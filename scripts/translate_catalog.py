#!/usr/bin/env python3
"""
================================================================================
 УНИВЕРСАЛЬНЫЙ ПЕРЕВОДЧИК КАТАЛОГА VMS NICOLE CORE (JSON EXPORT/IMPORT)
================================================================================

 НАЗНАЧЕНИЕ:
   Автоматизирует процесс многоязычной локализации каталога платформы VMS.
   Находит все мультиязычные поля (формат spatie/laravel-translatable: {"ru": "..."}),
   переводит их на целевые языки и сохраняет обратно в JSON без повреждения 
   системных идентификаторов (external_code, slug, sku, code, eav).

--------------------------------------------------------------------------------
 ПОЛНЫЙ ЦИКЛ ЛОКАЛИЗАЦИИ КАТАЛОГА (WORKFLOW):
--------------------------------------------------------------------------------
 1. ЭКСПОРТ ДАННЫХ ИЗ LARAVEL:
    Выгрузите каталог без тяжелых описаний для экономии токенов и ускорения:
      php artisan vms:export --no-descriptions

 2. ПРЕДВАРИТЕЛЬНЫЙ АУДИТ (DRY-RUN):
    Проверьте, сколько уникальных фраз будет переведено и сколько займет времени:
      py scripts/translate_catalog.py -i import/export_data.json -t en --dry-run

 3. ЗАПУСК ПЕРЕВОДА:
    Выполните перевод (по умолчанию результат сохранится в export_data_multilingual.json):
      py scripts/translate_catalog.py -i import/export_data.json -f ru -t en --delay-min 0.3 --delay-max 0.8

 4. РЕГИСТРАЦИЯ ЯЗЫКА В LARAVEL:
    а) В файле .env добавьте язык:
         VMS_LOCALES=ru,en
    б) В app/Providers/Filament/AdminPanelProvider.php укажите локаль:
         SpatieTranslatablePlugin::make()->defaultLocales(['ru', 'en']),
         TranslatableFieldsPlugin::make()->supportedLocales(['ru', 'en']),

 5. ИМПОРТ ПЕРЕВЕДЕННЫХ ДАННЫХ В БАЗУ:
      php artisan vms:import --data=import/export_data_multilingual.json

--------------------------------------------------------------------------------
 ТИПОВЫЕ СЦЕНАРИИ ИСПОЛЬЗОВАНИЯ:
--------------------------------------------------------------------------------
 • Быстрый перевод на английский с оптимизированной паузой:
     py scripts/translate_catalog.py -i import/export_data.json -f ru -t en --delay-min 0.3 --delay-max 0.8

 • Перевод сразу на несколько языков (английский, казахский, немецкий):
     py scripts/translate_catalog.py -i import/export_data.json -f ru -t en,kk,de

 • Доперевод на 3-й язык позже (НЕ переводит заново уже существующие языки):
     py scripts/translate_catalog.py -i import/export_data_multilingual.json -t de --in-place

 • Принудительный переперевод (перезаписать существующие переводы):
     py scripts/translate_catalog.py -i import/export_data.json -t en --force

 • Исключение отдельных секций каталога из перевода:
     py scripts/translate_catalog.py -i import/export_data.json -t en --exclude-sections currencies,price_groups

 • Сохранение результата сразу в целевой файл для импорта:
     py scripts/translate_catalog.py -i import/export_data.json -t en -o import/import_data.json

--------------------------------------------------------------------------------
 СПРАВОЧНИК ПАРАМЕТРОВ CLI:
--------------------------------------------------------------------------------
  -i, --input            Путь к входному файлу JSON (по умолчанию: import/export_data.json).
  -o, --output           Путь для сохранения (по умолчанию: <имя>_multilingual.json).
  --in-place             Перезаписать входной файл на месте без создания копии.
  -f, --from-lang        Базовый язык оригинала (по умолчанию: ru).
  -t, --to-langs         Целевые языки через запятую (по умолчанию: en).
  --force                Принудительно обновить перевод, даже если он уже есть.
  --dry-run              Режим аудита без сетевых запросов к API.
  --exclude-keys         Ключи словарей для пропуска (по умолчанию защищены: sku, code, etc).
  --exclude-sections     Корневые секции JSON для пропуска (currencies, pipelines, etc).
  --delay-min            Мин. пауза между запросами в сек (по умолчанию: 1.0, оптимум: 0.3).
  --delay-max            Макс. пауза между запросами в сек (по умолчанию: 2.5, оптимум: 0.8).
  --concurrency          Число параллельных потоков (по умолчанию: 2).
  --translator           Движок перевода библиотеки translators (google, bing, yandex).

--------------------------------------------------------------------------------
 ОСОБЕННОСТИ И БЕЗОПАСНОСТЬ:
--------------------------------------------------------------------------------
  ✔ Умная дедупликация: одинаковые цвета ("Хром"), толщины ("8 мм") и свойства 
    запрашиваются у API ровно 1 раз и мгновенно тиражируются по всему JSON из кэша.
  ✔ Безопасное прерывание: при нажатии Ctrl+C процесс остановится, а всё, что успело
    перевестись к этой секунде, автоматически запишется в выходной файл.
  ✔ Защита системных полей: артикулы (SKU), слоги (slug), UUID (external_code) 
    и параметры калькулятора изолированы от изменений.
================================================================================
"""

