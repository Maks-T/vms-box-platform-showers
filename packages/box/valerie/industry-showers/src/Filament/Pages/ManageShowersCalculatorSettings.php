<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Filament\Pages;

use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\HtmlString;
use Nicole\Box\Core\Models\Attribute;
use Nicole\Box\Core\Models\ComplexDictionary;
use Nicole\Box\Core\Models\ComplexDictionaryRecord;
use Nicole\Box\Core\Support\CatalogCache;

/**
 * Единый оркестратор фабрики душевых кабин: формы, открывания, лимиты и права.
 *
 * @since 2026-09-23
 * @property Schema $form
 */
class ManageShowersCalculatorSettings extends Page implements HasForms
{
  use InteractsWithForms;

  protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAdjustmentsHorizontal;

  protected static ?string $slug = 'showers/calculator-settings';

  protected static ?int $navigationSort = 10;

  protected string $view = 'valerie-showers::filament.pages.manage-showers-settings';

  public static function getNavigationGroup(): ?string
  {
    return __('Configurations');
  }

  public static function getNavigationLabel(): string
  {
        return __('Calculator Settings');
  }

  public ?array $data = [];

  public function mount(): void
  {
    $this->form->fill($this->loadCurrentSettings());
  }

  /**
   * Матрица физической совместимости дверей с формами (по базе 3D-моделей).
   *
   * @return array<string, array<int, string>>
   */
  protected function getCompatibleDoors(): array
  {
    return [
      'line'      => ['one_swing', 'two_swing', 'one_slide', 'two_slide'],
      'corner'    => ['one_swing', 'two_swing', 'one_slide', 'two_slide'],
      'free'      => ['static'],
      'trapezoid' => ['one_swing'],
      'ushaped'   => ['one_swing', 'one_slide'],
      'door'      => ['one_swing', 'two_swing', 'accordion_2glass', 'accordion_3glass'],
      'curtain'   => ['static', 'one_swing', 'one_swing_with_partition', 'one_slide', 'two_slide', 'accordion_2glass', 'accordion_3glass'],
    ];
  }

  /**
   * Эталонный белый список активных дверей по умолчанию
   *
   * @return array<string, array<int, string>>
   */
  protected function getDefaultEnabledDoors(): array
  {
    return [
      'line'      => ['one_swing', 'one_slide', 'two_slide'],
      'corner'    => ['one_swing', 'one_slide', 'two_slide'],
      'free'      => ['static'],
      'trapezoid' => ['one_swing'],
      'ushaped'   => ['one_swing', 'one_slide'],
      'door'      => ['one_swing', 'two_swing'],
      'curtain'   => ['static', 'one_swing', 'one_swing_with_partition', 'one_slide', 'two_slide'],
    ];
  }

