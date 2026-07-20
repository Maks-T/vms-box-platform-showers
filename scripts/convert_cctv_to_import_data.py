#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import re

# ==============================================================================
# НАСТРОЙКИ КОНВЕРТАЦИИ
# ==============================================================================
RENAME_IMAGES_TO_WEBP = True  # Если True, расширения всех изображений будут заменены на .webp

# Константный список валют для инъекции
STATIC_CURRENCIES = [
    {
      "code": "BYN",
      "symbol": "Br",
      "symbol_native": {
        "ru": "руб.",
        "en": "Br"
      },
      "name": {
        "ru": "Белорусский рубль",
        "en": "Belarusian Ruble"
      },
      "rate": 1.0,
      "is_default": True,
      "is_active": True
    },
    {
      "code": "RUB",
      "symbol": "₽",
      "symbol_native": {
        "ru": "руб.",
        "en": "rub."
      },
      "name": {
        "ru": "Российский рубль",
        "en": "Russian Ruble"
      },
      "rate": 0.0339,
      "is_default": False,
      "is_active": True
    },
    {
      "code": "USD",
      "symbol": "$",
      "symbol_native": {
        "ru": "долл.",
        "en": "$"
      },
      "name": {
        "ru": "Доллар США",
        "en": "US Dollar"
      },
      "rate": 3.2,
      "is_default": False,
      "is_active": True
    }
]

# Константный список типов цен для инъекции
STATIC_PRICE_TYPES = [
    {
      "slug": "retail",
      "currency_code": "BYN",
      "is_default": True,
      "name": {
        "ru": "Цена продажи",
        "en": "Retail"
      },
      "description": {
        "ru": "Базовая розничная цена в системе",
        "en": "Base retail price in the system"
      }
    }
]


def normalize_image_path(photo_path):
    """
    Приводит расширение имени файла изображения к .webp, если включена опция
    """
    if not photo_path:
        return None
    if RENAME_IMAGES_TO_WEBP:
        base_path, _ = os.path.splitext(photo_path)
        return f"{base_path}.webp"
    return photo_path


def clean_link(val):
    """Удаляет из строк префиксы связей link-id: и link-value:"""
    if isinstance(val, str):
        return re.sub(r'^link-(id|value):', '', val)
    return val


