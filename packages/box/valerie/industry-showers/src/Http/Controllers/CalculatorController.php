<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Http\Controllers;

use Illuminate\Http\Request;
use Nicole\Box\Core\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class CalculatorController
{
  public function show(Request $request, string $type = 'user'): Response
  {
    $widgetSlug = 'widget';

    $assets = $this->getAssets($widgetSlug);

    $order = null;

    $orderCode = $request->input('order') ?? $request->input('code');

    if ($orderCode) {
      $order = Order::where('code', $orderCode)->first();
    }

    $initialData = [
      'apiUrl' => config('app.url') . '/api/v1',
      'assetsUrl' => config('app.url') . '/' . $widgetSlug . '/',
      'baseUrl' => config('app.url'),
      'policyLink' => config('nicole.policy_link', '#'),
      'ofertaLink' => config('nicole.oferta_link', '#'),
      'state' => $order ? $order->calc_state : null,
    ];

    return Inertia::render('Calculator/Show', [
      'assets' => $assets,
      'initialData' => $initialData,
      'currentType' => $type,
    ]);
  }

  protected function getAssets(string $widgetSlug): array
  {
    $manifestPath = public_path($widgetSlug . '/manifest.json');

    if (!file_exists($manifestPath)) {
      return ['js' => null, 'css' => null];
    }

    $manifest = json_decode(file_get_contents($manifestPath), true);

    $jsFile = null;
    $cssFile = null;

    foreach ($manifest as $key => $path) {
      if (str_ends_with($key, '.js') && (str_starts_with($key, 'main') || str_starts_with($key, 'index'))) {
        $jsFile = url($widgetSlug . '/js/' . basename($path));
      }

      if (str_ends_with($key, '.css') && (str_starts_with($key, 'main') || str_starts_with($key, 'index'))) {
        $cssFile = url($widgetSlug . '/css/' . basename($path));
      }
    }

    return [
      'js' => $jsFile,
      'css' => $cssFile,
    ];
  }
}
