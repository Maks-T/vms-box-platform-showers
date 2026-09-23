<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Filament\Pages;

use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\HtmlString;
use Nicole\Box\Core\Models\Attribute;
use Nicole\Box\Core\Models\ComplexDictionary;
use Nicole\Box\Core\Models\ComplexDictionaryRecord;
use Nicole\Box\Core\Support\CatalogCache;

/**
 * Единый оркестратор фабрики душевых кабин: формы, открывания, лимиты и права.
 * Распределяет параметры по справочникам shower_measure_limits и shower_interface_settings.
 *
 * @since 2026-09-23
 * @property Schema $form
 */
class ManageShowersCalculatorSettings extends Page implements HasForms
{
  use InteractsWithForms;

  protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAdjustmentsHorizontal;

  protected static ?string $slug = 'showers/calculator-settings';

  protected static ?int $navigationSort = 10;

  protected string $view = 'valerie-showers::filament.pages.manage-showers-settings';

  public static function getNavigationGroup(): ?string
  {
    return __('Configurations');
  }

  public static function getNavigationLabel(): string
  {
    return __('Настройки калькулятора');
  }

  public ?array $data = [];

  public function mount(): void
  {
    $this->form->fill($this->loadCurrentSettings());
  }

  protected function loadCurrentSettings(): array
  {
    // 1. Загрузка габаритных лимитов форм из shower_measure_limits
    /** @var ComplexDictionary|null $measureDict */
    $measureDict = ComplexDictionary::query()
      ->where('code', 'shower_measure_limits')
      ->with('records')
      ->first();
    $measureRecords = $measureDict?->records?->keyBy('slug') ?? collect();

    // 2. Загрузка параметров интерфейса из shower_interface_settings
    /** @var ComplexDictionary|null $interfaceDict */
    $interfaceDict = ComplexDictionary::query()
      ->where('code', 'shower_interface_settings')
      ->with('records')
      ->first();
    $interfaceRecords = $interfaceDict?->records?->keyBy('slug') ?? collect();

    // Десериализация отключенных дверей: disabled_doors[formSlug] = [doorSlugs...]
    $rawDisabledDoors = $interfaceRecords->get('disabled_doors')?->meta['values'] ?? [
      'line_two_swing',
      'corner_two_swing',
      'curtain_accordion_2glass',
      'curtain_accordion_3glass',
    ];

    $disabledDoorsByForm = [];
    $formSlugs = ['line', 'corner', 'free', 'trapezoid', 'ushaped', 'door', 'curtain'];
    foreach ($rawDisabledDoors as $compoundKey) {
      foreach ($formSlugs as $formSlug) {
        if (str_starts_with((string) $compoundKey, $formSlug . '_')) {
          $doorSlug = substr((string) $compoundKey, strlen($formSlug) + 1);
          // Автоматическая нормализация старого ключа accordion -> accordion_2glass + accordion_3glass
          if ($doorSlug === 'accordion') {
            $disabledDoorsByForm[$formSlug][] = 'accordion_2glass';
            $disabledDoorsByForm[$formSlug][] = 'accordion_3glass';
          } else {
            $disabledDoorsByForm[$formSlug][] = $doorSlug;
          }
          break;
        }
      }
    }

    // Специальные лимиты связок из interface settings
    $specialLimitsRaw = $interfaceRecords->get('special_limits')?->meta['items'] ?? [];
    $specialLimitsByForm = [];
    foreach ($specialLimitsRaw as $item) {
      $form = $item['form_id'] ?? '';
      if ($form) {
        $specialLimitsByForm[$form][] = $item;
      }
    }

    // Сборка агрегированного стейта по каждой форме
    $formsState = [];
    $formAttribute = Attribute::query()->where('code', 'form_type')->with('options')->first();
    $availableFormSlugs = $formAttribute?->options?->pluck('slug')->toArray() ?? $formSlugs;

    foreach ($availableFormSlugs as $formSlug) {
      $measure = $measureRecords->get($formSlug);
      $formsState[$formSlug] = [
        'is_active' => (bool) ($measure?->is_active ?? true),
        'disabled_doors' => $disabledDoorsByForm[$formSlug] ?? [],
        'length_min' => (int) ($measure?->meta['length_min'] ?? 300),
        'length_max' => (int) ($measure?->meta['length_max'] ?? 2000),
        'height_min' => (int) ($measure?->meta['height_min'] ?? 1700),
        'height_max' => (int) ($measure?->meta['height_max'] ?? 3200),
        'special_limits' => $specialLimitsByForm[$formSlug] ?? (
          $formSlug === 'line' ? [
            [
              'door_id' => 'two_slide',
              'length_min' => 1500,
              'length_max' => null,
              'height_min' => null,
              'height_max' => null,
            ],
          ] : []
          ),
      ];
    }

    // Ролевая матрица видимости
    $systemZones = $this->getSystemInterfaceZones();
    $uiMatrix = [];
    foreach ($systemZones as $zoneKey => $zoneLabel) {
      $recordMeta = $interfaceRecords->get($zoneKey)?->meta ?? [];
      $uiMatrix[$zoneKey] = [
        'userShow' => (bool) ($recordMeta['show_user'] ?? in_array($zoneKey, ['priceBlock', 'estimateBlock'], true)),
        'managerShow' => (bool) ($recordMeta['show_manager'] ?? true),
        'adminShow' => (bool) ($recordMeta['show_admin'] ?? true),
      ];
    }

    return [
      'forms' => $formsState,
      'ui_matrix' => $uiMatrix,
      'montage_rate_type' => (string) ($interfaceRecords->get('montage_rate_type')?->meta['value_user'] ?? 'fixed'),
    ];
  }

