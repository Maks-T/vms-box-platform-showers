<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Services;

use Illuminate\Support\Facades\DB;
use Nicole\Box\Core\Models\BindingRule;
use Nicole\Box\Core\Models\ComplexDictionary;
use Nicole\Box\Core\Models\ComplexDictionaryRecord;
use Nicole\Box\Core\Models\Pipeline;
use Nicole\Box\Core\Models\Product;
use Nicole\Box\Core\Models\ProductVariant;
use Valerie\Box\IndustryShowers\Support\Constants\ShowersPipelineRole;

class PipelineRuleGeneratorService
{
  public function generate(Pipeline $pipeline): int
  {
    return DB::transaction(function () use ($pipeline) {
      BindingRule::where('pipeline_id', $pipeline->id)->delete();
      $ruleSort = 1;

      $productsByCode = Product::with('variants.attributeValues.attribute', 'variants.attributeValues.option')
        ->get()
        ->keyBy('code');

      $glassProduct    = $productsByCode->get('glass_id_1');
      $profileProduct  = $productsByCode->get('profile_profile');
      $capProduct      = $productsByCode->get('profile_cap');
      $cornerProduct   = $productsByCode->get('profile_corner');
      $handleProduct   = $productsByCode->get('handle_knob');
      $hingeProduct    = $productsByCode->get('opensys_hinge');
      $crossbarProduct = $productsByCode->get('crossbar_crossbar');
      $fixProduct      = $productsByCode->get('crossbar_fix');
      $fixGlassProduct = $productsByCode->get('crossbar_fix_glass');
      $doorstepProduct = $productsByCode->get('doorsteps');

      $montageMap = [
        'line'      => $productsByCode->get('service_id_1'),
        'corner'    => $productsByCode->get('service_id_3'),
        'free'      => $productsByCode->get('service_id_5'),
        'trapezoid' => $productsByCode->get('service_id_6'),
        'ushaped'   => $productsByCode->get('service_id_7'),
        'door'      => $productsByCode->get('service_id_8'),
        'curtain'   => $productsByCode->get('service_id_9'),
      ];

      $measureService  = $productsByCode->get('service_measure');
      $deliveryService = $productsByCode->get('service_delivery');
      $liftService     = $productsByCode->get('service_lift');

      $formsDict = ComplexDictionary::where('code', 'shower_forms')->first();
      $forms = $formsDict ? ComplexDictionaryRecord::where('dictionary_id', $formsDict->id)->get() : collect();

      foreach ($forms as $form) {
        $slug = $form->slug;

        $slots = match ($slug) {
          'free' => [
            ShowersPipelineRole::GLASS => $glassProduct,
            ShowersPipelineRole::PROFILE => $profileProduct,
            ShowersPipelineRole::CROSSBAR => $crossbarProduct,
          ],
          'door' => [
            ShowersPipelineRole::GLASS => $glassProduct,
            ShowersPipelineRole::OPEN_SYSTEM => $hingeProduct,
            ShowersPipelineRole::HANDLE => $handleProduct,
          ],
          'curtain' => [
            ShowersPipelineRole::GLASS => $glassProduct,
            ShowersPipelineRole::PROFILE => $profileProduct,
            ShowersPipelineRole::OPEN_SYSTEM => $hingeProduct,
            ShowersPipelineRole::HANDLE => $handleProduct,
            ShowersPipelineRole::CROSSBAR => $crossbarProduct,
          ],
          default => [
            ShowersPipelineRole::GLASS => $glassProduct,
            ShowersPipelineRole::PROFILE => $profileProduct,
            ShowersPipelineRole::OPEN_SYSTEM => $hingeProduct,
            ShowersPipelineRole::HANDLE => $handleProduct,
            ShowersPipelineRole::CROSSBAR => $crossbarProduct,
            ShowersPipelineRole::DOORSTEP => $doorstepProduct,
          ],
        };

        foreach ($slots as $role => $targetProd) {
          if (!$targetProd) continue;

          $defaultVar = $targetProd->variants->firstWhere('is_default', true) ?? $targetProd->variants->first();
          if (!$defaultVar) continue;

          BindingRule::create([
            'external_code' => "rule_form_{$slug}_{$role}",
            'pipeline_id' => $pipeline->id,
            'name' => ShowersPipelineRole::label($role) . " ({$form->name})",
            'role' => $role,
            'parent_type' => $form->getMorphClass(),
            'parent_id' => $form->id,
            'child_type' => $defaultVar->getMorphClass(),
            'child_id' => $defaultVar->id,
            'is_required' => in_array($role, [ShowersPipelineRole::GLASS, ShowersPipelineRole::PROFILE]),
            'quantity_formula' => '1',
            'sort_order' => $ruleSort++,
          ]);
        }

        if ($slug !== 'free') {
          foreach (['sealant_hinge', 'sealant_magnetic'] as $sealCode) {
            $sealProd = $productsByCode->get($sealCode);
            $sealVar = $sealProd?->variants->first();
            if ($sealVar) {
              BindingRule::create([
                'external_code' => "rule_form_{$slug}_seal_{$sealCode}",
                'pipeline_id' => $pipeline->id,
                'name' => "Уплотнитель {$sealProd->name} ({$form->name})",
                'role' => ShowersPipelineRole::SEALANT,
                'parent_type' => $form->getMorphClass(),
                'parent_id' => $form->id,
                'child_type' => $sealVar->getMorphClass(),
                'child_id' => $sealVar->id,
                'is_required' => false,
                'quantity_formula' => '1',
                'sort_order' => $ruleSort++,
              ]);
            }
          }
        }

        $services = array_filter([
          $montageMap[$slug] ?? null,
          $measureService,
          $deliveryService,
          $liftService,
        ]);

        foreach ($services as $srvProd) {
          $srvVar = $srvProd->variants->first();
          if (!$srvVar) continue;

          BindingRule::create([
            'external_code' => "rule_form_{$slug}_srv_{$srvProd->code}",
            'pipeline_id' => $pipeline->id,
            'name' => "{$srvProd->name} ({$form->name})",
            'role' => ShowersPipelineRole::SERVICES,
            'parent_type' => $form->getMorphClass(),
            'parent_id' => $form->id,
            'child_type' => $srvVar->getMorphClass(),
            'child_id' => $srvVar->id,
            'is_required' => false,
            'quantity_formula' => '1',
            'sort_order' => $ruleSort++,
          ]);
        }
      }

      // Sub-BOM Штанги
      $getEav = function (ProductVariant $v, string $attrCode): string {
        $val = $v->attributeValues->first(fn($a) => $a->attribute && $a->attribute->code === $attrCode);
        return $val?->option?->slug ?? ($val?->value_string ?? '');
      };

      $fixVariants = [];
      foreach ($fixProduct?->variants ?? [] as $v) {
        $cType = $getEav($v, 'crossbar_type_id');
        $fColor = $getEav($v, 'furniture_type_id');
        if ($cType && $fColor) $fixVariants["{$cType}_{$fColor}"] = $v;
      }

      $fixGlassVariants = [];
      foreach ($fixGlassProduct?->variants ?? [] as $v) {
        $cType = $getEav($v, 'crossbar_type_id');
        $fColor = $getEav($v, 'furniture_type_id');
        if ($cType && $fColor) $fixGlassVariants["{$cType}_{$fColor}"] = $v;
      }

      foreach ($crossbarProduct?->variants ?? [] as $cbVar) {
        $cType = $getEav($cbVar, 'crossbar_type_id');
        $fColor = $getEav($cbVar, 'furniture_type_id');
        $key = "{$cType}_{$fColor}";

        if (isset($fixVariants[$key])) {
          BindingRule::create([
            'external_code' => "rule_sub_cb_{$cbVar->id}_fix",
            'pipeline_id' => $pipeline->id,
            'name' => "Крепление к стене ({$cbVar->sku})",
            'role' => ShowersPipelineRole::FIX,
            'parent_type' => $cbVar->getMorphClass(),
            'parent_id' => $cbVar->id,
            'child_type' => $fixVariants[$key]->getMorphClass(),
            'child_id' => $fixVariants[$key]->id,
            'is_required' => true,
            'quantity_formula' => '1',
            'sort_order' => $ruleSort++,
          ]);
        }

        if (isset($fixGlassVariants[$key])) {
          BindingRule::create([
            'external_code' => "rule_sub_cb_{$cbVar->id}_fixglass",
            'pipeline_id' => $pipeline->id,
            'name' => "Держатель стекла ({$cbVar->sku})",
            'role' => ShowersPipelineRole::FIX_GLASS,
            'parent_type' => $cbVar->getMorphClass(),
            'parent_id' => $cbVar->id,
            'child_type' => $fixGlassVariants[$key]->getMorphClass(),
            'child_id' => $fixGlassVariants[$key]->id,
            'is_required' => true,
            'quantity_formula' => '1',
            'sort_order' => $ruleSort++,
          ]);
        }
      }

      // Sub-BOM Профиля
      $capVariants = [];
      foreach ($capProduct?->variants ?? [] as $v) {
        $thick = $getEav($v, 'glass_thickness');
        $fColor = $getEav($v, 'furniture_type_id');
        if ($thick && $fColor) $capVariants["{$thick}_{$fColor}"] = $v;
      }

      $cornerVariants = [];
      foreach ($cornerProduct?->variants ?? [] as $v) {
        $thick = $getEav($v, 'glass_thickness');
        $fColor = $getEav($v, 'furniture_type_id');
        if ($thick && $fColor) $cornerVariants["{$thick}_{$fColor}"] = $v;
      }

      foreach ($profileProduct?->variants ?? [] as $profVar) {
        $thick = $getEav($profVar, 'glass_thickness');
        $fColor = $getEav($profVar, 'furniture_type_id');
        $key = "{$thick}_{$fColor}";

        if (isset($capVariants[$key])) {
          BindingRule::create([
            'external_code' => "rule_sub_prof_{$profVar->id}_cap",
            'pipeline_id' => $pipeline->id,
            'name' => "Заглушка ({$profVar->sku})",
            'role' => ShowersPipelineRole::CAP,
            'parent_type' => $profVar->getMorphClass(),
            'parent_id' => $profVar->id,
            'child_type' => $capVariants[$key]->getMorphClass(),
            'child_id' => $capVariants[$key]->id,
            'is_required' => false,
            'quantity_formula' => '2',
            'sort_order' => $ruleSort++,
          ]);
        }

        if (isset($cornerVariants[$key])) {
          BindingRule::create([
            'external_code' => "rule_sub_prof_{$profVar->id}_corner",
            'pipeline_id' => $pipeline->id,
            'name' => "Угловой коннектор ({$profVar->sku})",
            'role' => ShowersPipelineRole::CONNECTOR,
            'parent_type' => $profVar->getMorphClass(),
            'parent_id' => $profVar->id,
            'child_type' => $cornerVariants[$key]->getMorphClass(),
            'child_id' => $cornerVariants[$key]->id,
            'is_required' => false,
            'quantity_formula' => '1',
            'sort_order' => $ruleSort++,
          ]);
        }
      }

      return BindingRule::where('pipeline_id', $pipeline->id)->count();
    });
  }
}
