<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
use Nicole\Box\Core\Models\Product;
use Nicole\Box\Core\Models\ProductVariant;
use Nicole\Box\Core\Models\ComplexDictionary;
use Nicole\Box\Core\Models\Currency;
use Nicole\Box\Core\Models\Attribute;

class ShowersCalculatorBridgeController extends Controller
{
  private const string CAT_GLASS        = 'cat_showers_glass';
  private const string CAT_PROFILES     = 'cat_showers_profiles';
  private const string CAT_HANDLES      = 'cat_showers_handles';
  private const string CAT_CROSSBARS    = 'cat_showers_crossbars';
  private const string CAT_OPEN_SYSTEMS = 'cat_showers_open_systems';
  private const string CAT_SEALANTS     = 'cat_showers_sealants';
  private const string CAT_DOORSTEPS    = 'cat_showers_doorsteps';
  private const string CAT_SERVICES     = 'cat_showers_services';

  public function loadData(Request $request): JsonResponse
  {
    $version = Cache::get('catalog_version', 1);
    $cacheKey = 'showers_calc_bridge_v' . $version . '_' . app()->getLocale();

    $responsePayload = Cache::remember($cacheKey, 86400, function () {
      return [
        'config'    => $this->loadConfigurations(),
        'prices'    => $this->loadPrices(),
        'limits'    => $this->loadLimits(),
        'interface' => $this->loadInterfaceSettings(),
        'rates'     => $this->loadExchangeRates(),
        'status'    => true
      ];
    });

    return response()->json($responsePayload);
  }

  /**
   * Единый хелпер сборки базовых DTO-данных элемента товара/услуги
   */
  protected function buildBaseItemData(ProductVariant $variant, Product $product, string $unitSymbol): array
  {
    return [
      'id'         => (string)$variant->id,
      'variant_id' => $variant->id,
      'sku'        => $variant->sku,
      'name'       => $this->resolveVariantName($variant, $product),
      'unit'       => $unitSymbol,
      'price'      => $this->resolveVariantPrice($variant),
    ];
  }

  /**
   * Единый хелпер сборки DTO модификаций (для стекол, профилей, уплотнителей)
   */
  protected function buildVariantData(ProductVariant $variant): array
  {
    return [
      'id'         => $variant->id,
      'sku'        => $variant->sku,
      'price'      => $this->resolveVariantPrice($variant),
      'is_default' => (bool)$variant->is_default,
    ];
  }

  protected function getEavValue($model, string $code): string
  {
    $val = $model->attributeValues->first(fn($v) => $v->attribute && $v->attribute->code === $code);

    if (!$val && isset($model->product) && $model->product) {
      $val = $model->product->attributeValues->first(fn($v) => $v->attribute && $v->attribute->code === $code);
    }

    if (!$val) {
      return '';
    }

    return $val->value_option_id ? ($val->option?->slug ?? '') : ($val->value_string ?? (string)$val->value_numeric);
  }

  protected function getEavMultipleValues($model, string $code): array
  {
    $vals = $model->attributeValues->filter(fn($v) => $v->attribute && $v->attribute->code === $code);
    if ($vals->isEmpty()) {
      return [];
    }
    return $vals->map(function ($v) {
      return $v->value_option_id ? ($v->option?->slug ?? '') : ($v->value_string ?? (string)$v->value_numeric);
    })->filter()->values()->toArray();
  }

  protected function resolveVariantName(ProductVariant $variant, Product $product): string
  {
    $locale = app()->getLocale();
    return $variant->getTranslation('name', $locale)
      ?: ($product->getTranslation('name', $locale) ?? '');
  }

  protected function resolveVariantPreview(ProductVariant $variant, Product $product): string
  {
    return $variant->getPreviewUrl()
      ?: ($product->getPreviewUrl() ?? '');
  }

  protected function resolveVariantPrice(ProductVariant $variant): float
  {
    return (float)($variant->retail_price ?? $variant->getPrice());
  }

