<?php

declare(strict_types=1);

/**
 * Аудит производительности админки VMS-NC изнутри приложения.
 *
 * Все замеры с записью в БД выполняются в транзакции и откатываются.
 * Пишет только сессии и кэш (как обычный запрос к админке).
 *
 * Запуск ОБЯЗАТЕЛЬНО от www-data (иначе кэш/сессии станут root-овыми):
 *   sudo -u www-data php perf-audit.php /var/www/dev-projects/showers-cpq.tech/current
 *   sudo -u www-data php perf-audit.php /var/www/.../current --http --livewire
 *
 *   --http      рендер страниц админки через HTTP-ядро (как браузер, без nginx/FPM)
 *   --livewire  догрузка отложенных таблиц (loadTable) — то, что браузер делает после открытия страницы
 *
 * @since 2026-11-06
 */

use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Contracts\Http\Kernel as HttpKernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

$base = rtrim($argv[1] ?? getcwd(), '/');
$withHttp = in_array('--http', $argv, true);
$withLivewire = in_array('--livewire', $argv, true);

if (!is_file($base . '/artisan')) {
    fwrite(STDERR, "Не найден Laravel-проект в {$base}\n");
    exit(1);
}

chdir($base);
$tBoot = microtime(true);
require $base . '/vendor/autoload.php';
$app = require $base . '/bootstrap/app.php';
$app->make(ConsoleKernel::class)->bootstrap();
$bootMs = (microtime(true) - $tBoot) * 1000;

/**
 * Счётчик SQL и замер блоков кода.
 */
final class Probe
{
    public static int $queries = 0;
    public static float $sqlMs = 0.0;
    /** @var array<string, int> */
    public static array $patterns = [];

    public static function listen(): void
    {
        DB::listen(static function ($e): void {
            self::$queries++;
            self::$sqlMs += (float)$e->time;
            // Нормализуем SQL, чтобы увидеть повторяющиеся запросы (N+1)
            $sql = preg_replace(['/\s+/', '/\d+/', "/'[^']*'/"], [' ', '?', '?'], (string)$e->sql);
            $sql = mb_substr((string)$sql, 0, 140);
            self::$patterns[$sql] = (self::$patterns[$sql] ?? 0) + 1;
        });
    }

    public static function reset(): void
    {
        self::$queries = 0;
        self::$sqlMs = 0.0;
        self::$patterns = [];
    }

    /**
     * @return array{ms: float, queries: int, sql_ms: float, mem_mb: float, result: mixed}
     */
    public static function run(callable $fn): array
    {
        self::reset();
        $mem = memory_get_usage(true);
        $t = microtime(true);
        $result = $fn();
        return [
            'ms' => (microtime(true) - $t) * 1000,
            'queries' => self::$queries,
            'sql_ms' => self::$sqlMs,
            'mem_mb' => (memory_get_usage(true) - $mem) / 1048576,
            'result' => $result,
        ];
    }

    /**
     * @param array{ms: float, queries: int, sql_ms: float, mem_mb: float, result: mixed} $r
     */
    public static function line(string $label, array $r, string $extra = ''): void
    {
        printf(
            "  %-58s %8.1f мс  SQL: %4d шт / %7.1f мс%s\n",
            $label,
            $r['ms'],
            $r['queries'],
            $r['sql_ms'],
            $extra !== '' ? "  {$extra}" : ''
        );
    }

    /**
     * Самые частые запросы последнего замера — так видно N+1.
     */
    public static function top(int $limit = 3): void
    {
        arsort(self::$patterns);
        foreach (array_slice(self::$patterns, 0, $limit, true) as $sql => $n) {
            if ($n < 3) {
                break;
            }
            printf("      ×%-4d %s\n", $n, $sql);
        }
    }
}

function hdr(string $title): void
{
    echo "\n\033[0;36m== {$title} ==\033[0m\n";
}

function flag(bool $good, string $text): void
{
    echo $good ? "  \033[0;32m✔\033[0m {$text}\n" : "  \033[0;31m✘\033[0m {$text}\n";
}

Probe::listen();

// -----------------------------------------------------------------------------
hdr('1. Окружение приложения');
printf("  PHP %s (CLI), Laravel %s\n", PHP_VERSION, $app->version());
flag(!extension_loaded('xdebug'), 'Xdebug в CLI ' . (extension_loaded('xdebug') ? 'загружен (mode=' . ini_get('xdebug.mode') . ')' : 'не загружен'));
printf("  APP_ENV=%s  APP_DEBUG=%s  cache=%s  session=%s  queue=%s\n",
    app()->environment(),
    config('app.debug') ? 'true' : 'false',
    config('cache.default'),
    config('session.driver'),
    config('queue.default'));
