@php
  // Обновленный импорт модели Product для Box-платформы
  use Nicole\Box\Core\Models\Product;
  $switches = $state['switches'] ?? [];
  $storage = $state['storage'] ?? [];
@endphp

<div class="flex items-center gap-6 p-4 overflow-x-auto">

  <!-- ЛЕВЫЙ БЛОК: Коммутаторы -->
  <div class="flex flex-col gap-3 min-w-[300px]">
    <div class="text-center font-medium text-gray-500 mb-2">{{ __('Commutators / Switches') }}</div>

    @forelse($switches as $switch)
      @php $product = Product::find($switch['product_id']); @endphp
      @if($product)
        <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center shadow-sm dark:bg-cyan-950/30 dark:border-cyan-800">
          <div class="text-xs text-gray-500 dark:text-gray-400">{{ __('Switch Model') }}</div>
          <div class="text-sm font-medium text-cyan-900 dark:text-cyan-100">{{ $product->name }} &times; {{ $switch['quantity'] ?? 1 }}</div>
        </div>
      @endif
    @empty
      <div class="text-sm text-gray-400 text-center italic">{{ __('No switches') }}</div>
    @endforelse
  </div>

  <!-- СТРЕЛКА -->
  <div class="text-gray-400">
    <x-heroicon-o-arrow-right class="w-8 h-8" />
  </div>

  <!-- ПРАВЫЙ БЛОК: Хранилище (Дни) -->
  <div class="flex flex-col gap-4 flex-1">
    @foreach([10, 20, 30] as $days)
      @if(isset($storage[$days]))
        <div class="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 relative">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 px-2 text-xs font-medium text-gray-500">
            {{ __('Storage') }} {{ $days }} {{ __('days') }}
          </div>

          <div class="flex items-center justify-center gap-4 mt-2">

            <!-- Регистратор -->
            @php $recorder = Product::find($storage[$days]['product_id'] ?? null); @endphp
            <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center shadow-sm flex-1 dark:bg-cyan-950/30 dark:border-cyan-800">
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ __('Recorder') }}</div>
              <div class="text-sm font-medium text-cyan-900 dark:text-cyan-100">
                {{ $recorder ? $recorder->name : '—' }} &times; 1
              </div>
            </div>

            <!-- Стрелка -->
            <div class="text-gray-400">
              <x-heroicon-o-arrow-right class="w-5 h-5" />
            </div>

            <!-- Диски -->
            <div class="flex flex-col gap-2 flex-1">
              @forelse($storage[$days]['memory'] ?? [] as $hdd)
                @php $disk = Product::find($hdd['product_id']); @endphp
                @if($disk)
                  <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center shadow-sm dark:bg-cyan-950/30 dark:border-cyan-800">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ __('Memory (HDDs)') }}</div>
                    <div class="text-sm font-medium text-cyan-900 dark:text-cyan-100">
                      {{ $disk->name }} &times; {{ $hdd['quantity'] ?? 1 }}
                    </div>
                  </div>
                @endif
              @empty
                <div class="text-sm text-gray-400 text-center italic">{{ __('No HDDs') }}</div>
              @endforelse
            </div>

          </div>
        </div>
      @endif
    @endforeach
  </div>

</div>
