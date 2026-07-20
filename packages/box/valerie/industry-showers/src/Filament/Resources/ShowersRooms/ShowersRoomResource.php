<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Filament\Resources\ShowersRooms;

use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersRooms\Pages;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersRooms\Schemas\ShowersRoomForm;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersRooms\Tables\ShowersRoomsTable;
use Valerie\Box\IndustryShowers\Models\ShowersRoom;


class ShowersRoomResource extends Resource
{
  protected static ?string $model = ShowersRoom::class;

  protected static string|null|\BackedEnum $navigationIcon = Heroicon::OutlinedHomeModern;

  protected static ?string $recordTitleAttribute = 'name';

  protected static ?string $slug = 'showers-rooms';

  public static function getNavigationGroup(): ?string
  {
    return __('Configurations');
  }

  public static function getModelLabel(): string
  {
    return __('Showers Room');
  }

  public static function getPluralModelLabel(): string
  {
    return __('Showers Rooms');
  }

  public static function form(Schema $schema): Schema
  {
    return ShowersRoomForm::configure($schema);
  }

  public static function table(Table $table): Table
  {
    return ShowersRoomsTable::configure($table);
  }

  public static function getPages(): array
  {
    return [
      'index'  => Pages\ListShowersRooms::route('/'),
      'create' => Pages\CreateShowersRoom::route('/create'),
      'edit'   => Pages\EditShowersRoom::route('/{record}/edit'),
    ];
  }
}