  protected function loadCurrentSettings(): array
  {
    // Загрузка габаритных лимитов форм из shower_measure_limits
    /** @var ComplexDictionary|null $measureDict */
    $measureDict = ComplexDictionary::query()
      ->where('code', 'shower_measure_limits')
      ->with('records')
      ->first();
    $measureRecords = $measureDict?->records?->keyBy('slug') ?? collect();

    // 2. Загрузка параметров интерфейса из shower_interface_settings
    /** @var ComplexDictionary|null $interfaceDict */
    $interfaceDict = ComplexDictionary::query()
      ->where('code', 'shower_interface_settings')
      ->with('records')
      ->first();
    $interfaceRecords = $interfaceDict?->records?->keyBy('slug') ?? collect();

    // Загрузка белого списка разрешенных дверей
    $enabledDoorsMap = $interfaceRecords->get('enabled_doors')?->meta['values'] ?? $this->getDefaultEnabledDoors();

    // Специальные лимиты связок из interface settings
    $specialLimitsRaw = $interfaceRecords->get('special_limits')?->meta['items'] ?? [];
    $specialLimitsByForm = [];
    foreach ($specialLimitsRaw as $item) {
      $form = $item['form_id'] ?? '';
      if ($form) {
        $specialLimitsByForm[$form][] = $item;
      }
    }

    // Сборка агрегированного стейта по каждой форме
    $formsState = [];
    $formAttribute = Attribute::query()->where('code', 'form_type')->with('options')->first();
    $availableFormSlugs = $formAttribute?->options?->pluck('slug')->toArray() ?? array_keys($this->getCompatibleDoors());

    foreach ($availableFormSlugs as $formSlug) {
      $measure = $measureRecords->get($formSlug);
      $formsState[$formSlug] = [
        'is_active' => (bool) ($measure?->is_active ?? true),
        'enabled_doors' => $enabledDoorsMap[$formSlug] ?? ($this->getDefaultEnabledDoors()[$formSlug] ?? []),
        'length_min' => (int) ($measure?->meta['length_min'] ?? 300),
        'length_max' => (int) ($measure?->meta['length_max'] ?? 2000),
        'height_min' => (int) ($measure?->meta['height_min'] ?? 1700),
        'height_max' => (int) ($measure?->meta['height_max'] ?? 3200),
        'special_limits' => $specialLimitsByForm[$formSlug] ?? (
          $formSlug === 'line' ? [
            [
              'door_id' => 'two_slide',
              'length_min' => 1500,
              'length_max' => null,
              'height_min' => null,
              'height_max' => null,
            ],
          ] : []
          ),
      ];
    }

    // Ролевая матрица видимости
    $uiMatrix = [];
    foreach ($this->getSystemInterfaceZones() as $groupName => $zones) {
      foreach ($zones as $zoneKey => $info) {
        $recordMeta = $interfaceRecords->get($zoneKey)?->meta ?? [];
        $defaultUser = $info['default_user'] ?? true;

        $uiMatrix[$zoneKey] = [
          'userShow' => (bool) ($recordMeta['show_user'] ?? ($recordMeta['userShow'] ?? $defaultUser)),
          'managerShow' => (bool) ($recordMeta['show_manager'] ?? ($recordMeta['managerShow'] ?? true)),
          'adminShow' => (bool) ($recordMeta['show_admin'] ?? ($recordMeta['adminShow'] ?? true)),
        ];
      }
    }

    return [
      'forms' => $formsState,
      'ui_matrix' => $uiMatrix,
      'montage_rate_type' => (string) ($interfaceRecords->get('montage_rate_type')?->meta['value_user'] ?? 'fixed'),
    ];
  }

  protected function getSystemInterfaceZones(): array
  {
    return [
      'Цены и сметы' => [
        'priceBlock' => ['label' => 'Карточка разбивки стоимости (Изделия, Монтаж, Доставка)', 'default_user' => false],
        'estimateBlock' => ['label' => 'Таблица детализированной сметы / спецификации', 'default_user' => false],
        'totalBlock' => ['label' => 'Нижняя плашка итоговой суммы и статуса заказа', 'default_user' => true],
        'catalog_prices' => ['label' => 'Отображение цен в карточках каталогов (ручки, петли, стекло)', 'default_user' => false],
      ],
      'Дополнительные услуги (Сервис)' => [
        'service_lift' => ['label' => 'Подъем на этаж (Лифт / Этажи)', 'default_user' => false],
        'service_measure' => ['label' => 'Услуга замера (тумблер "Замер")', 'default_user' => true],
        'service_delivery' => ['label' => 'Услуга доставки (тумблер "Доставка")', 'default_user' => true],
        'service_montage' => ['label' => 'Услуга монтажа (тумблер "Монтаж")', 'default_user' => true],
      ],
      'Кнопки действий (Подвал под формой)' => [
        'btn_download_pdf' => ['label' => 'Кнопка "Скачать КП" (PDF)', 'default_user' => false],
        'btn_print' => ['label' => 'Кнопка "Распечатать"', 'default_user' => false],
        'btn_share' => ['label' => 'Кнопка "Поделиться ссылкой"', 'default_user' => true],
      ],
      'Конструкторские опции' => [
        'hide_material_selector' => ['label' => 'Скрытие селектора сплава (Цинк / Латунь)', 'default_user' => true],
        'doorstep_show' => ['label' => 'Опция "Выносной порог"', 'default_user' => true],
        'profile_framing_show' => ['label' => 'Опция "Обрамление П-профилем"', 'default_user' => true],
      ],
    ];
  }

