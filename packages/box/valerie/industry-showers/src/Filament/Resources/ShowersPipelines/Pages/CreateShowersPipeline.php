<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\Pages;

use Filament\Resources\Pages\CreateRecord;
use Nicole\Box\Core\Models\Pipeline;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\ShowersPipelineResource;
use Valerie\Box\IndustryShowers\Services\PipelineRuleGeneratorService;

class CreateShowersPipeline extends CreateRecord
{
  protected static string $resource = ShowersPipelineResource::class;

  protected function afterCreate(): void
  {
    $pipeline = $this->getRecord();

    if ($pipeline instanceof Pipeline) {
      app(PipelineRuleGeneratorService::class)->generate($pipeline);
    }
  }
}
