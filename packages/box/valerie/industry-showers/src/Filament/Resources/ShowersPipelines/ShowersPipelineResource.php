<?php

namespace Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines;

use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Nicole\Box\Core\Models\Pipeline;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\Pages\CreateShowersPipeline;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\Pages\EditShowersPipeline;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\Pages\ListShowersPipelines;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\Schemas\ShowersPipelineForm;
use Valerie\Box\IndustryShowers\Filament\Resources\ShowersPipelines\Tables\ShowersPipelinesTable;

class ShowersPipelineResource extends Resource
{
  protected static ?string $model = Pipeline::class;

  protected static string|null|\BackedEnum $navigationIcon = Heroicon::OutlinedServerStack;

  protected static ?string $recordTitleAttribute = 'name';

  protected static ?string $slug = 'showers-pipelines';

  public static function getNavigationGroup(): ?string
  {
    return __('Configurations');
  }

  public static function getModelLabel(): string
  {
    return __('Showers Pipeline');
  }

  public static function getPluralModelLabel(): string
  {
    return __('Showers Pipelines');
  }

  public static function canAccess(): bool
  {
    // В коробке доступ открыт для всех администраторов панели
    return true;
  }

  public static function form(Schema $schema): Schema
  {
    return ShowersPipelineForm::configure($schema);
  }

  public static function table(Table $table): Table
  {
    return ShowersPipelinesTable::configure($table);
  }

  public static function getPages(): array
  {
    return [
      'index' => ListShowersPipelines::route('/'),
      'create' => CreateShowersPipeline::route('/create'),
      'edit' => EditShowersPipeline::route('/{record}/edit'),
    ];
  }
}
