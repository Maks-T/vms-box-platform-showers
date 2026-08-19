@php
  $isDark = isset($theme) && $theme === 'dark';

  $companyName = strtoupper(config('nicole.company.name', 'Прозрачные решения'));
  $companyPhone = config('nicole.company.phone', '+375 29 555-61-01');
  $companyEmail = config('nicole.company.email', 'steklovdome.sales@gmail.com');
  $companyWebsite = config('nicole.company.website', 'proreshenia.by');

  $cleanPhone = preg_replace('/[^\d+]/', '', $companyPhone);

  $logoPath = public_path('pdf/logo.svg');
  $logoBase64 = '';
  if (file_exists($logoPath)) {
      $logoBase64 = 'data:image/svg+xml;base64,' . base64_encode(file_get_contents($logoPath));
  }
@endphp

<div class="pdf-header {{ $isDark ? 'pdf-header-dark' : '' }}">
  <div class="header-logo-container">
    @if ($logoBase64)
      <a href="https://{{ $companyWebsite }}" target="_blank">
        <img src="{{ $logoBase64 }}" alt="Logo" class="header-logo-img">
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