  protected function getSystemInterfaceZones(): array
  {
    return [
      'estimateBlock' => 'Таблица детализированной сметы изделия',
      'priceBlock' => 'Блок расчета стоимости (Итого)',
      'service_lift' => 'Подъем на этаж (Лифт / Ручной подъем по этажам)',
      'hide_material_selector' => 'Скрытие сквозного селектора сплава фурнитуры (Цинк/Латунь)',
    ];
  }

  public function form(Schema $schema): Schema
  {
    $locale = app()->getLocale();

    $formAttribute = Attribute::query()->where('code', 'form_type')->with('options')->first();
    $doorAttribute = Attribute::query()->where('code', 'door_type_ids')->with('options')->first();

    $formOptions = $formAttribute?->options
      ?->mapWithKeys(fn ($opt) => [$opt->slug => $opt->getTranslation('value', $locale) ?: (string) $opt->value])
      ->toArray() ?? [];

    $doorOptions = $doorAttribute?->options
      ?->mapWithKeys(fn ($opt) => [$opt->slug => $opt->getTranslation('value', $locale) ?: (string) $opt->value])
      ->toArray() ?? [];

    // Формирование вкладок для каждой отдельной формы
    $formTabs = [];
    foreach ($formOptions as $formSlug => $formName) {
      $textLabel = is_array($formName) ? ($formName[$locale] ?? $formSlug) : $formName;
      $meta = $this->getFormVisualMeta((string) $formSlug, (string) $textLabel);

      $formTabs[] = Tab::make((string) $formSlug)
        ->label((string) $textLabel)
        ->schema([
          Section::make()
            ->schema([
              Grid::make(12)->schema([
                // Визуальная карточка: 3D рендер + чертеж + описание
                Placeholder::make("forms.{$formSlug}.visual_card")
                  ->hiddenLabel()
                  ->columnSpan(['default' => 12, 'lg' => 6])
                  ->content(fn () => new HtmlString($meta['html'])),

                // Управление активностью и скрытием дверей
                Grid::make(1)
                  ->columnSpan(['default' => 12, 'lg' => 6])
                  ->schema([
                    Toggle::make("forms.{$formSlug}.is_active")
                      ->label('Конструкция активна в калькуляторе')
                      ->helperText('Если отключить, форма полностью исчезнет из выбора на сайте')
                      ->default(true),

                    Select::make("forms.{$formSlug}.disabled_doors")
                      ->label('Скрыть типы дверей для этой формы')
                      ->helperText('Выберите открывания, недоступные для данной конструкции. Пустое поле — разрешены все.')
                      ->multiple()
                      ->options($doorOptions)
                      ->placeholder('Все открывания доступны')
                      ->searchable()
                      ->preload(),
                  ]),
              ]),
            ]),

          Section::make('Базовые габаритные лимиты формы')
            ->description('Ограничивают допустимые размеры в калькуляторе для данной конструкции')
            ->schema([
              Grid::make(4)->schema([
                TextInput::make("forms.{$formSlug}.length_min")->label('Мин. длина (мм)')->numeric()->required(),
                TextInput::make("forms.{$formSlug}.length_max")->label('Макс. длина (мм)')->numeric()->required(),
                TextInput::make("forms.{$formSlug}.height_min")->label('Мин. высота (мм)')->numeric()->required(),
                TextInput::make("forms.{$formSlug}.height_max")->label('Макс. высота (мм)')->numeric()->required(),
              ]),
            ]),

          Section::make('Специальные лимиты под конкретные открывания')
            ->description('Переопределяют габариты (например, мин. 1500 мм для 2-х сдвижных дверей)')
            ->schema([
              Repeater::make("forms.{$formSlug}.special_limits")
                ->hiddenLabel()
                ->addActionLabel('Добавить спец-лимит для двери')
                ->schema([
                  Select::make('door_id')
                    ->label('Тип двери')
                    ->options($doorOptions)
                    ->required(),

                  TextInput::make('length_min')->label('Мин. длина (мм)')->numeric()->placeholder('300'),
                  TextInput::make('length_max')->label('Макс. длина (мм)')->numeric()->placeholder('2000'),
                  TextInput::make('height_min')->label('Мин. высота (мм)')->numeric()->placeholder('1700'),
                  TextInput::make('height_max')->label('Макс. высота (мм)')->numeric()->placeholder('3200'),
                ])
                ->columns(5),
            ]),
        ]);
    }

    return $schema
      ->statePath('data')
      ->components([
        Tabs::make('MasterSettingsTabs')->tabs([

          // ВКЛАДКА 1: Конструкции со вложенными подвкладками по формам
          Tab::make('Конструкции и лимиты')
            ->icon('heroicon-o-cube-transparent')
            ->schema([
              Tabs::make('FormsInnerTabs')
                ->tabs($formTabs),
            ]),

          // ВКЛАДКА 2: Ролевая матрица видимости интерфейса
          Tab::make('Видимость интерфейса (Права)')
            ->icon('heroicon-o-eye')
            ->schema([
              Section::make('Матрица отображения элементов по ролям')
                ->description('Управляйте видимостью функциональных зон для клиента на сайте, менеджера и администратора.')
                ->schema(
                  collect($this->getSystemInterfaceZones())->map(function ($label, $key) {
                    return Grid::make(4)->schema([
                      Section::make($label)
                        ->columnSpan(1)
                        ->compact(),
                      Checkbox::make("ui_matrix.{$key}.userShow")
                        ->label('Клиент на сайте (User)')
                        ->inline(false)
                        ->columnSpan(1),
                      Checkbox::make("ui_matrix.{$key}.managerShow")
                        ->label('Менеджер (CRM)')
                        ->inline(false)
                        ->columnSpan(1),
                      Checkbox::make("ui_matrix.{$key}.adminShow")
                        ->label('Администратор')
                        ->inline(false)
                        ->columnSpan(1),
                    ]);
                  })->toArray()
                ),
            ]),

          // ВКЛАДКА 3: Тарификация услуг
          Tab::make('Услуги и монтаж')
            ->icon('heroicon-o-wrench-screwdriver')
            ->schema([
              Section::make('Тарификация монтажа')
                ->schema([
                  Radio::make('montage_rate_type')
                    ->label('Принцип начисления стоимости монтажных работ')
                    ->options([
                      'fixed' => 'Фиксированная цена за всю конструкцию целиком (базовая цена услуги)',
                      'per_unit' => 'Умножать цену монтажа на фактическое количество створок/стекол',
                    ])
                    ->required(),
                ]),
            ]),
        ]),
      ]);
  }

