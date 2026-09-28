<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Support\Formatters;

use Filament\Infolists\Components\ViewEntry;
use Filament\Schemas\Components\Component as FilamentSchemasComponent;
use Filament\Schemas\Components\View;
use Nicole\Box\Core\Contracts\OrderSectionFormatterInterface;
use Nicole\Box\Core\Models\OrderSection;

/**
 * Отраслевой форматтер изделий и сметы для душевых перегородок (Showers).
 *
 * @since 2026-09-28
 */
class ShowersOrderSectionFormatter implements OrderSectionFormatterInterface
{
  /**
   * Формирование детальной таблицы технических характеристик для модального окна.
   *
   * @return array<string, string>
   */
  public function formatSpecifications(OrderSection $section): array
  {
    $specs = [];
    $rawDescription = $section->description ?? [];

    if (is_array($rawDescription)) {
      foreach ($rawDescription as $item) {
        $name = trim((string)($item['name'] ?? ''));
        $val = trim((string)($item['description'] ?? ''));

        if ($name !== '' && $val !== '') {
          $specs[$name] = $val;
        }
      }
    }

    return $specs;
  }

  /**
   * Формирование краткой сводки изделия для колонки таблицы «Изделия заказа».
   * Гарантированно выводит форму, размеры сторон A/B/C/D, высоту и тип открывания.
   */
  public function formatSummary(OrderSection $section): string
  {
    $lines = [];
    $rawDescription = $section->description ?? [];
    $descMap = [];

    if (is_array($rawDescription)) {
      foreach ($rawDescription as $item) {
        $k = mb_strtolower(trim((string)($item['name'] ?? '')));
        $v = trim((string)($item['description'] ?? ''));
        if ($k !== '' && $v !== '') {
          $descMap[$k] = $v;
        }
      }
    }

    // 1. Форма перегородки
    $formVal = $this->findValue($descMap, ['форма', 'shape']);
    if ($formVal) {
      $lines[] = "• " . __('Shower partition shape') . ": <strong>{$formVal}</strong>";
    }

    // 2. Размеры сторон (A, B, C...)
    $sidesVal = $this->findValue($descMap, ['размер', 'габарит', 'dimension', 'стороны']);
        if (!empty($section->meta['properties']['sides']) && is_array($section->meta['properties']['sides'])) {
      $labels = ['A', 'B', 'C', 'D'];
      $sidesList = [];
      foreach ($section->meta['properties']['sides'] as $idx => $sideVal) {
        $lbl = $labels[$idx] ?? (string)($idx + 1);
        $sidesList[] = "{$lbl}: {$sideVal} мм";
      }
      $sidesVal = implode(', ', $sidesList);
        } elseif ($sidesVal && !str_contains($sidesVal, ':')) {
            $sidesVal = "A: {$sidesVal}";
    }

    if ($sidesVal) {
            $lines[] = "• " . __('Dimensions') . ": <strong>{$sidesVal}</strong>";
    }

    // 3. Высота
    $heightVal = $this->findValue($descMap, ['высота', 'height']);
    if ($heightVal) {
      $formattedHeight = str_ends_with($heightVal, 'мм') ? $heightVal : "{$heightVal} мм";
      $lines[] = "• " . __('Height, mm') . ": <strong>{$formattedHeight}</strong>";
    }

    // 4. Тип открывания
    $doorVal = $this->findValue($descMap, ['открыван', 'door', 'дверь']);
    if ($doorVal) {
      $lines[] = "• " . __('Opening Type') . ": <strong>{$doorVal}</strong>";
    }

    if (empty($lines)) {
      foreach ($descMap as $k => $v) {
        $lines[] = "• " . ucfirst($k) . ": <strong>{$v}</strong>";
        if (count($lines) >= 4) {
          break;
        }
      }
    }

    return !empty($lines) ? implode('<br>', $lines) : '—';
  }

  /**
   * Схема компонентов вкладки сметы для модального окна изделия Filament.
   * Делегирует рендеринг отраслевому шаблону valerie-showers::filament.infolists.estimate-table.
   *
   * @return array<FilamentSchemasComponent>
   */
  public function formatEstimate(OrderSection $section): array
  {
    if (class_exists(ViewEntry::class)) {
      return [
        ViewEntry::make('estimate')
          ->view('valerie-showers::filament.infolists.estimate-table')
          ->viewData(['section' => $section, 'estimate' => $section->estimate ?? []])
          ->hiddenLabel()
          ->columnSpanFull(),
      ];
    }

    return [
      View::make('valerie-showers::filament.infolists.estimate-table')
        ->viewData(['section' => $section, 'estimate' => $section->estimate ?? []])
        ->columnSpanFull(),
    ];
  }

  /**
   * Вспомогательный поиск ключа в словаре описания
   */
  protected function findValue(array $map, array $needles): ?string
  {
    foreach ($map as $key => $val) {
      foreach ($needles as $needle) {
        if (str_contains($key, $needle)) {
          return $val;
        }
      }
    }

    return null;
  }
}