def clean_obj_links(obj):
    """Рекурсивный обход и очистка структуры от линк-префиксов"""
    if isinstance(obj, dict):
        return {k: clean_obj_links(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_obj_links(item) for item in obj]
    else:
        return clean_link(obj)


def convert_hours_to_days(hours_str):
    """Преобразует строку часов хранения в целые дни"""
    try:
        return str(int(hours_str) // 24)
    except (ValueError, TypeError):
        return hours_str


def resolve_unit_code(unit_ref):
    """Сопоставляет старые UUID единиц измерения с символьными кодами коробки"""
    if not unit_ref:
        return "pcs"
    clean_ref = clean_link(unit_ref)
    mapping = {
        'rdJ-ydPuPc3kSET5hc3mu': 'pcs',  # Штуки
        'K34ZJjw32oCMNf0Z9FBBW': 'm',    # Метры
        'ffUJtqQDzsiEleWcE7qCQ': 'set',  # Комплекты
        'G_1UsHHFZQ9P67676WOVL': 'srv'   # Услуги
    }
    return mapping.get(clean_ref, 'pcs')


def ensure_multilingual(name_dict, fallback_key="ru"):
    """Гарантирует заполнение мультиязычной структуры для всех системных локалей"""
    if not isinstance(name_dict, dict):
        name_str = str(name_dict) if name_dict is not None else ""
        return {"ru": name_str, "en": name_str}

    result = name_dict.copy()
    locales = ["ru", "en"]
    fallback_val = result.get(fallback_key) or next(iter(result.values()), "")
    for loc in locales:
        if loc not in result or not result[loc]:
            result[loc] = fallback_val
    return result


def transform_to_import_format(source_path, target_path):
    if not os.path.exists(source_path):
        print(f"Ошибка: Исходный файл {source_path} не найден.")
        return

    with open(source_path, 'r', encoding='utf-8') as f:
        source_data = json.load(f)

    # 1. Рекурсивное удаление link-префиксов
    clean_data = clean_obj_links(source_data)

    import_data = {
        "currencies": STATIC_CURRENCIES,
        "price_types": STATIC_PRICE_TYPES,

        "languages": ["ru", "en"],
        "families": [
            {
                "external_code": "fam_cctv",
                "code": "cctv",
                "name": {"ru": "Видеонаблюдение", "en": "Video Surveillance"}
            },
            {
                "external_code": "fam_acms",
                "code": "acm",  # singular во избежание бага Inflector в Laravel
                "name": {"ru": "Контроль доступа (СКУД)", "en": "Access Control"}
            },
            {
                "external_code": "fam_service",
                "code": "service",
                "name": {"ru": "Услуги", "en": "Services"}
            }
        ],
        "types": [
            {
                "external_code": "type_camera",
                "family_external_code": "fam_cctv",
                "code": "camera",
                "name": {"ru": "IP Камера", "en": "IP Camera"},
                "attached_attributes": [
                    {"code": "camera_resolution", "is_variant_only": False},
                    {"code": "camera_type", "is_variant_only": False},
                    {"code": "camera_groups", "is_variant_only": False}
                ]
            },
            {
                "external_code": "type_recorder",
                "family_external_code": "fam_cctv",
                "code": "recorder",
                "name": {"ru": "Видеорегистратор", "en": "Video Recorder"},
                "attached_attributes": [
                    {"code": "camera_groups", "is_variant_only": False},
                    {"code": "channels_count", "is_variant_only": False}
                ]
            },
            {
                "external_code": "type_switch",
                "family_external_code": "fam_cctv",
                "code": "switch",
                "name": {"ru": "PoE Коммутатор", "en": "PoE Switch"},
                "attached_attributes": [
                    {"code": "poe_ports", "is_variant_only": False}
                ]
            },
            {
                "external_code": "type_storage",
                "family_external_code": "fam_cctv",
                "code": "storage",
                "name": {"ru": "Жесткий диск", "en": "HDD Storage"},
                "attached_attributes": [
                    {"code": "storage_capacity", "is_variant_only": False}
                ]
            },
            {
                "external_code": "type_material",
                "family_external_code": "fam_cctv",
                "code": "material",
                "name": {"ru": "Материалы для монтажа", "en": "Materials"},
                "attached_attributes": [
                    {"code": "material_type", "is_variant_only": False}
                ]
            },
            {
                "external_code": "type_acms_equipment",
                "family_external_code": "fam_acms",
                "code": "acms_equipment",
                "name": {"ru": "Оборудование СКУД", "en": "ACMS Equipment"},
                "attached_attributes": [
                    {"code": "acms_equipment_type", "is_variant_only": False},
                    {"code": "acms_equipment_groups", "is_variant_only": False}
                ]
            },
            {
                "external_code": "type_service",
                "family_external_code": "fam_service",
                "code": "service",
                "name": {"ru": "Услуга", "en": "Service"},
                "attached_attributes": []
            }
        ],
        "categories": [],
        "attributes": [],
        "price_groups": [],
        "products": [],
        "pipelines": [],
        "binding_rules": [],
        "rooms": []
    }

    # Сборка категорий
    category_map = {
        "cameras": {
            "slug": "cctv-cameras",
            "name": {"ru": "Камеры видеонаблюдения", "en": "Video Cameras"}
        },
        "recorders": {
            "slug": "cctv-recorders",
            "name": {"ru": "Видеорегистраторы", "en": "Video Recorders"}
        },
        "switches": {
            "slug": "cctv-switches",
            "name": {"ru": "Сетевое оборудование", "en": "Networking"}
        },
        "storage": {
            "slug": "cctv-storage",
            "name": {"ru": "Накопители (HDD/SSD)", "en": "Storage Drives"}
        },
        "materials": {
            "slug": "cctv-materials",
            "name": {"ru": "Материалы для монтажа", "en": "Installation Materials"}
        },
        "acmsMaterials": {
            "slug": "acms-materials",
            "name": {"ru": "Материалы СКУД", "en": "ACS Materials"}
        },
        "services": {
            "slug": "cctv-installation-services",
            "name": {"ru": "Услуги монтажа", "en": "Installation Services"}
        },
        "acmsServices": {
            "slug": "acms-installation-services",
            "name": {"ru": "Услуги настройки СКУД", "en": "ACS Services"}
        },
        "acmsEquipment": {
            "slug": "acms-equipment",
            "name": {"ru": "Оборудование СКУД", "en": "Access Control Systems"}
        },
    }

    for key, info in category_map.items():
        import_data["categories"].append({
            "external_code": f"cat_{key}",
            "slug": info["slug"],
            "name": info["name"],
            "parent_external_code": None
        })

    # Сборка характеристик с ДЕДУПЛИКАЦИЕЙ ОПЦИЙ
    if 'lists' in clean_data:
        for lst in clean_data['lists']:
            if lst['id'] in ['units', 'error-messages', 'payment-controls', 'active-controls', 'tooltips']:
                continue

            attr_code = lst['id'].replace('-', '_')

            # Автоматически определяем тип параметра для схемы атрибута
            option_param_type = "numeric" if lst['id'] in ['storage-time', 'camera-resolution'] else "string"

            attribute = {
                "external_code": f"attr_{attr_code}",
                "code": attr_code,
                "name": lst['name'],
                "type": "dictionary",
                "option_param_type": option_param_type,
                "is_multiple": False,
                "options": []
            }

            seen_options = set()

            for option in lst['list']:
                opt_id = option['id']

                if opt_id in seen_options:
                    continue
                seen_options.add(opt_id)

                opt_val = option['value']
                value_translations = option['name']

                if lst['id'] == 'storage-time':
                    days = convert_hours_to_days(opt_val)
                    value_translations = {
                        "ru": f"{days} суток",
                        "en": f"{days} days"
                    }

                opt_meta = {}
                if 'cameraCalcName' in option:
                    opt_meta['calc_name'] = option['cameraCalcName']

                # Заменили "extra_value" на "param"
                attribute["options"].append({
                    "external_code": opt_id,
                    "slug": str(opt_val),
                    "value": value_translations,
                    "param": float(opt_val) if opt_val.isdigit() else None,
                    "meta": opt_meta if opt_meta else None
                })

            import_data["attributes"].append(attribute)

    # Добавляем числовые спецификации
    numeric_attributes = [
        {"code": "storage_capacity", "ru": "Емкость (ГБ)", "en": "Capacity (GB)"},
        {"code": "channels_count", "ru": "Количество каналов", "en": "Channels"},
        {"code": "poe_ports", "ru": "PoE порты", "en": "PoE Ports"}
    ]
    for attr in numeric_attributes:
        import_data["attributes"].append({
            "external_code": f"attr_{attr['code']}",
            "code": attr['code'],
            "name": {"ru": attr['ru'], "en": attr['en']},
            "type": "numeric",
            "is_multiple": False,
            "options": []
        })

    # Сборка каталога товаров и услуг
    entity_map = {
        'cameras': {'type': 'camera', 'cat': 'cat_cameras'},
        'recorders': {'type': 'recorder', 'cat': 'cat_recorders'},
        'switches': {'type': 'switch', 'cat': 'cat_switches'},
        'storage': {'type': 'storage', 'cat': 'cat_storage'},
        'materials': {'type': 'material', 'cat': 'cat_materials'},
        'acmsMaterials': {'type': 'material', 'cat': 'cat_acmsMaterials'},
        'services': {'type': 'service', 'cat': 'cat_services'},
        'acmsServices': {'type': 'service', 'cat': 'cat_acmsServices'},
        'acmsEquipment': {'type': 'acms_equipment', 'cat': 'cat_acmsEquipment'},
    }

    import_data["binding_rules"] = []

    for json_key, info in entity_map.items():
        if json_key not in clean_data:
            continue

        for item in clean_data[json_key]:
            ext_code = item['id']
            price = float(item.get('price', 0))

            photo_raw = item.get('photo')
            photo = normalize_image_path(photo_raw)

            product = {
                "external_code": ext_code,
                "product_type_external_code": f"type_{info['type']}",
                "category_external_code": info['cat'],
                "catalog_type": "service" if info['type'] == "service" else "product",
                "unit_code": resolve_unit_code(item.get('unit')),

                "code": f"{ext_code.lower()}",

                "slug": f"{ext_code.lower()}",
                "name": item['name'],

                # Фотографии на уровне базового товара теперь строго null
                "preview_picture": None,
                "detail_picture": None,

                "eav": {},
                "variants": []
            }

            # Наполнение EAV
            if 'resolution' in item:
                product["eav"]["camera_resolution"] = item['resolution']
            if 'type' in item:
                if info['type'] == 'camera':
                    product["eav"]["camera_type"] = item['type']
                elif info['type'] == 'material':
                    product["eav"]["material_type"] = item['type']
                elif info['type'] == 'acms_equipment':
                    product["eav"]["acms_equipment_type"] = item['type']
            if 'group' in item:
                if info['type'] == 'acms_equipment':
                    product["eav"]["acms_equipment_groups"] = item['group']
                else:
                    product["eav"]["camera_groups"] = item['group']

            if info['type'] == 'storage' and 'value' in item:
                product["eav"]["storage_capacity"] = float(item['value'])
            if info['type'] == 'recorder' and 'channels' in item:
                product["eav"]["channels_count"] = float(item['channels'])
            if info['type'] == 'switch' and 'connections' in item:
                product["eav"]["poe_ports"] = float(item['connections'])

            # Сборка статических BOM-привязок
            if 'materials' in item and isinstance(item['materials'], list):
                for m_idx, mat in enumerate(item['materials']):
                    import_data["binding_rules"].append({
                        "pipeline_external_code": None,
                        "external_code": f"rule_static_{ext_code}_mat_{m_idx + 1}",
                        "name": "Auto Material",
                        "parent_type_key": "product",
                        "parent_external_code": ext_code,
                        "child_type_key": "product",
                        "child_external_code": mat['id'],
                        "conditions": None,
                        "quantity_formula": str(mat['count']),
                        "is_required": True,
                        "sort_order": m_idx + 1
                    })

            if 'services' in item and isinstance(item['services'], list):
                for s_idx, srv in enumerate(item['services']):
                    import_data["binding_rules"].append({
                        "pipeline_external_code": None,
                        "external_code": f"rule_static_{ext_code}_srv_{s_idx + 1}",
                        "name": "Auto Service",
                        "parent_type_key": "product",
                        "parent_external_code": ext_code,
                        "child_type_key": "product",
                        "child_external_code": srv['id'],
                        "conditions": None,
                        "quantity_formula": str(srv['count']),
                        "is_required": True,
                        "sort_order": s_idx + 1
                    })

            variant = {
                "external_code": f"var_{ext_code}",
                "price_group_external_code": None,
                "sku": item.get('code') or f"SKU-{ext_code}",
                "cost_price": round(price * 0.70, 2),
                "currency": "RUB",
                "price": price,
                "is_default": True if info['type'] != "service" else False,
                "is_active": True,

                # Фотографии перенесены строго на уровень модификации SKU
                "preview_picture": photo,
                "detail_picture": None,

                "eav": {}
            }
            product["variants"].append(variant)
            import_data["products"].append(product)

    # 5. Сборка Пайплайнов с Filament-совместимыми ключами ui_state
    if 'pipelines' in clean_data:
        for idx, pl in enumerate(clean_data['pipelines']):
            pipeline_code = f"pipeline_{idx + 1}"

            ui_state_ext = {
                "type": pl.get("type"),
                "groups": pl.get("groups", []),
                "resolutions": pl.get("resolutions", []),
                "range_from": pl["range"]["from"],
                "range_to": pl["range"]["to"],
                "switches": [],
                "storage": {}
            }

            for sw in pl.get("switches", []):
                ui_state_ext["switches"].append({
                    "product_id": sw["id"],
                    "quantity": sw["count"]
                })

            for hours, storage_config in pl.get("storage", {}).items():
                days = str(int(hours) // 24)
                ui_state_ext["storage"][days] = {
                    "product_id": storage_config["recorder"]["id"] if storage_config.get("recorder") else None,
                    "memory": []
                }
                for hdd in storage_config.get("memory", []):
                    ui_state_ext["storage"][days]["memory"].append({
                        "product_id": hdd["id"],
                        "quantity": hdd["count"]
                    })

            import_data["pipelines"].append({
                "external_code": pipeline_code,
                "code": pipeline_code,
                "slug": f"pipeline-{idx + 1}",
                "name": {
                    "ru": f"Правило подбора {idx + 1}",
                    "en": f"Pipeline Configuration {idx + 1}"
                },
                "industry": "cctv",
                "is_active": True,
                "sort_order": idx,
                "ui_state": ui_state_ext
            })

            # Формируем условия (conditions)
            conditions = {
                "and": []
            }
            if pl.get("groups"):
                conditions["and"].append({
                    "var": "parent.camera_groups",
                    "op": "in",
                    "val": pl["groups"]
                })
            if pl.get("resolutions"):
                conditions["and"].append({
                    "var": "parent.camera_resolution",
                    "op": "in",
                    "val": pl["resolutions"]
                })

            conditions["and"].append({"var": "context.total_cameras", "op": ">=", "val": int(pl["range"]["from"])})
            conditions["and"].append({"var": "context.total_cameras", "op": "<=", "val": int(pl["range"]["to"])})

            # Генерируем правила связей (binding_rules)
            rule_idx = 1

            # Для коммутаторов (Switches)
            for sw in pl.get("switches", []):
                import_data["binding_rules"].append({
                    "pipeline_external_code": pipeline_code,
                    "external_code": f"rule_{pipeline_code}_switch_{rule_idx}",
                    "name": "Auto Switch",
                    "parent_type_key": "product_type",
                    "parent_external_code": "type_camera",
                    "child_type_key": "product",
                    "child_external_code": sw["id"],
                    "conditions": conditions,
                    "quantity_formula": str(sw["count"]),
                    "is_required": False,
                    "sort_order": rule_idx
                })
                rule_idx += 1

            # Для хранилища
            for hours, storage_config in pl.get("storage", {}).items():
                days = int(hours) // 24

                storage_conditions = {
                    "and": conditions["and"] + [
                        {"var": "context.storage_days", "op": "==", "val": int(days)}
                    ]
                }

                # Регистратор (NVR)
                if storage_config.get("recorder"):
                    import_data["binding_rules"].append({
                        "pipeline_external_code": pipeline_code,
                        "external_code": f"rule_{pipeline_code}_nvr_{days}_{rule_idx}",
                        "name": f"NVR for {days} days",
                        "parent_type_key": "product_type",
                        "parent_external_code": "type_camera",
                        "child_type_key": "product",
                        "child_external_code": storage_config["recorder"]["id"],
                        "conditions": storage_conditions,
                        "quantity_formula": "1",
                        "is_required": False,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

                # Дисковые накопители (HDDs)
                for hdd in storage_config.get("memory", []):
                    import_data["binding_rules"].append({
                        "pipeline_external_code": pipeline_code,
                        "external_code": f"rule_{pipeline_code}_hdd_{days}_{rule_idx}",
                        "name": f"HDD for {days} days",
                        "parent_type_key": "product_type",
                        "parent_external_code": "type_camera",
                        "child_type_key": "product",
                        "child_external_code": hdd["id"],
                        "conditions": storage_conditions,
                        "quantity_formula": str(hdd["count"]),
                        "is_required": False,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

    # 6. Сборка комнат
    if 'rooms' in clean_data:
        for idx, room in enumerate(clean_data['rooms']):
            import_data["rooms"].append({
                "external_code": room["id"],
                "name": room["name"],
                "photo": normalize_image_path(room.get("photo")),
                "points": room.get("points", []),
                "is_active": True,
                "sort_order": idx
            })

    # Защитная дедупликация характеристик на уровне Python
    unique_attributes = {}
    for attr in import_data["attributes"]:
        attr_code = attr["external_code"]
        if attr_code not in unique_attributes:
            unique_attributes[attr_code] = attr
        else:
            existing_attr = unique_attributes[attr_code]
            merged_options = {}
            for opt in existing_attr["options"] + attr["options"]:
                ext_code = opt["external_code"]
                if ext_code not in merged_options:
                    merged_options[ext_code] = opt
                else:
                    current_slug = opt["slug"]
                    existing_slug = merged_options[ext_code]["slug"]
                    if len(current_slug) < len(existing_slug):
                        merged_options[ext_code] = opt
            existing_attr["options"] = list(merged_options.values())

    import_data["attributes"] = list(unique_attributes.values())

    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(import_data, f, indent=2, ensure_ascii=False)

    print(f"Экспорт завершен! Сгенерировано пайплайнов: {len(import_data['pipelines'])}, правил: {len(import_data.get('binding_rules', []))}, комнат: {len(import_data['rooms'])}")


if __name__ == '__main__':
    source = './import/config_multilingual.json'
    target = './import/import_data_multilingual.json'
    transform_to_import_format(source, target)
