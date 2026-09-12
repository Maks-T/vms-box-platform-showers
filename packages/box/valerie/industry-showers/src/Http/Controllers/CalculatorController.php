<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Http\Controllers;

use Illuminate\Http\Request;
use Nicole\Box\Core\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class CalculatorController
{
  /**
   * Отображение страницы 3D-калькулятора душевых.
   */
  public function show(Request $request): Response
  {
    $widgetSlug = 'widget';
    $order = null;

    $orderCode = $request->input('order') ?? $request->input('code');
    $orderId = $request->input('orderId');

    if ($orderCode) {
      $order = Order::where('code', $orderCode)->first();
    } elseif ($orderId) {
      $order = Order::find($orderId);
    }

    $user = auth()->user();

    $type = $user ? 'manager' : 'user';

    $initialData = [
      'apiUrl'     => url('/api/v1'),
      'assetsUrl'  => url('/' . $widgetSlug . '/'),
      'baseUrl'    => url('/'),
      'policyLink' => config('nicole.policy_link', '#'),
      'ofertaLink' => config('nicole.oferta_link', '#'),
      'state'      => $order ? $order->calc_state : null,
      'type'       => $type,
      'auth'       => [
        'client'   => null,
        'employee' => $user ? [
          'id'    => $user->id,
          'name'  => $user->name,
          'email' => $user->email,
          'roles' => method_exists($user, 'getRoleNames') ? $user->getRoleNames()->toArray() : [],
        ] : null,
      ],
    ];

    return Inertia::render('Calculator/Show', [
      'initialData' => $initialData,
    ]);
  }
}