<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Nicole\Box\Core\Models\AttributeOption;
use Nicole\Box\Core\Models\Pipeline;

class ShowersPipelinesTable
{
  public static function configure(Table $table): Table
  {
    return $table
      ->columns([
        TextColumn::make('name')
          ->label(__('Name'))
          ->searchable()
          ->sortable()
          ->weight('medium'),

        TextColumn::make('groups')
          ->label(__('Groups'))
          ->state(function (Pipeline $record): array {
            $groupIds = $record->ui_state['groups'] ?? [];
            if (empty($groupIds)) {
              return [];
            }
            return AttributeOption::whereIn('id', $groupIds)->get()->pluck('value')->toArray();
          })
          ->badge()
          ->color('gray')
          ->wrap(),

        TextColumn::make('resolutions')
          ->label(__('Resolutions'))
          ->state(function (Pipeline $record): array {
            $resIds = $record->ui_state['resolutions'] ?? [];
            if (empty($resIds)) {
              return [];
            }
            return AttributeOption::whereIn('id', $resIds)->get()->pluck('value')->toArray();
          })
          ->badge()
          ->color('info'),

        TextColumn::make('range')
          ->label(__('Range'))
          ->state(function (Pipeline $record): string {
            $from = $record->ui_state['range_from'] ?? 1;
            $to = $record->ui_state['range_to'] ?? '∞';
            return "{$from} - {$to}";
          })
          ->badge()
          ->color('success'),

        TextColumn::make('rules_count')
          ->label(__('Generated Rules'))
          ->counts('rules')
          ->badge()
          ->color('primary')
          ->toggleable(isToggledHiddenByDefault: true),

        IconColumn::make('is_active')
          ->label(__('Is Active'))
          ->boolean(),
      ])
      ->recordActions([
        Action::make('view_scheme')
          ->label(__('Scheme'))
          ->icon('heroicon-o-share')
          ->color('info')
          ->modalHeading(fn (Pipeline $record) => __('Equipment (Outcomes)') . ': ' . $record->name)
          ->modalSubmitAction(false)
          ->modalCancelActionLabel(__('Close'))
          ->modalWidth('5xl')
          ->modalContent(fn (Pipeline $record) => view('valerie-showers::pipeline-scheme', ['state' => $record->ui_state])),

        EditAction::make(),
      ])
      ->toolbarActions([
        BulkActionGroup::make([
          DeleteBulkAction::make(),
        ]),
      ])
      ->defaultSort('id', 'asc');
  }
}
