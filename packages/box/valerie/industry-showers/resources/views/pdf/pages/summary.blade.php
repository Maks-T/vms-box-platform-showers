@php
  /** @var \Nicole\Box\Core\Models\Order $order */
  use Valerie\Box\IndustryShowers\Support\PdfEstimateRenderer;

  $currencySymbol = match($order->currency) {
      'RUB' => 'руб.',
      'USD' => '$',
      'BYN' => 'Br',
      default => $order->currency
  };

  $sectionsCount = $order->sections->count();
  $sectionsWord = match (true) {
      $sectionsCount === 1 => '1 расчёт',
      $sectionsCount > 1 && $sectionsCount < 5 => "{$sectionsCount} расчёта",
      default => "{$sectionsCount} расчётов"
  };

  $customerName = $order->customer ? trim(($order->customer->last_name ?? '') . ' ' . ($order->customer->first_name ?? '')) : 'Физическое лицо';
  if ($order->customer && $order->customer->middle_name) {
      $customerName .= ' ' . $order->customer->middle_name;
  }
@endphp

<div class="page">
  <!-- Шапка в светлом стиле -->
  @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

  <div class="page-content">

    <!-- 1. Заголовок страницы -->
    <div class="page-title-container">
      <h1 class="page-title">Коммерческое предложение</h1>
      <div class="page-subtitle">
        от {{ $order->created_at ? $order->created_at->format('d.m.Y H:i') : date('d.m.Y H:i') }} &nbsp;·&nbsp;
        {{ $sectionsWord }} в корзине &nbsp;·&nbsp;
        {{ $customerName }}
      </div>
    </div>

    <!-- 2. Сводная таблица по всем расчетам -->
    <table class="estimate-table">
      <thead>
      <tr class="estimate-table-th">
        <th class="estimate-th-cell">Расчёт</th>
        <th class="estimate-th-cell-right">Позиций</th>
        <th class="estimate-th-cell-right">Без скидки</th>
        <th class="estimate-th-cell-right">Скидка</th>
        <th class="estimate-th-cell-right">Тех. надзор</th>
        <th class="estimate-th-cell-right">Итого</th>
      </tr>
      </thead>
      <tbody>
      @php
        $totalPositions = 0;
        $totalBasePrice = 0;
        $totalDiscount = 0;
        $totalTechPrice = 0;
      @endphp

      @foreach ($order->sections as $index => $section)
        @php
          $positionsCount = PdfEstimateRenderer::countTotalPositions($section);
          $totalPositions += $positionsCount;

          $techPrice = PdfEstimateRenderer::resolveTechSupervisionPrice($section->estimate ?? []);

          $totalBasePrice += $section->price_total;
          $totalDiscount += $section->price_discount;
          $totalTechPrice += $techPrice;
        @endphp

        <tr class="estimate-row">
          <td class="estimate-cell-bold">
            Расчёт №{{ $index + 1 }} · {{ $section->title }}
          </td>
          <td class="estimate-cell-qty estimate-cell-qty-left">
            {{ $positionsCount }}
          </td>
          <td class="estimate-cell-price">
            {{ PdfEstimateRenderer::formatPrice($section->price_total, $currencySymbol) }}
          </td>
          <td class="estimate-cell-price estimate-cell-red">
            {{ $section->price_discount > 0 ? '-' . PdfEstimateRenderer::formatPrice($section->price_discount, $currencySymbol) : '—' }}
          </td>
          <td class="estimate-cell-price">
            {{ $techPrice > 0 ? PdfEstimateRenderer::formatPrice($techPrice, $currencySymbol) : '—' }}
          </td>
          <td class="estimate-cell-total">
            {{ PdfEstimateRenderer::formatPrice($section->price_grand_total, $currencySymbol) }}
          </td>
        </tr>
      @endforeach

      <!-- Строка общих итогов сметы -->
      <tr class="estimate-row-total">
        <td class="estimate-cell-total-bold">Итого по заказу</td>
        <td class="estimate-cell-total-medium">{{ $totalPositions }}</td>
        <td class="estimate-cell-total-right-blue">
          {{ PdfEstimateRenderer::formatPrice($totalBasePrice, $currencySymbol) }}
        </td>
        <td class="estimate-cell-total-right-red">
          {{ $totalDiscount > 0 ? '-' . PdfEstimateRenderer::formatPrice($totalDiscount, $currencySymbol) : '—' }}
        </td>
        <td class="estimate-cell-total-right-blue">
          {{ $totalTechPrice > 0 ? PdfEstimateRenderer::formatPrice($totalTechPrice, $currencySymbol) : '—' }}
        </td>
        <td class="estimate-cell-total-right-bold">
          {{ PdfEstimateRenderer::formatPrice($order->grand_total, $currencySymbol) }}
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 3. Спецификация первого расчета (Только Камеры) -->
    @if($order->sections->isNotEmpty())
      @php
        $firstSection = $order->sections->first();
      @endphp

      <div class="section-summary-title-bar">
        <div class="section-summary-title-text">Расчёт №1 · {{ $firstSection->title }}</div>
        <div class="section-summary-price">
          {{ PdfEstimateRenderer::formatPrice($firstSection->price_grand_total, $currencySymbol) }}
        </div>
      </div>

      @foreach($firstSection->estimate ?? [] as $index => $categoryNode)
        <!-- На второй странице выводятся только Камеры первого расчета -->
        @continue($index !== 1)

        <!-- Внедряем наш переиспользуемый компонент таблицы сметы -->
        @include('valerie-showers::pdf.partials.estimate-table', ['categoryNode' => $categoryNode, 'section' => $firstSection])
      @endforeach
    @endif

  </div>

  @include('valerie-showers::pdf.partials.footer', ['pageNum' => $pageCounter++])
</div>
