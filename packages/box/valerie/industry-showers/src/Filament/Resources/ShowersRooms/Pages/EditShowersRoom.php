<?php

namespace Valerie\Box\IndustryShowers\Filament\Resources\ShowersRooms\Pages;

use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersRooms\ShowersRoomResource;

class EditShowersRoom extends EditRecord
{
  protected static string $resource = ShowersRoomResource::class;

  protected function getHeaderActions(): array
  {
    return [
      DeleteAction::make(),
    ];
  }
}
