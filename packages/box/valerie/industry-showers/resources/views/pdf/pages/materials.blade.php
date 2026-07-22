@php
  /** @var \Nicole\Box\Core\Models\Order $order */

  $hasCatalogProducts = false;
  foreach ($order->sections as $section) {
    if ($section->products->count() > 0) {
      $hasCatalogProducts = true;
      break;
    }
  }
@endphp

@if ($hasCatalogProducts)
  @foreach ($order->sections as $sectionIndex => $section)
    @php
      $validProducts = [];
      foreach ($section->products as $op) {
        if ($op->variant && $op->variant->product) {
          $validProducts[] = $op;
        }
      }

      $productChunks = array_chunk($validProducts, 3);
    @endphp

    @foreach ($productChunks as $chunkIndex => $chunk)
      <div class="page">
        @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

        <div class="page-content">

          <div class="page-title-container">
            <div class="category-header-text" style="color: var(--brand-blue); margin-bottom: 4px;">
              Спецификация компонентов · Расчёт №{{ $sectionIndex + 1 }}
              @if(count($productChunks) > 1)
                (Часть {{ $chunkIndex + 1 }} из {{ count($productChunks) }})
              @endif
            </div>
            <h1 class="page-title">Материалы и комплектующие проекта</h1>
          </div>

          <div class="materials-grid">
            @foreach ($chunk as $op)
              @php
                $variant = $op->variant;
                $product = $variant->product;

                $prodName = $product->getTranslation('name', app()->getLocale()) ?? $product->name;
                $prodDesc = $product->getTranslation('description', app()->getLocale()) ?? $product->description;

                $photo = $variant->getFirstMediaUrl('preview')
                  ?: ($variant->getFirstMediaUrl('main')
                    ?: ($product->getFirstMediaUrl('preview') ?: $product->getFirstMediaUrl('main')));

                $base64Photo = null;
                if ($photo) {
                  $path = public_path(parse_url($photo, PHP_URL_PATH));
                  if (file_exists($path)) {
                    $mime = mime_content_type($path);
                    $base64Photo = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($path));
                  }
                }
              @endphp

              <div class="material-card">
                <div class="material-card-body">
                  @if ($base64Photo)
                    <div class="material-img-cell">
                      <img src="{{ $base64Photo }}" alt="{{ $prodName }}" class="material-img">
                    </div>
                  @endif

                  <div class="material-info-cell" style="width: {{ $base64Photo ? '68%' : '100%' }} !important;">
                    <div class="material-title">{{ $prodName }}</div>
                    <div class="material-sku">Артикул: {{ $variant->sku }}</div>
                    @if (!empty($prodDesc))
                      <div class="material-desc">{!! $prodDesc !!}</div>
                    @endif
                  </div>
                </div>
              </div>
            @endforeach
          </div>

        </div>

        @include('valerie-showers::pdf.partials.footer', ['pageNum' => $pageCounter++])
      </div>
    @endforeach
  @endforeach
@endif
