<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Filament\Pages;

use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Nicole\Box\Core\Models\ComplexDictionary;
use Nicole\Box\Core\Models\ComplexDictionaryRecord;
use Nicole\Box\Core\Support\CatalogCache;

/**
 * Страница управления параметрами и поведением калькулятора душевых.
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

  /**
   * @var string Шаблон рендеринга страницы (экземплярное свойство Livewire 3 / Filament 5)
   */
  protected string $view = 'valerie-showers::filament.pages.manage-showers-settings';

  public static function getNavigationGroup(): ?string
  {
    return __('Configurations');
  }

  public static function getNavigationLabel(): string
  {
    return __('Настройки калькулятора');
  }

  public ?array $data = [];

  public function mount(): void
  {
    $this->form->fill($this->loadCurrentSettings());
  }

  protected function loadCurrentSettings(): array
  {
    /** @var ComplexDictionary|null $dict */
    $dict = ComplexDictionary::query()
      ->where('code', 'shower_interface_settings')
      ->with('records')
      ->first();

    $records = $dict?->records?->keyBy('slug') ?? collect();

    return [
      'disabled_doors' => $records->get('disabled_doors')?->meta['values'] ?? [
          'line_two_swing',
          'corner_two_swing',
          'curtain_accordion',
        ],
      'show_lift' => (bool) ($records->get('service_lift')?->meta['show_user'] ?? false),
      'montage_rate_type' => (string) ($records->get('montage_rate_type')?->meta['value_user'] ?? 'fixed'),
      'hide_material_selector' => (bool) ($records->get('hide_material_selector')?->meta['show_user'] ?? true),
      'line_two_slide_min_length' => (int) ($records->get('line_two_slide_min_length')?->meta['value_user'] ?? 1500),
    ];
  }

  public function form(Schema $schema): Schema
  {
    return $schema
      ->statePath('data')
      ->components([
        Tabs::make('SettingsTabs')->tabs([
          Tab::make('Типы дверей')
            ->icon('heroicon-o-arrows-right-left')
            ->schema([
              Section::make('Скрытие неактуальных вариантов открывания')
                ->description('Выбранные типы дверей будут исключены из селектора калькулятора на сайте')
                ->schema([
                  CheckboxList::make('disabled_doors')
                    ->hiddenLabel()
                    ->options([
                      'line_two_swing' => 'Линейная перегородка: Двойная распашная дверь',
                      'corner_two_swing' => 'Угловая перегородка: Двойная распашная дверь',
                      'curtain_accordion' => 'Шторка на ванну: Складная дверь-гармошка (2 и 3 створки)',
                      'door_two_swing' => 'Дверь в нишу: Двойная распашная дверь',
                    ])
                    ->columns(2),
                ]),
            ]),

          Tab::make('Услуги и монтаж')
            ->icon('heroicon-o-wrench-screwdriver')
            ->schema([
              Section::make('Подъем на этаж')
                ->schema([
                  Toggle::make('show_lift')
                    ->label('Отображать блок подъема на этаж (Лифт / Этажи)')
                    ->helperText('При выключении этажность и лифт скрыты, стоимость подъема не начисляется'),
                ]),
              Section::make('Тарификация монтажа')
                ->schema([
                  Radio::make('montage_rate_type')
                    ->label('Принцип начисления стоимости монтажных работ')
                    ->options([
                      'fixed' => 'Фиксированная цена за всю конструкцию целиком (базовая цена услуги)',
                      'per_unit' => 'Умножать цену монтажа на фактическое количество створок/стекол',
                    ]),
                ]),
            ]),

          Tab::make('Фурнитура')
            ->icon('heroicon-o-cube')
            ->schema([
              Section::make('Селектор сплава фурнитуры')
                ->schema([
                  Toggle::make('hide_material_selector')
                    ->label('Скрыть сквозной селектор сплава (Цинк / Латунь / Нержавейка)')
                    ->helperText('Клиент сразу выбирает цвет, а конкретные ручки и петли выбираются из каталога независимо от сплава'),
                ]),
            ]),

          Tab::make('Лимиты габаритов')
            ->icon('heroicon-o-variable')
            ->schema([
              Section::make('Ограничения конструкций')
                ->schema([
                  TextInput::make('line_two_slide_min_length')
                    ->label('Минимальная длина для Линейной с 2-мя раздвижными створками (мм)')
                    ->numeric()
                    ->default(1500)
                    ->required()
                    ->helperText('Блокирует ввод ширины менее заданного порога во избежание слишком узкого проема'),
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

    /** @var ComplexDictionary $dict */
    $dict = ComplexDictionary::query()->firstOrCreate(
      ['code' => 'shower_interface_settings'],
      [
        'name' => [
          'ru' => 'Настройки интерфейса калькулятора',
          'en' => 'Calculator Interface Settings',
        ],
        'is_active' => true,
      ]
    );

    $this->saveRecord($dict, 'disabled_doors', ['values' => $state['disabled_doors'] ?? []]);
    $this->saveRecord($dict, 'service_lift', ['show_user' => (bool) $state['show_lift']]);
    $this->saveRecord($dict, 'montage_rate_type', ['value_user' => (string) $state['montage_rate_type']]);
    $this->saveRecord($dict, 'hide_material_selector', ['show_user' => (bool) $state['hide_material_selector']]);
    $this->saveRecord($dict, 'line_two_slide_min_length', ['value_user' => (int) $state['line_two_slide_min_length']]);

    // Инвалидация кэша каталога по стандарту Nicole Core
    CatalogCache::invalidate();

    Notification::make()
      ->title('Настройки калькулятора успешно обновлены')
      ->success()
      ->send();
  }

  protected function saveRecord(ComplexDictionary $dict, string $slug, array $meta): void
  {
    ComplexDictionaryRecord::query()->updateOrCreate(
      ['dictionary_id' => $dict->id, 'slug' => $slug],
      [
        'name' => ['ru' => $slug, 'en' => $slug],
        'meta' => $meta,
        'is_active' => true,
      ]
    );
  }
}