import argparse
import asyncio
from dataclasses import dataclass, field
import datetime
from functools import partial
import json
import os
import random
import sys
import time

def ensure_translators_installed():
    """Проверяет наличие библиотеки translators перед запуском сетевых запросов."""
    try:
        import translators
    except ImportError:
        print(f"\n\033[91m[!] Для выполнения перевода требуется библиотека 'translators'.\033[0m")
        print(f"Установите её: \033[93mpip install translators\033[0m\n")
        sys.exit(1)

# Допустимые коды языков (ISO 639-1) для предотвращения путаницы с полями 'sku', 'id' и т.д.
VALID_LOCALES = {
    "ru", "en", "kk", "uz", "ky", "tg", "tk", "az", "hy", "ka",
    "de", "fr", "es", "it", "pt", "tr", "zh", "ja", "ko", "ar",
    "pl", "uk", "be", "cs", "bg", "ro", "hu", "sr", "hr", "sk"
}

# ANSI цвета для красивого терминального вывода
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RED = "\033[91m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"


@dataclass
class Config:
    input_file: str
    output_file: str
    map_file: str
    mode: str
    from_lang: str
    to_langs: list[str]
    force: bool
    exclude_keys: set[str]
    exclude_sections: set[str]
    dry_run: bool
    translator: str
    concurrency: int
    delay_min: float
    delay_max: float


class TranslationMapManager:
    """Управляет персистентным файлом карты переводов (translation map / glossary)."""

    def __init__(self, map_file: str):
        self.map_file = map_file
        self.data: dict[str, dict[str, str]] = {}
        self.load()

    def load(self) -> dict[str, dict[str, str]]:
        """Загружает существующую карту с диска или инициализирует пустую."""
        if os.path.exists(self.map_file):
            try:
                with open(self.map_file, "r", encoding="utf-8") as f:
                    self.data = json.load(f)
            except Exception as e:
                print(f"{YELLOW}[!] Предупреждение: Не удалось прочитать '{self.map_file}': {e}. Создаём новую карту.{RESET}")
                self.data = {}
        else:
            self.data = {}
        return self.data

    def save(self):
        """Сохраняет текущее состояние карты на диск."""
        os.makedirs(os.path.dirname(os.path.abspath(self.map_file)), exist_ok=True)
        with open(self.map_file, "w", encoding="utf-8") as f:
            json.dump(self.data, f, ensure_ascii=False, indent=4)

    def sync_phrases(self, phrases: set[str], target_langs: list[str]) -> tuple[int, int]:
        """Синхронизирует фразы каталога с картой. Возвращает (всего_в_карте, новых_добавлено)."""
        new_count = 0
        for phrase in sorted(phrases):
            clean_p = phrase.strip()
            if not clean_p:
                continue

            if clean_p not in self.data:
                self.data[clean_p] = {lang: "" for lang in target_langs}
                new_count += 1
            else:
                for lang in target_langs:
                    if lang not in self.data[clean_p]:
                        self.data[clean_p][lang] = ""

        if new_count > 0:
            self.save()
        return len(self.data), new_count

    def get_pending_tasks(self, target_langs: list[str], force: bool = False) -> list[tuple[str, str]]:
        """Возвращает список задач (phrase, lang), требующих перевода."""
        tasks = []
        for phrase, translations in self.data.items():
            for lang in target_langs:
                translated_val = translations.get(lang, "").strip()
                if force or not translated_val:
                    tasks.append((phrase, lang))
        return tasks

    def set_translation(self, phrase: str, lang: str, text: str):
        """Сохраняет перевод одной фразы и сразу сбрасывает на диск."""
        clean_p = phrase.strip()
        if clean_p not in self.data:
            self.data[clean_p] = {}
        self.data[clean_p][lang] = text
        self.save()

    def get_translation(self, phrase: str, lang: str) -> str | None:
        """Возвращает готовый перевод для фразы или None."""
        clean_p = phrase.strip()
        val = self.data.get(clean_p, {}).get(lang)
        if val and isinstance(val, str) and val.strip():
            return val.strip()
        return None