  protected function getFormActions(): array
  {
    return [
      Action::make('save')
        ->label(__('Save changes'))
        ->submit('save'),
    ];
  }

  public function save(): void
  {
    $state = $this->form->getState();

    // 1. Сохранение габаритов и активности форм в shower_measure_limits
    /** @var ComplexDictionary $measureDict */
    $measureDict = ComplexDictionary::query()->firstOrCreate(
      ['code' => 'shower_measure_limits'],
      ['name' => ['ru' => 'Лимиты размеров душевых', 'en' => 'Shower Measure Limits'], 'is_active' => true]
    );

    foreach ($state['forms'] ?? [] as $formSlug => $formData) {
      ComplexDictionaryRecord::query()->updateOrCreate(
        ['dictionary_id' => $measureDict->id, 'slug' => $formSlug],
        [
          'name' => ['ru' => "Лимиты размеров для {$formSlug}", 'en' => "Measure limits for {$formSlug}"],
          'is_active' => (bool) ($formData['is_active'] ?? true),
          'meta' => [
            'height_min' => (int) ($formData['height_min'] ?? 1700),
            'height_max' => (int) ($formData['height_max'] ?? 3200),
            'length_min' => (int) ($formData['length_min'] ?? 300),
            'length_max' => (int) ($formData['length_max'] ?? 2000),
          ],
        ]
      );
    }

    // 2. Сохранение параметров интерфейса в shower_interface_settings
    /** @var ComplexDictionary $interfaceDict */
    $interfaceDict = ComplexDictionary::query()->firstOrCreate(
      ['code' => 'shower_interface_settings'],
      ['name' => ['ru' => 'Настройки интерфейса калькулятора', 'en' => 'Calculator Interface Settings'], 'is_active' => true]
    );

    // Агрегация отключенных дверей со всех форм
    $flatDisabledDoors = [];
    $allSpecialLimits = [];

    foreach ($state['forms'] ?? [] as $formSlug => $formData) {
      if (!empty($formData['disabled_doors']) && is_array($formData['disabled_doors'])) {
        foreach ($formData['disabled_doors'] as $doorSlug) {
          $flatDisabledDoors[] = "{$formSlug}_{$doorSlug}";
        }
      }

      if (!empty($formData['special_limits']) && is_array($formData['special_limits'])) {
        foreach ($formData['special_limits'] as $limitRow) {
          $limitRow['form_id'] = $formSlug;
          $allSpecialLimits[] = $limitRow;
        }
      }
    }

    $this->saveRecord($interfaceDict, 'disabled_doors', ['values' => array_values(array_unique($flatDisabledDoors))]);
    $this->saveRecord($interfaceDict, 'special_limits', ['items' => $allSpecialLimits]);

    // Сохранение ролевой матрицы видимости
    foreach ($state['ui_matrix'] ?? [] as $zoneKey => $roles) {
      $this->saveRecord($interfaceDict, $zoneKey, [
        'show_user' => (bool) ($roles['userShow'] ?? false),
        'show_manager' => (bool) ($roles['managerShow'] ?? true),
        'show_admin' => (bool) ($roles['adminShow'] ?? true),
      ]);
    }

    // Режим тарификации монтажа
    $this->saveRecord($interfaceDict, 'montage_rate_type', [
      'value_admin' => (string) $state['montage_rate_type'],
      'value_manager' => (string) $state['montage_rate_type'],
      'value_user' => (string) $state['montage_rate_type'],
    ]);

    // Инвалидация кэша
    CatalogCache::invalidate();

    Notification::make()
      ->title('Все настройки фабрики и лимиты успешно сохранены')
      ->success()
      ->send();
  }

