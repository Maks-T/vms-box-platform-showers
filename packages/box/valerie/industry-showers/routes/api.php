<?php

use Illuminate\Support\Facades\Route;
use Valerie\Box\IndustryShowers\Http\Controllers\Api\V1\ShowersCalculatorBridgeController;

Route::get('showers/load-data', [ShowersCalculatorBridgeController::class, 'loadData']);