flag($app->configurationIsCached(), 'config:cache');
flag($app->routesAreCached(), 'route:cache');
flag($app->eventsAreCached(), 'event:cache');
flag(is_file($base . '/bootstrap/cache/filament/panels/admin.php'), 'filament:cache-components');
printf("  Загрузка фреймворка в CLI: %.0f мс (в CLI OPcache обычно выключен — это верхняя оценка)\n", $bootMs);

hdr('2. Объём данных');
$counts = [];
foreach ([
    'products' => 'Товары',
    'product_variants' => 'Модификации',
    'product_attribute_values' => 'EAV-значения',
    'attributes' => 'Атрибуты',
    'complex_dictionary_records' => 'Записи справочников',
    'binding_rules' => 'Правила привязки',
    'media' => 'Медиафайлы',
    'orders' => 'Заказы',
] as $table => $label) {
    try {
        $counts[$table] = (int)DB::table($table)->count();
        printf("  %-22s %8d\n", $label, $counts[$table]);
    } catch (\Throwable $e) {
        printf("  %-22s  — (%s)\n", $label, $e->getMessage());
    }
}

// -----------------------------------------------------------------------------
hdr('3. Узкие места кода (в транзакции с откатом)');
DB::beginTransaction();

try {
    $variantModel = \Nicole\Box\Core\Models\ProductVariant::class;
    $pricing = app(\Nicole\Box\Core\Services\PricingManager::class);

    // 3.1 Строки таблицы модификаций: как было в карточке товара (без eager) и как сейчас
    $rowWork = static function ($variants) use ($pricing): int {
        $retailId = \Nicole\Box\Core\Models\PriceType::where('slug', 'retail')->value('id') ?? 1;
        foreach ($variants as $v) {
            $v->getPreviewUrl();
            $pricing->getVariantPrice($v);
            $pricing->getVariantCostCurrency($v);
            $v->prices->firstWhere('price_type_id', $retailId);
            $v->attributeValues->each(fn($val) => $val->option?->value ?? $val->complexRecord?->name);
            $v->product?->attributeValues->each(fn($val) => $val->option?->value);
        }
        return count($variants);
    };

    $r = Probe::run(fn() => $rowWork($variantModel::query()->latest('updated_at')->limit(25)->get()));
    Probe::line('Модификации, 25 строк, БЕЗ eager loading (как было)', $r);
    Probe::top();

    if (method_exists(\Nicole\Box\Core\Filament\Resources\ProductVariants\Tables\ProductVariantsTable::class, 'applyEagerLoads')) {
        $r = Probe::run(fn() => $rowWork(
            \Nicole\Box\Core\Filament\Resources\ProductVariants\Tables\ProductVariantsTable::applyEagerLoads($variantModel::query())
                ->latest('updated_at')->limit(25)->get()
        ));
        Probe::line('Модификации, 25 строк, applyEagerLoads() (сейчас)', $r);
        Probe::top();
    } else {
        flag(false, 'applyEagerLoads() не найден — на сервере старая версия ядра');
    }

    // 3.2 Пересчёт минимальной цены (срабатывает при каждом сохранении модификации/цены)
    $products = \Nicole\Box\Core\Models\Product::query()->has('variants')->limit(20)->get();
    $r = Probe::run(function () use ($products): int {
        foreach ($products as $p) {
            $p->refreshMinPrice();
        }
        return $products->count();
    });
    Probe::line(sprintf('refreshMinPrice() для %d товаров', $products->count()), $r,
        $products->count() ? sprintf('≈ %.1f мс/товар', $r['ms'] / max(1, $products->count())) : '');
    Probe::top();

    // 3.3 Схема вкладки «Характеристики»: первый вызов и повторный (кэш на запрос)
    $typeId = DB::table('attribute_product_type')
        ->select('product_type_id', DB::raw('count(*) as c'))
        ->groupBy('product_type_id')->orderByDesc('c')->value('product_type_id');
    if ($typeId) {
        $form = \Nicole\Box\Core\Filament\Resources\Products\Schemas\ProductForm::class;
        $morph = (new \Nicole\Box\Core\Models\Product())->getMorphClass();
        $r = Probe::run(fn() => $form::getDynamicEavSchema((int)$typeId, $morph));
        Probe::line("EAV-схема типа #{$typeId}, первый вызов", $r);
        $r = Probe::run(fn() => $form::getDynamicEavSchema((int)$typeId, $morph));
        Probe::line("EAV-схема типа #{$typeId}, повторный (каждый live-апдейт)", $r);
    }

    // 3.4 Деревья CPQ: анализ одного дерева
    $tree = app(\Nicole\Box\Core\Services\Calculator\PipelineTreeService::class);
    $roots = DB::table('binding_rules as br')
        ->join('pipelines as p', 'p.id', '=', 'br.pipeline_id')
        ->where('p.is_active', true)
        ->select('br.parent_type', 'br.parent_id', 'p.code')
        ->distinct()->limit(10)->get();
    $treeStats = ['ms' => 0.0, 'queries' => 0, 'n' => 0, 'max_q' => 0];
    foreach ($roots as $root) {
        $r = Probe::run(fn() => $tree->analyzeTree((int)$root->parent_id, (string)$root->code, (string)$root->parent_type));
        if ($r['result'] === null) {
            continue;
        }
        $treeStats['ms'] += $r['ms'];
        $treeStats['queries'] += $r['queries'];
        $treeStats['max_q'] = max($treeStats['max_q'], $r['queries']);
        $treeStats['n']++;
    }
    if ($treeStats['n'] > 0) {
        printf("  %-58s %8.1f мс  SQL: %4d шт в среднем (макс. %d)\n",
            "analyzeTree(), среднее по {$treeStats['n']} деревьям",
            $treeStats['ms'] / $treeStats['n'],
            intdiv($treeStats['queries'], $treeStats['n']),
            $treeStats['max_q']);
        echo "      Список цепочек раньше делал это для КАЖДОЙ строки на каждый клик; сейчас — кэш.\n";
    } else {
        echo "  analyzeTree(): нет корней в активных пайплайнах — пропуск\n";
    }

    // 3.5 «Связанные товары»: опции селекта для самого большого типа
    $bigType = DB::table('products')->select('product_type_id', DB::raw('count(*) as c'))
        ->whereNotNull('product_type_id')->groupBy('product_type_id')->orderByDesc('c')->first();
    if ($bigType) {
        $render = static fn($list) => $list->map(fn($p) => \Nicole\Box\Core\Filament\Forms\Components\ProductSelect::renderProductOption($p))->count();
        $r = Probe::run(fn() => $render(\Nicole\Box\Core\Models\Product::where('product_type_id', $bigType->product_type_id)->get()));
        Probe::line("Опции «Связанные товары», все {$bigType->c} шт без eager (как было)", $r, 'на КАЖДУЮ строку репитера');
        Probe::top(2);
        $r = Probe::run(fn() => $render(\Nicole\Box\Core\Models\Product::query()
            ->where('product_type_id', $bigType->product_type_id)
            ->with(['media', 'variants' => fn($q) => $q->where('is_active', true), 'variants.media'])
            ->limit(50)->get()));
        Probe::line('Опции «Связанные товары», 50 шт с eager (сейчас)', $r);
    }
} catch (\Throwable $e) {
    flag(false, 'Ошибка в замерах кода: ' . $e->getMessage() . ' @ ' . basename($e->getFile()) . ':' . $e->getLine());
} finally {
    DB::rollBack();
}

