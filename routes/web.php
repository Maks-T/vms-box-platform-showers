<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Nicole\Box\Core\Http\Resources\Api\V1\ProductResource;
use Nicole\Box\Core\Models\Product;

// 1. Главная страница (Душевые кабины под ключ)
Route::get('/', function () {
  return Inertia::render('ShowerCabin/Index');
})->name('home');

// Страница Душевые кабины
Route::get('/shower_cabin', function () {
  return Inertia::render('ShowerCabin/Index');
})->name('shower.cabin');

// Страница Межкомнатные перегородки
Route::get('/peregorodki', function () {
  return Inertia::render('Partitions/Index');
})->name('partitions');

// Страница Зеркала
Route::get('/zerkala', function () {
  return Inertia::render('Mirrors/Index');
})->name('mirrors');

// Страница Контакты
Route::get('/contacts', function () {
  return Inertia::render('Contacts/Index');
})->name('contacts');

// Каталог материалов VMS-NC
Route::get('/catalog', function () {
  return Inertia::render('Catalog/Index');
})->name('catalog');

// Страница конфигурации Bootstrap (API Инспектор)
Route::get('/bootstrap', function () {
  return Inertia::render('Bootstrap/Index');
})->name('bootstrap');

// Детальная карточка товара
Route::get('/product/{slug}', function (string $slug) {
  $product = Product::where('slug', $slug)
    ->where('is_active', true)
    ->with([
      'unit',
      'type.family',
      'attributeValues.attribute.complexDictionary',
      'attributeValues.option',
      'attributeValues.complexRecord',
      'variants' => fn($v) => $v->where('is_active', true),
      'variants.attributeValues.attribute',
      'variants.attributeValues.option',
      'variants.prices.type',
    ])
    ->firstOrFail();

  $productData = (new ProductResource($product))->toArray(request());

  return Inertia::render('Product/Show', [
    'product' => $productData,
    'familyCode' => $product->type->family->code ?? 'stone'
  ]);
})->name('product.show');

// Страница услуг и матрицы цен
Route::get('/services', function () {
  return Inertia::render('Services/Index');
})->name('services');

// Переключение локали/языка
Route::get('/lang/{locale}', function (string $locale) {
  if (in_array($locale, ['ru'])) {
    session(['locale' => $locale]);
    cookie()->queue(cookie()->forever('filament_language_switch_locale', $locale));
  }

  return back();
})->name('lang.switch');