class TranslationEngine:
    def __init__(self, config: Config):
        self.cfg = config
        self.semaphore = asyncio.Semaphore(config.concurrency)
        # In-memory кэш уникальных переводов: (source_text, target_lang) -> translated_text
        self.cache: dict[tuple[str, str], str] = {}
        self.stats = {"requests_made": 0, "cache_hits": 0, "errors": 0}

    def _sync_fetch(self, text: str, target_lang: str) -> tuple[str, float]:
        """Синхронный сетевой запрос к API переводчика с плавающей паузой."""
        sleep_time = random.uniform(self.cfg.delay_min, self.cfg.delay_max)
        time.sleep(sleep_time)

        try:
            import translators as ts
            res = ts.translate_text(
                query_text=text,
                translator=self.cfg.translator,
                from_language=self.cfg.from_lang,
                to_language=target_lang,
                timeout=8.0,
            )
            return str(res).strip(), sleep_time
        except Exception as e:
            print(
                f"  {RED}[!] Ошибка перевода '{text[:30]}...' на '{target_lang}': {e}{RESET}"
            )
            self.stats["errors"] += 1
            return text, sleep_time

    async def translate(
        self, text: str, target_lang: str, loop: asyncio.AbstractEventLoop
    ) -> tuple[str, float]:
        """Асинхронный метод с дедупликацией через кэш и семафор."""
        clean_text = text.strip()
        if not clean_text:
            return "", 0.0

        cache_key = (clean_text, target_lang)
        if cache_key in self.cache:
            self.stats["cache_hits"] += 1
            return self.cache[cache_key], 0.0

        async with self.semaphore:
            # Двойная проверка на случай, если параллельный запрос уже перевёл эту фразу
            if cache_key in self.cache:
                self.stats["cache_hits"] += 1
                return self.cache[cache_key], 0.0

            func = partial(self._sync_fetch, clean_text, target_lang)
            translated, sleep_time = await loop.run_in_executor(None, func)
            self.cache[cache_key] = translated
            self.stats["requests_made"] += 1
            return translated, sleep_time


def parse_comma_separated(value: str) -> list[str]:
    """Разбивает переданную через запятую строку на чистый список."""
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def format_duration(seconds: float) -> str:
    """Преобразует секунды в компактный читаемый вид (напр. '02m 15s' или '01h 05m 20s')."""
    total_sec = max(0, int(seconds))
    hours = total_sec // 3600
    minutes = (total_sec % 3600) // 60
    secs = total_sec % 60

    if hours > 0:
        return f"{hours:02d}h {minutes:02d}m {secs:02d}s"
    return f"{minutes:02d}m {secs:02d}s"


