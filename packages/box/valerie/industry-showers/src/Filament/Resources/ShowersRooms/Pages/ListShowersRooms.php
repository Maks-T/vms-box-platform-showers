<?php

namespace Valerie\Box\IndustryShowers\Filament\Resources\ShowersRooms\Pages;

use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersRooms\ShowersRoomResource;

class ListShowersRooms extends ListRecords
{
  protected static string $resource = ShowersRoomResource::class;

  protected function getHeaderActions(): array
  {
    return [
      CreateAction::make(),
    ];
  }
}
