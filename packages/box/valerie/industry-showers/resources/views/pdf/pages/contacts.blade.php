@php
  /** @var \Nicole\Box\Core\Models\Order $order */
  use Valerie\Box\IndustryShowers\Support\PdfEstimateRenderer;

  $currencySymbol = match($order->currency) {
      'RUB' => 'руб.',
      'USD' => '$',
      'BYN' => 'Br',
      'KZT' => '₸',
      default => $order->currency
  };

  $validUntil = PdfEstimateRenderer::getValidUntil($order->created_at);

  $companyName = config('nicole.company.name', 'АМИ ГРУПП');
  $companyPhone = config('nicole.company.phone', '8 (343) 288-26-04');
  $companyEmail = config('nicole.company.email', 'zakazamigrupp@gmail.com');
  $companyAddress = config('nicole.company.address', 'г. Екатеринбург, ул. Рощинская 67, офис 2');
  $companyWebsite = config('nicole.company.website', 'amigrupp.ru');
  $cleanPhone = preg_replace('/[^\d+]/', '', $companyPhone);
@endphp

<div class="page">
  @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

  <div class="page-content">

    <div class="info-blocks-container">
      {{-- Блок 1: Сроки производства --}}
      <div class="info-block-card">
        <div class="info-block-title">Срок производства</div>
        <div class="info-block-content">
          <p>Срок изготовления составляет <strong>3 недели</strong>.</p>
        </div>
      </div>

      {{-- Блок 2: Пояснение о расчете и бесплатном замере --}}
      <div class="info-block-card">
        <div class="info-block-title">О расчёте и замере</div>
        <div class="info-block-content">
          <p>Стоимость изделия представлена примерно. Цена может незначительно измениться из-за наличия той или иной фурнитуры.</p>
          <p>Свяжитесь с нами — мы сделаем для вас <strong>бесплатно замеры</strong>, подберем оптимальную фурнитуру, поможем решить все технические вопросы. И вы получите фиксированную точную стоимость проекта.</p>
        </div>
      </div>

      {{-- Блок 3: Призыв к действию (Следующий шаг) --}}
      <div class="info-block-card">
        <div class="info-block-title">Следующий шаг</div>
        <div class="info-block-content">
          <p><strong>Сообщите нашему менеджеру номер вашего расчета</strong>, для того чтобы он оперативно смог приступить к анализу проекта.</p>
        </div>
      </div>
    </div>

    {{-- Карточка контактов компании для обратной связи --}}
    <div class="manager-card-light">
      <div class="manager-info">
        <div class="manager-post-light">Контакты для обратной связи</div>
        <div class="manager-name-light">{{ $companyName }}</div>

        <ul class="manager-contacts-list-light">
          <li>
            <span>Телефон:</span>
            <a href="tel:{{ $cleanPhone }}">{{ $companyPhone }}</a>
          </li>
          <li>
            <span>Электронная почта:</span>
            <a href="mailto:{{ $companyEmail }}">{{ $companyEmail }}</a>
          </li>
          @if(!empty($companyAddress))
            <li>
              <span>Адрес офиса:</span>
              {{ $companyAddress }}
            </li>
          @endif
          <li>
            <span>Сайт:</span>
            <a href="https://{{ $companyWebsite }}" target="_blank">{{ $companyWebsite }}</a>
          </li>
        </ul>
      </div>
    </div>

    {{-- Итоговый подвал: Срок действия и общая сумма заказа --}}
    <div class="closing-meta-light">
      <div class="closing-cell-left">
        <div class="closing-label-light">Срок действия предложения</div>
        <div class="closing-value-light">до {{ $validUntil }} года · 30 дней</div>
      </div>

      <div class="closing-cell-right">
        <div class="closing-label-light">Общая сумма заказа</div>
        <div class="closing-value-light-price">
          {{ PdfEstimateRenderer::formatPrice($order->grand_total, $currencySymbol) }}
        </div>
      </div>
    </div>

  </div>

  @include('valerie-showers::pdf.partials.footer', ['theme' => 'light'])
</div>