def parse_arguments() -> Config:
    parser = argparse.ArgumentParser(
        description="Универсальный переводчик каталога VMS Nicole Core (JSON экспорт/импорт).",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )

    parser.add_argument(
        "--mode",
        choices=["all", "extract", "translate", "apply"],
        default="all",
        help="Режим работы: extract (собрать карту), translate (перевести карту), apply (применить карту к JSON), all (полный цикл)",
    )
    parser.add_argument(
        "-m",
        "--map-file",
        default="import/translation_map.json",
        help="Путь к файлу словаря-карты переводов (translation_map.json)",
    )
    parser.add_argument(
        "-i",
        "--input",
        default="import/export_data.json",
        help="Путь к исходному файлу экспорта",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=None,
        help="Путь для сохранения результата (по умолчанию: <имя>_multilingual.json)",
    )
    parser.add_argument(
        "--in-place",
        action="store_true",
        help="Перезаписать исходный файл без создания копии",
    )
    parser.add_argument(
        "-f",
        "--from-lang",
        default="ru",
        help="Исходный (базовый) язык в объектах локализации (по умолчанию: ru)",
    )
    parser.add_argument(
        "-t",
        "--to-langs",
        default="en",
        help="Целевой язык или список языков через запятую (напр.: en или en,kk,de)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Принудительно перевести заново даже те поля, где перевод уже существует",
    )
    parser.add_argument(
        "--exclude-keys",
        default="symbol_native,currency,catalog_type,slug,sku,code,external_code",
        help="Ключи словарей, которые никогда не должны переводиться",
    )
    parser.add_argument(
        "--exclude-sections",
        default="",
        help="Корневые секции JSON для полного пропуска (напр.: currencies,pipelines)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Режим аудита: просканировать структуру, показать объем уникальных фраз без обращения к API",
    )
    parser.add_argument(
        "--translator",
        default="google",
        help="Бэкенд переводчика в библиотеке translators (google, bing, yandex)",
    )
    parser.add_argument(
        "--concurrency",
        type=int,
        default=2,
        help="Количество одновременных запросов к API",
    )
    parser.add_argument(
        "--delay-min",
        type=float,
        default=1.0,
        help="Минимальная пауза между запросами (сек)",
    )
    parser.add_argument(
        "--delay-max",
        type=float,
        default=2.5,
        help="Максимальная пауза между запросами (сек)",
    )

    args = parser.parse_args()

    # Разрешение пути сохранения
    input_path = os.path.abspath(args.input)
    if args.in_place:
        output_path = input_path
    elif args.output:
        output_path = os.path.abspath(args.output)
    else:
        dir_name, base_name = os.path.split(input_path)
        name, ext = os.path.splitext(base_name)
        output_path = os.path.join(dir_name, f"{name}_multilingual{ext}")

    return Config(
        input_file=input_path,
        output_file=output_path,
        map_file=os.path.abspath(args.map_file),
        mode=args.mode,
        from_lang=args.from_lang,
        to_langs=parse_comma_separated(args.to_langs),
        force=args.force,
        exclude_keys=set(parse_comma_separated(args.exclude_keys)),
        exclude_sections=set(parse_comma_separated(args.exclude_sections)),
        dry_run=args.dry_run,
        translator=args.translator,
        concurrency=max(1, args.concurrency),
        delay_min=max(0.1, args.delay_min),
        delay_max=max(args.delay_min, args.delay_max),
    )


def detect_base_language(data: dict | list) -> str:
    """Анализирует JSON и определяет, какой язык чаще всего используется как исходный."""
    lang_counts: dict[str, int] = {}

    def scan(node):
        if isinstance(node, dict):
            for k, v in node.items():
                # Учитываем только валидные языковые коды из белого списка
                if isinstance(k, str) and k in VALID_LOCALES and isinstance(v, str) and v.strip():
                    lang_counts[k] = lang_counts.get(k, 0) + 1
            for v in node.values():
                scan(v)
        elif isinstance(node, list):
            for item in node:
                scan(item)

    scan(data)
    if not lang_counts:
        return "ru"
    # Возвращаем язык с максимальным количеством заполненных строк
    return max(lang_counts, key=lang_counts.get)


