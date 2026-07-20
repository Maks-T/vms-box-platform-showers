<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
use Nicole\Box\Core\Models\Product;
use Nicole\Box\Core\Models\ComplexDictionary;
use Nicole\Box\Core\Models\Currency;

class ShowersCalculatorBridgeController extends Controller
{
  public function appData(Request $request): JsonResponse
  {
    $version = Cache::get('catalog_version', 1);
    $cacheKey = 'showers_calc_bridge_v' . $version . '_' . app()->getLocale();

    $responsePayload = Cache::remember($cacheKey, 86400, function () {
      return [
        'config' => $this->loadConfigurations(),
        'prices' => $this->loadPrices(),
        'limits' => $this->loadLimits(),
        'interface' => $this->loadInterfaceSettings(),
        'rates' => $this->loadExchangeRates()
      ];
    });

    return response()->json($responsePayload);
  }

  protected function getEavValue($model, string $code): string
  {
    $val = $model->attributeValues->first(fn($v) => $v->attribute && $v->attribute->code === $code);
    if (!$val) {
      return '';
    }
    return $val->value_option_id ? ($val->option?->slug ?? '') : ($val->value_string ?? (string)$val->value_numeric);
  }

  protected function getEavOptionParam($model, string $code): ?string
  {
    $val = $model->attributeValues->first(fn($v) => $v->attribute && $v->attribute->code === $code);
    if (!$val || !$val->option) {
      return null;
    }
    return $val->option->param;
  }

  protected function loadConfigurations(): array
  {
    $config = [];
    $dicts = [
      'shower_forms' => 'form',
      'shower_doors' => 'doors',
      'shower_materials' => 'material',
      'shower_furniture' => 'furniture'
    ];

    foreach ($dicts as $dbCode => $frontKey) {
      $dict = ComplexDictionary::where('code', $dbCode)->with('records')->first();
      if ($dict) {
        foreach ($dict->records as $record) {
          $slug = $record->slug;
          $config[$frontKey][$slug] = [
            'id' => $slug,
            'name' => $record->getTranslation('name', app()->getLocale()) ?? $record->name
          ];

          if ($frontKey === 'furniture') {
            $config[$frontKey][$slug]['hexColor'] = $record->meta['hex_color'] ?? '#FFFFFF';
            $config[$frontKey][$slug]['metallic'] = (float)($record->meta['metallic'] ?? 0.0);
            $config[$frontKey][$slug]['roughness'] = (float)($record->meta['roughness'] ?? 0.0);
            $config[$frontKey][$slug]['fluted'] = false;
          }
        }
      }
    }

    return $config;
  }

