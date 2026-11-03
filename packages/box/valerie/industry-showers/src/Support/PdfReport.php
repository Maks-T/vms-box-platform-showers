<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Support;

use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

/**
 * Общие данные и ресурсы для КП (PDF/HTML).
 *
 * Точки расширения на уровне приложения (без правки пакета):
 *  - resources/views/vendor/valerie-showers/pdf/**              — переопределение любого blade-файла КП
 *  - resources/views/vendor/valerie-showers/pdf/pdf-report.css  — полная замена стилей
 *  - resources/views/vendor/valerie-showers/pdf/theme.css       — дополнение стилей (подключается после основных)
 *  - lang/{locale}.json приложения                              — свои тексты/переводы
 *  - config('valerie-showers.pdf.*') и VMS_COMPANY_* / VMS_PDF_* — данные без вёрстки
 */
class PdfReport
{
  public const string VIEW_NAMESPACE = 'valerie-showers';

  public static function packagePath(string $path = ''): string
  {
    $base = dirname(__DIR__, 2);

    return $path === '' ? $base : $base . '/' . ltrim($path, '/');
  }

  /**
   * Папка оверрайдов КП в приложении.
   */
  public static function appOverridePath(string $path = ''): string
  {
    $base = resource_path('views/vendor/' . self::VIEW_NAMESPACE . '/pdf');

    return $path === '' ? $base : $base . '/' . ltrim($path, '/');
  }

  /**
   * Язык КП: язык заказа, если он поддерживается, иначе текущий.
   */
  public static function applyOrderLocale(?string $orderLocale): string
  {
    $supported = (array)config('nicole.locales', [config('app.locale', 'ru')]);

    if ($orderLocale && in_array($orderLocale, $supported, true)) {
      app()->setLocale($orderLocale);
    }

    return app()->getLocale();
  }

  public static function currencySymbol(?string $currency, ?string $locale = null): string
  {
    $currency = strtoupper((string)$currency);
    $locale = $locale ?: app()->getLocale();
    $map = (array)config('valerie-showers.pdf.currency_symbols', []);

    return $map[$locale][$currency]
      ?? $map['*'][$currency]
      ?? $currency;
  }

  /**
   * Единицы измерения из сметы виджета (link-id:pcs, шт., м. ...) -> локализованная подпись.
   */
  public static function unitLabel(?string $unit): string
  {
    return match ((string)$unit) {
      'link-id:pcs', 'pcs', 'pcs.', 'шт', 'шт.' => __('pcs.'),
      'link-id:m', 'm', 'м', 'м.' => __('m'),
      'link-id:m2', 'm2', 'м2', 'м²' => __('m²'),
      default => (string)$unit,
    };
  }

  /**
   * Реквизиты компании из ядра + дополнительные строки индустрии.
   *
   * @return array{name:string,phone:string,phone_clean:string,email:string,website:string,address:string,messengers:string,working_hours:string}
   */
  public static function company(): array
  {
    $phone = (string)config('nicole.company.phone', '');

    return [
      'name'          => (string)config('nicole.company.name', ''),
      'phone'         => $phone,
      'phone_clean'   => (string)preg_replace('/[^\d+]/', '', $phone),
      'email'         => (string)config('nicole.company.email', ''),
      'website'       => (string)config('nicole.company.website', ''),
      'address'       => (string)config('nicole.company.address', ''),
      'messengers'    => (string)config('valerie-showers.pdf.company_extra.messengers', ''),
      'working_hours' => (string)config('valerie-showers.pdf.company_extra.working_hours', ''),
    ];
  }

  public static function logoDataUri(): ?string
  {
    return self::firstImageDataUri((array)config('valerie-showers.pdf.logo_candidates', []));
  }

  public static function coverDataUri(): string
  {
    $candidates = (array)config('valerie-showers.pdf.cover_candidates', []);

    $custom = config('nicole.company.cover_image');
    if ($custom) {
      array_unshift($candidates, (string)$custom);
    }

    return self::firstImageDataUri($candidates) ?? self::coverPlaceholder();
  }

