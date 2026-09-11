@php
  /** @var \Nicole\Box\Core\Models\Order $order */

  $currencySymbol = match($order->currency) {
      'RUB' => 'руб.',
      'USD' => '$',
      'BYN' => 'Br',
      'KZT' => '₸',
      default => $order->currency
  };

  // Поиск обложки по кандидатам с поддержкой разных папок
  $coverSetting = ltrim(config('nicole.company.cover_image', 'pdf/cover.jpg'), '/');
  $coverCandidates = [
      public_path($coverSetting),
      public_path('pdf/cover.jpg'),
      public_path('images/pdf/cover.jpg'),
      public_path('images/pdf/cover.png'),
  ];

  $coverBase64 = '';
  foreach ($coverCandidates as $path) {
      if (file_exists($path)) {
          $mime = str_ends_with($path, '.png') ? 'image/png' : 'image/jpeg';
          $coverBase64 = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($path));
          break;
      }
  }

  // Архитектурный векторный фоллбек в фирменном тиловом цвете #228B88
  if (empty($coverBase64)) {
      $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#f8fafc"/><path d="M200,100 L600,100 L600,500 L200,500 Z" fill="none" stroke="#228B88" stroke-width="2" stroke-opacity="0.35"/><circle cx="400" cy="300" r="100" fill="none" stroke="#228B88" stroke-width="1" stroke-opacity="0.25"/></svg>';
      $coverBase64 = 'data:image/svg+xml;base64,' . base64_encode($svg);
  }

  $customerFullName = $order->customer ? trim($order->customer->full_name) : '';
@endphp

<div class="page page-cover">
  <div class="cover-top-section">
    @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

    <div class="cover-img-container">
      <img src="{{ $coverBase64 }}" alt="Cover Image" class="cover-img-photo">
      <div class="cover-img-gradient"></div>
    </div>
  </div>

  <div class="cover-content-container">
    <div class="cover-title-container">
      <div class="cover-subtitle-showers">Коммерческое предложение</div>
      <h1 class="cover-title-showers">
        Душевые перегородки<br>и стеклянные конструкции
      </h1>
      <div class="cover-fade-divider"></div>
    </div>

    <div class="cover-meta-showers">
      <div class="cover-meta-row">
        <span class="cover-meta-label-showers">Номер КП:</span>
        <span class="cover-meta-value-showers">
          {{ $order->code }}
        </span>
      </div>

      <div class="cover-meta-row">
        <span class="cover-meta-label-showers">Дата формирования:</span>
        <span class="cover-meta-value-showers">
          {{ $order->created_at ? \Carbon\Carbon::parse($order->created_at)->format('d.m.Y') : date('d.m.Y') }}
        </span>
      </div>

      @if (!empty($customerFullName))
        <div class="cover-meta-row">
          <span class="cover-meta-label-showers">Заказчик:</span>
          <span class="cover-meta-value-showers">
            {{ $customerFullName }}
          </span>
        </div>
      @endif

      <div class="cover-meta-row">
        <span class="cover-meta-label-showers">Итого к оплате:</span>
        <span class="cover-meta-value-showers cover-meta-value-price">
          {{ number_format($order->grand_total, 0, '.', ' ') }} {{ $currencySymbol }}
        </span>
      </div>
    </div>
  </div>

  @include('valerie-showers::pdf.partials.footer', ['theme' => 'light'])
</div>