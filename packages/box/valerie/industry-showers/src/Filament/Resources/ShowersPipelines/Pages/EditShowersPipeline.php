<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\Pages;

use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Nicole\Box\Core\Models\Pipeline;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\ShowersPipelineResource;
use Valerie\Box\IndustryShowers\Services\PipelineRuleGeneratorService;

class EditShowersPipeline extends EditRecord
{
  protected static string $resource = ShowersPipelineResource::class;

  protected function getHeaderActions(): array
  {
    return [
      DeleteAction::make(),
    ];
  }

  protected function afterSave(): void
  {
    $pipeline = $this->getRecord();

    if ($pipeline instanceof Pipeline) {
      $pipeline->rules()->delete();
      app(PipelineRuleGeneratorService::class)->generate($pipeline);
    }
  }
}
