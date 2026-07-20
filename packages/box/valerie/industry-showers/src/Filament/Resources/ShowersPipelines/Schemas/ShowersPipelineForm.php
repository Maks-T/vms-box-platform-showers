<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\Schemas;

use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Callout;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;
use Filament\Actions\Action;
use Nicole\Box\Core\Models\AttributeOption;
use Nicole\Box\Core\Models\Product;
use Nicole\Box\Core\Filament\Forms\Components\ProductSelect;

class ShowersPipelineForm
{

  public static function configure(Schema $schema): Schema
  {
    $storageTabs = self::resolveStorageTabs();

    return $schema
      ->components([
        Hidden::make('industry')
          ->default('showers'),

        self::getIdentitySection(),

        self::getConfigurationSection(),

        self::getEquipmentSection($storageTabs),
      ]);
  }

  /**
   * Секция 1: Идентификация пайплайна.
   */
  private static function getIdentitySection(): Section
  {
    return Section::make(__('Pipeline Identity'))
      ->schema([
        TextInput::make('name')
          ->label(__('Name'))
          ->required()
          ->translatable(),

        Toggle::make('is_active')
          ->label(__('Is Active'))
          ->default(true),
      ])->columns(2);
  }

  /**
   * Секция 2: Конфигурация условий (триггеры подбора).
   */
  private static function getConfigurationSection(): Section
  {
    return Section::make(__('Configuration (Triggers)'))
      ->description(__('Which cameras trigger this pipeline?'))
      ->schema([
        Grid::make(3)->schema([
          Select::make('ui_state.groups')
            ->label(__('Groups'))
            ->multiple()
            ->options(fn (): array => AttributeOption::whereHas('attribute', fn ($q) => $q->whereIn('code', ['camera_groups', 'camera-groups']))->get()->pluck('value', 'id')->toArray())
            ->preload(),

          Select::make('ui_state.resolutions')
            ->label(__('Resolutions'))
            ->multiple()
            ->options(fn (): array => AttributeOption::whereHas('attribute', fn ($q) => $q->whereIn('code', ['camera_resolution', 'camera-resolution']))->get()->pluck('value', 'id')->toArray())
            ->preload(),

          Grid::make(2)->schema([
            TextInput::make('ui_state.range_from')
              ->label(__('Range From'))
              ->numeric()
              ->default(1),

            TextInput::make('ui_state.range_to')
              ->label(__('Range To'))
              ->numeric()
              ->default(4),
          ])->columnSpan(1),
        ]),
      ]);
  }

  /**
   * Секция 3: Выходные результаты (подбираемое оборудование и диски).
   *
   * @param array<int, Tabs\Tab> $storageTabs
   */
  private static function getEquipmentSection(array $storageTabs): Section
  {
    return Section::make(__('Equipment (Outcomes)'))
      ->schema([
        Repeater::make('ui_state.switches')
          ->label(__('Commutators / Switches'))
          ->schema([
            ProductSelect::make('product_id')
              ->label(__('Switch Model'))
              ->options(fn (): array => Product::whereHas('type', fn ($q) => $q->where('code', 'switch'))->get()->mapWithKeys(fn ($p): array => [$p->id => ProductSelect::renderProductOption($p)])->toArray())
              ->searchable()
              ->required(),

            TextInput::make('quantity')
              ->label(__('Quantity'))
              ->numeric()
              ->default(1)
              ->required(),
          ])
          ->columns(2)
          ->defaultItems(0)
          ->addActionLabel(__('Add Switch')),

        empty($storageTabs)
          ? Callout::make('warning_storage_empty')
          ->heading(__('Attention required'))
          ->description(__('The storage duration dictionary is empty. Please configure options for the storage_time attribute.'))
          ->warning()
          ->icon('heroicon-m-exclamation-triangle')
          ->actions([
            Action::make('configure_attributes')
              ->label(__('Configure'))
              ->url(url('/admin/attributes'))
              ->button()
              ->color('warning')
          ])
          ->columnSpanFull()
          : Tabs::make('StorageTabs')
          ->tabs($storageTabs)
          ->columnSpanFull(),
      ]);
  }

  /**
   * Резолвит массив опций хранения и конвертирует их в структуры вкладок.
   *
   * @return array<int, Tabs\Tab>
   */
  private static function resolveStorageTabs(): array
  {
    $storageOptions = AttributeOption::whereHas('attribute', function ($q): void {
      $q->whereIn('code', ['storage_time', 'storage-time']);
    })
      ->orderBy('sort_order')
      ->get();

    $storageTabs = [];
    foreach ($storageOptions as $option) {
      if ($option->param > 0) {
        $days = (int) ($option->param / 24);
        $storageTabs[] = self::getStorageTabSchema($days, (string) $option->value);
      }
    }

    return $storageTabs;
  }

  /**
   * Вспомогательный метод схемы для конкретной вкладки (дня хранения).
   */
  private static function getStorageTabSchema(int $days, string $tabLabel): Tabs\Tab
  {
    return Tabs\Tab::make("tab_{$days}_days")
      ->label($tabLabel)
      ->icon('heroicon-o-server')
      ->schema([
        ProductSelect::make("ui_state.storage.{$days}.product_id")
          ->label(__('Recorder'))
          ->options(fn (): array => Product::whereHas('type', fn ($q) => $q->where('code', 'recorder'))->get()->mapWithKeys(fn ($p): array => [$p->id => ProductSelect::renderProductOption($p)])->toArray())
          ->searchable(),

        Repeater::make("ui_state.storage.{$days}.memory")
          ->label(__('Memory (HDDs)'))
          ->schema([
            ProductSelect::make('product_id')
              ->label(__('HDD Model'))
              ->options(fn (): array => Product::whereHas('type', fn ($q) => $q->where('code', 'storage'))->get()->mapWithKeys(fn ($p): array => [$p->id => ProductSelect::renderProductOption($p)])->toArray())
              ->searchable()
              ->required(),

            TextInput::make('quantity')
              ->label(__('Quantity Multiplier'))
              ->helperText(__('Multiplied by total cameras'))
              ->numeric()
              ->default(1)
              ->required(),
          ])
          ->columns(2)
          ->defaultItems(0)
          ->addActionLabel(__('Add Memory')),
      ]);
  }
}
