@php
  $isDark = isset($theme) && $theme === 'dark';

  $companyEmail = config('nicole.company.email', 'info@vistegra.by');
  $companyWebsite = config('nicole.company.website', 'vistegra.ru');
@endphp

<div class="pdf-footer {{ $isDark ? 'pdf-footer-dark' : '' }}">
  <!-- Левая часть: Сайт и Email компании -->
  <div class="footer-text {{ $isDark ? 'footer-text-dark' : '' }}">
    {{ $companyWebsite }} &nbsp;·&nbsp; {{ $companyEmail }}
  </div>

  <!-- Центральная часть: Название документа -->
  <div class="footer-text-center {{ $isDark ? 'footer-text-dark' : '' }}">
    Коммерческое предложение
  </div>

  <!-- Правая часть: Выводим ТОЛЬКО чистый номер страницы без общего количества (без слэша) -->
  <div class="footer-text-right {{ $isDark ? 'footer-text-dark' : '' }}">
    {{ $pageNum ?? 1 }}
  </div>
</div>
