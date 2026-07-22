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

<div class="page">
  @include('valerie-showers::pdf.partials.header', ['theme' => 'light'])

  <div class="page-content">

    <div class="page-title-container">
      <div class="category-header-text" style="color: var(--brand-blue); margin-bottom: 4px;">Завершающий шаг</div>
      <h1 class="page-title" style="font-size: 24px;">Готовы оформить заказ?</h1>
    </div>

    <div class="light-divider"></div>

    <div class="steps-container-light">
      <div class="step-card-light">
        <div class="step-num-light">1</div>
        <div class="step-content-light">
          <div class="step-title-light">Подтвердите расчёт и эскиз</div>
          <div class="step-desc-light">Свяжитесь с вашим персональным менеджером для согласования типа стекла, цвета фурнитуры и нюансов монтажа.</div>
        </div>
      </div>

      <div class="step-card-light">
        <div class="step-num-light">2</div>
        <div class="step-content-light">
          <div class="step-title-light">Согласуйте дату замера</div>
          <div class="step-desc-light">Наш инженер выедет на объект для точного снятия геометрических размеров и проверки плоскостей стен и пола.</div>
        </div>
      </div>

      <div class="step-card-light">
        <div class="step-num-light">3</div>
        <div class="step-content-light">
          <div class="step-title-light">Производство и профессиональный монтаж</div>
          <div class="step-desc-light">Запускаем точный раскрой и закалку стекла, доставляем и производим чистый монтаж конструкции.</div>
        </div>
      </div>
    </div>

    @if ($order->manager)
      <div class="manager-card-light">
        <div class="manager-info">
          <div class="manager-post-light">Ваш персональный менеджер</div>
          <div class="manager-name-light">{{ $order->manager->name }}</div>

          <ul class="manager-contacts-list-light">
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
      <div class="manager-card-light">
        <div class="manager-info">
          <div class="manager-post-light">Контакты компании</div>
          <div class="manager-name-light">{{ config('nicole.company.name', 'Vistegra') }}</div>

          <ul class="manager-contacts-list-light">
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

    <div class="closing-meta-light">
      <div class="closing-cell-left">
        <div class="closing-label-light">Срок действия КП</div>
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

  @include('valerie-showers::pdf.partials.footer', ['pageNum' => $pageCounter++])
</div>