  public function form(Schema $schema): Schema
  {
    $locale = app()->getLocale();

    $formAttribute = Attribute::query()->where('code', 'form_type')->with('options')->first();
    $doorAttribute = Attribute::query()->where('code', 'door_type_ids')->with('options')->first();

    $formOptions = $formAttribute?->options
      ?->mapWithKeys(fn ($opt) => [$opt->slug => $opt->getTranslation('value', $locale) ?: (string) $opt->value])
      ->toArray() ?? [];

    $allDoorOptions = $doorAttribute?->options
      ?->mapWithKeys(fn ($opt) => [$opt->slug => $opt->getTranslation('value', $locale) ?: (string) $opt->value])
      ->toArray() ?? [];

    $compatibleMap = $this->getCompatibleDoors();

    // Формирование вкладок для каждой отдельной формы
    $formTabs = [];
    foreach ($formOptions as $formSlug => $formName) {
      $textLabel = is_array($formName) ? ($formName[$locale] ?? $formSlug) : $formName;
      $meta = $this->getFormVisualMeta((string) $formSlug, (string) $textLabel);

      // Фильтруем список дверей: оставляем только совместимые с данной формой
      $allowedDoorKeys = $compatibleMap[$formSlug] ?? array_keys($allDoorOptions);
      $formSpecificDoorOptions = array_intersect_key($allDoorOptions, array_flip($allowedDoorKeys));

      $formTabs[] = Tab::make((string) $formSlug)
        ->label((string) $textLabel)
        ->schema([
          Section::make()
            ->schema([
              Grid::make(12)->schema([
                // Визуальная карточка: 3D рендер + чертеж + описание
                Placeholder::make("forms.{$formSlug}.visual_card")
                  ->hiddenLabel()
                  ->columnSpan(['default' => 12, 'lg' => 6])
                  ->content(fn () => new HtmlString($meta['html'])),

                // Управление активностью и белым списком дверей
                Grid::make(1)
                  ->columnSpan(['default' => 12, 'lg' => 6])
                  ->schema([
                    Toggle::make("forms.{$formSlug}.is_active")
                      ->label('Конструкция активна в калькуляторе')
                      ->helperText('Если отключить, форма полностью исчезнет из выбора на сайте')
                      ->default(true),

                    // Whitelist дверей
                    Select::make("forms.{$formSlug}.enabled_doors")
                      ->label('Доступные типы дверей для этой формы')
                      ->helperText('Выберите разрешенные типы открывания на сайте (выводятся только совместимые двери).')
                      ->multiple()
                      ->options($formSpecificDoorOptions)
                      ->placeholder('Выберите разрешенные открывания')
                      ->searchable()
                      ->preload(),
                  ]),
              ]),
            ]),

          Section::make('Базовые габаритные лимиты формы')
            ->description('Ограничивают допустимые размеры в калькуляторе для данной конструкции')
            ->schema([
              Grid::make(4)->schema([
                TextInput::make("forms.{$formSlug}.length_min")->label('Мин. длина (мм)')->numeric()->required(),
                TextInput::make("forms.{$formSlug}.length_max")->label('Макс. длина (мм)')->numeric()->required(),
                TextInput::make("forms.{$formSlug}.height_min")->label('Мин. высота (мм)')->numeric()->required(),
                TextInput::make("forms.{$formSlug}.height_max")->label('Макс. высота (мм)')->numeric()->required(),
              ]),
            ]),

          Section::make('Специальные лимиты под конкретные открывания')
            ->description('Переопределяют габариты (например, мин. 1500 мм для 2-х сдвижных дверей)')
            ->schema([
              Repeater::make("forms.{$formSlug}.special_limits")
                ->hiddenLabel()
                ->addActionLabel('Добавить спец-лимит для двери')
                ->schema([
                  Select::make('door_id')
                    ->label('Тип двери')
                    ->options($formSpecificDoorOptions)
                    ->required(),

                  TextInput::make('length_min')->label('Мин. длина (мм)')->numeric()->placeholder('300'),
                  TextInput::make('length_max')->label('Макс. длина (мм)')->numeric()->placeholder('2000'),
                  TextInput::make('height_min')->label('Мин. высота (мм)')->numeric()->placeholder('1700'),
                  TextInput::make('height_max')->label('Макс. высота (мм)')->numeric()->placeholder('3200'),
                ])
                ->columns(5),
            ]),
        ]);
    }

    return $schema
      ->statePath('data')
      ->components([
        Tabs::make('MasterSettingsTabs')->tabs([

          // ВКЛАДКА 1: Конструкции со вложенными подвкладками по формам
          Tab::make('Конструкции и лимиты')
            ->icon('heroicon-o-cube-transparent')
            ->schema([
              Tabs::make('FormsInnerTabs')
                ->tabs($formTabs),
            ]),

          // Ролевая матрица видимости интерфейса
          Tab::make('Видимость интерфейса (Права)')
            ->icon('heroicon-o-eye')
            ->schema(
              collect($this->getSystemInterfaceZones())->map(function (array $zones, string $groupName) {
                return Section::make($groupName)
                  ->compact()
                  ->schema(
                    collect($zones)->map(function (array $info, string $key) {
                      return Grid::make(4)->schema([
                        Section::make($info['label'])
                          ->columnSpan(1)
                          ->compact(),
                        Checkbox::make("ui_matrix.{$key}.userShow")
                          ->label('Клиент на сайте (User)')
                          ->inline(false)
                          ->columnSpan(1),
                        Checkbox::make("ui_matrix.{$key}.managerShow")
                          ->label('Менеджер (CRM)')
                          ->inline(false)
                          ->columnSpan(1),
                        Checkbox::make("ui_matrix.{$key}.adminShow")
                          ->label('Администратор')
                          ->inline(false)
                          ->columnSpan(1),
                      ]);
                    })->values()->toArray()
                  );
              })->values()->toArray()
            ),

          // Тарификация услуг
          Tab::make('Услуги и монтаж')
            ->icon('heroicon-o-wrench-screwdriver')
            ->schema([
              Section::make('Тарификация монтажа')
                ->schema([
                  Radio::make('montage_rate_type')
                    ->label('Принцип начисления стоимости монтажных работ')
                    ->options([
                      'fixed' => 'Фиксированная цена за всю конструкцию целиком (базовая цена услуги)',
                      'per_unit' => 'Умножать цену монтажа на фактическое количество створок/стекол',
                    ])
                    ->required(),
                ]),
            ]),
        ]),
      ]);
  }

