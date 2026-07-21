<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Support;

use Nicole\Box\Core\Models\OrderSection;
use Carbon\Carbon;

class PdfEstimateRenderer
{
  /**
   * Поиск и кодирование в Base64 изображения продукта из MediaLibrary по совпадению имени в смете.
   */
  public static function resolveProductPhoto(string $name, OrderSection $section): ?string
  {
    foreach ($section->products as $op) {
      if ($op->variant) {
        $variantName = $op->variant->getTranslation('name', app()->getLocale()) ?? $op->variant->name;
        $product = $op->variant->product;
        $prodName = $product ? ($product->getTranslation('name', app()->getLocale()) ?? $product->name) : '';

        $match = false;
        if ($variantName && (str_contains(strtolower($name), strtolower($variantName)) || str_contains(strtolower($variantName), strtolower($name)))) {
          $match = true;
        } elseif ($prodName && (str_contains(strtolower($name), strtolower($prodName)) || str_contains(strtolower($prodName), strtolower($name)))) {
          $match = true;
        }

        if ($match) {
          $media = $op->variant->getFirstMedia('preview')
            ?? ($op->variant->getFirstMedia('main')
              ?? ($product ? ($product->getFirstMedia('preview') ?? $product->getFirstMedia('main')) : null));

          if ($media) {
            $path = $media->getPath();
            if (file_exists($path)) {
              $mime = mime_content_type($path);
              return 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($path));
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Возвращает техническое описание базового продукта по совпадению имени.
   */
  public static function resolveProductDesc(string $name, OrderSection $section): string
  {
    foreach ($section->products as $op) {
      if ($op->variant) {
        $variantName = $op->variant->getTranslation('name', app()->getLocale()) ?? $op->variant->name;
        $product = $op->variant->product;
        $prodName = $product ? ($product->getTranslation('name', app()->getLocale()) ?? $product->name) : '';

        $match = false;
        if ($variantName && (str_contains(strtolower($name), strtolower($variantName)) || str_contains(strtolower($variantName), strtolower($name)))) {
          $match = true;
        } elseif ($prodName && (str_contains(strtolower($name), strtolower($prodName)) || str_contains(strtolower($prodName), strtolower($name)))) {
          $match = true;
        }

        if ($match && $product) {
          return $product->getTranslation('description', app()->getLocale())
            ?? 'Технические характеристики уточняются.';
        }
      }
    }

    return 'Описание технических характеристик уточняется.';
  }

  /**
   * Рекурсивно вычисляет стоимость технического надзора по дереву сметы.
   */
  public static function resolveTechSupervisionPrice(array $estimateTree): float
  {
    $techPrice = 0;

    $search = function(array $items) use (&$search, &$techPrice) {
      foreach ($items as $item) {
        $val = $item['value'] ?? [];
        if (count($val) >= 5 && (str_contains(strtolower($val[0]), 'технический надзор') || str_contains(strtolower($val[0]), 'тех. надзор'))) {
          $techPrice = (float) preg_replace('/[^0-9]/', '', $val[4]);
          return;
        }
        if (!empty($item['children']) && is_array($item['children'])) {
          $search($item['children']);
        }
      }
    };

    $search($estimateTree);

    return $techPrice;
  }

  /**
   * Подсчет общего количества позиций в конкретной секции заказа (на основе meta)
   */
  public static function countTotalPositions(OrderSection $section): int
  {
    $positionsCount = 0;
    if (is_array($section->meta['items'] ?? null)) {
      foreach ($section->meta['items'] as $groupItems) {
        $positionsCount += is_array($groupItems) ? count($groupItems) : 0;
      }
    }
    return $positionsCount;
  }

  /**
   * Универсальное форматирование стоимости с разделителями тысяч и символом валюты
   */
  public static function formatPrice(float $amount, string $currencySymbol = 'руб.'): string
  {
    return number_format($amount, 0, '.', ' ') . ' ' . $currencySymbol;
  }

  /**
   * Расчет срока действия коммерческого предложения (по умолчанию +30 дней)
   */
  public static function getValidUntil(?Carbon $createdAt): string
  {
    $date = $createdAt ? $createdAt->addDays(30) : Carbon::now()->addDays(30);
    return $date->format('d.m.Y');
  }
}
