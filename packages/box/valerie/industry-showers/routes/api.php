<?php

use Illuminate\Support\Facades\Route;
use Valerie\Box\IndustryShowers\Http\Controllers\Api\V1\ShowersCalculatorBridgeController;

Route::get('load-data', [ShowersCalculatorBridgeController::class, 'loadData']);

Route::get('permission', function () {
  return response()->json([
    'value' => 'admin', //  'admin' | 'manager' | 'user'
    'status' => true
  ]);
});
