<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Filament\Resources\ShowersRooms\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Valerie\Box\IndustryShowers\Models\ShowersRoom;

class ShowersRoomsTable
{
  public static function configure(Table $table): Table
  {
    return $table
      ->columns([
        SpatieMediaLibraryImageColumn::make('photo')
          ->label(__('Photo'))
          ->collection('main')
          ->circular(),

        TextColumn::make('name')
          ->label(__('Name'))
          ->searchable()
          ->sortable()
          ->weight('medium'),

        TextColumn::make('points')
          ->label(__('Points Count'))
          ->state(fn (ShowersRoom $record): int => is_array($record->points) ? count($record->points) : 0)
          ->badge()
          ->color('info'),

        IconColumn::make('is_active')
          ->label(__('Is Active'))
          ->boolean(),
      ])
      ->recordActions([
        EditAction::make(),
      ])
      ->toolbarActions([
        BulkActionGroup::make([
          DeleteBulkAction::make(),
        ]),
      ])
      ->reorderable('sort_order')
      ->defaultSort('sort_order', 'asc');
  }
}
