import os
import csv
import json

def load_csv_data(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';')
        return [row for row in reader if row.get('active') != '-' and any(row.values())]

def convert_to_float(val):
    if not val or val == 'undefined':
        return 0.0
    return float(val.replace(',', '.'))

def convert_to_bool(val):
    v = str(val).lower()
    return v in ['+', 'true', 'yes', 'да', '1']

def build_showers_import(project_path, target_path):
    csv_path = os.path.join(project_path, "shared", "csv")

    import_data = {
        "currencies": [
            {
                "external_code": "BYN",
                "code": "BYN",
                "symbol": "Br",
                "symbol_native": {"ru": "руб.", "en": "Br"},
                "name": {"ru": "Белорусский рубль", "en": "Belarusian Ruble"},
                "rate": 0.03691,
                "is_default": False,
                "is_active": True
            },
            {
                "external_code": "RUB",
                "code": "RUB",
                "symbol": "₽",
                "symbol_native": {"ru": "руб.", "en": "rub."},
                "name": {"ru": "Российский рубль", "en": "Russian Ruble"},
                "rate": 1.0,
                "is_default": True,
                "is_active": True
            },
            {
                "external_code": "USD",
                "code": "USD",
                "symbol": "$",
                "symbol_native": {"ru": "долл.", "en": "$"},
                "name": {"ru": "Доллар США", "en": "US Dollar"},
                "rate": 0.01276,
                "is_default": False,
                "is_active": True
            }
        ],
        "price_types": [
            {
                "slug": "retail",
                "currency_code": "RUB",
                "is_default": True,
                "name": {"ru": "Цена продажи", "en": "Retail Price"},
                "description": {"ru": "Базовая розничная цена в системе", "en": "Base retail price"}
            }
        ],
        "languages": ["ru", "en"],
        "families": [
            {
                "external_code": "fam_showers",
                "code": "showers",
                "name": {"ru": "Душевые кабины", "en": "Shower Enclosures"}
            }
        ],
        "types": [
            {
                "external_code": "type_shower_glass",
                "family_external_code": "fam_showers",
                "code": "shower_glass",
                "name": {"ru": "Стекло душевое", "en": "Shower Glass"},
                "attached_attributes": []
            },
            {
                "external_code": "type_shower_profile",
                "family_external_code": "fam_showers",
                "code": "shower_profile",
                "name": {"ru": "Профиль душевой", "en": "Shower Profile"},
                "attached_attributes": []
            },
            {
                "external_code": "type_shower_handle",
                "family_external_code": "fam_showers",
                "code": "shower_handle",
                "name": {"ru": "Ручка душевая", "en": "Shower Handle"},
                "attached_attributes": []
            },
            {
                "external_code": "type_shower_open_system",
                "family_external_code": "fam_showers",
                "code": "shower_open_system",
                "name": {"ru": "Система открывания", "en": "Shower Open System"},
                "attached_attributes": []
            },
            {
                "external_code": "type_shower_crossbar",
                "family_external_code": "fam_showers",
                "code": "shower_crossbar",
                "name": {"ru": "Штанга стабилизационная", "en": "Stabilizer Bar"},
                "attached_attributes": []
            },
            {
                "external_code": "type_shower_sealant",
                "family_external_code": "fam_showers",
                "code": "shower_sealant",
                "name": {"ru": "Уплотнитель душевой", "en": "Shower Sealant"},
                "attached_attributes": []
            },
            {
                "external_code": "type_shower_doorstep",
                "family_external_code": "fam_showers",
                "code": "shower_doorstep",
                "name": {"ru": "Порог душевой", "en": "Shower Doorstep"},
                "attached_attributes": []
            },
            {
                "external_code": "type_shower_service",
                "family_external_code": "fam_showers",
                "code": "shower_service",
                "name": {"ru": "Услуга душевой", "en": "Shower Service"},
                "attached_attributes": []
            }
        ],
        "categories": [
            {"external_code": "cat_showers_glass", "slug": "shower-glass", "name": {"ru": "Стекла", "en": "Glasses"}, "parent_external_code": None},
            {"external_code": "cat_showers_profiles", "slug": "shower-profiles", "name": {"ru": "Профили", "en": "Profiles"}, "parent_external_code": None},
            {"external_code": "cat_showers_handles", "slug": "shower-handles", "name": {"ru": "Ручки", "en": "Handles"}, "parent_external_code": None},
            {"external_code": "cat_showers_open_systems", "slug": "shower-open-systems", "name": {"ru": "Петли и треки", "en": "Open Systems"}, "parent_external_code": None},
            {"external_code": "cat_showers_crossbars", "slug": "shower-crossbars", "name": {"ru": "Штанги", "en": "Crossbars"}, "parent_external_code": None},
            {"external_code": "cat_showers_sealants", "slug": "shower-sealants", "name": {"ru": "Уплотнители", "en": "Sealants"}, "parent_external_code": None},
            {"external_code": "cat_showers_doorsteps", "slug": "shower-doorsteps", "name": {"ru": "Пороги", "en": "Doorsteps"}, "parent_external_code": None},
            {"external_code": "cat_showers_services", "slug": "shower-services", "name": {"ru": "Услуги", "en": "Services"}, "parent_external_code": None}
        ],
        "attributes": [],
        "products": [],
        "complex_dictionaries": []
    }

    raw_forms = load_csv_data(os.path.join(csv_path, "config", "form.csv"))
    form_records = []
    for row in raw_forms:
        form_records.append({
            "external_code": f"rec_config_form_{row['id']}",
            "slug": row['id'],
            "name": {"ru": row['name'], "en": row['name']},
            "meta": {}
        })
    import_data["complex_dictionaries"].append({
        "external_code": "dict_shower_forms",
        "code": "shower_forms",
        "name": {"ru": "Формы кабин", "en": "Shower Forms"},
        "meta_schema": [],
        "records": form_records
    })

    raw_doors = load_csv_data(os.path.join(csv_path, "config", "doors.csv"))
    door_records = []
    for row in raw_doors:
        door_records.append({
            "external_code": f"rec_config_door_{row['id']}",
            "slug": row['id'],
            "name": {"ru": row['name'], "en": row['name']},
            "meta": {}
        })
    import_data["complex_dictionaries"].append({
        "external_code": "dict_shower_doors",
        "code": "shower_doors",
        "name": {"ru": "Типы дверей", "en": "Door Types"},
        "meta_schema": [],
        "records": door_records
    })

    raw_materials = load_csv_data(os.path.join(csv_path, "config", "material.csv"))
    material_records = []
    for row in raw_materials:
        material_records.append({
            "external_code": f"rec_config_material_{row['id']}",
            "slug": row['id'],
            "name": {"ru": row['name'], "en": row['name']},
            "meta": {}
        })
    import_data["complex_dictionaries"].append({
        "external_code": "dict_shower_materials",
        "code": "shower_materials",
        "name": {"ru": "Материалы фурнитуры", "en": "Hardware Materials"},
        "meta_schema": [],
        "records": material_records
    })

    raw_furniture = load_csv_data(os.path.join(csv_path, "config", "furniture.csv"))
    furniture_records = []
    for row in raw_furniture:
        furniture_records.append({
            "external_code": f"rec_config_furniture_{row['id']}",
            "slug": row['id'],
            "name": {"ru": row['name'], "en": row['name']},
            "meta": {
                "hex_color": row['HEX_color'],
                "metallic": convert_to_float(row['metallic']),
                "roughness": convert_to_float(row['roughness'])
            }
        })
    import_data["complex_dictionaries"].append({
        "external_code": "dict_shower_furniture",
        "code": "shower_furniture",
        "name": {"ru": "Цвета фурнитуры", "en": "Hardware Colors"},
        "meta_schema": [
            {"key": "hex_color", "type": "text", "label": {"ru": "HEX Цвет"}},
            {"key": "metallic", "type": "number", "label": {"ru": "Металлик"}},
            {"key": "roughness", "type": "number", "label": {"ru": "Шероховатость"}}
        ],
        "records": furniture_records
    })

    raw_measures = load_csv_data(os.path.join(csv_path, "limits", "measure.csv"))
    measure_records = []
    for row in raw_measures:
        measure_records.append({
            "external_code": f"rec_limit_measure_{row['form']}",
            "slug": row['form'],
            "name": {"ru": f"Лимиты размеров для {row['form']}", "en": f"Size limits for {row['form']}"},
            "meta": {
                "height_min": int(row['height_min']),
                "height_max": int(row['height_max']),
                "length_min": int(row['length_min']),
                "length_max": int(row['length_max'])
            }
        })
    import_data["complex_dictionaries"].append({
        "external_code": "dict_shower_measure_limits",
        "code": "shower_measure_limits",
        "name": {"ru": "Лимиты размеров душевых", "en": "Shower Size Limits"},
        "meta_schema": [
            {"key": "height_min", "type": "number", "label": {"ru": "Мин. высота"}},
            {"key": "height_max", "type": "number", "label": {"ru": "Макс. высота"}},
            {"key": "length_min", "type": "number", "label": {"ru": "Мин. длина"}},
            {"key": "length_max", "type": "number", "label": {"ru": "Макс. длина"}}
        ],
        "records": measure_records
    })

    raw_service_limits = load_csv_data(os.path.join(csv_path, "limits", "services.csv"))
    service_limit_records = []
    for row in raw_service_limits:
        service_limit_records.append({
            "external_code": f"rec_limit_service_{row['id']}",
            "slug": row['id'],
            "name": {"ru": f"Лимиты услуг для {row['id']}", "en": f"Service limits for {row['id']}"},
            "meta": {
                "value_max": int(row['value_max'])
            }
        })
    import_data["complex_dictionaries"].append({
        "external_code": "dict_shower_service_limits",
        "code": "shower_service_limits",
        "name": {"ru": "Лимиты параметров услуг", "en": "Shower Service Limits"},
        "meta_schema": [
            {"key": "value_max", "type": "number", "label": {"ru": "Макс. значение"}}
        ],
        "records": service_limit_records
    })

    raw_interface = load_csv_data(os.path.join(csv_path, "interface.csv"))
    interface_records = []
    for row in raw_interface:
        interface_records.append({
            "external_code": f"rec_interface_{row['id']}",
            "slug": row['id'],
            "name": {"ru": row['name'], "en": row['name']},
            "meta": {
                "show_admin": convert_to_bool(row['show_admin']),
                "show_manager": convert_to_bool(row['show_manager']),
                "show_user": convert_to_bool(row['show_user']),
                "value_admin": row['value_admin'],
                "value_manager": row['value_manager'],
                "value_user": row['value_user']
            }
        })
    import_data["complex_dictionaries"].append({
        "external_code": "dict_shower_interface_settings",
        "code": "shower_interface_settings",
        "name": {"ru": "Параметры интерфейса калькулятора", "en": "Calculator Interface Settings"},
        "meta_schema": [
            {"key": "show_admin", "type": "boolean", "label": {"ru": "Показывать админу"}},
            {"key": "show_manager", "type": "boolean", "label": {"ru": "Показывать менеджеру"}},
            {"key": "show_user", "type": "boolean", "label": {"ru": "Показывать пользователю"}},
            {"key": "value_admin", "type": "text", "label": {"ru": "Значение админа"}},
            {"key": "value_manager", "type": "text", "label": {"ru": "Значение менеджера"}},
            {"key": "value_user", "type": "text", "label": {"ru": "Значение пользователя"}}
        ],
        "records": interface_records
    })

    raw_glasses = load_csv_data(os.path.join(csv_path, "prices", "glasses.csv"))
    for row in raw_glasses:
        prod_ext_code = f"prod_shower_glass_{row['id']}"
        product = {
            "external_code": prod_ext_code,
            "product_type_external_code": "type_shower_glass",
            "category_external_code": "cat_showers_glass",
            "catalog_type": "product",
            "unit_code": "m2",
            "slug": f"shower-glass-{row['id']}",
            "name": {"ru": row['name'], "en": row['name']},
            "code": row['id'],
            "is_active": True,
            "eav": {},
            "variants": []
        }

        thicknesses = [("6", "price_6mm"), ("8", "price_8mm"), ("10", "price_10mm")]
        for thick_slug, col_name in thicknesses:
            price_val = convert_to_float(row[col_name])
            product["variants"].append({
                "external_code": f"var_shower_glass_{row['id']}_{thick_slug}mm",
                "sku": f"GLASS-{row['id']}-{thick_slug}MM",
                "price_group_external_code": null,
                "cost_price": round(price_val * 0.7, 2),
                "currency": "USD",
                "price": price_val,
                "is_default": thick_slug == "8",
                "is_active": True,
                "eav": {}
            })
        import_data["products"].append(product)

    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(import_data, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    build_showers_import("D:\\Vistegra\\projects\\showers", "./import_data.json")
