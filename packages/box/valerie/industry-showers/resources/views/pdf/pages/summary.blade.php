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
  @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

  <div class="page-content">

    <div class="page-title-container">
      <h1 class="page-title">Коммерческое предложение</h1>
      <div class="page-subtitle">
        от {{ $order->created_at ? $order->created_at->format('d.m.Y H:i') : date('d.m.Y H:i') }} &nbsp;·&nbsp;
        {{ $sectionsWord }} в корзине &nbsp;·&nbsp;
        {{ $customerName }}
      </div>
    </div>

    <table class="estimate-table">
      <thead>
      <tr class="estimate-table-th">
        <th class="estimate-th-cell">Расчёт</th>
        <th class="estimate-th-cell-right">Позиций</th>
        <th class="estimate-th-cell-right">Без скидки</th>
        <th class="estimate-th-cell-right">Скидка</th>
        <th class="estimate-th-cell-right">Итого</th>
      </tr>
      </thead>
      <tbody>
      @php
        $totalPositions = 0;
        $totalBasePrice = 0;
        $totalDiscount = 0;
      @endphp

      @foreach ($order->sections as $index => $section)
        @php
          $positionsCount = PdfEstimateRenderer::countTotalPositions($section);
          $totalPositions += $positionsCount;

          $totalBasePrice += $section->price_total;
          $totalDiscount += $section->price_discount;
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
          <td class="estimate-cell-total">
            {{ PdfEstimateRenderer::formatPrice($section->price_grand_total, $currencySymbol) }}
          </td>
        </tr>
      @endforeach

      <tr class="estimate-row-total">
        <td class="estimate-cell-total-bold">Итого по заказу</td>
        <td class="estimate-cell-total-medium">{{ $totalPositions }}</td>
        <td class="estimate-cell-total-right-blue">
          {{ PdfEstimateRenderer::formatPrice($totalBasePrice, $currencySymbol) }}
        </td>
        <td class="estimate-cell-total-right-red">
          {{ $totalDiscount > 0 ? '-' . PdfEstimateRenderer::formatPrice($totalDiscount, $currencySymbol) : '—' }}
        </td>
        <td class="estimate-cell-total-right-bold">
          {{ PdfEstimateRenderer::formatPrice($order->grand_total, $currencySymbol) }}
        </td>
      </tr>
      </tbody>
    </table>

    @foreach ($order->sections as $index => $section)
      @php
        $drawImg = null;
        $mediaItem = $section->getFirstMedia('drawing');

        if ($mediaItem && file_exists($mediaItem->getPath())) {
          $mime = mime_content_type($mediaItem->getPath());
          $drawImg = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($mediaItem->getPath()));
        } else {
          $meta = is_array($section->meta) ? $section->meta : json_decode((string)($section->meta ?? '{}'), true);
          $drawImg = $meta['draw'][0] ?? ($meta['properties']['draw'][0] ?? null);
        }
      @endphp

      <div class="section-card">
        <div class="section-card-header">
          <div class="section-header-title">
            0{{ $index + 1 }} · {{ $section->title }}
          </div>
          <div class="section-header-price">
            {{ PdfEstimateRenderer::formatPrice($section->price_grand_total, $currencySymbol) }}
          </div>
        </div>

        <div class="section-card-body">
          @if ($drawImg)
            <div class="section-body-left">
              <img src="{{ $drawImg }}" alt="{{ $section->title }}" class="section-fallback-img">
            </div>
          @endif

          <div class="section-body-right" style="width: {{ $drawImg ? '48%' : '100%' }} !important;">
            @if (!empty($section->description))
              <table class="specs-table">
                @foreach ($section->description as $spec)
                  @if (!empty($spec['name']) && !empty($spec['description']))
                    <tr>
                      <td class="spec-label">{{ $spec['name'] }}</td>
                      <td class="spec-value">{{ $spec['description'] }}</td>
                    </tr>
                  @endif
                @endforeach
              </table>
            @else
              <div class="specs-missing">Характеристики не указаны</div>
            @endif
          </div>
        </div>
      </div>
    @endforeach

  </div>

  @include('valerie-showers::pdf.partials.footer', ['theme' => 'light'])
</div>