  protected function loadConfigurations(): array
  {
    $config = [];
    $locale = app()->getLocale();

    $furnitureDict = ComplexDictionary::where('code', 'shower_furniture')->with('records')->first();
    if ($furnitureDict) {
      foreach ($furnitureDict->records as $record) {
        $slug = $record->slug;
        $config['furniture'][$slug] = [
          'id'        => $slug,
          'name'      => $record->getTranslation('name', $locale) ?? $record->name,
          'hexColor'  => $record->meta['hex_color'] ?? '#FFFFFF',
          'metallic'  => (float)($record->meta['metallic'] ?? 0.0),
          'roughness' => (float)($record->meta['roughness'] ?? 0.0),
          'fluted'    => false
        ];
      }
    }

    $attributeMap = [
      'form_type'        => 'form',
      'door_type_ids'    => 'doors',
      'material_type_id' => 'material',
      'crossbar_type_id' => 'crossbar',
    ];

    foreach ($attributeMap as $attrCode => $frontKey) {
      $attribute = Attribute::where('code', $attrCode)->with('options')->first();
      if ($attribute) {
        foreach ($attribute->options as $option) {
          $slug = $option->slug;
          $config[$frontKey][$slug] = [
            'id'   => $slug,
            'name' => $option->getTranslation('value', $locale) ?? $option->value
          ];
        }
      }
    }

    return $config;
  }

  protected function loadPrices(): array
  {
    $prices = [
      'crossbar'   => [],
      'doorstep'   => [],
      'glasses'    => [],
      'handle'     => [],
      'openSystem' => [],
      'profile'    => [],
      'sealant'    => [],
      'services'   => []
    ];

    $allProducts = Product::query()
      ->where('is_active', true)
      ->with([
        'variants' => fn($query) => $query->where('is_active', true)->with([
          'attributeValues.attribute',
          'attributeValues.option',
        ]),
        'attributeValues.attribute',
        'attributeValues.option',
        'category',
        'unit'
      ])
      ->get();

    foreach ($allProducts as $product) {
      $catCode = $product->category?->external_code ?? '';
      $unitSymbol = $product->unit ? ($product->unit->getTranslation('symbol', app()->getLocale()) ?? $product->unit->symbol) : 'шт.';

      match ($catCode) {
        self::CAT_GLASS        => $this->parseGlassPrices($product, $unitSymbol, $prices),
        self::CAT_PROFILES     => $this->parseProfilePrices($product, $unitSymbol, $prices),
        self::CAT_HANDLES      => $this->parseHandlePrices($product, $unitSymbol, $prices),
        self::CAT_CROSSBARS    => $this->parseCrossbarPrices($product, $unitSymbol, $prices),
        self::CAT_OPEN_SYSTEMS => $this->parseOpenSystemPrices($product, $unitSymbol, $prices),
        self::CAT_SEALANTS     => $this->parseSealantPrices($product, $unitSymbol, $prices),
        self::CAT_DOORSTEPS    => $this->parseDoorstepPrices($product, $unitSymbol, $prices),
        self::CAT_SERVICES     => $this->parseServicePrices($product, $unitSymbol, $prices),
        default => null
      };
    }

    return $prices;
  }

  private function parseGlassPrices(Product $product, string $unitSymbol, array &$prices): void
  {
    $groupedByColor = [];

    foreach ($product->variants as $variant) {
      $colorOption = $variant->attributeValues
        ->first(fn($v) => $v->attribute && $v->attribute->code === 'color')
        ?->option
        ?? $product->attributeValues
          ->first(fn($v) => $v->attribute && $v->attribute->code === 'color')
          ?->option;

      if (!$colorOption) {
        continue;
      }

      $colorSlug = $colorOption->slug;

      if (!isset($groupedByColor[$colorSlug])) {
        $groupedByColor[$colorSlug] = [
          'id'        => $colorSlug,
          'name'      => $colorOption->getTranslation('value', app()->getLocale()) ?? $colorOption->value,
          'hexColor'  => $colorOption->param ?: '#D6E4E5',
          'roughness' => (float)$this->getEavValue($variant, 'roughness'),
          'fluted'    => (bool)$this->getEavValue($variant, 'fluted'),
          'pathImg'   => $this->resolveVariantPreview($variant, $product),
          'variants'  => []
        ];
      }

      $thicknessSlug = $this->getEavValue($variant, 'glass_thickness');

      if ($thicknessSlug) {
        $groupedByColor[$colorSlug]['variants'][$thicknessSlug] = $this->buildVariantData($variant);
      }
    }

    foreach ($groupedByColor as $colorSlug => $data) {
      $prices['glasses'][$colorSlug] = [
        'id'        => $colorSlug,
        'name'      => $data['name'],
        'unit'      => $unitSymbol,
        'variants'  => $data['variants'],
        'hexColor'  => $data['hexColor'],
        'roughness' => $data['roughness'],
        'fluted'    => $data['fluted'],
        'pathImg'   => $data['pathImg'] ?: ($product->getPreviewUrl() ?? ''),
      ];
    }
  }

