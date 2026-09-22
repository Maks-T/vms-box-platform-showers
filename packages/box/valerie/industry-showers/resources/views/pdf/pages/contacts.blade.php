@php
  /** @var \Nicole\Box\Core\Models\Order $order */
  use Valerie\Box\IndustryShowers\Support\PdfEstimateRenderer;

  $currencySymbol = $currencySymbol ?? match($order->currency) {
      'RUB' => app()->getLocale() === 'en' ? 'RUB' : 'руб.',
      'USD' => '$',
      'EUR' => '€',
      'BYN' => app()->getLocale() === 'en' ? 'BYN' : 'Br',
      default => $order->currency
  };

  $validUntil = PdfEstimateRenderer::getValidUntil($order->created_at);

  $companyName = config('nicole.company.name', 'Прозрачные решения');
  $companyPhone = config('nicole.company.phone', '+375 29 555-61-01');
  $companyEmail = config('nicole.company.email', 'steklovdome.sales@gmail.com');
  $cleanPhone = preg_replace('/[^\d+]/', '', $companyPhone);
@endphp

<div class="page">
  @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

  <div class="page-content">

    <div class="info-blocks-container">
      {{-- Блок 1: Условия оплаты --}}
      <div class="info-block-card">
          <div class="info-block-title">{{ __('Payment Terms') }}</div>
        <div class="info-block-content">
            <p><strong>{{ __('Payment options:') }}</strong></p>
          <ul>
              <li>{{ __('Cash payment — 50% advance payment.') }}</li>
              <li>{{ __('ERIP — 50% advance payment.') }}</li>
            <li>
                <strong>{{ __('Installment plan from Alfa-Bank:') }}</strong>
                <br>{{ __('1% from 2 to 5 months (registration during measurement).') }}
            </li>
            <li>
                <strong>{{ __('Credit from Alfa-Bank:') }}</strong>
                <br>{{ __('18.2% up to 48 months (registration during measurement).') }}
            </li>
          </ul>
        </div>
      </div>

      {{-- Блок 2: Сроки производства --}}
      <div class="info-block-card">
          <div class="info-block-title">{{ __('Production time') }}</div>
        <div class="info-block-content">
            <p>{{ __('The lead time is 15 business days.') }}</p>
        </div>
      </div>

      {{-- Блок 3: Гарантийные обязательства --}}
      <div class="info-block-card">
          <div class="info-block-title">{{ __('Warranty') }}</div>
        <div class="info-block-content">
            <p>{{ __('Glass warranty is 36 months, warranty for works performed is 12 months.') }}</p>
        </div>
      </div>
    </div>

    {{-- Карточка контактов компании / менеджера --}}
    <div class="manager-card-light">
      <div class="manager-info">
          <div class="manager-post-light">{{ __('Company Contacts') }}</div>
        <div class="manager-name-light">{{ $companyName }}</div>

        <ul class="manager-contacts-list-light">
          <li>
                <span>{{ __('Phone:') }}</span>
            <a href="tel:{{ $cleanPhone }}">{{ $companyPhone }}</a>
          </li>
          <li>
                <span>{{ __('Email:') }}</span>
            <a href="mailto:{{ $companyEmail }}">{{ $companyEmail }}</a>
          </li>
          <li>
                <span>{{ __('Support:') }}</span>
            Telegram · WhatsApp · Viber
          </li>
          <li>
                <span>{{ __('Working Hours:') }}</span>
                {{ __('Mon–Fri 10:00–20:00') }}
          </li>
        </ul>
      </div>
    </div>

    <div class="closing-meta-light">
      <div class="closing-cell-left">
          <div class="closing-label-light">{{ __('Proposal Validity') }}</div>
          <div class="closing-value-light">{{ __('valid until :date · 30 days', ['date' => $validUntil]) }}</div>
      </div>

      <div class="closing-cell-right">
          <div class="closing-label-light">{{ __('Total order amount') }}</div>
        <div class="closing-value-light-price">
          {{ PdfEstimateRenderer::formatPrice($order->grand_total, $currencySymbol) }}
        </div>
      </div>
    </div>

  </div>

  @include('valerie-showers::pdf.partials.footer')
</div>