@php
  /**
   * Стандартные условия КП индустрии (нейтральные, без привязки к клиенту).
   * Клиентские условия: resources/views/vendor/valerie-showers/pdf/partials/terms.blade.php
   *
   * @var \Nicole\Box\Core\Models\Order $order
   */
  $leadTimeDays = config('valerie-showers.pdf.lead_time_days');
@endphp

<div class="info-blocks-container">
  <div class="info-block-card">
    <div class="info-block-title">{{ __('About the estimate') }}</div>
    <div class="info-block-content">
      <p>{{ __('The cost is preliminary and may change slightly depending on the availability of hardware.') }}</p>
      <p>{{ __('The exact fixed price is set after a measurement by our specialist.') }}</p>
    </div>
  </div>

  @if ($leadTimeDays)
    <div class="info-block-card">
      <div class="info-block-title">{{ __('Production time') }}</div>
      <div class="info-block-content">
        <p>{!! __('The lead time is :days business days.', ['days' => '<strong>' . (int)$leadTimeDays . '</strong>']) !!}</p>
      </div>
    </div>
  @endif

  <div class="info-block-card">
    <div class="info-block-title">{{ __('Next step') }}</div>
    <div class="info-block-content">
      <p>{!! __('Tell our manager the proposal number :code so that we can start working on your project.', ['code' => '<strong>' . e($order->code) . '</strong>']) !!}</p>
    </div>
  </div>
</div>
