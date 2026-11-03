@php
  /** @var \Nicole\Box\Core\Models\Order $order */
  use Valerie\Box\IndustryShowers\Support\PdfReport;

  $currencySymbol = $currencySymbol ?? PdfReport::currencySymbol($order->currency);
  $customerFullName = $customerFullName ?? ($order->customer ? trim((string)$order->customer->full_name) : '');
  $coverBase64 = PdfReport::coverDataUri();
@endphp

<div class="page page-cover">
  <div class="cover-top-section">
    @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

    <div class="cover-img-container">
      <img src="{{ $coverBase64 }}" alt="{{ __('Commercial Proposal') }}" class="cover-img-photo">
      <div class="cover-img-gradient"></div>
    </div>
  </div>

  <div class="cover-content-container">
    <div class="cover-title-container">
      <div class="cover-subtitle-showers">{{ __('Commercial Proposal') }}</div>
      <h1 class="cover-title-showers">
        {!! nl2br(e(__('Shower enclosures and glass structures'))) !!}
      </h1>
      <div class="cover-fade-divider"></div>
    </div>

    <div class="cover-meta-showers">
      <div class="cover-meta-row">
        <span class="cover-meta-label-showers">{{ __('Proposal No:') }}</span>
        <span class="cover-meta-value-showers">
          {{ $order->code }}
        </span>
      </div>

      <div class="cover-meta-row">
        <span class="cover-meta-label-showers">{{ __('Date of creation:') }}</span>
        <span class="cover-meta-value-showers">
          {{ $order->created_at ? \Carbon\Carbon::parse($order->created_at)->format('d.m.Y') : date('d.m.Y') }}
        </span>
      </div>

      @if (!empty($customerFullName))
        <div class="cover-meta-row">
          <span class="cover-meta-label-showers">{{ __('Customer:') }}</span>
          <span class="cover-meta-value-showers">
            {{ $customerFullName }}
          </span>
        </div>
      @endif

      <div class="cover-meta-row">
        <span class="cover-meta-label-showers">{{ __('Grand Total:') }}</span>
        <span class="cover-meta-value-showers cover-meta-value-price">
          {{ number_format((float)$order->grand_total, 0, '.', ' ') }} {{ $currencySymbol }}
        </span>
      </div>
    </div>
  </div>

  @include('valerie-showers::pdf.partials.footer', ['theme' => 'light'])
</div>
