{{--
  КП клиента «АМИ ГРУПП» (amigrupp.ru): срок производства, пояснение о расчёте и замере, следующий шаг.
  Переопределяет valerie-showers::pdf.partials.terms. Тексты: lang/{locale}.json приложения.
--}}
<div class="info-blocks-container">
  <div class="info-block-card">
    <div class="info-block-title">{{ __('Production time') }}</div>
    <div class="info-block-content">
      <p>{!! __('The production time is :period.', ['period' => '<strong>' . e(__('3 weeks')) . '</strong>']) !!}</p>
    </div>
  </div>

  <div class="info-block-card">
    <div class="info-block-title">{{ __('About the estimate and measurement') }}</div>
    <div class="info-block-content">
      <p>{{ __('The cost of the product is approximate. The price may change slightly depending on the availability of certain hardware.') }}</p>
      <p>{!! __('Contact us and we will take :free, select the optimal hardware and help with all technical questions. You will receive a fixed exact project price.', ['free' => '<strong>' . e(__('measurements free of charge')) . '</strong>']) !!}</p>
    </div>
  </div>

  <div class="info-block-card">
    <div class="info-block-title">{{ __('Next step') }}</div>
    <div class="info-block-content">
      <p><strong>{{ __('Tell our manager your estimate number') }}</strong>{{ __(', so that they can promptly start analysing the project.') }}</p>
    </div>
  </div>
</div>