  protected function getFormActions(): array
  {
    return [
      Action::make('save')
        ->label(__('Save changes'))
        ->submit('save'),
    ];
  }

  public function save(): void
  {
    $state = $this->form->getState();

    // 1. Сохранение габаритов и активности форм в shower_measure_limits
    /** @var ComplexDictionary $measureDict */
    $measureDict = ComplexDictionary::query()->firstOrCreate(
      ['code' => 'shower_measure_limits'],
      ['name' => ['ru' => 'Лимиты размеров душевых', 'en' => 'Shower Measure Limits'], 'is_active' => true]
    );

    foreach ($state['forms'] ?? [] as $formSlug => $formData) {
      ComplexDictionaryRecord::query()->updateOrCreate(
        ['dictionary_id' => $measureDict->id, 'slug' => $formSlug],
        [
          'name' => ['ru' => "Лимиты размеров для {$formSlug}", 'en' => "Measure limits for {$formSlug}"],
          'is_active' => (bool) ($formData['is_active'] ?? true),
          'meta' => [
            'height_min' => (int) ($formData['height_min'] ?? 1700),
            'height_max' => (int) ($formData['height_max'] ?? 3200),
            'length_min' => (int) ($formData['length_min'] ?? 300),
            'length_max' => (int) ($formData['length_max'] ?? 2000),
          ],
        ]
      );
    }

    // 2. Сохранение параметров интерфейса в shower_interface_settings
    /** @var ComplexDictionary $interfaceDict */
    $interfaceDict = ComplexDictionary::query()->firstOrCreate(
      ['code' => 'shower_interface_settings'],
      ['name' => ['ru' => 'Настройки интерфейса калькулятора', 'en' => 'Calculator Interface Settings'], 'is_active' => true]
    );

    // Обработка белого списка (enabled_doors) и автоматический расчет disabled_doors для обратной совместимости
    $enabledDoorsMap = [];
    $allDisabledDoors = [];
    $compatibleMap = $this->getCompatibleDoors();

    foreach ($state['forms'] ?? [] as $formSlug => $formData) {
      $selectedDoors = $formData['enabled_doors'] ?? [];
      $enabledDoorsMap[$formSlug] = $selectedDoors;

      // Вычисляем, какие совместимые двери были сняты
      $compatible = $compatibleMap[$formSlug] ?? [];
      $disabledForForm = array_diff($compatible, $selectedDoors);

      foreach ($disabledForForm as $doorSlug) {
        $allDisabledDoors[] = "{$formSlug}_{$doorSlug}";
      }
    }

    // Сохраняем белый список
    $this->saveRecord($interfaceDict, 'enabled_doors', ['values' => $enabledDoorsMap]);

    // Сохраняем черный список для обратной совместимости со старыми билдами виджета
    $this->saveRecord($interfaceDict, 'disabled_doors', ['values' => array_values(array_unique($allDisabledDoors))]);

    // Сохраняем специальные лимиты
    $allSpecialLimits = [];
    foreach ($state['forms'] ?? [] as $formSlug => $formData) {
      if (!empty($formData['special_limits']) && is_array($formData['special_limits'])) {
        foreach ($formData['special_limits'] as $limitRow) {
          $limitRow['form_id'] = $formSlug;
          $allSpecialLimits[] = $limitRow;
        }
      }
    }
    $this->saveRecord($interfaceDict, 'special_limits', ['items' => $allSpecialLimits]);

    // Сохранение ролевой матрицы видимости
    foreach ($state['ui_matrix'] ?? [] as $zoneKey => $roles) {
      $userShow = (bool) ($roles['userShow'] ?? false);
      $managerShow = (bool) ($roles['managerShow'] ?? true);
      $adminShow = (bool) ($roles['adminShow'] ?? true);

      $this->saveRecord($interfaceDict, $zoneKey, [
        'show_user'    => $userShow,
        'show_manager' => $managerShow,
        'show_admin'   => $adminShow,
        'userShow'     => $userShow,
        'managerShow'  => $managerShow,
        'adminShow'    => $adminShow,
      ]);
    }

    // Режим тарификации монтажа
    $this->saveRecord($interfaceDict, 'montage_rate_type', [
      'value_admin' => (string) $state['montage_rate_type'],
      'value_manager' => (string) $state['montage_rate_type'],
      'value_user' => (string) $state['montage_rate_type'],
    ]);

    // Инвалидация кэша каталога
    CatalogCache::invalidate();

    Notification::make()
      ->title('Все настройки фабрики и открываний успешно сохранены')
      ->success()
      ->send();
  }

