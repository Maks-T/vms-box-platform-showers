<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Nicole\Box\Core\Support\OrderSectionFormatterResolver;
use Valerie\Box\IndustryShowers\Support\Formatters\ShowersOrderSectionFormatter;


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
    $this->mergeConfigFrom($this->getPluginBasePath() . '/config/valerie-showers.php', 'valerie-showers');
    $this->loadJsonTranslationsFrom($this->getPluginBasePath() . '/lang');
  }

  public function boot(): void
  {
    $basePath = $this->getPluginBasePath();

    $this->loadMigrationsFrom($basePath . '/database/migrations');
    // Laravel сам ищет оверрайды в resources/views/vendor/valerie-showers/** приложения
    $this->loadViewsFrom($basePath . '/resources/views', 'valerie-showers');

    if ($this->app->runningInConsole()) {
      $this->publishes([
        $basePath . '/config/valerie-showers.php' => config_path('valerie-showers.php'),
      ], 'valerie-showers-config');

      // Скопировать КП в приложение целиком для кастомизации под клиента
      $this->publishes([
        $basePath . '/resources/views/pdf' => resource_path('views/vendor/valerie-showers/pdf'),
      ], 'valerie-showers-pdf');
    }

    $this->registerApiRoutes();
    $this->registerWebRoutes();

    if (class_exists(OrderSectionFormatterResolver::class)) {
      $showerTypes = ['shower', 'custom', 'line', 'corner', 'free', 'trapezoid', 'ushaped', 'door', 'curtain'];
      foreach ($showerTypes as $type) {
        OrderSectionFormatterResolver::register($type, ShowersOrderSectionFormatter::class);
      }
    }
    // Динамически дописываем наш импортер в конец массива ядра
    /*$modules = config('nicole.import_modules', []);
    $modules[] = ShowersRoomImporter::class;

    config(['nicole.import_modules' => array_unique($modules)]);*/
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
