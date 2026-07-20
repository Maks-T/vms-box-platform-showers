<?php

use Illuminate\Support\Facades\Route;
use Valerie\Box\IndustryShowers\Http\Controllers\Api\V1\ShowersWidgetApiController;

Route::get('showers/load-data', [ShowersWidgetApiController::class, 'loadData']);

Route::get('/', [ShowersWidgetApiController::class, 'getOrder']);

Route::get('showers/load-data', [ShowersWidgetApiController::class, 'loadData']);