def collect_unique_phrases(data: dict | list, cfg: Config) -> set[str]:
    """Рекурсивно обходит структуру JSON и находит все уникальные исходные фразы."""
    phrases = set()

    def walk(node, current_key=None, current_section=None):
        if current_section and current_section in cfg.exclude_sections:
            return
        if current_key and current_key in cfg.exclude_keys:
            return

        if isinstance(node, dict):
            if cfg.from_lang in node and isinstance(node[cfg.from_lang], str):
                source_text = node[cfg.from_lang].strip()
                if source_text:
                    phrases.add(source_text)
                return

            for k, v in node.items():
                section = k if current_section is None and isinstance(data, dict) else current_section
                walk(v, current_key=k, current_section=section)

        elif isinstance(node, list):
            for item in node:
                walk(item, current_key=current_key, current_section=current_section)

    walk(data)
    return phrases


def apply_map_to_json(data: dict | list, map_manager: TranslationMapManager, cfg: Config) -> tuple[int, int]:
    """Применяет переводы из карты к JSON структуре каталога. Возвращает (применено, пропущено_без_перевода)."""
    applied = 0
    missing = 0

    def walk(node, current_key=None, current_section=None):
        nonlocal applied, missing
        if current_section and current_section in cfg.exclude_sections:
            return
        if current_key and current_key in cfg.exclude_keys:
            return

        if isinstance(node, dict):
            if cfg.from_lang in node and isinstance(node[cfg.from_lang], str):
                source_text = node[cfg.from_lang].strip()
                if source_text:
                    for lang in cfg.to_langs:
                        translated = map_manager.get_translation(source_text, lang)
                        if translated:
                            node[lang] = translated
                            applied += 1
                        else:
                            missing += 1
                return

            for k, v in node.items():
                section = k if current_section is None and isinstance(data, dict) else current_section
                walk(v, current_key=k, current_section=section)

        elif isinstance(node, list):
            for item in node:
                walk(item, current_key=current_key, current_section=current_section)

    walk(data)
    return applied, missing


