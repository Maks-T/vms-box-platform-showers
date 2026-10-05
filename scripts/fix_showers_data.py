#!/usr/bin/env python3
"""
Скрипт автоматического исправления экспортов, добавления импорта React
и замены отсутствующих иконок (ScanBox -> Box as ScanBox) во всех data_showers_*.jsx
"""
import glob
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "resources", "js", "Pages", "Products", "data")

if not os.path.exists(DATA_DIR):
    DATA_DIR = os.path.join("resources", "js", "Pages", "Products", "data")

files = glob.glob(os.path.join(DATA_DIR, "data_showers_*.jsx")) + glob.glob(
    os.path.join(DATA_DIR, "data_showers_*.js")
)

print(f"Найдено файлов для проверки: {len(files)}")

for fpath in sorted(files):
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    changed = False

    # 1. Добавляем импорт React, если он отсутствует
    if "import React" not in content and "from 'react'" not in content and 'from "react"' not in content:
        content = "import React from 'react';\n" + content
        changed = True

    # 2. Добавляем ключевое слово export к объявлению productData
    if "export const productData" not in content and "const productData =" in content:
        content = content.replace("const productData =", "export const productData =")
        changed = True

    # 3. Заменяем отсутствующую в старых версиях ScanBox на Box as ScanBox
    if "ScanBox," in content and "Box as ScanBox" not in content:
        content = content.replace("ScanBox,", "Box as ScanBox,")
        changed = True

    # 4. Добавляем export default в конец файла
    if "export default" not in content:
        content += "\nexport default productData;\n"
        changed = True

    if changed:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  [✔] Исправлен: {os.path.basename(fpath)}")
    else:
        print(f"  [-] Уже в порядке: {os.path.basename(fpath)}")

print("\nГотово! Все файлы нормализованы.")