  protected function loadPrices(): array
  {
    $prices = [
      'crossbar' => [],
      'doorstep' => [],
      'glasses' => [],
      'handle' => [],
      'openSystem' => [],
      'profile' => [],
      'sealant' => [],
      'services' => []
    ];

    $colorToId = [
      'chrome' => 'id_1',
      'chrome_matte' => 'id_2',
      'black' => 'id_3',
      'bronze' => 'id_4',
      'gold' => 'id_5',
      'gold_matte' => 'id_6',
      'white' => 'id_7',
      'gunmetal_grey' => 'id_8'
    ];

    $allProducts = Product::with([
      'variants.attributeValues.attribute',
      'variants.attributeValues.option',
      'attributeValues.attribute',
      'attributeValues.option'
    ])->get();

    foreach ($allProducts as $product) {
      $catCode = $product->category?->external_code ?? '';

      if ($catCode === 'cat_showers_glass') {
        $p6 = 0.0; $p8 = 0.0; $p10 = 0.0;
        foreach ($product->variants as $variant) {
          if (str_ends_with($variant->sku, '6MM')) {
            $p6 = (float)$variant->price;
          } elseif (str_ends_with($variant->sku, '8MM')) {
            $p8 = (float)$variant->price;
          } elseif (str_ends_with($variant->sku, '10MM')) {
            $p10 = (float)$variant->price;
          }
        }
        $prices['glasses'][$product->code] = [
          'id' => $product->code,
          'name' => $product->getTranslation('name', app()->getLocale()) ?? $product->name,
          'unit' => 'm²',
          'currency' => 'USD',
          'price1' => $p6,
          'price2' => $p8,
          'price3' => $p10,
          'hexColor' => $this->getEavOptionParam($product, 'color') ?: '#D6E4E5',
          'roughness' => (float)$this->getEavValue($product, 'roughness'),
          'fluted' => (bool)$this->getEavValue($product, 'fluted'),
          'pathImg' => $product->getPreviewUrl() ?? ''
        ];
      }

      if ($catCode === 'cat_showers_profiles') {
        $type = $this->getEavValue($product, 'type');
        $groupedByColor = [];
        foreach ($product->variants as $v) {
          $color = $this->getEavValue($v, 'furniture_type_id');
          $thick = $this->getEavValue($v, 'glass_thickness');
          $groupedByColor[$color][$thick] = (float)$v->price;
          $groupedByColor[$color]['name'] = $product->getTranslation('name', app()->getLocale()) ?? $product->name;
        }
        foreach ($groupedByColor as $color => $thickPrices) {
          $id = $colorToId[$color] ?? $color;
          $prices['profile'][$type][$id] = [
            'id' => $id,
            'furnitureTypeId' => $color,
            'name' => $thickPrices['name'] ?? '',
            'unit' => 'pcs.',
            'currency' => 'USD',
            'price1' => $thickPrices['6mm'] ?? 0.0,
            'price2' => $thickPrices['8mm'] ?? 0.0,
            'price3' => $thickPrices['10mm'] ?? 0.0
          ];
        }
      }

      if ($catCode === 'cat_showers_handles') {
        foreach ($product->variants as $v) {
          $type = $this->getEavValue($v, 'type');
          $color = $this->getEavValue($v, 'furniture_type_id');
          $skuParts = explode('-', $v->sku);
          $rawId = strtolower(end($skuParts)) . '_' . $type;
          $prices['handle'][$rawId] = [
            'id' => $rawId,
            'type' => $type,
            'furnitureTypeId' => $color,
            'doorTypeIds' => explode(',', $this->getEavValue($v, 'door_type_ids')),
            'interfaceName' => $this->getEavValue($v, 'interface_name'),
            'name' => $v->getTranslation('name', app()->getLocale()) ?? $v->name,
            'unit' => 'pcs.',
            'currency' => 'USD',
            'price' => (float)$v->price,
            'pathImg' => $v->getPreviewUrl() ?? ''
          ];
        }
      }

      if ($catCode === 'cat_showers_crossbars') {
        $type = $this->getEavValue($product, 'type');
        foreach ($product->variants as $v) {
          $cbType = $this->getEavValue($v, 'crossbar_type_id');
          $color = $this->getEavValue($v, 'furniture_type_id');
          $skuParts = explode('-', $v->sku);
          $rawId = strtolower(end($skuParts));
          $prices['crossbar'][$type][$rawId] = [
            'id' => $rawId,
            'crossbarTypeId' => $cbType,
            'furnitureTypeId' => $color,
            'name' => $v->getTranslation('name', app()->getLocale()) ?? $v->name,
            'unit' => $product->unit?->symbol ?? 'pcs.',
            'currency' => 'USD',
            'price' => (float)$v->price
          ];
        }
      }

      if ($catCode === 'cat_showers_open_systems') {
        $type = $this->getEavValue($product, 'type');
        foreach ($product->variants as $v) {
          $mat = $this->getEavValue($v, 'material_type_id');
          $color = $this->getEavValue($v, 'furniture_type_id');
          $skuParts = explode('-', $v->sku);
          $rawId = strtolower(end($skuParts));
          $prices['openSystem'][$type][$rawId] = [
            'id' => $rawId,
            'materialTypeId' => $mat,
            'furnitureTypeId' => $color,
            'name' => $v->getTranslation('name', app()->getLocale()) ?? $v->name,
            'unit' => 'psc.',
            'currency' => 'USD',
            'price' => (float)$v->price
          ];
        }
      }

      if ($catCode === 'cat_showers_sealants') {
        $type = $this->getEavValue($product, 'type');
        $p6 = 0.0; $p8 = 0.0; $p10 = 0.0;
        foreach ($product->variants as $v) {
          if (str_ends_with($v->sku, '6MM')) {
            $p6 = (float)$v->price;
          } elseif (str_ends_with($v->sku, '8MM')) {
            $p8 = (float)$v->price;
          } elseif (str_ends_with($v->sku, '10MM')) {
            $p10 = (float)$v->price;
          }
        }
        $prices['sealant'][$type]['id_1'] = [
          'id' => 'id_1',
          'name' => $product->getTranslation('name', app()->getLocale()) ?? $product->name,
          'unit' => 'psc.',
          'currency' => 'USD',
          'price1' => $p6,
          'price2' => $p8,
          'price3' => $p10
        ];
      }

      if ($catCode === 'cat_showers_doorsteps') {
        foreach ($product->variants as $v) {
          $color = $this->getEavValue($v, 'furniture_type_id');
          $skuParts = explode('-', $v->sku);
          $rawId = strtolower(end($skuParts));
          $prices['doorstep'][$rawId] = [
            'id' => $rawId,
            'furnitureTypeId' => $color,
            'name' => $v->getTranslation('name', app()->getLocale()) ?? $v->name,
            'unit' => 'lm.',
            'currency' => 'USD',
            'price' => (float)$v->price
          ];
        }
      }

      if ($catCode === 'cat_showers_services') {
        $type = $this->getEavValue($product, 'type');
        foreach ($product->variants as $v) {
          $skuParts = explode('-', $v->sku);
          $rawId = strtolower(end($skuParts));
          $prices['services'][$type][$rawId] = [
            'id' => $rawId,
            'formTypeId' => $this->getEavValue($v, 'form_type'),
            'doorTypeIds' => explode(',', $this->getEavValue($v, 'door_type_ids')),
            'name' => $v->getTranslation('name', app()->getLocale()) ?? $v->name,
            'unit' => 'service',
            'currency' => 'USD',
            'price1' => (float)$v->price,
            'price2' => (float)$v->cost_price
          ];
        }
      }
    }

    return $prices;
  }