async def async_main():
    cfg = parse_arguments()

    if not os.path.exists(cfg.input_file):
        print(f"{RED}[!] Ошибка: Файл '{cfg.input_file}' не найден!{RESET}")
        sys.exit(1)

    with open(cfg.input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Если базовый язык не задан явно флагом -f, определяем его автоматически
    if not cfg.from_lang:
        cfg.from_lang = detect_base_language(data)

    print(f"\n{BOLD}══════════════════════════════════════════════════════════{RESET}")
    print(f"{BOLD}🚀 VMS Nicole Core — Каталожный Переводчик                 {RESET}")
    print(f"{BOLD}══════════════════════════════════════════════════════════{RESET}")
    print(f"Каталог:   {cfg.input_file}")
    print(f"Карта:     {cfg.map_file}")
    print(f"Режим:     {BOLD}{cfg.mode.upper()}{RESET}")
    print(f"Языки:     {cfg.from_lang} ➔ {', '.join(cfg.to_langs)}")

    # Сканирование структуры
    phrases = collect_unique_phrases(data, cfg)
    map_manager = TranslationMapManager(cfg.map_file)

    # -------------------------------------------------------------
    # ЭТАП 1: Синхронизация с картой (EXTRACT)
    # -------------------------------------------------------------
    total_in_map, new_added = map_manager.sync_phrases(phrases, cfg.to_langs)
    pending_tasks = map_manager.get_pending_tasks(cfg.to_langs, cfg.force)

    print(f"\n{BLUE}Статистика карты переводов:{RESET}")
    print(f"  • Уникальных фраз в каталоге: {len(phrases)}")
    print(f"  • Всего фраз в карте на диске: {total_in_map} (новых добавлено: {new_added})")
    print(f"  • Требует перевода:           {len(pending_tasks)} позиций")

    if cfg.mode == "extract":
        print(f"\n{GREEN}✔ [EXTRACT] Карта успешно обновлена на диске:{RESET} {cfg.map_file}")
        print(f"Вы можете перевести этот файл вручную/через LLM или запустить с флагом --mode=translate.\n")
        return

    # -------------------------------------------------------------
    # ЭТАП 2: Перевод незаполненных позиций карты (TRANSLATE)
    # -------------------------------------------------------------
    if cfg.mode in ["translate", "all"]:
        if cfg.dry_run:
            print(f"\n{CYAN}{BOLD}--- РЕЖИМ АУДИТА (--dry-run) ---{RESET}")
            print(f"Задач к переводу через API: {len(pending_tasks)}")
            avg_delay = (cfg.delay_min + cfg.delay_max) / 2
            est_sec = int(len(pending_tasks) * avg_delay)
            print(f"Ориентировочное время: ~{est_sec // 60}м {est_sec % 60}с\n")
            return

        if len(pending_tasks) == 0:
            print(f"\n{GREEN}✔ Все фразы в карте уже переведены. Переходим к сборке каталога...{RESET}")
        else:
            ensure_translators_installed()

            start_wall_time = datetime.datetime.now().strftime("%H:%M:%S")
            start_time = time.time()

            print(f"\nСтарт перевода в {BOLD}{start_wall_time}{RESET}. Нажмите {YELLOW}Ctrl+C{RESET} в любой момент для паузы...\n")

            engine = TranslationEngine(cfg)
            loop = asyncio.get_running_loop()
            total_tasks = len(pending_tasks)

            try:
                for idx, (text, lang) in enumerate(pending_tasks, 1):
                    translated, pause_duration = await engine.translate(text, lang, loop)
                    map_manager.set_translation(text, lang, translated)

                    elapsed = time.time() - start_time
                    avg_per_item = elapsed / idx
                    remaining_tasks = total_tasks - idx
                    eta = remaining_tasks * avg_per_item
                    pct = (idx / total_tasks) * 100

                    elapsed_str = format_duration(elapsed)
                    eta_str = format_duration(eta)
                    pause_str = f"{pause_duration:.1f}с" if pause_duration > 0 else "кэш"

                    short_src = text.replace("\n", " ")[:30]
                    short_res = translated.replace("\n", " ")[:30]
                    print(
                        f"[{idx:3d}/{total_tasks:3d} | {pct:4.1f}% | "
                        f"Прошло: {CYAN}{elapsed_str}{RESET} | "
                        f"Осталось: ~{YELLOW}{eta_str}{RESET} | "
                        f"Пауза: {pause_str}] "
                        f"[{lang}] {short_src} ➔ {GREEN}{short_res}{RESET}"
                    )

            except KeyboardInterrupt:
                print(f"\n\n{YELLOW}[!] Процесс приостановлен. Все переведённые фразы сохранены в карте:{RESET} {cfg.map_file}")
                if cfg.mode == "translate":
                    return

            except Exception as e:
                print(f"\n\n{RED}[!] Ошибка перевода: {e}{RESET}")
                if cfg.mode == "translate":
                    return

            if cfg.mode == "translate":
                print(f"\n{GREEN}✔ [TRANSLATE] Перевод карты завершён и сохранён:{RESET} {cfg.map_file}\n")
                return

    # -------------------------------------------------------------
    # ЭТАП 3: Применение карты к каталогу (APPLY)
    # -------------------------------------------------------------
    if cfg.mode in ["apply", "all"]:
        print(f"\n{BLUE}Применение карты переводов к JSON каталогу...{RESET}")
        applied, missing = apply_map_to_json(data, map_manager, cfg)

        os.makedirs(os.path.dirname(os.path.abspath(cfg.output_file)), exist_ok=True)
        with open(cfg.output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(f"{GREEN}✔ [APPLY] Мультиязычный каталог успешно собран и сохранён:{RESET}")
        print(f"  {BOLD}{cfg.output_file}{RESET}")
        print(f"  • Успешно применено переводов: {applied}")
        if missing > 0:
            print(f"  • {YELLOW}Пропущено без перевода (не заполнено в карте): {missing}{RESET}")
        print(f"{BOLD}══════════════════════════════════════════════════════════{RESET}\n")


def main():
    asyncio.run(async_main())


if __name__ == "__main__":
    main()