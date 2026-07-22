@php
  /** @var \Nicole\Box\Core\Models\OrderSection $section */
  /** @var array $categoryNode */

  use Valerie\Box\IndustryShowers\Support\PdfEstimateRenderer;

  $children = $categoryNode['children'] ?? [];
  if (empty($children) || count($children) === 0) {
    return;
  }

  $categoryName = $categoryNode['value'][0] ?? 'Материалы и комплектующие';
  $categoryQty = count($children);
@endphp

<div class="category-header-bar">
  <div class="category-header-text">
    {{ mb_strtolower($categoryName) }} · {{ $categoryQty }} шт.
  </div>
</div>

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
  @foreach($children as $itemNode)
    @php
      $cells = $itemNode['value'] ?? [];
      if (count($cells) < 5) continue;

      $itemName = $cells[0];
      $itemQty = $cells[1];
      $itemUnit = $cells[2];
      $itemPrice = $cells[3];
      $itemSum = $cells[4];

      $resolvedPhoto = PdfEstimateRenderer::resolveProductPhoto($itemName, $section);
    @endphp

    <tr class="estimate-row">
      <td class="estimate-cell-product">
        @if($resolvedPhoto)
          <img class="product-preview-img" src="{{ $resolvedPhoto }}" alt="Preview">
        @endif
        <div class="product-info-block">
          <div class="product-name">{{ $itemName }}</div>
        </div>
      </td>
      <td class="estimate-cell-qty">{{ $itemQty }} {{ $itemUnit === 'link-id:pcs' ? 'шт.' : ($itemUnit === 'link-id:m' ? 'м.' : $itemUnit) }}</td>
      <td class="estimate-cell-price">{{ $itemPrice }}</td>
      <td class="estimate-cell-total">{{ $itemSum }}</td>
    </tr>
  @endforeach
  </tbody>
</table>
