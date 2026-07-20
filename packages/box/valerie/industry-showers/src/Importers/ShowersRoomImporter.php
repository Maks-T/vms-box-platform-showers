<?php

declare(strict_types=1);

namespace Valerie\Box\IndustryShowers\Importers;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Nicole\Box\Core\Importers\Contracts\ImportModuleInterface;
use Nicole\Box\Core\Models\Product;
use Valerie\Box\IndustryShowers\Models\ShowersRoom;
use Illuminate\Support\Facades\File;

class ShowersRoomImporter implements ImportModuleInterface
{
  protected array $productMap = [];

  public function getName(): string
  {
    return 'Showers Rooms and Observation Points';
  }

  public function run(array $settings, array $data, Command $command): void
  {
    $command->info('Старт импорта помещений и точек ССTV...');

    $roomsData = $data['rooms'] ?? [];
    if (empty($roomsData)) {
      $command->warn('  ⚠ Пропущено: Раздел rooms отсутствует в import_data.json.');
      return;
    }

    $this->productMap = Product::pluck('id', 'external_code')->toArray();

    // Очищаем таблицу перед импортом
    ShowersRoom::truncate();

    $bar = $command->getOutput()->createProgressBar(count($roomsData));

    foreach ($roomsData as $index => $roomData) {
      $transformedPoints = [];

      foreach ($roomData['points'] ?? [] as $point) {
        $transformedCameras = [];
        foreach ($point['cameras'] ?? [] as $camExtId) {
          if (isset($this->productMap[$camExtId])) {
            $transformedCameras[] = $this->productMap[$camExtId];
          }
        }

        $transformedEquipment = [];
        foreach ($point['equipment'] ?? [] as $eq) {
          $extId = str_replace('link-id:', '', $eq['id'] ?? $eq['product_id'] ?? '');
          if (isset($this->productMap[$extId])) {
            $transformedEquipment[] = [
              'product_id' => $this->productMap[$extId],
              'quantity' => $eq['count'] ?? $eq['quantity'] ?? 1,
            ];
          }
        }

        $transformedServices = [];
        foreach ($point['services'] ?? [] as $srv) {
          $extId = str_replace('link-id:', '', $srv['id'] ?? $srv['product_id'] ?? '');
          if (isset($this->productMap[$extId])) {
            $transformedServices[] = [
              'product_id' => $this->productMap[$extId],
              'quantity' => $srv['count'] ?? $srv['quantity'] ?? 1,
            ];
          }
        }

        $transformedPoints[] = [
          'id' => $point['id'] ?? (string)Str::uuid(),
          'name' => $point['name'],
          'cameras' => $transformedCameras,
          'equipment' => $transformedEquipment,
          'services' => $transformedServices,
          'tooltip' => $point['tooltip'] ?? null,
        ];
      }

      $room = ShowersRoom::create([
        'name' => $roomData['name'],
        'points' => $transformedPoints,
        'is_active' => true,
        'sort_order' => $index,
      ]);

      // Копируем изображение пресета комнаты напрямую из папки импорта в Spatie Media Library
      if (!empty($roomData['photo'])) {
        $localPath = base_path('import/export_images/' . ltrim($roomData['photo'], '/'));

        if (File::exists($localPath)) {
          $room->addMedia($localPath)
            ->preservingOriginal()
            ->toMediaCollection('main');
        } else {
          $command->warn("\n  ⚠ Изображение помещения не найдено на диске по пути: {$localPath}");
        }
      }

      $bar->advance();
    }

    $bar->finish();
    $command->newLine();
    $command->info('Импорт помещений Showers успешно завершен.');
  }
}
