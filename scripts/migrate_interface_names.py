#!/usr/bin/env python3
"""
Скрипт миграции скалярного EAV-атрибута (по умолчанию 'interface_name')
в мультиязычное системное свойство модификации/товара name: {"ru": "..."}.
"""

import argparse
import json
import os
import sys

# ANSI цвета
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Перенос значений из eav[attribute] в мультиязычное поле name: {lang: value}.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "-i", "--input",
        default="import/export_data.json",
        help="Путь к исходному файлу каталога",
    )
    parser.add_argument(
        "-o", "--output",
        default=None,
        help="Путь для сохранения результата (по умолчанию перезаписывает входной файл)",
    )
    parser.add_argument(
        "-a", "--attribute",
        default="interface_name",
        help="Имя EAV-атрибута, который нужно перенести в поле name",
    )
    parser.add_argument(
        "-l", "--lang",
        default="ru",
        help="Код языка, под которым сохранится значение в объекте name",
    )
    parser.add_argument(
        "--keep-eav",
        action="store_true",
        help="Не удалять атрибут из eav (по умолчанию удаляется во избежание дублирования)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Режим симуляции: показать список изменений без записи на диск",
    )
    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()

    input_path = os.path.abspath(args.input)
    output_path = os.path.abspath(args.output) if args.output else input_path

    print(f"\n{BOLD}══════════════════════════════════════════════════════════{RESET}")
    print(f"{BOLD}🔄 Миграция EAV-атрибута '{args.attribute}' ➔ variant.name['{args.lang}']{RESET}")
    print(f"{BOLD}══════════════════════════════════════════════════════════{RESET}")
    print(f"Входной файл:  {input_path}")
    print(f"Выходной файл: {output_path}")
    print(f"Режим:         {'[DRY-RUN] Симуляция' if args.dry_run else 'Реальная запись'}\n")

    if not os.path.exists(input_path):
        print(f"{RED}[!] Ошибка: Файл '{input_path}' не найден!{RESET}")
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    products = data.get("products", [])
    if not isinstance(products, list):
        print(f"{RED}[!] Ошибка: В JSON не найдена секция 'products'!{RESET}")
        sys.exit(1)

    migrated_count = 0

    for prod in products:
        prod_name = prod.get("name", {}).get(args.lang) or prod.get("code") or "Товар"

        # 1. Проверяем модификации товара (SKU)
        variants = prod.get("variants", [])
        if isinstance(variants, list):
            for variant in variants:
                eav = variant.get("eav")
                if isinstance(eav, dict) and args.attribute in eav:
                    val = eav[args.attribute]
                    if isinstance(val, str) and val.strip():
                        clean_val = val.strip()

                        # Обеспечиваем, что name является словарём
                        current_name = variant.get("name")
                        if not isinstance(current_name, dict):
                            variant["name"] = {}

                        variant["name"][args.lang] = clean_val

                        if not args.keep_eav:
                            del eav[args.attribute]

                        sku = variant.get("sku", "Без SKU")
                        print(f"  • {BLUE}[{sku}]{RESET} {prod_name} ➔ name['{args.lang}'] = {GREEN}\"{clean_val}\"{RESET}")
                        migrated_count += 1

        # 2. Проверяем сам базовый товар (на случай, если атрибут висит на нём)
        prod_eav = prod.get("eav")
        if isinstance(prod_eav, dict) and args.attribute in prod_eav:
            val = prod_eav[args.attribute]
            if isinstance(val, str) and val.strip():
                clean_val = val.strip()
                if not isinstance(prod.get("name"), dict):
                    prod["name"] = {}
                prod["name"][args.lang] = clean_val
                if not args.keep_eav:
                    del prod_eav[args.attribute]
                print(f"  • {BLUE}[Товар]{RESET} {prod.get('code')} ➔ name['{args.lang}'] = {GREEN}\"{clean_val}\"{RESET}")
                migrated_count += 1

    print("-" * 58)
    print(f"Всего перенесено значений: {BOLD}{migrated_count}{RESET}")

    if args.dry_run:
        print(f"\n{YELLOW}Файл не был изменён (режим --dry-run).{RESET}\n")
        return

    if migrated_count > 0:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"\n{GREEN}✔ Результат успешно сохранён в:{RESET}\n  {output_path}\n")
    else:
        print(f"\n{YELLOW}Совпадений по атрибуту '{args.attribute}' не обнаружено. Файл не перезаписывался.{RESET}\n")


if __name__ == "__main__":
    main()