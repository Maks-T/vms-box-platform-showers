<?php

use Illuminate\Support\Facades\Route;
use Valerie\Box\IndustryShowers\Http\Controllers\CalculatorController;

Route::get('/calculator/{type?}', [CalculatorController::class, 'show'])->name('calculator.show');
