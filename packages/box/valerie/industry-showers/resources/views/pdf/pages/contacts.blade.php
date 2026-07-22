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
@endphp

<div class="page page-dark">
  @include('valerie-showers::pdf.partials.header', ['theme' => 'dark'])

  <div class="page-content">

    <h2 class="contacts-title">
      Готовы<br>
      <span class="gold-italic">оформить заказ?</span>
    </h2>

    <div class="dark-divider"></div>

    <div class="steps-container">
      <div class="step-card">
        <div class="step-num">1</div>
        <div class="step-content">
          <div class="step-title">Подтвердите расчёт и эскиз</div>
          <div class="step-desc">Свяжитесь с вашим персональным менеджером для согласования типа стекла, цвета фурнитуры и нюансов монтажа.</div>
        </div>
      </div>

      <div class="step-card">
        <div class="step-num">2</div>
        <div class="step-content">
          <div class="step-title">Согласуйте дату замера</div>
          <div class="step-desc">Наш инженер выедет на объект для точного снятия геометрических размеров и проверки плоскостей стен и пола.</div>
        </div>
      </div>

      <div class="step-card">
        <div class="step-num">3</div>
        <div class="step-content">
          <div class="step-title">Производство и профессиональный монтаж</div>
          <div class="step-desc">Запускаем точный раскрой и закалку стекла, доставляем и производим чистый монтаж конструкции.</div>
        </div>
      </div>
    </div>

    @if ($order->manager)
      <div class="manager-card">
        <div class="manager-info">
          <div class="manager-post">Ваш персональный менеджер</div>
          <div class="manager-name">{{ $order->manager->name }}</div>

          <ul class="manager-contacts-list">
            @if ($order->manager->phone || config('nicole.company.phone'))
              <li><span>Телефон:</span> {{ $order->manager->phone ?? config('nicole.company.phone') }}</li>
            @endif
            @if ($order->manager->email || config('nicole.company.email'))
              <li><span>Email:</span> {{ $order->manager->email ?? config('nicole.company.email') }}</li>
            @endif
            <li><span>Поддержка:</span> Telegram · WhatsApp · Viber</li>
            <li><span>График работы:</span> Пн–Пт 10:00–20:00</li>
          </ul>
        </div>
      </div>
    @elseif (config('nicole.company.phone') || config('nicole.company.email'))
      <div class="manager-card">
        <div class="manager-info">
          <div class="manager-post">Контакты компании</div>
          <div class="manager-name">{{ config('nicole.company.name', 'Vistegra') }}</div>

          <ul class="manager-contacts-list">
            @if (config('nicole.company.phone'))
              <li><span>Телефон:</span> {{ config('nicole.company.phone') }}</li>
            @endif
            @if (config('nicole.company.email'))
              <li><span>Email:</span> {{ config('nicole.company.email') }}</li>
            @endif
            <li><span>Поддержка:</span> Telegram · WhatsApp · Viber</li>
            <li><span>График работы:</span> Пн–Пт 10:00–20:00</li>
          </ul>
        </div>
      </div>
    @endif

    <div class="closing-meta">
      <div class="closing-cell-left">
        <div class="closing-label-left">Срок действия КП</div>
        <div class="closing-value-left">до {{ $validUntil }} года · 30 дней</div>
      </div>

      <div class="closing-cell-right">
        <div class="closing-label-right">Общая сумма заказа</div>
        <div class="closing-value-right">
          {{ PdfEstimateRenderer::formatPrice($order->grand_total, $currencySymbol) }}
        </div>
      </div>
    </div>

  </div>

  @include('valerie-showers::pdf.partials.footer', ['pageNum' => $pageCounter++, 'theme' => 'dark'])
</div>
