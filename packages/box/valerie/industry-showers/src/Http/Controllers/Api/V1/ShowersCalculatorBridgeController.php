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
use Nicole\Box\Core\Models\Attribute;
use Nicole\Box\Core\Services\PricingManager;

class ShowersCalculatorBridgeController extends Controller
{
  // Карта сопоставления цветов в легаси-формат ID
  private const array COLOR_TO_LEGACY_ID_MAP = [
    'chrome'        => 'id_1',
    'chrome_matte'  => 'id_2',
    'black'         => 'id_3',
    'bronze'        => 'id_4',
    'gold'          => 'id_5',
    'gold_matte'    => 'id_6',
    'white'         => 'id_7',
    'gunmetal_grey' => 'id_8'
  ];

  // Системные коды категорий товаров VMS-NC [2]
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
   * Получение одиночного ЕАV-значения.
   */
  protected function getEavValue($model, string $code): string
  {
    $val = $model->attributeValues->first(fn($v) => $v->attribute && $v->attribute->code === $code);
    if (!$val) {
      return '';
    }
    return $val->value_option_id ? ($val->option?->slug ?? '') : ($val->value_string ?? (string)$val->value_numeric);
  }

  /**
   * Получение массива множественных ЕАV-значений.
   */
  protected function getEavMultipleValues($model, string $code): array
  {
    $vals = $model->attributeValues->filter(fn($v) => $v->attribute && $v->attribute->code === $code);
    if ($vals->isEmpty()) {
      return [];
    }
    return $vals->map(function($v) {
      return $v->value_option_id ? ($v->option?->slug ?? '') : ($v->value_string ?? (string)$v->value_numeric);
    })->filter()->values()->toArray();
  }

  protected function getEavOptionParam($model, string $code): ?string
  {
    $val = $model->attributeValues->first(fn($v) => $v->attribute && $v->attribute->code === $code);
    if (!$val || !$val->option) {
      return null;
    }
    return $val->option->param;
  }

  /**
   * Безопасное извлечение имени торгового предложения с фолбеком на продукт [2].
   */
  protected function resolveVariantName($variant, $product): string
  {
    $locale = app()->getLocale();
    return $variant->getTranslation('name', $locale)
      ?: ($product->getTranslation('name', $locale) ?? '');
  }

  /**
   * Безопасное извлечение картинки превью с фолбеком на продукт [2].
   */
  protected function resolveVariantPreview($variant, $product): string
  {
    return $variant->getPreviewUrl()
      ?: ($product->getPreviewUrl() ?? '');
  }

  /**
   * Получение розничной стоимости модификации [2].
   */
  protected function resolveVariantPrice($variant): float
  {
    return (float)($variant->retail_price ?? $variant->getPrice());
  }

  /**
   * Маппинг цвета фурнитуры в легаси-формат ID [2].
   */
  protected function getLegacyColorId(string $colorSlug): string
  {
    return self::COLOR_TO_LEGACY_ID_MAP[$colorSlug] ?? $colorSlug;
  }

  protected function loadConfigurations(): array
  {
    $config = [];
    $locale = app()->getLocale();

    // 1. Фурнитура (выгружается из Complex Dictionary) [2]
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

    // 2. Формы, Двери, Материалы и Штанги (загружаются из обычных ЕАV-атрибутов) [2]
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

    $pricingManager = app(PricingManager::class);
    $priceTypeCurrencyCode = $pricingManager->defaultPriceType->currency->code ?? $pricingManager->baseCurrency->code;

    $allProducts = Product::with([
      'variants.attributeValues.attribute',
      'variants.attributeValues.option',
      'attributeValues.attribute',
      'attributeValues.option'
    ])->get();

    foreach ($allProducts as $product) {
      $catCode = $product->category?->external_code ?? '';
      $unitSymbol = $product->unit ? ($product->unit->getTranslation('symbol', app()->getLocale()) ?? $product->unit->symbol) : 'шт.';

      // Декомпозиция по категориям товаров [2]
      match ($catCode) {
        self::CAT_GLASS        => $this->parseGlassPrices($product, $unitSymbol, $prices),
        self::CAT_PROFILES     => $this->parseProfilePrices($product, $unitSymbol, $priceTypeCurrencyCode, $prices),
        self::CAT_HANDLES      => $this->parseHandlePrices($product, $unitSymbol, $priceTypeCurrencyCode, $prices),
        self::CAT_CROSSBARS    => $this->parseCrossbarPrices($product, $unitSymbol, $priceTypeCurrencyCode, $prices),
        self::CAT_OPEN_SYSTEMS => $this->parseOpenSystemPrices($product, $unitSymbol, $priceTypeCurrencyCode, $prices),
        self::CAT_SEALANTS     => $this->parseSealantPrices($product, $unitSymbol, $priceTypeCurrencyCode, $prices),
        self::CAT_DOORSTEPS    => $this->parseDoorstepPrices($product, $unitSymbol, $priceTypeCurrencyCode, $prices),
        self::CAT_SERVICES     => $this->parseServicePrices($product, $unitSymbol, $priceTypeCurrencyCode, $prices),
        default => null
      };
    }

    return $prices;
  }

