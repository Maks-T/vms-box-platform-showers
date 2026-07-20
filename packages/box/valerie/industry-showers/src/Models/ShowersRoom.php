<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Spatie\MediaLibrary\HasMedia;
use Nicole\Box\Core\Traits\HasNicoleMedia;

class ShowersRoom extends Model implements HasMedia
{
  use HasTranslations, HasNicoleMedia;

  protected $table = 'showers_rooms';

  protected $fillable = [
    'name',
    'points',
    'is_active',
    'sort_order',
  ];

  public array $translatable = ['name'];

  protected $casts = [
    'points' => 'array',
    'is_active' => 'boolean',
    'sort_order' => 'integer',
  ];

  public function registerMediaCollections(): void
  {
    $this->addMediaCollection('main')->singleFile();
  }
}