  /**
   * Генерация визуальной карточки с 3D-рендером (.webp) и чертежом (.svg) для формы.
   *
   * @return array{render: string, blueprint: ?string, desc: string, html: string}
   */
  protected function getFormVisualMeta(string $formSlug, string $formName): array
  {
    $iconMap = [
      'line' => [
        'render' => asset('filament/showerTypes/type1.webp'),
        'blueprint' => asset('filament/showerTypes/03-odna-stvorka.svg'),
        'desc' => 'Линейная перегородка в проем или на прямой участок',
      ],
      'corner' => [
        'render' => asset('filament/showerTypes/type2.webp'),
        'blueprint' => asset('filament/showerTypes/02-uglovoy-stvorka-bokovaya.svg'),
        'desc' => 'Угловое душевое ограждение 90° (Г-образное)',
      ],
      'free' => [
        'render' => asset('filament/showerTypes/type3.webp'),
        'blueprint' => null,
        'desc' => 'Свободный вход без дверей (Walk-in)',
      ],
      'trapezoid' => [
        'render' => asset('filament/showerTypes/type4.webp'),
        'blueprint' => asset('filament/showerTypes/04-pyatiugolnyy.svg'),
        'desc' => 'Пятиугольная трапециевидная кабина с углами 135°',
      ],
      'ushaped' => [
        'render' => asset('filament/showerTypes/type5.webp'),
        'blueprint' => asset('filament/showerTypes/05-p-obraznyy.svg'),
        'desc' => 'П-образное ограждение с примыканием к одной стене',
      ],
      'door' => [
        'render' => asset('filament/showerTypes/type6.webp'),
        'blueprint' => asset('filament/showerTypes/06-nisha-1-stvorka.svg'),
        'desc' => 'Душевая дверь для установки в существующую нишу',
      ],
      'curtain' => [
        'render' => asset('filament/showerTypes/type7.webp'),
        'blueprint' => asset('filament/showerTypes/07-shtorka-dlya-vanny.svg'),
        'desc' => 'Защитная стеклянная шторка на борт ванны',
      ],
    ];

    $data = $iconMap[$formSlug] ?? [
      'render' => asset('filament/showerTypes/placeholder.png'),
      'blueprint' => null,
      'desc' => $formName,
    ];

    $blueprintHtml = $data['blueprint']
      ? "<div class=\"w-24 h-28 bg-white dark:bg-gray-900 rounded-lg p-1.5 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm\"><img src=\"{$data['blueprint']}\" class=\"max-h-full max-w-full object-contain dark:invert\" alt=\"Схема\" /></div>"
      : "";

    $html = "
        <div class=\"flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 w-full\">
            <div class=\"w-28 h-28 bg-white dark:bg-gray-900 rounded-lg p-1.5 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm\">
                <img src=\"{$data['render']}\" class=\"max-h-full max-w-full object-contain\" alt=\"3D\" />
            </div>
            {$blueprintHtml}
            <div class=\"flex flex-col gap-0.5 min-w-0 flex-1 pl-1\">
                <span class=\"text-[11px] uppercase font-bold tracking-wider text-primary-600 dark:text-primary-400 font-mono\">код: {$formSlug}</span>
                <h4 class=\"text-sm font-bold text-gray-900 dark:text-white leading-snug truncate\">{$formName}</h4>
                <p class=\"text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5 line-clamp-2\">{$data['desc']}</p>
            </div>
        </div>";

    $data['html'] = $html;
    return $data;
  }

