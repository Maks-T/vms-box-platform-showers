#!/usr/bin/env python3
"""
VMS Nicole Core: Скрипт обогащения каталога душевых ограждений изображениями.

Источники данных:
  1. Файл-источник (--source import/import_data_source.json).
  2. Физические файлы в папке (--images-dir import/export_images/products).
"""

import argparse
import json
import os
import shutil
import sys

# ANSI цвета
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"


def load_json(path):
    if not os.path.exists(path):
        print(f"{RED}[ERROR] Файл не найден: {path}{RESET}")
        sys.exit(1)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


def build_parser():
    parser = argparse.ArgumentParser(
        description="Обогащение каталога душевых ограждений относительными путями к изображениям.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "-t", "--target",
        default="import/export_data_multilingual.json",
        help="Целевой файл каталога (если не найден, берётся import/export_data.json)",
    )
    parser.add_argument(
        "-s", "--source",
        default="import/import_data_source.json",
        help="Файл-источник со ссылками на изображения",
    )
    parser.add_argument(
        "-d", "--images-dir",
        default="import/export_images/products",
        help="Физическая папка с изображениями товаров",
    )
    parser.add_argument(
        "--prefix",
        default="products/",
        help="Префикс относительного пути, записываемый в JSON",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Применить изменения и сохранить целевой файл (по умолчанию: dry-run)",
    )
    return parser


def index_physical_images(images_dir, prefix):
    """Индексирует реально существующие файлы картинок."""
    indexed = {}
    if not os.path.exists(images_dir):
        print(f"{YELLOW}[!] Папка картинок не найдена: {images_dir}{RESET}")
        return indexed

    clean_prefix = prefix.replace("\\", "/").strip("/")
    for fname in os.listdir(images_dir):
        if fname.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            rel_path = f"{clean_prefix}/{fname}"
            base, _ = os.path.splitext(fname)
            indexed[fname.lower()] = rel_path
            indexed[base.lower()] = rel_path
    return indexed


def main():
    parser = build_parser()
    args = parser.parse_args()
    dry_run = not args.apply

    # Определение путей
    target_path = os.path.abspath(args.target)
    if not os.path.exists(target_path) and args.target == "import/export_data_multilingual.json":
        fallback = os.path.abspath("import/export_data.json")
        if os.path.exists(fallback):
            target_path = fallback

    source_path = os.path.abspath(args.source) if args.source else None
    images_dir = os.path.abspath(args.images_dir)
    prefix = args.prefix.replace("\\", "/").strip("/") + "/"

    print("=" * 60)
    print(f"{BOLD}VMS-NC: Обогащение каталога душевых ограждений фото{RESET}")
    print(f"Целевой файл:  {target_path}")
    print(f"Источник:      {source_path or '—'}")
    print(f"Папка фото:    {images_dir}")
    print(f"Режим:         {GREEN + '[БОЕВОЙ / APPLY]' if not dry_run else YELLOW + '[ТЕСТОВЫЙ / DRY-RUN]'}{RESET}")
    print("=" * 60)

    target_data = load_json(target_path)
    source_data = load_json(source_path) if source_path and os.path.exists(source_path) else {}
    physical_images = index_physical_images(images_dir, prefix)
    print(f"[i] Найдено физических картинок в папке: {len(physical_images) // 2}\n")

    # 1. Построение словарей поиска из файла-источника
    prod_by_ext = {}
    prod_by_code = {}
    prod_by_slug = {}

    for p in source_data.get("products", []):
        p_prev = p.get("preview_picture")
        p_det = p.get("detail_picture") or p_prev

        if p_prev:
            if p.get("external_code"):
                prod_by_ext[p["external_code"]] = (p_prev, p_det)
            if p.get("code"):
                prod_by_code[p["code"]] = (p_prev, p_det)
            if p.get("slug"):
                prod_by_slug[p["slug"]] = (p_prev, p_det)

    # 2. Обогащение товаров и их модификаций
    matched_prods = 0
    total_prods = len(target_data.get("products", []))
    matched_vars = 0
    total_vars = 0

    for p in target_data.get("products", []):
        p_code = p.get("code", "")
        p_slug = p.get("slug", "")
        p_ext = p.get("external_code", "")

        # Стратегия 1: из source_data
        img_pair = prod_by_ext.get(p_ext) or prod_by_code.get(p_code) or prod_by_slug.get(p_slug)

        # Стратегия 2: по совпадению файла из tree.txt (напр. glass_id_1.jpg или profile_profile.jpg)
        if not img_pair:
            matched_file = physical_images.get(p_code.lower()) or physical_images.get(p_slug.lower())
            if matched_file:
                img_pair = (matched_file, matched_file)

        if img_pair:
            p["preview_picture"] = img_pair[0]
            p["detail_picture"] = img_pair[1]
            matched_prods += 1
            print(f"  • {GREEN}[Товар]{RESET} {p.get('name', {}).get('ru') or p_code} ➔ {img_pair[0]}")

        # Сопоставление для вариантов (ручки 1, ручки 2, скобы и т.д.)
        for v in p.get("variants", []):
            total_vars += 1
            v_name_ru = v.get("name", {}).get("ru", "") if isinstance(v.get("name"), dict) else ""
            var_img = None

            # Распознавание вариантов ручек из tree.txt
            if "handle_knob" in p_code:
                if "1" in v_name_ru:
                    var_img = physical_images.get("handle_knob_1")
                elif "2" in v_name_ru:
                    var_img = physical_images.get("handle_knob_2")
            elif "handle_bracket" in p_code:
                if "1" in v_name_ru:
                    var_img = physical_images.get("handle_bracket_1")
                elif "2" in v_name_ru:
                    var_img = physical_images.get("handle_bracket_2")

            if var_img:
                v["preview_picture"] = var_img
                v["detail_picture"] = var_img
                matched_vars += 1
                print(f"    - {BLUE}[SKU]{RESET} {v.get('sku')} ({v_name_ru}) ➔ {var_img}")

    # 3. Итоговая статистика
    print(f"\n📊 РЕЗУЛЬТАТЫ:")
    print(f"  • Товары (Products):     {matched_prods} из {total_prods} получили фото")
    print(f"  • Варианты (SKU):        {matched_vars} из {total_vars} получили фото")

    if dry_run:
        print(f"\n{YELLOW}[INFO] Это был тестовый прогон. Файл не изменён.{RESET}")
        print("Чтобы применить изменения и сохранить файл, запустите:")
        print(f"  py scripts/enrich_images.py -t {target_path} -s {source_path} --apply")
    else:
        backup_path = f"{target_path}.bak"
        shutil.copyfile(target_path, backup_path)
        print(f"\n{GREEN}[OK] Создан бэкап:{RESET} {backup_path}")
        save_json(target_path, target_data)
        print(f"{GREEN}[OK] Файл успешно обновлён:{RESET} {target_path}")


if __name__ == "__main__":
    main()