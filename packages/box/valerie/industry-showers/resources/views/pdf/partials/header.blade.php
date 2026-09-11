@php
  $isDark = isset($theme) && $theme === 'dark';

  $companyName = strtoupper(config('nicole.company.name', 'АМИ ГРУПП'));
  $companyPhone = config('nicole.company.phone', '8 (343) 288-26-04');
  $companyEmail = config('nicole.company.email', 'zakazamigrupp@gmail.com');
  $companyWebsite = config('nicole.company.website', 'amigrupp.ru');

  $cleanPhone = preg_replace('/[^\d+]/', '', $companyPhone);

  // Поддержка SVG и PNG логотипа
  $logoBase64 = '';
  $logoCandidates = [
      public_path('pdf/logo.svg'),
      public_path('pdf/logo.png'),
      public_path('images/pdf/logo.svg'),
      public_path('images/pdf/logo.png'),
  ];

  foreach ($logoCandidates as $path) {
      if (file_exists($path)) {
          $mime = str_ends_with($path, '.svg') ? 'image/svg+xml' : 'image/png';
          $logoBase64 = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($path));
          break;
      }
  }
@endphp

<div class="pdf-header {{ $isDark ? 'pdf-header-dark' : '' }}">
  <div class="header-logo-container">
    @if ($logoBase64)
      <a href="https://{{ $companyWebsite }}" target="_blank">
        <img src="{{ $logoBase64 }}" alt="{{ $companyName }}" class="header-logo-img">
      </a>
    @else
      <a href="https://{{ $companyWebsite }}" target="_blank">
        <span class="header-logo-text">{{ $companyName }}</span>
      </a>
    @endif
  </div>

  <div class="header-contacts">
    <div class="header-phone {{ $isDark ? 'header-phone-dark' : '' }}">
      <a href="tel:{{ $cleanPhone }}">{{ $companyPhone }}</a>
    </div>
    <div class="header-emails {{ $isDark ? 'header-emails-dark' : '' }}">
      <a href="mailto:{{ $companyEmail }}">{{ $companyEmail }}</a>
      <span>·</span>
      <a href="https://{{ $companyWebsite }}" target="_blank">{{ $companyWebsite }}</a>
    </div>
  </div>
</div>