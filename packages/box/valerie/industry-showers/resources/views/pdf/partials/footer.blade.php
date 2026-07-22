@php
  $isDark = isset($theme) && $theme === 'dark';

  $companyEmail = config('nicole.company.email', 'info@vistegra.by');
  $companyWebsite = config('nicole.company.website', 'vistegra.ru');
@endphp

<div class="pdf-footer {{ $isDark ? 'pdf-footer-dark' : '' }}">
  <div class="footer-text {{ $isDark ? 'footer-text-dark' : '' }}">
    {{ $companyWebsite }} &nbsp;·&nbsp; {{ $companyEmail }}
  </div>

  <div class="footer-text-center {{ $isDark ? 'footer-text-dark' : '' }}">
    Коммерческое предложение
  </div>
</div>