  private function parseProfilePrices(Product $product, string $unitSymbol, array &$prices): void
  {
    $type = $this->getEavValue($product, 'type');
    if (!$type) {
      return;
    }

    $groupedByColor = [];

    foreach ($product->variants as $v) {
      $color = $this->getEavValue($v, 'furniture_type_id');
      $thick = $this->getEavValue($v, 'glass_thickness');

      if (!$color) {
        continue;
      }

      if (!isset($groupedByColor[$color])) {
        $groupedByColor[$color] = [
          'name'     => $this->resolveVariantName($v, $product),
          'variants' => [],
        ];
      }

      if ($thick) {
        $groupedByColor[$color]['variants'][$thick] = $this->buildVariantData($v);
      }
    }

    foreach ($groupedByColor as $color => $data) {
      $prices['profile'][$type][$color] = [
        'id'              => $color,
        'furnitureTypeId' => $color,
        'name'            => $data['name'],
        'unit'            => $unitSymbol,
        'variants'        => $data['variants'],
      ];
    }
  }

  private function parseHandlePrices(Product $product, string $unitSymbol, array &$prices): void
  {
    foreach ($product->variants as $v) {
      $type = $this->getEavValue($v, 'type') ?: $this->getEavValue($product, 'type');
      $color = $this->getEavValue($v, 'furniture_type_id');
      $rawId = (string)$v->id;

      $interfaceName = $this->getEavValue($v, 'interface_name');
      $variantName = $this->resolveVariantName($v, $product);

      $prices['handle'][$rawId] = array_merge(
        $this->buildBaseItemData($v, $product, $unitSymbol),
        [
          'type'            => $type,
          'furnitureTypeId' => $color,
          'doorTypeIds'     => $this->getEavMultipleValues($v, 'door_type_ids'),
          'interfaceName'   => $interfaceName ?: $variantName,
          'pathImg'         => $this->resolveVariantPreview($v, $product),
        ]
      );
    }
  }

  private function parseCrossbarPrices(Product $product, string $unitSymbol, array &$prices): void
  {
    foreach ($product->variants as $v) {
      $type = $this->getEavValue($v, 'type') ?: $this->getEavValue($product, 'type');
      if (!$type) {
        continue;
      }

      $rawId = (string)$v->id;

      $prices['crossbar'][$type][$rawId] = array_merge(
        $this->buildBaseItemData($v, $product, $unitSymbol),
        [
          'crossbarTypeId'  => $this->getEavValue($v, 'crossbar_type_id'),
          'furnitureTypeId' => $this->getEavValue($v, 'furniture_type_id'),
        ]
      );
    }
  }

  private function parseOpenSystemPrices(Product $product, string $unitSymbol, array &$prices): void
  {
    foreach ($product->variants as $v) {
      $type = $this->getEavValue($v, 'type') ?: $this->getEavValue($product, 'type');
      if (!$type) {
        continue;
      }

      $rawId = (string)$v->id;

      $prices['openSystem'][$type][$rawId] = array_merge(
        $this->buildBaseItemData($v, $product, $unitSymbol),
        [
          'materialTypeId'  => $this->getEavValue($v, 'material_type_id'),
          'furnitureTypeId' => $this->getEavValue($v, 'furniture_type_id'),
        ]
      );
    }
  }

  private function parseSealantPrices(Product $product, string $unitSymbol, array &$prices): void
  {
    $type = $this->getEavValue($product, 'type');
    if (!$type) {
      return;
    }

    $variants = [];

    foreach ($product->variants as $v) {
      $thick = $this->getEavValue($v, 'glass_thickness');

      if ($thick) {
        $variants[$thick] = $this->buildVariantData($v);
      }
    }

    $rawId = $product->code ?: ('id_' . $product->id);

    $prices['sealant'][$type][$rawId] = [
      'id'       => $rawId,
      'name'     => $product->getTranslation('name', app()->getLocale()) ?? $product->name,
      'unit'     => $unitSymbol,
      'variants' => $variants,
    ];
  }

  private function parseDoorstepPrices(Product $product, string $unitSymbol, array &$prices): void
  {
    foreach ($product->variants as $v) {
      $color = $this->getEavValue($v, 'furniture_type_id');
      $rawId = (string)$v->id;

      $prices['doorstep'][$rawId] = array_merge(
        $this->buildBaseItemData($v, $product, $unitSymbol),
        [
          'furnitureTypeId' => $color,
        ]
      );
    }
  }

