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
    $techPrice = PdfEstimateRenderer::resolveTechSupervisionPrice($section->estimate ?? []);
  @endphp

  @if($sectionIndex === 0)
    <!-- ==========================================================================
         СТРАНИЦА РАСЧЕТА №1: ЧАСТЬ 1 - ОБОРУДОВАНИЕ (9 позиций)
         ========================================================================== -->
    <div class="page">
      @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

      <div class="page-content">
        <!-- Рендерим Оборудование (индекс 2) через общий партиал -->
        @foreach($section->estimate ?? [] as $index => $categoryNode)
          @continue($index !== 2)
          @include('valerie-showers::pdf.partials.estimate-table', ['categoryNode' => $categoryNode, 'section' => $section])
        @endforeach
      </div>

      @include('valerie-showers::pdf.partials.footer', ['pageNum' => $pageCounter++])
    </div>

    <!-- ==========================================================================
         СТРАНИЦА РАСЧЕТА №1: ЧАСТЬ 2 - МОНТАЖНЫЕ РАБОТЫ И КАРТОЧКА ИТОГОВ
         ========================================================================== -->
    <div class="page">
      @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

      <div class="page-content">
        <!-- Рендерим Монтажные работы (индекс 3) через общий партиал -->
        @foreach($section->estimate ?? [] as $index => $categoryNode)
          @continue($index !== 3)
          @include('valerie-showers::pdf.partials.estimate-table', ['categoryNode' => $categoryNode, 'section' => $section])
        @endforeach

        <!-- Финальная карточка итогов по расчету -->
        <div class="section-summary-title-bar">
          <div class="section-summary-title-text">Итого по расчёту №1</div>
        </div>

        <div class="total-breakdown-card">
          <div class="breakdown-row">
            <span class="breakdown-label">Стоимость оборудования и работ</span>
            <span class="breakdown-value">
              {{ PdfEstimateRenderer::formatPrice($section->price_grand_total - $techPrice, $currencySymbol) }}
            </span>
          </div>

          @if($techPrice > 0)
            <div class="breakdown-row">
              <span class="breakdown-label">Технический надзор</span>
              <span class="breakdown-value">
                {{ PdfEstimateRenderer::formatPrice($techPrice, $currencySymbol) }}
              </span>
            </div>
          @endif

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

      @include('valerie-showers::pdf.partials.footer', ['pageNum' => $pageCounter++])
    </div>

  @else
    <!-- ==========================================================================
         СТРАНИЦЫ ДЛЯ ВСЕХ ПОСЛЕДУЮЩИХ РАСЧЕТОВ (X > 1)
         ========================================================================== -->

    <!-- СТРАНИЦА А: КАМЕРЫ + ОБОРУДОВАНИЕ (Умещаются вместе) -->
    <div class="page">
      @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

      <div class="page-content">
        <div class="section-summary-title-bar">
          <div class="section-summary-title-text">Расчёт №{{ $sectionIndex + 1 }} · {{ $section->title }}</div>
        </div>

        <!-- Рендерим Камеры (индекс 1) и Оборудование (индекс 2) через общий партиал -->
        @foreach($section->estimate ?? [] as $index => $categoryNode)
          @continue($index !== 1 && $index !== 2)
          @include('valerie-showers::pdf.partials.estimate-table', ['categoryNode' => $categoryNode, 'section' => $section])
        @endforeach
      </div>

      @include('valerie-showers::pdf.partials.footer', ['pageNum' => ($sectionIndex * 2) + 1, 'theme' => 'light'])
    </div>

    <!-- СТРАНИЦА Б: МОНТАЖНЫЕ РАБОТЫ + КАРТОЧКА ИТОГОВ РАСЧЕТА -->
    <div class="page">
      @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

      <div class="page-content">
        <!-- Рендерим Монтажные работы (индекс 3) через общий партиал -->
        @foreach($section->estimate ?? [] as $index => $categoryNode)
          @continue($index !== 3)
          @include('valerie-showers::pdf.partials.estimate-table', ['categoryNode' => $categoryNode, 'section' => $section])
        @endforeach

        <!-- Финальная карточка итогов по расчету -->
        <div class="section-summary-title-bar">
          <div class="section-summary-title-text">Итого по расчёту №{{ $sectionIndex + 1 }}</div>
        </div>

        <div class="total-breakdown-card">
          <div class="breakdown-row">
            <span class="breakdown-label">Стоимость оборудования и работ</span>
            <span class="breakdown-value">
              {{ PdfEstimateRenderer::formatPrice($section->price_grand_total - $techPrice, $currencySymbol) }}
            </span>
          </div>

          @if($techPrice > 0)
            <div class="breakdown-row">
              <span class="breakdown-label">Технический надзор</span>
              <span class="breakdown-value">
                {{ PdfEstimateRenderer::formatPrice($techPrice, $currencySymbol) }}
              </span>
            </div>
          @endif

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

      @include('valerie-showers::pdf.partials.footer', ['pageNum' => ($sectionIndex * 2) + 2, 'theme' => 'light'])
    </div>
  @endif
@endforeach