// -----------------------------------------------------------------------------
if ($withHttp || $withLivewire) {
    hdr('4. Страницы админки через HTTP-ядро (без nginx/FPM, классы уже загружены)');

    $userClass = config('auth.providers.users.model', \App\Models\User::class);
    $user = null;
    try {
        $user = $userClass::role('admin')->first(); // spatie/permission
    } catch (\Throwable) {
    }
    $user ??= $userClass::query()->first();

    if (!$user) {
        flag(false, 'Нет пользователей — пропуск');
        exit(0);
    }
    Auth::guard('web')->setUser($user);
    printf("  Пользователь: #%d %s\n", $user->getKey(), $user->email ?? '');

    $http = $app->make(HttpKernel::class);
    $cookies = [];

    $send = static function (string $method, string $uri, array $server = [], ?string $body = null) use ($http, &$cookies): \Symfony\Component\HttpFoundation\Response {
        if (method_exists(app('livewire'), 'flushState')) {
            app('livewire')->flushState();
        }
        $request = Request::create($uri, $method, [], $cookies, [], $server + ['HTTP_HOST' => parse_url((string)config('app.url'), PHP_URL_HOST) ?: 'localhost', 'HTTPS' => 'on'], $body);
        $response = $http->handle($request);
        foreach ($response->headers->getCookies() as $cookie) {
            $cookies[$cookie->getName()] = $cookie->getValue();
        }
        $http->terminate($request, $response);
        return $response;
    };

    $firstProductId = \Nicole\Box\Core\Models\Product::query()->has('variants')->value('id');
    $chainsUrl = null;
    try {
        \Filament\Facades\Filament::setCurrentPanel(\Filament\Facades\Filament::getPanel('admin'));
        $chainsUrl = parse_url(\Nicole\Box\Core\Filament\Clusters\Pipelines\Pages\PipelineChainsPage::getUrl(), PHP_URL_PATH);
    } catch (\Throwable) {
    }

    $pages = array_filter([
        'Дашборд' => '/admin',
        'Товары (список)' => '/admin/products',
        'Модификации (список)' => '/admin/product-variants',
        'Карточка товара' => $firstProductId ? "/admin/products/{$firstProductId}/edit" : null,
        'Цепочки (Pipelines)' => $chainsUrl,
    ]);

    $send('GET', '/admin'); // прогрев: загрузка классов, компиляция шаблонов

    $htmlByPage = [];
    foreach ($pages as $label => $uri) {
        $runs = [];
        $last = null;
        for ($i = 0; $i < 3; $i++) {
            $last = Probe::run(fn() => $send('GET', $uri));
            $runs[] = $last;
        }
        usort($runs, fn($a, $b) => $a['ms'] <=> $b['ms']);
        $median = $runs[1];
        $status = $last['result']->getStatusCode();
        Probe::line("{$label} {$uri}", $median, "HTTP {$status}, " . round(strlen((string)$last['result']->getContent()) / 1024) . ' КБ');
        if ($status >= 300) {
            echo "      ⚠ HTTP {$status}: страница не отрендерилась (редирект/ошибка) — цифры не показательны\n";
        }
        Probe::top(2);
        $htmlByPage[$label] = (string)$last['result']->getContent();
    }

    // -------------------------------------------------------------------------
    if ($withLivewire) {
        hdr('5. Догрузка таблиц (Livewire loadTable — второй запрос браузера)');

        foreach ($htmlByPage as $label => $html) {
            if (!preg_match('/<meta name="csrf-token" content="([^"]+)"/', $html, $m)) {
                continue;
            }
            $token = $m[1];
            $updateUri = preg_match('/data-update-uri="([^"]+)"/', $html, $mu)
                ? parse_url(html_entity_decode($mu[1]), PHP_URL_PATH)
                : '/livewire/update';

            preg_match_all('/wire:snapshot="([^"]+)"/', $html, $snaps);
            foreach ($snaps[1] as $raw) {
                $snapshot = html_entity_decode($raw, ENT_QUOTES);
                $decoded = json_decode($snapshot, true);
                if (!is_array($decoded) || !array_key_exists('isTableLoaded', $decoded['data'] ?? [])) {
                    continue;
                }
                if ($decoded['data']['isTableLoaded'] === true) {
                    continue;
                }
                $payload = json_encode([
                    '_token' => $token,
                    'components' => [[
                        'snapshot' => $snapshot,
                        'updates' => new \stdClass(),
                        'calls' => [['path' => '', 'method' => 'loadTable', 'params' => []]],
                    ]],
                ]);
                $r = Probe::run(fn() => $send('POST', (string)$updateUri, [
                    'CONTENT_TYPE' => 'application/json',
                    'HTTP_ACCEPT' => 'application/json',
                    'HTTP_X_LIVEWIRE' => '1',
                    'HTTP_X_CSRF_TOKEN' => $token,
                ], (string)$payload));
                $name = $decoded['memo']['name'] ?? '?';
                Probe::line("{$label}: {$name}", $r, 'HTTP ' . $r['result']->getStatusCode());
                Probe::top(3);
            }
        }
        echo "  Если таблиц нет в списке — страница не отложенная или формат Livewire отличается; смотрите DevTools → Network.\n";
    }
}

hdr('Готово');
echo "  Пришлите вывод целиком — по строкам с «×N» видно, где остались N+1.\n";
