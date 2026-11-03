@php
  use Valerie\Box\IndustryShowers\Support\PdfReport;

  $isDark = isset($theme) && $theme === 'dark';
  $company = $company ?? PdfReport::company();
  $logoBase64 = PdfReport::logoDataUri();
  $companyNameUpper = mb_strtoupper($company['name']);
@endphp

<div class="pdf-header {{ $isDark ? 'pdf-header-dark' : '' }}">
  <div class="header-logo-container">
    @if ($company['website'])
      <a href="https://{{ $company['website'] }}" target="_blank">
    @endif
      @if ($logoBase64)
        <img src="{{ $logoBase64 }}" alt="{{ $company['name'] }}" class="header-logo-img">
      @else
        <span class="header-logo-text">{{ $companyNameUpper }}</span>
      @endif
    @if ($company['website'])
      </a>
    @endif
  </div>

  <div class="header-contacts">
    @if ($company['phone'])
      <div class="header-phone {{ $isDark ? 'header-phone-dark' : '' }}">
        <a href="tel:{{ $company['phone_clean'] }}">{{ $company['phone'] }}</a>
      </div>
    @endif
    <div class="header-emails {{ $isDark ? 'header-emails-dark' : '' }}">
      @if ($company['email'])
        <a href="mailto:{{ $company['email'] }}">{{ $company['email'] }}</a>
      @endif
      @if ($company['email'] && $company['website'])
        <span>·</span>
      @endif
      @if ($company['website'])
        <a href="https://{{ $company['website'] }}" target="_blank">{{ $company['website'] }}</a>
      @endif
    </div>
  </div>
</div>