  protected function loadLimits(): array
  {
    $limits = [];

    $measureDict = ComplexDictionary::where('code', 'shower_measure_limits')->with('records')->first();
    if ($measureDict) {
      foreach ($measureDict->records as $record) {
        $limits['measure'][$record->slug] = [
          'id' => $record->slug,
          'heightMin' => (int)($record->meta['height_min'] ?? 0),
          'heightMax' => (int)($record->meta['height_max'] ?? 0),
          'lengthMin' => (int)($record->meta['length_min'] ?? 0),
          'lengthMax' => (int)($record->meta['length_max'] ?? 0),
        ];
      }
    }

    $serviceDict = ComplexDictionary::where('code', 'shower_service_limits')->with('records')->first();
    if ($serviceDict) {
      foreach ($serviceDict->records as $record) {
        $limits['services'][$record->slug] = [
          'id' => $record->slug,
          'valueMin' => 0,
          'valueMax' => (int)($record->meta['value_max'] ?? 0),
        ];
      }
    }

    return $limits;
  }

  protected function loadInterfaceSettings(): array
  {
    $settings = [];
    $dict = ComplexDictionary::where('code', 'shower_interface_settings')->with('records')->first();

    if ($dict) {
      foreach ($dict->records as $record) {
        $settings[$record->slug] = [
          'adminShow' => (bool)($record->meta['show_admin'] ?? false),
          'managerShow' => (bool)($record->meta['show_manager'] ?? false),
          'userShow' => (bool)($record->meta['show_user'] ?? false),
          'adminValue' => (string)($record->meta['value_admin'] ?? ''),
          'managerValue' => (string)($record->meta['value_manager'] ?? ''),
          'userValue' => (string)($record->meta['value_user'] ?? ''),
        ];
      }
    }

    return $settings;
  }

  protected function loadExchangeRates(): array
  {
    $rates = [];
    $currencies = Currency::where('is_active', true)->get();

    foreach ($currencies as $currency) {
      $rates[$currency->code] = [
        'ID' => (string)$currency->id,
        'code' => $currency->code,
        'name' => $currency->getTranslation('name', app()->getLocale()) ?? $currency->name,
        'scale' => 1,
        'rate' => (float)$currency->rate,
        'main' => (bool)$currency->is_default,
        'shortName' => $currency->symbol,
        'lastEditDate' => $currency->updated_at?->toDateTimeString() ?? date('Y-m-d H:i:s')
      ];
    }

    return $rates;
  }
}
