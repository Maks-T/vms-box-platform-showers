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
@endphp

@foreach ($order->sections as $sectionIndex => $section)
  @php
    $validCategories = [];
    foreach ($section->estimate ?? [] as $index => $categoryNode) {
      if ($index === 0) continue;
      if (!empty($categoryNode['children']) && count($categoryNode['children']) > 0) {
        $validCategories[] = $categoryNode;
      }
    }
  @endphp

  @if(!empty($validCategories))
    <div class="page">
      @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

      <div class="page-content">
        <div class="section-summary-title-bar">
          <div class="section-summary-title-text">{{ __('Detailed estimate') }} · {{ $section->title }}</div>
        </div>

        @foreach($validCategories as $categoryNode)
          @include('valerie-showers::pdf.partials.estimate-table', ['categoryNode' => $categoryNode, 'section' => $section])
        @endforeach

        <div class="section-summary-title-bar">
          <div class="section-summary-title-text">{{ __('Total cost') }}</div>
        </div>

        <div class="total-breakdown-card">
          <div class="breakdown-row breakdown-row-grand">
            <span class="breakdown-label-grand">{{ __('Grand Total') }}</span>
            <span class="breakdown-value-grand">
              {{ PdfEstimateRenderer::formatPrice($section->price_grand_total, $currencySymbol) }}
            </span>
          </div>
        </div>

      </div>

      @include('valerie-showers::pdf.partials.footer')
    </div>
  @endif
@endforeach