  /**
   * Генерация визуальной карточки с 3D-рендером (.webp) и чертежом (.svg) для формы.
   *
   * @return array{render: string, blueprint: ?string, desc: string, html: string}
   */
  protected function getFormVisualMeta(string $formSlug, string $formName): array
  {
    $iconMap = [
      'line' => [
        'render' => asset('filament/showerTypes/type1.webp'),
        'blueprint' => asset('filament/showerTypes/03-odna-stvorka.svg'),
        'desc' => 'Линейная перегородка в проем или на прямой участок',
      ],
      'corner' => [
        'render' => asset('filament/showerTypes/type2.webp'),
        'blueprint' => asset('filament/showerTypes/02-uglovoy-stvorka-bokovaya.svg'),
        'desc' => 'Угловое душевое ограждение 90° (Г-образное)',
      ],
      'free' => [
        'render' => asset('filament/showerTypes/type3.webp'),
        'blueprint' => null,
        'desc' => 'Свободный вход без дверей (Walk-in)',
      ],
      'trapezoid' => [
        'render' => asset('filament/showerTypes/type4.webp'),
        'blueprint' => asset('filament/showerTypes/04-pyatiugolnyy.svg'),
        'desc' => 'Пятиугольная трапециевидная кабина с углами 135°',
      ],
      'ushaped' => [
        'render' => asset('filament/showerTypes/type5.webp'),
        'blueprint' => asset('filament/showerTypes/05-p-obraznyy.svg'),
        'desc' => 'П-образное ограждение с примыканием к одной стене',
      ],
      'door' => [
        'render' => asset('filament/showerTypes/type6.webp'),
        'blueprint' => asset('filament/showerTypes/06-nisha-1-stvorka.svg'),
        'desc' => 'Душевая дверь для установки в существующую нишу',
      ],
      'curtain' => [
        'render' => asset('filament/showerTypes/type7.webp'),
        'blueprint' => asset('filament/showerTypes/07-shtorka-dlya-vanny.svg'),
        'desc' => 'Защитная стеклянная шторка на борт ванны',
      ],
    ];

    $data = $iconMap[$formSlug] ?? [
      'render' => asset('filament/showerTypes/placeholder.png'),
      'blueprint' => null,
      'desc' => $formName,
    ];

    $blueprintHtml = $data['blueprint']
      ? "<div class=\"w-24 h-28 bg-white dark:bg-gray-900 rounded-lg p-1.5 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm\"><img src=\"{$data['blueprint']}\" class=\"max-h-full max-w-full object-contain dark:invert\" alt=\"Схема\" /></div>"
      : "";

    $html = "
        <div class=\"flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 w-full\">
            <div class=\"w-28 h-28 bg-white dark:bg-gray-900 rounded-lg p-1.5 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm\">
                <img src=\"{$data['render']}\" class=\"max-h-full max-w-full object-contain\" alt=\"3D\" />
            </div>
            {$blueprintHtml}
            <div class=\"flex flex-col gap-0.5 min-w-0 flex-1 pl-1\">
                <span class=\"text-[11px] uppercase font-bold tracking-wider text-primary-600 dark:text-primary-400 font-mono\">код: {$formSlug}</span>
                <h4 class=\"text-sm font-bold text-gray-900 dark:text-white leading-snug truncate\">{$formName}</h4>
                <p class=\"text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5 line-clamp-2\">{$data['desc']}</p>
            </div>
        </div>";

    $data['html'] = $html;
    return $data;
  }

