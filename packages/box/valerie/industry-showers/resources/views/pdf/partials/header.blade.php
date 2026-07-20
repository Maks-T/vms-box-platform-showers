@php
  $isDark = isset($theme) && $theme === 'dark';

  $companyName = strtoupper(config('nicole.company.name', 'Vistegra'));
  $companyPhone = config('nicole.company.phone', '+375 (29) 189-83-22');
  $companyEmail = config('nicole.company.email', 'info@vistegra.by');
  $companyWebsite = config('nicole.company.website', 'vistegra.ru');

  // Динамически считываем SVG-логотип с диска (public/images/logo.svg) и кодируем в Base64 для надежного рендера
  $logoPath = public_path('pdf/logo.svg');
  $logoBase64 = '';
  if (file_exists($logoPath)) {
      $logoBase64 = 'data:image/svg+xml;base64,' . base64_encode(file_get_contents($logoPath));
  }
@endphp

<div class="pdf-header {{ $isDark ? 'pdf-header-dark' : '' }}">
  <!-- Контейнер логотипа со стилями из CSS -->
  <div class="header-logo-container">
    @if ($logoBase64)
      <!-- Полноценный векторный логотип, прочитанный с диска -->
      <img src="{{ $logoBase64 }}" alt="Logo" class="header-logo-img">
    @else
      <!-- Красивый текстовый фоллбек-заголовок, если SVG-файл еще не залит на диск -->
      <span class="header-logo-text">{{ $companyName }}</span>
    @endif
  </div>

  <!-- Контактная информация -->
  <div class="header-contacts">
    <div class="header-phone {{ $isDark ? 'header-phone-dark' : '' }}">
      {{ $companyPhone }}
    </div>
    <div class="header-emails {{ $isDark ? 'header-emails-dark' : '' }}">
      <span>{{ $companyEmail }}</span>
      <span>·</span>
      <span>{{ $companyWebsite }}</span>
    </div>
  </div>
</div>
