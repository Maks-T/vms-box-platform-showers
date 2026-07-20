<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Nicole\Box\Core\Models\Product;
use Nicole\Box\Core\Models\ComplexDictionary;
use Nicole\Box\Core\Models\Currency;

class ShowersCalculatorBridgeController extends Controller
{
  public function appData(Request $request): JsonResponse
  {
    $data = [];

    $data['config'] = $this->loadConfigurations();
    $data['prices'] = $this->loadPrices();
    $data['limits'] = $this->loadLimits();
    $data['interface'] = $this->loadInterfaceSettings();
    $data['rates'] = $this->loadExchangeRates();
    $data['status'] = true;

    return response()->json($data);
  }

  protected function loadConfigurations(): array
  {
    $config = [];
    $dicts = ['shower_forms' => 'form', 'shower_doors' => 'doors', 'shower_materials' => 'material', 'shower_furniture' => 'furniture'];

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
    $prices = [];

    $glassesProducts = Product::where('category_external_code', 'cat_showers_glass')
      ->with('variants.attributeValues.option')
      ->get();

    foreach ($glassesProducts as $product) {
      $p6 = 0.0; $p8 = 0.0; $p10 = 0.0;
      foreach ($product->variants as $variant) {
        $thick = $variant->attributeValues->firstWhere('attribute.code', 'glass_thickness')?->option?->slug;
        $price = (float)$variant->price;
        if ($thick === '6') $p6 = $price;
        if ($thick === '8') $p8 = $price;
        if ($thick === '10') $p10 = $price;
      }

      $prices['glasses'][$product->code] = [
        'id' => $product->code,
        'name' => $product->getTranslation('name', app()->getLocale()) ?? $product->name,
        'unit' => 'm²',
        'currency' => 'USD',
        'price1' => $p6,
        'price2' => $p8,
        'price3' => $p10,
        'hexColor' => '#D6E4E5',
        'roughness' => 0.0,
        'fluted' => false,
        'pathImg' => ''
      ];
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