  protected function getRecordHumanNames(): array
  {
    $names = [
      'enabled_doors' => ['ru' => 'Разрешенные типы дверей (белый список)', 'en' => 'Enabled door types (whitelist)'],
      'disabled_doors' => ['ru' => 'Отключенные типы дверей (черный список)', 'en' => 'Disabled door types (blacklist)'],
      'special_limits' => ['ru' => 'Специальные лимиты габаритов связок', 'en' => 'Special dimensional limits'],
      'montage_rate_type' => ['ru' => 'Принцип тарификации монтажа', 'en' => 'Montage rate type'],
    ];

    foreach ($this->getSystemInterfaceZones() as $zones) {
      foreach ($zones as $key => $info) {
        $names[$key] = [
          'ru' => $info['label'],
          'en' => $info['label'],
        ];
      }
    }

    return $names;
  }

  protected function saveRecord(ComplexDictionary $dict, string $slug, array $meta): void
  {
    $humanNames = $this->getRecordHumanNames();
    $name = $humanNames[$slug] ?? ['ru' => $slug, 'en' => $slug];

    ComplexDictionaryRecord::query()->updateOrCreate(
      ['dictionary_id' => $dict->id, 'slug' => $slug],
      [
        'name' => $name,
        'meta' => $meta,
        'is_active' => true,
      ]
    );
  }
}