  private function parseGlassPrices($product, string $unitSymbol, array &$prices): void
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
          'prices'    => [
            '6mm'  => 0.0,
            '8mm'  => 0.0,
            '10mm' => 0.0,
          ],
          'variant_ids' => [ // Собираем ID вариантов стекол
            '6mm'  => null,
            '8mm'  => null,
            '10mm' => null,
          ]
        ];
      }

      $priceVal = $this->resolveVariantPrice($variant);
      if (str_ends_with($variant->sku, '6MM')) {
        $groupedByColor[$colorSlug]['prices']['6mm'] = $priceVal;
        $groupedByColor[$colorSlug]['variant_ids']['6mm'] = $variant->id;
      } elseif (str_ends_with($variant->sku, '8MM')) {
        $groupedByColor[$colorSlug]['prices']['8mm'] = $priceVal;
        $groupedByColor[$colorSlug]['variant_ids']['8mm'] = $variant->id;
      } elseif (str_ends_with($variant->sku, '10MM')) {
        $groupedByColor[$colorSlug]['prices']['10mm'] = $priceVal;
        $groupedByColor[$colorSlug]['variant_ids']['10mm'] = $variant->id;
      }
    }

    foreach ($groupedByColor as $colorSlug => $data) {
      $prices['glasses'][$colorSlug] = [
        'id'        => $colorSlug,
        'name'      => $data['name'],
        'unit'      => $unitSymbol,
        'currency'  => 'USD',
        'price1'    => $data['prices']['6mm'],
        'price2'    => $data['prices']['8mm'],
        'price3'    => $data['prices']['10mm'],
        'variant_ids' => $data['variant_ids'],
        'hexColor'  => $data['hexColor'],
        'roughness' => $data['roughness'],
        'fluted'    => $data['fluted'],
        'pathImg'   => $data['pathImg'] ?: ($product->getPreviewUrl() ?? ''),
      ];
    }
  }

  private function parseProfilePrices($product, string $unitSymbol, string $currency, array &$prices): void
  {
    $type = $this->getEavValue($product, 'type');
    $groupedByColor = [];

    foreach ($product->variants as $v) {
      $color = $this->getEavValue($v, 'furniture_type_id');
      $thick = $this->getEavValue($v, 'glass_thickness');
      $groupedByColor[$color][$thick] = $this->resolveVariantPrice($v);
      $groupedByColor[$color][$thick . '_variant_id'] = $v->id;
      $groupedByColor[$color]['name'] = $this->resolveVariantName($v, $product);
    }

    foreach ($groupedByColor as $color => $thickPrices) {
      $id = $this->getLegacyColorId($color);
      $prices['profile'][$type][$id] = [
        'id'              => $id,
        'furnitureTypeId' => $color,
        'name'            => $thickPrices['name'] ?? '',
        'unit'            => $unitSymbol,
        'currency'        => $currency,
        'price1'          => $thickPrices['6mm'] ?? 0.0,
        'price2'          => $thickPrices['8mm'] ?? 0.0,
        'price3'          => $thickPrices['10mm'] ?? 0.0,
        'variant_ids' => [ // Выводим ID вариантов [2]
          '6mm'  => $thickPrices['6mm_variant_id'] ?? null,
          '8mm'  => $thickPrices['8mm_variant_id'] ?? null,
          '10mm' => $thickPrices['10mm_variant_id'] ?? null,
        ]
      ];
    }
  }

  private function parseHandlePrices($product, string $unitSymbol, string $currency, array &$prices): void
  {
    foreach ($product->variants as $v) {
      $type = $this->getEavValue($v, 'type');
      $color = $this->getEavValue($v, 'furniture_type_id');
      $skuParts = explode('-', $v->sku);
      $rawId = strtolower(end($skuParts)) . '_' . $type;

      $prices['handle'][$rawId] = [
        'id'              => $rawId,
        'type'            => $type,
        'furnitureTypeId' => $color,
        'doorTypeIds'     => $this->getEavMultipleValues($v, 'door_type_ids'),
        'interfaceName'   => $this->getEavValue($v, 'interface_name'),
        'name'            => $this->resolveVariantName($v, $product),
        'unit'            => $unitSymbol,
        'currency'        => $currency,
        'price'           => $this->resolveVariantPrice($v),
        'pathImg'         => $this->resolveVariantPreview($v, $product)
      ];
    }
  }

  private function parseCrossbarPrices($product, string $unitSymbol, string $currency, array &$prices): void
  {
    $type = $this->getEavValue($product, 'type');
    foreach ($product->variants as $v) {
      $cbType = $this->getEavValue($v, 'crossbar_type_id');
      $color = $this->getEavValue($v, 'furniture_type_id');
      $skuParts = explode('-', $v->sku);
      $rawId = strtolower(end($skuParts));

      $prices['crossbar'][$type][$rawId] = [
        'id'              => $rawId,
        'crossbarTypeId'  => $cbType,
        'furnitureTypeId' => $color,
        'name'            => $this->resolveVariantName($v, $product),
        'unit'            => $unitSymbol,
        'currency'        => $currency,
        'price'           => $this->resolveVariantPrice($v)
      ];
    }
  }

  private function parseOpenSystemPrices($product, string $unitSymbol, string $currency, array &$prices): void
  {
    $type = $this->getEavValue($product, 'type');
    foreach ($product->variants as $v) {
      $mat = $this->getEavValue($v, 'material_type_id');
      $color = $this->getEavValue($v, 'furniture_type_id');
      $skuParts = explode('-', $v->sku);
      $rawId = strtolower(end($skuParts));

      $prices['openSystem'][$type][$rawId] = [
        'id'              => $rawId,
        'materialTypeId'  => $mat,
        'furnitureTypeId' => $color,
        'name'            => $this->resolveVariantName($v, $product),
        'unit'            => $unitSymbol,
        'currency'        => $currency,
        'price'           => $this->resolveVariantPrice($v)
      ];
    }
  }

  private function parseSealantPrices($product, string $unitSymbol, string $currency, array &$prices): void
  {
    $type = $this->getEavValue($product, 'type');
    $p6 = 0.0; $p8 = 0.0; $p10 = 0.0;

    foreach ($product->variants as $v) {
      $priceVal = $this->resolveVariantPrice($v);
      if (str_ends_with($v->sku, '6MM')) {
        $p6 = $priceVal;
      } elseif (str_ends_with($v->sku, '8MM')) {
        $p8 = $priceVal;
      } elseif (str_ends_with($v->sku, '10MM')) {
        $p10 = $priceVal;
      }
    }

    $prices['sealant'][$type]['id_1'] = [
      'id'       => 'id_1',
      'name'     => $product->getTranslation('name', app()->getLocale()) ?? $product->name,
      'unit'     => $unitSymbol,
      'currency' => $currency,
      'price1'   => $p6,
      'price2'   => $p8,
      'price3'   => $p10
    ];
  }

  private function parseDoorstepPrices($product, string $unitSymbol, string $currency, array &$prices): void
  {
    foreach ($product->variants as $v) {
      $color = $this->getEavValue($v, 'furniture_type_id');
      $skuParts = explode('-', $v->sku);
      $rawId = strtolower(end($skuParts));

      $prices['doorstep'][$rawId] = [
        'id'              => $rawId,
        'furnitureTypeId' => $color,
        'name'            => $this->resolveVariantName($v, $product),
        'unit'            => $unitSymbol,
        'currency'        => $currency,
        'price'           => $this->resolveVariantPrice($v)
      ];
    }
  }

  private function parseServicePrices($product, string $unitSymbol, string $currency, array &$prices): void
  {
    $type = $this->getEavValue($product, 'type');
    foreach ($product->variants as $v) {
      $skuParts = explode('-', $v->sku);
      $rawId = strtolower(end($skuParts));

      $prices['services'][$type][$rawId] = [
        'id'          => $rawId,
        'formTypeId'  => $this->getEavValue($v, 'form_type'),
        'doorTypeIds' => $this->getEavMultipleValues($v, 'door_type_ids'),
        'name'        => $this->resolveVariantName($v, $product),
        'unit'        => $unitSymbol,
        'currency'    => $currency,
        'price1'      => $this->resolveVariantPrice($v),
        'price2'      => (float)$v->cost_price
      ];
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
    $currencies = Currency::where('is_active', true)->get();

    foreach ($currencies as $currency) {
      $rates[$currency->code] = [
        'ID'           => (string)$currency->id,
        'code'         => $currency->code,
        'name'         => $currency->getTranslation('name', app()->getLocale()) ?? $currency->name,
        'scale'         => 1,
        'rate'         => (float)$currency->rate,
        'main'         => $currency->is_default ? "1" : "0",
        'shortName'    => $currency->symbol,
        'lastEditDate' => $currency->updated_at?->toDateTimeString() ?? date('Y-m-d H:i:s')
      ];
    }

    return $rates;
  }
}
