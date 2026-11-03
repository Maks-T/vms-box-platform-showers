@php
  /**
   * Стандартное КП индустрии `Душевые перегородки`.
   *
   * Клиентская вёрстка не правится здесь: приложение переопределяет нужные файлы в
   * resources/views/vendor/valerie-showers/pdf/** (см. README пакета).
   *
   * @var \Nicole\Box\Core\Models\Order $order
   */
  use Valerie\Box\IndustryShowers\Support\PdfReport;

  $reportLocale = PdfReport::applyOrderLocale($order->locale ?? null);
  $currencySymbol = PdfReport::currencySymbol($order->currency, $reportLocale);
  $company = PdfReport::company();
  $customerFullName = $order->customer ? trim((string)$order->customer->full_name) : '';
  $pageCounter = 1;

  view()->share(compact('currencySymbol', 'company', 'customerFullName', 'pageCounter', 'reportLocale'));
@endphp
<!DOCTYPE html>
<html lang="{{ $reportLocale }}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  {{-- $title из ядра всегда на русском, поэтому собираем свой --}}
  <title>{{ __('Commercial Proposal') }} № {{ $order->code }}</title>

  <style>
    {!! PdfReport::fontFacesCss() !!}
    {!! PdfReport::stylesCss() !!}
  </style>

  @includeIf('valerie-showers::pdf.partials.head-extra')
</head>
<body>

@foreach (PdfReport::pages() as $pdfPage)
  @include('valerie-showers::pdf.pages.' . $pdfPage)
@endforeach

</body>
</html>
