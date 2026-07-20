<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Services;

use Nicole\Box\Core\Models\ProductType;
use Nicole\Box\Core\Models\Pipeline;
use Nicole\Box\Core\Models\Product;

class PipelineRuleGeneratorService
{
  public function generate(Pipeline $pipeline): void
  {
    $uiState = $pipeline->ui_state ?? [];
    $cameraType = ProductType::where('code', 'camera')->first();

    if (!$cameraType) {
      return;
    }

    $conditions = [
      'and' => [],
    ];

    if (!empty($uiState['groups'])) {
      $conditions['and'][] = [
        'var' => 'parent.camera_groups',
        'op'  => 'in',
        'val' => array_map('intval', $uiState['groups']),
      ];
    }

    if (!empty($uiState['resolutions'])) {
      $conditions['and'][] = [
        'var' => 'parent.camera_resolution',
        'op'  => 'in',
        'val' => array_map('intval', $uiState['resolutions']),
      ];
    }

    if (isset($uiState['range_from'], $uiState['range_to'])) {
      $conditions['and'][] = ['var' => 'context.total_cameras', 'op' => '>=', 'val' => (int)$uiState['range_from']];
      $conditions['and'][] = ['var' => 'context.total_cameras', 'op' => '<=', 'val' => (int)$uiState['range_to']];
    }

    if (!empty($uiState['switches'])) {
      foreach ($uiState['switches'] as $switch) {
        $pipeline->rules()->create([
          'name'             => 'Auto Switch',
          'parent_type'      => ProductType::class,
          'parent_id'        => $cameraType->id,
          'child_type'       => Product::class,
          'child_id'         => $switch['product_id'],
          'conditions'       => $conditions,
          'quantity_formula' => (string)($switch['quantity'] ?? 1),
        ]);
      }
    }

    if (!empty($uiState['storage'])) {
      foreach ($uiState['storage'] as $days => $config) {
        $storageConditions = $conditions;
        $storageConditions['and'][] = [
          'var' => 'context.storage_days',
          'op'  => '==',
          'val' => (int)$days,
        ];

        if (!empty($config['product_id'])) {
          $pipeline->rules()->create([
            'name'             => "NVR for {$days} days",
            'parent_type'      => ProductType::class,
            'parent_id'        => $cameraType->id,
            'child_type'       => Product::class,
            'child_id'         => $config['product_id'],
            'conditions'       => $storageConditions,
            'quantity_formula' => "1",
          ]);
        }

        if (!empty($config['memory'])) {
          foreach ($config['memory'] as $hdd) {
            $qtyMultiplier = $hdd['quantity'] ?? 1;
            $pipeline->rules()->create([
              'name'             => "HDD for {$days} days",
              'parent_type'      => ProductType::class,
              'parent_id'        => $cameraType->id,
              'child_type'       => Product::class,
              'child_id'         => $hdd['product_id'],
              'conditions'       => $storageConditions,
              'quantity_formula' => (string)$qtyMultiplier,
            ]);
          }
        }
      }
    }
  }
}