  public static function coverPlaceholder(): string
  {
    $color = (string)config('valerie-showers.pdf.accent_color', '#0284C7');

    $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">'
      . '<rect width="800" height="600" fill="#f8fafc"/>'
      . '<path d="M200,100 L600,100 L600,500 L200,500 Z" fill="none" stroke="' . e($color) . '" stroke-width="2" stroke-opacity="0.35"/>'
      . '<circle cx="400" cy="300" r="100" fill="none" stroke="' . e($color) . '" stroke-width="1" stroke-opacity="0.25"/>'
      . '</svg>';

    return 'data:image/svg+xml;base64,' . base64_encode($svg);
  }

  /**
   * @param string[] $relativePaths пути относительно public/
   */
  public static function firstImageDataUri(array $relativePaths): ?string
  {
    foreach ($relativePaths as $relative) {
      $path = public_path(ltrim((string)$relative, '/'));

      if (is_file($path)) {
        return self::fileDataUri($path);
      }
    }

    return null;
  }

  public static function fileDataUri(string $path): string
  {
    $mime = match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
      'svg' => 'image/svg+xml',
      'png' => 'image/png',
      'webp' => 'image/webp',
      'jpg', 'jpeg' => 'image/jpeg',
      default => (mime_content_type($path) ?: 'application/octet-stream'),
    };

    return 'data:' . $mime . ';base64,' . base64_encode((string)file_get_contents($path));
  }

  /**
   * @font-face для шрифтов пакета (встраиваются в base64, Chrome/Browsershot не ходит по путям).
   */
  public static function fontFacesCss(): string
  {
    $fonts = [
      ['DM Sans', 'DMSans/DMSans-Regular.ttf', 'normal'],
      ['DM Sans', 'DMSans/DMSans-Medium.ttf', '500'],
      ['DM Sans', 'DMSans/DMSans-Bold.ttf', '700'],
      ['Inter', 'Inter/Inter_18pt-Regular.ttf', 'normal'],
      ['Inter', 'Inter/Inter_18pt-SemiBold.ttf', '600'],
      ['Inter', 'Inter/Inter_24pt-Bold.ttf', '700'],
    ];

    $css = '';
    foreach ($fonts as [$family, $file, $weight]) {
      $path = self::packagePath('resources/fonts/' . $file);
      if (!is_file($path)) {
        continue;
      }

      $css .= "@font-face{font-family:'{$family}';"
        . 'src:url("data:font/truetype;charset=utf-8;base64,' . base64_encode((string)file_get_contents($path)) . '") format("truetype");'
        . "font-weight:{$weight};font-style:normal;}\n";
    }

    return $css;
  }

  /**
   * Стили КП: pdf-report.css приложения (если есть) или пакета + theme.css приложения (если есть).
   */
  public static function stylesCss(): string
  {
    $base = self::appOverridePath('pdf-report.css');
    if (!is_file($base)) {
      $base = self::packagePath('resources/views/pdf/pdf-report.css');
    }

    $css = is_file($base) ? (string)file_get_contents($base) : '';

    $theme = self::appOverridePath('theme.css');
    if (is_file($theme)) {
      $css .= "\n/* app theme.css */\n" . file_get_contents($theme);
    }

    return $css;
  }

  public static function validUntil(CarbonInterface|string|null $createdAt): string
  {
    $days = (int)config('valerie-showers.pdf.validity_days', 30);
    $date = $createdAt ? Carbon::parse($createdAt) : Carbon::now();

    // copy(): не мутируем $order->created_at
    return $date->copy()->addDays($days)->format('d.m.Y');
  }

  /**
   * Страницы КП, для которых существует шаблон.
   *
   * @return string[]
   */
  public static function pages(): array
  {
    $pages = (array)config('valerie-showers.pdf.pages', ['cover', 'summary', 'estimate', 'contacts']);

    return array_values(array_filter(
      $pages,
      static fn($page) => is_string($page) && $page !== '' && view()->exists(self::VIEW_NAMESPACE . '::pdf.pages.' . $page)
    ));
  }
}
