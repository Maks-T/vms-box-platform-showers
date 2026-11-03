@php
  /** @var \Nicole\Box\Core\Models\Order $order */
  use Valerie\Box\IndustryShowers\Support\PdfEstimateRenderer;
  use Valerie\Box\IndustryShowers\Support\PdfReport;

  $currencySymbol = $currencySymbol ?? PdfReport::currencySymbol($order->currency);
  $validUntil = PdfReport::validUntil($order->created_at);
  $validityDays = (int)config('valerie-showers.pdf.validity_days', 30);
@endphp

<div class="page">
  @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

  <div class="page-content">

    {{-- Условия (оплата, сроки, гарантия и т.п.). Клиент переопределяет только этот partial. --}}
    @include('valerie-showers::pdf.partials.terms')

    {{-- Карточка контактов компании --}}
    @include('valerie-showers::pdf.partials.company-card')

    <div class="closing-meta-light">
      <div class="closing-cell-left">
        <div class="closing-label-light">{{ __('Proposal Validity') }}</div>
        <div class="closing-value-light">{{ __('valid until :date · :days days', ['date' => $validUntil, 'days' => $validityDays]) }}</div>
      </div>

      <div class="closing-cell-right">
        <div class="closing-label-light">{{ __('Total order amount') }}</div>
        <div class="closing-value-light-price">
          {{ PdfEstimateRenderer::formatPrice($order->grand_total, $currencySymbol) }}
        </div>
      </div>
    </div>

  </div>

  @include('valerie-showers::pdf.partials.footer', ['theme' => 'light'])
</div>
