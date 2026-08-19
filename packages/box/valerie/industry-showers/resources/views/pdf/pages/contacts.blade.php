@php
  /** @var \Nicole\Box\Core\Models\Order $order */
  use Valerie\Box\IndustryShowers\Support\PdfEstimateRenderer;

  $currencySymbol = match($order->currency) {
      'RUB' => 'руб.',
      'USD' => '$',
      'BYN' => 'Br',
      default => $order->currency
  };

  $validUntil = PdfEstimateRenderer::getValidUntil($order->created_at);

  $companyName = config('nicole.company.name', 'Прозрачные решения');
  $companyPhone = config('nicole.company.phone', '+375 29 555-61-01');
  $companyEmail = config('nicole.company.email', 'steklovdome.sales@gmail.com');
  $cleanPhone = preg_replace('/[^\d+]/', '', $companyPhone);
@endphp

<div class="page">
  @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

  <div class="page-content">

    <div class="info-blocks-container">
      {{-- Блок 1: Условия оплаты --}}
      <div class="info-block-card">
        <div class="info-block-title">Условия оплаты</div>
        <div class="info-block-content">
          <p><strong>Варианты оплаты:</strong></p>
          <ul>
            <li>Наличный расчет — предоплата 50%.</li>
            <li>ЕРИП — предоплата 50%.</li>
            <li>
              <strong>Рассрочка от Альфа-Банка:</strong>
              <br>— 1% от 2 до 5 месяцев (оформление при проведении замера).
            </li>
            <li>
              <strong>Кредит от Альфа-Банка:</strong>
              <br>— 18,2% до 48 месяцев (оформление при проведении замера).
            </li>
          </ul>
        </div>
      </div>

      {{-- Блок 2: Сроки производства --}}
      <div class="info-block-card">
        <div class="info-block-title">Срок выполнения</div>
        <div class="info-block-content">
          <p>Срок выполнения работ составляет <strong>15 рабочих дней</strong>.</p>
        </div>
      </div>

      {{-- Блок 3: Гарантийные обязательства --}}
      <div class="info-block-card">
        <div class="info-block-title">Гарантия</div>
        <div class="info-block-content">
          <p>Гарантия на стекло — <strong>36 месяцев</strong>, гарантия на выполненные работы — <strong>12 месяцев</strong>.</p>
        </div>
      </div>
    </div>

    {{-- Карточка контактов компании / менеджера --}}
    <div class="manager-card-light">
      <div class="manager-info">
        <div class="manager-post-light">Контакты компании</div>
        <div class="manager-name-light">{{ $companyName }}</div>

        <ul class="manager-contacts-list-light">
          <li>
            <span>Телефон:</span>
            <a href="tel:{{ $cleanPhone }}">{{ $companyPhone }}</a>
          </li>
          <li>
            <span>Email:</span>
            <a href="mailto:{{ $companyEmail }}">{{ $companyEmail }}</a>
          </li>
          <li>
            <span>Поддержка:</span>
            Telegram · WhatsApp · Viber
          </li>
          <li>
            <span>График работы:</span>
            Пн–Пт 10:00–20:00
          </li>
        </ul>
      </div>
    </div>

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

  @include('valerie-showers::pdf.partials.footer')
</div>