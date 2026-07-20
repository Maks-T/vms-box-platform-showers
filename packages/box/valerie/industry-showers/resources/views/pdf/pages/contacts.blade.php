@php
  /** @var \Nicole\Box\Core\Models\Order $order */
  use Valerie\Box\IndustryShowers\Support\PdfEstimateRenderer;

  $currencySymbol = match($order->currency) {
      'RUB' => '₽',
      'USD' => '$',
      'BYN' => 'Br',
      default => $order->currency
  };

  // Вычисляем срок действия предложения (+30 дней) через хелпер
  $validUntil = PdfEstimateRenderer::getValidUntil($order->created_at);
@endphp

<div class="page page-dark">
  <!-- Верхняя шапка в темном стиле -->
  @include('valerie-showers::pdf.partials.header', ['theme' => 'dark'])

  <div class="page-content">

    <!-- 1. Заголовок раздела -->
    <h2 class="contacts-title">
      Готовы<br>
      <span class="gold-italic">оформить заказ?</span>
    </h2>

    <div class="dark-divider"></div>

    <!-- 2. Шаги оформления заказа (адаптированные под видеонаблюдение) -->
    <div class="steps-container">
      <div class="step-card">
        <div class="step-num">1</div>
        <div class="step-content">
          <div class="step-title">Подтвердите КП</div>
          <div class="step-desc">Напишите или позвоните вашему персональному менеджеру — уточним детали и зафиксируем состав оборудования.</div>
        </div>
      </div>

      <div class="step-card">
        <div class="step-num">2</div>
        <div class="step-content">
          <div class="step-title">Внесите предоплату 50%</div>
          <div class="step-desc">После получения предоплаты мы резервируем оборудование на складе и планируем выезд монтажной бригады.</div>
        </div>
      </div>

      <div class="step-card">
        <div class="step-num">3</div>
        <div class="step-content">
          <div class="step-title">Согласуйте дату монтажа</div>
          <div class="step-desc">Выберите удобный день — выедем для установки, настройки и юстировки системы в течение 1–2 рабочих дней.</div>
        </div>
      </div>
    </div>

    <!-- 3. Карточка Персонального менеджера или Реквизиты компании -->
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
          <div class="manager-name">{{ config('nicole.company.name') }}</div>

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

    <!-- 4. Срок действия предложения и Итоговая сумма КП -->
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

  <!-- Подвал в темном стиле -->
  @include('valerie-showers::pdf.partials.footer', ['pageNum' => 4, 'theme' => 'dark'])
</div>
