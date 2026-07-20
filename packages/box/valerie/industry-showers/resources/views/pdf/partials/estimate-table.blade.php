@php
  /** @var \Nicole\Box\Core\Models\OrderSection $section */
  /** @var array $categoryNode */

  use Valerie\Box\IndustryShowers\Support\PdfEstimateRenderer;

  $categoryName = $categoryNode['value'][0] ?? 'Оборудование';
  $categoryQty = count($categoryNode['children'] ?? []);
@endphp

  <!-- Группировочный заголовок категории (например, видеокамеры · 6 шт.) -->
<div class="category-header-bar">
  <div class="category-header-text">
    {{ mb_strtolower($categoryName) }} · {{ $categoryQty }} шт.
  </div>
</div>

<!-- Таблица сметного расчета -->
<table class="estimate-table">
  <thead>
  <tr class="estimate-table-th">
    <th class="estimate-th-cell">НАИМЕНОВАНИЕ</th>
    <th class="estimate-th-cell-right">КОЛ-ВО</th>
    <th class="estimate-th-cell-right">ЦЕНА</th>
    <th class="estimate-th-cell-right">СУММА</th>
  </tr>
  </thead>
  <tbody>
  @foreach($categoryNode['children'] ?? [] as $itemNode)
    @php
      $cells = $itemNode['value'] ?? [];
      if (count($cells) < 5) continue;

      $itemName = $cells[0];
      $itemQty = $cells[1];
      $itemUnit = $cells[2];
      $itemPrice = $cells[3];
      $itemSum = $cells[4];

      // Автоматически извлекаем Base64-изображение и динамические EAV-характеристики из СУБД
      $resolvedPhoto = PdfEstimateRenderer::resolveProductPhoto($itemName, $section);
      $resolvedDesc = PdfEstimateRenderer::resolveProductDesc($itemName, $section);
    @endphp

    <tr class="estimate-row">
      <td class="estimate-cell-product">
        @if($resolvedPhoto)
          <img class="product-preview-img" src="{{ $resolvedPhoto }}" alt="Preview">
        @endif
        <div class="product-info-block">
          <div class="product-name">{{ $itemName }}</div>
          <div class="product-description">{!! $resolvedDesc !!}</div>
        </div>
      </td>
      <td class="estimate-cell-qty">{{ $itemQty }} {{ $itemUnit === 'link-id:pcs' ? 'шт.' : ($itemUnit === 'link-id:m' ? 'м.' : $itemUnit) }}</td>
      <td class="estimate-cell-price">{{ $itemPrice }}</td>
      <td class="estimate-cell-total">{{ $itemSum }}</td>
    </tr>
  @endforeach
  </tbody>
</table>
