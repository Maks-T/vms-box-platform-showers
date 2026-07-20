@php
  /** @var \Nicole\Box\Core\Models\Order $order */
  $currencySymbol = match($order->currency) {
      'RUB' => 'руб.',
      'USD' => '$',
      'BYN' => 'Br',
      default => $order->currency
  };

  // МАТЕМАТИЧЕСКИЙ РАСЧЕТ ОБЩЕГО КОЛИЧЕСТВА СТРАНИЦ
  // Обложка (1) + Сводная страница (2) + по 2 страницы на каждый расчет
  $totalPages = 2 + (2 * $order->sections->count());

  // Инициализация сквозного счетчика страниц
  $pageCounter = 1;

  // Делимся переменными со всеми вложенными шаблонами @include
  view()->share('totalPages', $totalPages);
  view()->share('pageCounter', $pageCounter);
@endphp
  <!DOCTYPE html>
<html lang="{{ $order->locale ?? 'ru' }}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>{{ $title ?? 'Коммерческое предложение' }}</title>

  <style>
    /* DM SANS: Regular */
    @font-face {
      font-family: 'DM Sans';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/DMSans/DMSans-Regular.ttf'))) }}") format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    /* DM SANS: Medium */
    @font-face {
      font-family: 'DM Sans';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/DMSans/DMSans-Medium.ttf'))) }}") format('truetype');
      font-weight: 500;
      font-style: normal;
    }

    /* DM SANS: Bold */
    @font-face {
      font-family: 'DM Sans';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/DMSans/DMSans-Bold.ttf'))) }}") format('truetype');
      font-weight: 700;
      font-style: normal;
    }

    /* INTER: Regular */
    @font-face {
      font-family: 'Inter';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/Inter/Inter_18pt-Regular.ttf'))) }}") format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    /* INTER: SemiBold */
    @font-face {
      font-family: 'Inter';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/Inter/Inter_18pt-SemiBold.ttf'))) }}") format('truetype');
      font-weight: 600;
      font-style: normal;
    }

    /* INTER: Bold */
    @font-face {
      font-family: 'Inter';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/Inter/Inter_24pt-Bold.ttf'))) }}") format('truetype');
      font-weight: 700;
      font-style: normal;
    }

    /* Подгружаем основные стили */
    {!! file_get_contents(base_path('packages/box/valerie/industry-showers/resources/views/pdf/pdf-report.css')) !!}
  </style>
</head>
<body>

<!-- Страница 1: титульный лист (обложка) -->
@include('valerie-showers::pdf.pages.cover')

<!-- Страница 2: общий состав проекта -->
@include('valerie-showers::pdf.pages.summary')

<!-- Страницы 3+: детальная смета расчетов и итоги -->
@include('valerie-showers::pdf.pages.estimate')

</body>
</html>
