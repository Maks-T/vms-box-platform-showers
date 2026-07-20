<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Filament\Resources\ShowersRooms\Schemas;

use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Nicole\Box\Core\Models\Product;
use Nicole\Box\Core\Filament\Forms\Components\ProductSelect;

class ShowersRoomForm
{
  public static function configure(Schema $schema): Schema
  {
    return $schema
      ->components([
        Grid::make(3)->schema([

          Section::make(__('Room Identity'))
            ->columnSpan(1)
            ->schema([
              TextInput::make('name')
                ->label(__('Name'))
                ->required()
                ->translatable(),

              Toggle::make('is_active')
                ->label(__('Is Active'))
                ->default(true),

              SpatieMediaLibraryFileUpload::make('photo')
                ->collection('main')
                ->label(__('Photo'))
                ->image()
                ->imageEditor(),
            ]),

          Section::make(__('Room Points'))
            ->columnSpan(2)
            ->description(__('Configure points and recommended equipment for this room.'))
            ->schema([
              Repeater::make('points')
                ->label('')
                ->schema([
                  Hidden::make('id')
                    ->default(fn () => (string) Str::uuid()),

                  TextInput::make('name')
                    ->label(__('Point Name'))
                    ->required()
                    ->translatable()
                    ->columnSpanFull(),

                  ProductSelect::make('cameras')
                    ->label(__('Recommended Cameras'))
                    ->multiple()
                    ->options(fn () => Product::whereHas('type', fn($q) => $q->where('code', 'camera'))->get()->mapWithKeys(fn($p) =>[$p->id => ProductSelect::renderProductOption($p)])->toArray())

                    ->getSearchResultsUsing(function (string $search) {
                      $locale = app()->getLocale();
                      return Product::whereHas('type', fn($q) => $q->where('code', 'camera'))
                        ->where("name->{$locale}", 'ilike', "%{$search}%")
                        ->limit(15)
                        ->get()
                        ->mapWithKeys(fn($p) => [$p->id => ProductSelect::renderProductOption($p)])
                        ->toArray();
                    })

                    ->columnSpanFull(),

                  Repeater::make('equipment')
                    ->label(__('Additional Equipment'))
                    ->schema([
                      ProductSelect::make('product_id')
                        ->label(__('Equipment'))
                        ->options(fn () => Product::whereHas('type', fn($q) => $q->whereIn('code',['recorder', 'switch', 'storage', 'material', 'acms_equipment']))->get()->mapWithKeys(fn($p) =>[$p->id => ProductSelect::renderProductOption($p)])->toArray())
                        ->getSearchResultsUsing(fn (string $search) => Product::whereHas('type', fn($q) => $q->whereIn('code',['recorder', 'switch', 'storage', 'material', 'acms_equipment']))->where('name', 'ilike', "%{$search}%")->limit(15)->get()->mapWithKeys(fn($p) =>[$p->id => ProductSelect::renderProductOption($p)])->toArray())
                        ->required(),

                      TextInput::make('quantity')
                        ->label(__('Quantity'))
                        ->numeric()
                        ->default(1)
                        ->required(),
                    ])
                    ->columns(2)
                    ->defaultItems(0)
                    ->addActionLabel(__('Add Equipment')),

                  Repeater::make('services')
                    ->label(__('Additional Services'))
                    ->schema([
                      ProductSelect::make('product_id')
                        ->label(__('Service'))
                        ->options(fn () => Product::whereHas('type', fn($q) => $q->where('code', 'service'))->get()->mapWithKeys(fn($p) =>[$p->id => ProductSelect::renderProductOption($p)])->toArray())
                        ->getSearchResultsUsing(fn (string $search) => Product::whereHas('type', fn($q) => $q->where('code', 'service'))->where('name', 'ilike', "%{$search}%")->limit(15)->get()->mapWithKeys(fn($p) =>[$p->id => ProductSelect::renderProductOption($p)])->toArray())
                        ->required(),

                      TextInput::make('quantity')
                        ->label(__('Quantity'))
                        ->numeric()
                        ->default(1)
                        ->required(),
                    ])
                    ->columns(2)
                    ->defaultItems(0)
                    ->addActionLabel(__('Add Service')),

                  Textarea::make('tooltip')
                    ->label(__('Tooltip / Description'))
                    ->rows(3)
                    ->translatable()
                    ->columnSpanFull(),
                ])
                ->collapsible()
                ->collapsed()
                ->itemLabel(function (array $state) {
                  $name = $state['name'] ?? null;
                  return is_array($name) ? ($name[app()->getLocale()] ?? $name['en'] ?? collect($name)->first()) : $name;
                })
                ->addActionLabel(__('Add Point'))
                ->reorderableWithButtons()
                ->columnSpanFull(),
            ]),
        ])->columnSpanFull(),
      ]);
  }
}
