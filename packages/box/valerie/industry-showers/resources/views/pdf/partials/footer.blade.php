@php
  use Valerie\Box\IndustryShowers\Support\PdfReport;

  $isDark = isset($theme) && $theme === 'dark';
  $company = $company ?? PdfReport::company();
@endphp

<div class="pdf-footer {{ $isDark ? 'pdf-footer-dark' : '' }}">
  <div class="footer-text {{ $isDark ? 'footer-text-dark' : '' }}">
    @if ($company['website'])
      <a href="https://{{ $company['website'] }}" target="_blank">{{ $company['website'] }}</a>
    @endif
    @if ($company['website'] && $company['email'])
      &nbsp;·&nbsp;
    @endif
    @if ($company['email'])
      <a href="mailto:{{ $company['email'] }}">{{ $company['email'] }}</a>
    @endif
  </div>

  <div class="footer-text-center {{ $isDark ? 'footer-text-dark' : '' }}">
    {{ __('Commercial Proposal') }}
  </div>
</div>