  protected function getRecordHumanNames(): array
  {
    return [
      'disabled_doors' => ['ru' => 'Отключенные типы дверей (открывания)', 'en' => 'Disabled door types'],
      'service_lift' => ['ru' => 'Подъем на этаж (Лифт / Этажи)', 'en' => 'Floor lift service'],
      'montage_rate_type' => ['ru' => 'Принцип тарификации монтажа', 'en' => 'Montage rate type'],
      'hide_material_selector' => ['ru' => 'Скрытие селектора сплава фурнитуры', 'en' => 'Hide hardware alloy selector'],
      'special_limits' => ['ru' => 'Специальные лимиты габаритов связок', 'en' => 'Special dimensional limits'],
      'estimateBlock' => ['ru' => 'Показать смету', 'en' => 'Show estimate block'],
      'priceBlock' => ['ru' => 'Показать блок "стоимость"', 'en' => 'Show price block'],
    ];
  }

  protected function saveRecord(ComplexDictionary $dict, string $slug, array $meta): void
  {
    $humanNames = $this->getRecordHumanNames();
    $name = $humanNames[$slug] ?? ['ru' => $slug, 'en' => $slug];

    ComplexDictionaryRecord::query()->updateOrCreate(
      ['dictionary_id' => $dict->id, 'slug' => $slug],
      [
        'name' => $name,
        'meta' => $meta,
        'is_active' => true,
      ]
    );
  }
}