{{--
  КП клиента «Прозрачные решения» (proreshenia.by): условия оплаты, сроки, гарантия.
  Переопределяет valerie-showers::pdf.partials.terms. Тексты: lang/{locale}.json приложения.
--}}
<div class="info-blocks-container">
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

  <div class="info-block-card">
    <div class="info-block-title">{{ __('Production time') }}</div>
    <div class="info-block-content">
      <p>{!! __('The lead time is :days business days.', ['days' => '<strong>15</strong>']) !!}</p>
    </div>
  </div>

  <div class="info-block-card">
    <div class="info-block-title">{{ __('Warranty') }}</div>
    <div class="info-block-content">
      <p>{{ __('Glass warranty is 36 months, warranty for works performed is 12 months.') }}</p>
    </div>
  </div>
</div>
