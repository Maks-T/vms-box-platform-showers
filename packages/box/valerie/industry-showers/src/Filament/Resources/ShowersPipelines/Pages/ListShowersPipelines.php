<?php

namespace Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\Pages;

use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\ShowersPipelineResource;

class ListShowersPipelines extends ListRecords
{
  protected static string $resource = ShowersPipelineResource::class;

  protected function getHeaderActions(): array
  {
    return [
      CreateAction::make(),
    ];
  }
}