  private function parseServicePrices(Product $product, string $unitSymbol, array &$prices): void
  {
    foreach ($product->variants as $v) {
      $type = $this->getEavValue($v, 'type') ?: $this->getEavValue($product, 'type');
      if (!$type) {
        continue;
      }

      $rateType = $this->getEavValue($v, 'service_rate_type');
      $formTypeId = $this->getEavValue($v, 'form_type') ?: $this->getEavValue($product, 'form_type');
      $doorTypeIds = $this->getEavMultipleValues($v, 'door_type_ids') ?: $this->getEavMultipleValues($product, 'door_type_ids');
      $retailPrice = $this->resolveVariantPrice($v);

      // Для монтажных работ выводим каждую разновидность по формам и дверям
      if ($type === 'montage') {
        $rawId = (string)$v->id;
        $prices['services']['montage'][$rawId] = array_merge(
          $this->buildBaseItemData($v, $product, $unitSymbol),
          [
            'formTypeId'      => $formTypeId,
            'doorTypeIds'     => $doorTypeIds,
            'price1'          => $retailPrice,
            'price2'          => 0.0,
            'base_variant_id' => $v->id,
            'rate_variant_id' => $v->id,
          ]
        );
        continue;
      }

      // Для замера, доставки и подъема - группируем базовый выезд (price1) и тариф за км/этаж (price2)
      if (!isset($prices['services'][$type]['main'])) {
        $prices['services'][$type]['main'] = [
          'id'              => (string)$v->id,
          'variant_id'      => $v->id,
          'sku'             => $v->sku,
          'name'            => $product->getTranslation('name', app()->getLocale()) ?? $product->name,
          'unit'            => $unitSymbol,
          'price'           => $retailPrice,
          'formTypeId'      => $formTypeId,
          'doorTypeIds'     => $doorTypeIds,
          'price1'          => 0.0,
          'price2'          => 0.0,
          'base_variant_id' => $v->id,
          'rate_variant_id' => $v->id,
        ];
      }

      // Если это вариант тарифа за км/этаж (KM/FLOOR или per_unit) -> пишем в price2
      if ($rateType === 'per_unit' || str_contains($v->sku, '-KM') || str_contains($v->sku, '-FLOOR')) {
        $prices['services'][$type]['main']['price2'] = $retailPrice;
        $prices['services'][$type]['main']['rate_variant_id'] = $v->id;
      }
      // Если это базовый выезд (BASE/ELEVATOR) -> пишем в price1
      else {
        $prices['services'][$type]['main']['id'] = (string)$v->id;
        $prices['services'][$type]['main']['variant_id'] = $v->id;
        $prices['services'][$type]['main']['sku'] = $v->sku;
        $prices['services'][$type]['main']['name'] = $this->resolveVariantName($v, $product);
        $prices['services'][$type]['main']['price'] = $retailPrice;
        $prices['services'][$type]['main']['price1'] = $retailPrice;
        $prices['services'][$type]['main']['base_variant_id'] = $v->id;
      }
    }
  }

  protected function loadLimits(): array
  {
    $limits = [];

    $measureDict = ComplexDictionary::where('code', 'shower_measure_limits')->with('records')->first();
    if ($measureDict) {
      foreach ($measureDict->records as $record) {
        $limits['measure'][$record->slug] = [
          'id'        => $record->slug,
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
          'id'       => $record->slug,
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
          'adminShow'   => (bool)($record->meta['show_admin'] ?? false),
          'managerShow' => (bool)($record->meta['show_manager'] ?? false),
          'userShow'    => (bool)($record->meta['show_user'] ?? false),
          'adminValue'  => (string)($record->meta['value_admin'] ?? ''),
          'managerValue'=> (string)($record->meta['value_manager'] ?? ''),
          'userValue'   => (string)($record->meta['value_user'] ?? ''),
        ];
      }
    }

    return $settings;
  }

  protected function loadExchangeRates(): array
  {
    $rates = [];

    $baseCurrency = Currency::where('is_active', true)->where('is_default', true)->first()
      ?? Currency::where('is_active', true)->first();

    if ($baseCurrency) {
      $rates[$baseCurrency->code] = [
        'ID'           => (string)$baseCurrency->id,
        'code'         => $baseCurrency->code,
        'name'         => $baseCurrency->getTranslation('name', app()->getLocale()) ?? $baseCurrency->name,
        'scale'        => 1,
        'rate'         => 1.0,
        'main'         => "1",
        'shortName'    => $baseCurrency->symbol,
        'lastEditDate' => $baseCurrency->updated_at?->toDateTimeString() ?? date('Y-m-d H:i:s')
      ];
    }

    return $rates;
  }

}