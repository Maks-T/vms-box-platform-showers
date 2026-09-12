<?php

use Illuminate\Support\Facades\Route;
use Valerie\Box\IndustryShowers\Http\Controllers\CalculatorController;

Route::get('/calculator', [CalculatorController::class, 'show'])->name('calculator.show');