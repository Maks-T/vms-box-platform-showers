@php
  /** @var \Nicole\Box\Core\Models\Order $order */
  $currencySymbol = match($order->currency) {
      'RUB' => 'руб.',
      'USD' => '$',
      'BYN' => 'Br',
      default => $order->currency
  };

  $pageCounter = 1;

  view()->share('pageCounter', $pageCounter);
@endphp
  <!DOCTYPE html>
<html lang="{{ $order->locale ?? 'ru' }}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>{{ $title ?? 'Коммерческое предложение' }}</title>

  <style>
    @font-face {
      font-family: 'DM Sans';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/DMSans/DMSans-Regular.ttf'))) }}") format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'DM Sans';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/DMSans/DMSans-Medium.ttf'))) }}") format('truetype');
      font-weight: 500;
      font-style: normal;
    }

    @font-face {
      font-family: 'DM Sans';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/DMSans/DMSans-Bold.ttf'))) }}") format('truetype');
      font-weight: 700;
      font-style: normal;
    }

    @font-face {
      font-family: 'Inter';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/Inter/Inter_18pt-Regular.ttf'))) }}") format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'Inter';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/Inter/Inter_18pt-SemiBold.ttf'))) }}") format('truetype');
      font-weight: 600;
      font-style: normal;
    }

    @font-face {
      font-family: 'Inter';
      src: url("data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(base_path('packages/box/valerie/industry-showers/resources/fonts/Inter/Inter_24pt-Bold.ttf'))) }}") format('truetype');
      font-weight: 700;
      font-style: normal;
    }

    {!! file_get_contents(base_path('packages/box/valerie/industry-showers/resources/views/pdf/pdf-report.css')) !!}
  </style>
</head>
<body>

@include('valerie-showers::pdf.pages.cover')

@include('valerie-showers::pdf.pages.summary')

@include('valerie-showers::pdf.pages.estimate')

@include('valerie-showers::pdf.pages.materials')

@include('valerie-showers::pdf.pages.contacts')

</body>
</html>
