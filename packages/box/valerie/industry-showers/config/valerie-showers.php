<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Настройки индустрии `Душевые перегородки`
|--------------------------------------------------------------------------
|
| Публикация в приложение (необязательно):
|   php artisan vendor:publish --tag=valerie-showers-config
|
| Реквизиты компании берутся из ядра: config('nicole.company.*') / VMS_COMPANY_*.
|
*/

return [

  'pdf' => [

    /*
    | Страницы КП в порядке вывода. Имя = файл в views/pdf/pages/{name}.blade.php.
    | Приложение может добавить свою страницу: положить её в
    | resources/views/vendor/valerie-showers/pdf/pages/{name}.blade.php и дописать сюда.
    */
    'pages' => array_values(array_filter(array_map('trim', explode(',', (string)env(
      'VMS_PDF_PAGES',
      'cover,summary,estimate,contacts'
    ))))),

    // Срок действия КП, дней
    'validity_days' => (int)env('VMS_PDF_VALIDITY_DAYS', 30),

    // Срок изготовления для стандартного блока условий (null — блок не выводится)
    'lead_time_days' => env('VMS_PDF_LEAD_TIME_DAYS') !== null ? (int)env('VMS_PDF_LEAD_TIME_DAYS') : null,

    // Акцентный цвет для векторной заглушки обложки (когда нет cover-картинки)
    'accent_color' => env('VMS_PDF_ACCENT_COLOR', '#0284C7'),

    // Доп. строки карточки контактов. Значения прогоняются через __(), их можно переводить в lang приложения.
    'company_extra' => [
      'messengers'    => env('VMS_COMPANY_MESSENGERS'),     // напр. "Telegram · WhatsApp · Viber"
      'working_hours' => env('VMS_COMPANY_WORKING_HOURS'),  // напр. "Mon–Fri 10:00–20:00"
    ],

    // Кандидаты логотипа и обложки (относительно public/). Берётся первый существующий файл.
    'logo_candidates' => [
      'pdf/logo.svg',
      'pdf/logo.png',
      'images/pdf/logo.svg',
      'images/pdf/logo.png',
    ],
    'cover_candidates' => [
      'pdf/cover.jpg',
      'pdf/cover.png',
      'images/pdf/cover.jpg',
      'images/pdf/cover.png',
    ],

    /*
    | Символы валют. Ключ локали '*' — для всех языков.
    | Для 'ru' показываем «руб.» и «Br», для остальных — ISO-код.
    */
    'currency_symbols' => [
      '*' => [
        'USD' => '$',
        'EUR' => '€',
        'PLN' => 'zł',
        'KZT' => '₸',
        'TRY' => '₺',
      ],
      'ru' => [
        'RUB' => 'руб.',
        'BYN' => 'Br',
      ],
    ],
  ],

];
