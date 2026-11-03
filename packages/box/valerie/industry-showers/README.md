# valerie/box-industry-showers

Пакет индустрии «Душевые перегородки» для ядра VMS-NC (`nicole/box-core`).

## Подключение

```jsonc
// composer.json приложения
"repositories": [
  { "type": "vcs", "url": "git@github.com:<org>/vms-box-valerie-industry-showers.git" }
  // или локально: { "type": "path", "url": "packages/box/valerie/industry-showers", "options": { "symlink": true } }
],
"require": { "valerie/box-industry-showers": "@dev" }
```

```dotenv
VMS_INDUSTRY=showers
VMS_PDF_TEMPLATE=valerie-showers::pdf.calculator-report
VMS_LOCALES=ru,en,de,es,it,pl,tr
```

## КП (PDF/HTML)

Пакет содержит **стандартное нейтральное КП**: ни одного клиента в коде, все тексты через `__()`,
реквизиты из `config('nicole.company.*')` (`VMS_COMPANY_*`).

```
resources/views/pdf/
  calculator-report.blade.php   корень: локаль заказа, валюта, шрифты, стили, список страниц
  pages/  cover | summary | estimate | contacts | materials (выкл.)
  partials/
    header, footer              шапка и подвал (логотип, телефон, e-mail, сайт)
    terms                       блоки условий на последней странице  <- чаще всего переопределяется
    company-card                карточка контактов
    estimate-table              таблица позиций сметы
  pdf-report.css                стили
```

### Уровни кастомизации под клиента (от простого к сложному)

1. **Только данные** через `.env`:
   `VMS_COMPANY_NAME / PHONE / EMAIL / WEBSITE / ADDRESS / COVER_IMAGE`,
   `VMS_COMPANY_MESSENGERS`, `VMS_COMPANY_WORKING_HOURS`,
   `VMS_PDF_VALIDITY_DAYS`, `VMS_PDF_LEAD_TIME_DAYS`, `VMS_PDF_ACCENT_COLOR`, `VMS_PDF_PAGES`.
   Логотип и обложка: `public/pdf/logo.svg|png`, `public/pdf/cover.jpg|png`.
2. **Цвета и шрифты**: `resources/views/vendor/valerie-showers/pdf/theme.css` в приложении
   (дописывается после стилей пакета, достаточно переопределить `:root { --brand-blue: ... }`).
   Полная замена стилей: `.../pdf/pdf-report.css`.
3. **Вёрстка отдельных блоков**: положить в приложение файл с тем же путём, например
   `resources/views/vendor/valerie-showers/pdf/partials/terms.blade.php`.
   Laravel берёт файл приложения, остальное остаётся из пакета.
4. **Свои тексты и переводы**: `lang/{locale}.json` приложения (перекрывает ключи пакета).
5. **Своя страница**: `.../pdf/pages/promo.blade.php` + `VMS_PDF_PAGES=cover,summary,estimate,promo,contacts`.

Скопировать всё КП в приложение для глубокой переделки:
`php artisan vendor:publish --tag=valerie-showers-pdf`
(после этого обновления КП в пакете на такое приложение не влияют, поэтому лучше переопределять точечно).

### Язык КП

Берётся из `orders.locale`, если он есть в `VMS_LOCALES`, иначе язык приложения.

## Что объединено (ноябрь 2026)

| Откуда | Что |
|---|---|
| `client/amigrupp` | `PipelineRuleGeneratorService` для душевых (вместо заготовки CCTV), роль `GLASS`, локаль в `CalculatorController`, `config('nicole.active_widget')`, поиск логотипа/обложки svg/png, `KZT`, единица `м²` |
| `main` | `ShowersCalculatorBridgeController` (группы штанг, `resolveVariantName`, выбор локали по `VMS_LOCALES`) |
| `main-english` | все тексты КП через `__()`, переводы de/es/it/pl/tr, локаль заказа в КП, `EUR` |
| новое | `PdfReport` (валюта, единицы, реквизиты, логотип, стили), разбивка контактов на `terms` + `company-card`, конфиг `valerie-showers.php`, `vendor:publish`, шрифты без `base_path('packages/...')` (пакет работает и из `vendor/`) |

Исправлено: `getValidUntil()` мутировал `$order->created_at`; русские строки в `PdfEstimateRenderer` и форматтере.
Удалено из пакета: клиентские тексты (Альфа-Банк, ЕРИП, «3 недели» и т.п.) и ~50 ключей CCTV в `lang/*.json`.

Админка переведена: `ManageShowersCalculatorSettings` и таблица сметы в заказе. Названия записей справочников
(`shower_measure_limits`, `shower_interface_settings`) при сохранении пишутся на всех языках из `VMS_LOCALES`.
