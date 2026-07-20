<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Providers;

use Illuminate\Support\ServiceProvider;
use Nicole\Box\Core\Support\Calculator\PipelineRoleResolver;
use Valerie\Box\IndustryShowers\Support\Constants\ShowersPipelineRole;

class PipelineServiceProvider extends ServiceProvider
{
  public function boot(): void
  {
    if (class_exists(PipelineRoleResolver::class)) {
      PipelineRoleResolver::register('showers', ShowersPipelineRole::class);
    }
  }
}
