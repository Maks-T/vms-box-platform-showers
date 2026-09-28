{{-- packages/box/valerie/industry-showers/resources/views/filament/infolists/estimate-table.blade.php --}}
@php
  $record = $getRecord() ?? ($section ?? null);
  $estimate = $estimate ?? ($record->estimate ?? []);
@endphp

@if(empty($estimate))
  <div class="text-sm text-gray-500 dark:text-gray-400 italic py-4 text-center">
    {{ __('No estimate data') }}
  </div>
@else
  <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-900">
    <table class="w-full text-left text-sm border-collapse">
      <thead class="bg-gray-50 dark:bg-gray-800/80">
      <tr>
        @foreach(($estimate[0]['value'] ?? []) as $index => $colName)
          <th class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300 {{ $index > 0 ? 'text-right' : 'text-left' }}">
            {{ $colName }}
          </th>
        @endforeach
      </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
      @foreach(array_slice($estimate, 1) as $groupItem)
        @php
          $parentCells = $groupItem['value'] ?? [];
          $children = is_array($groupItem['children'] ?? null) ? $groupItem['children'] : [];
          $hasChildren = count($children) > 0;
        @endphp

            <!-- Строка родительской группы (Материалы и комплектующие / Работы и услуги) -->
        <tr class="bg-gray-100/90 dark:bg-gray-800/70 font-bold border-t border-b border-gray-200 dark:border-gray-700">
          @foreach($parentCells as $cIndex => $cellValue)
            <td class="px-4 py-2.5 text-gray-900 dark:text-white {{ $cIndex > 0 ? 'text-right' : 'text-left' }}">
              @if($cIndex === 0)
                <span class="inline-flex items-center gap-2">
                    <span class="font-semibold text-gray-950 dark:text-gray-100">{{ $cellValue }}</span>
                    @if($hasChildren)
                    <span class="text-xs font-normal px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {{ count($children) }} поз.
                      </span>
                  @endif
                  </span>
              @else
                <span class="font-bold text-primary-600 dark:text-primary-400">{{ $cellValue }}</span>
              @endif
            </td>
          @endforeach
        </tr>

        <!-- Дочерние строки позиций сметы (стекла, петли, профили, кастомные позиции) -->
        @foreach($children as $child)
          @php
            $childCells = is_array($child['value'] ?? null) ? $child['value'] : [];
          @endphp
          <tr class="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
            @foreach($childCells as $cIndex => $cellValue)
              <td class="px-4 py-2 border-b border-gray-100 dark:border-gray-800/60 {{ $cIndex === 0 ? 'pl-8 text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-600 dark:text-gray-400' }} {{ $cIndex > 0 ? 'text-right font-mono' : 'text-left' }}">
                {{ $cellValue }}
              </td>
            @endforeach
          </tr>
        @endforeach
      @endforeach
      </tbody>
    </table>
  </div>
@endif