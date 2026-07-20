<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Valerie\Box\IndustryShowers\Importers\ShowersRoomImporter;

class ValerieShowersServiceProvider extends ServiceProvider
{
  /**
   * Динамически определяет корневой путь плагина
   */
  protected function getPluginBasePath(): string
  {
    return is_dir(__DIR__ . '/../resources') ? dirname(__DIR__) : dirname(__DIR__, 2);
  }

  public function register(): void
  {
    $this->loadJsonTranslationsFrom($this->getPluginBasePath() . '/lang');
  }

  public function boot(): void
  {
    $basePath = $this->getPluginBasePath();

    $this->loadMigrationsFrom($basePath . '/database/migrations');
    $this->loadViewsFrom($basePath . '/resources/views', 'valerie-showers');

    $this->registerApiRoutes();
    $this->registerWebRoutes();
    // Динамически дописываем наш импортер в конец массива ядра
    $modules = config('nicole.import_modules', []);
    $modules[] = ShowersRoomImporter::class;

    config(['nicole.import_modules' => array_unique($modules)]);
  }

  protected function registerApiRoutes(): void
  {
    if (!$this->app->routesAreCached()) {
      Route::prefix('api/v1')
        ->middleware(['api', \Nicole\Box\Core\Http\Middleware\EnforceChannelContext::class])
        ->group(__DIR__ . '/../routes/api.php');
    }
  }

  protected function registerWebRoutes(): void
  {
    if (!$this->app->routesAreCached()) {
      Route::middleware(['web'])
        ->group(__DIR__ . '/../routes/web.php');
    }
  }
}
