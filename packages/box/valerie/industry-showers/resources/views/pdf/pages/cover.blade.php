<?php
/** @var \Nicole\Box\Core\Models\Order $order */

// Извлекаем и кодируем обложку из конфигурации для безопасного Dompdf
$coverPath = public_path(config('nicole.company.cover_image', 'pdf/cover.jpg'));
$coverBase64 = '';
if (file_exists($coverPath)) {
  $coverBase64 = 'data:image/jpeg;base64,' . base64_encode(file_get_contents($coverPath));
}
?>

<div class="page page-cover">
  <div class="cover-top-section">
    <!-- Шапка обложки в темном стиле (логотип и контакты Vistegra) -->
    @include('valerie-showers::pdf.partials.header', ['theme' => 'dark'])

    <!-- Превью-изображение (Камера) с плавным градиентным размытием к низу -->
    <div class="cover-img-container">
      @if ($coverBase64)
        <img src="{{ $coverBase64 }}" alt="Cover Image" class="cover-img-photo">
      @else
        <!-- Заглушка, если файл обложки не настроен в конфигурации -->
        <img src="https://placehold.co/800x600" alt="Placeholder Image" class="cover-img-photo">
      @endif

      <!-- Системная маска-градиент для перехода к темному фону (определена в CSS) -->
      <div class="cover-img-gradient"></div>
    </div>
  </div>

  <!-- Информационный блок коммерческого предложения -->
  <div class="cover-content-container">
    <div class="cover-title-container">
      <div class="cover-subtitle-showers">Коммерческое предложение</div>
      <h1 class="cover-title-showers">
        Система видеонаблюдения<br>и контроля доступа
      </h1>
    </div>

    <!-- Список мета-данных по заказу из БД -->
    <div class="cover-meta-showers">
      <!-- Добавленная строка: Номер КП (уникальный код заказа в БД Laravel) -->
      <div class="cover-meta-row">
        <span class="cover-meta-label-showers">Номер КП:</span>
        <span class="cover-meta-value-showers">
          {{ $order->code }}
        </span>
      </div>

      <div class="cover-meta-row">
        <span class="cover-meta-label-showers">дата формирования:</span>
        <span class="cover-meta-value-showers">
          {{ $order->created_at ? \Carbon\Carbon::parse($order->created_at)->format('d.m.Y') : date('d.m.Y') }}
        </span>
      </div>

      <div class="cover-meta-row">
        <span class="cover-meta-label-showers">расчётов в корзине:</span>
        <span class="cover-meta-value-showers">
          {{ $order->sections->count() }}
        </span>
      </div>

      <div class="cover-meta-row">
        <span class="cover-meta-label-showers">итого к оплате:</span>
        <span class="cover-meta-value-showers">
          {{ number_format($order->grand_total, 0, '.', ' ') }} {{ $currencySymbol }}
        </span>
      </div>
    </div>
  </div>

  <!-- Подвал обложки в темном стиле -->
  @include('valerie-showers::pdf.partials.footer', ['pageNum' => 1, 'theme' => 'dark'])
</div>
