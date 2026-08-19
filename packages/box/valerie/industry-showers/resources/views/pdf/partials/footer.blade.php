@php
  $isDark = isset($theme) && $theme === 'dark';

  $companyEmail = config('nicole.company.email', 'steklovdome.sales@gmail.com');
  $companyWebsite = config('nicole.company.website', 'proreshenia.by');
@endphp

<div class="pdf-footer {{ $isDark ? 'pdf-footer-dark' : '' }}">
  <div class="footer-text {{ $isDark ? 'footer-text-dark' : '' }}">
    <a href="https://{{ $companyWebsite }}" target="_blank">{{ $companyWebsite }}</a>
    &nbsp;·&nbsp;
    <a href="mailto:{{ $companyEmail }}">{{ $companyEmail }}</a>
  </div>

  <div class="footer-text-center {{ $isDark ? 'footer-text-dark' : '' }}">
    Коммерческое предложение
  </div>
</div>