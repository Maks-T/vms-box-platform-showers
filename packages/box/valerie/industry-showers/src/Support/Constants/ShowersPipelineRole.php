<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Support\Constants;

use Nicole\Box\Core\Support\Contracts\ChoiceConstantInterface;

class ShowersPipelineRole implements ChoiceConstantInterface
{
  public const string PROFILE = 'profile';
  public const string CAP = 'cap';
  public const string HANDLE = 'handle';
  public const string OPEN_SYSTEM = 'open_system';
  public const string SEALANT = 'sealant';
  public const string DOORSTEP = 'doorstep';
  public const string CROSSBAR = 'crossbar';
  public const string FIX = 'fix';
  public const string FIX_GLASS = 'fix_glass';
  public const string CONNECTOR = 'connector';
  public const string SLIDE = 'slide';
  public const string SERVICES = 'services';

  public static function label(string $value): string
  {
    return match ($value) {
      self::PROFILE => __('Profile'),
      self::CAP => __('Cap'),
      self::HANDLE => __('Handle'),
      self::OPEN_SYSTEM => __('Open System'),
      self::SEALANT => __('Sealant'),
      self::DOORSTEP => __('Doorstep'),
      self::CROSSBAR => __('Stabilizing Rod'),
      self::FIX => __('Wall Mount'),
      self::FIX_GLASS => __('Glass Holder'),
      self::CONNECTOR => __('Track Connector'),
      self::SLIDE => __('Sliding Rollers'),
      self::SERVICES => __('Services'),
      default => '',
    };
  }

  public static function defaultProductType(string $value): ?string
  {
    return match ($value) {
      self::PROFILE, self::CAP => 'shower_profile',
      self::HANDLE => 'shower_handle',
      self::OPEN_SYSTEM, self::CONNECTOR, self::SLIDE => 'shower_open_system',
      self::SEALANT => 'shower_sealant',
      self::DOORSTEP => 'shower_doorstep',
      self::CROSSBAR, self::FIX, self::FIX_GLASS => 'shower_crossbar',
      self::SERVICES => 'shower_service',
      default => null,
    };
  }

  public static function options(): array
  {
    $options = [];
    foreach (self::cases() as $case) {
      $options[$case] = self::label($case) . " ({$case})";
    }
    return $options;
  }

  public static function cases(): array
  {
    return [
      self::PROFILE,
      self::CAP,
      self::HANDLE,
      self::OPEN_SYSTEM,
      self::SEALANT,
      self::DOORSTEP,
      self::CROSSBAR,
      self::FIX,
      self::FIX_GLASS,
      self::CONNECTOR,
      self::SLIDE,
      self::SERVICES,
    ];
  }
}
