@php
  /** @var \Nicole\Box\Core\Models\Order $order */
  use Valerie\Box\IndustryShowers\Support\PdfEstimateRenderer;

  $currencySymbol = match($order->currency) {
      'RUB' => 'руб.',
      'USD' => '$',
      'BYN' => 'Br',
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
          <div class="section-summary-title-text">Детальный расчёт №{{ $sectionIndex + 1 }} · {{ $section->title }}</div>
        </div>

        @foreach($validCategories as $categoryNode)
          @include('valerie-showers::pdf.partials.estimate-table', ['categoryNode' => $categoryNode, 'section' => $section])
        @endforeach

        <div class="section-summary-title-bar">
          <div class="section-summary-title-text">Итого по расчёту №{{ $sectionIndex + 1 }}</div>
        </div>

        <div class="total-breakdown-card">
          <div class="breakdown-row">
            <span class="breakdown-label">Стоимость материалов и работ</span>
            <span class="breakdown-value">
              {{ PdfEstimateRenderer::formatPrice($section->price_grand_total, $currencySymbol) }}
            </span>
          </div>

          @if($section->price_discount > 0)
            <div class="breakdown-row">
              <span class="breakdown-label">Скидка</span>
              <span class="breakdown-value breakdown-value-discount">
                -{{ PdfEstimateRenderer::formatPrice($section->price_discount, $currencySymbol) }}
              </span>
            </div>
          @endif

          <div class="breakdown-row breakdown-row-grand">
            <span class="breakdown-label-grand">Итоговая сумма</span>
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
