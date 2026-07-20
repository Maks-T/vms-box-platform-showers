import os
import csv
import json

def find_project_root():
    curr = os.path.abspath(os.getcwd())
    while curr != os.path.dirname(curr):
        if os.path.exists(os.path.join(curr, "shared", "csv_ru")):
            return curr
        curr = os.path.dirname(curr)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    possible_roots = [
        os.path.abspath(os.path.join(script_dir, "../../../../../")),
        os.path.abspath(os.path.join(script_dir, "../..")),
        script_dir
    ]
    for root in possible_roots:
        if os.path.exists(os.path.join(root, "shared", "csv_ru")):
            return root
    return os.path.abspath(os.getcwd())

def load_csv_list(project_root, sub_file_path):
    filepath = os.path.join(project_root, "shared", "csv_ru", sub_file_path)
    if not os.path.exists(filepath):
        return []
    with open(filepath, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        return [row for row in reader if any(row.values())]

def load_csv_map(project_root, sub_file_path, key_col="id", use_composite=False):
    filepath = os.path.join(project_root, "shared", "csv_ru", sub_file_path)
    if not os.path.exists(filepath):
        return {}
    with open(filepath, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        result = {}
        for row in reader:
            if any(row.values()):
                key = row.get(key_col)
                if key:
                    key = key.strip()
                    if use_composite and "type" in row:
                        composite_key = f"{key}_{row['type'].strip()}"
                        result[composite_key] = row
                    else:
                        result[key] = row
        return result

def load_interface_csv(project_root, filepath):
    full_path = os.path.join(project_root, "shared", "csv_ru", filepath)
    if not os.path.exists(full_path):
        return {}
    with open(full_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.reader(f, delimiter=";")
        rows = list(reader)
        if not rows:
            return {}
        result = {}
        for row in rows[1:]:
            if len(row) >= 8 and row[0]:
                result[row[0].strip()] = {
                    "id": row[0].strip(),
                    "name": row[1].strip(),
                    "show_admin": row[2].strip(),
                    "show_manager": row[3].strip(),
                    "show_user": row[4].strip(),
                    "value_admin": row[5].strip(),
                    "value_manager": row[6].strip(),
                    "value_user": row[7].strip()
                }
        return result

def to_float(val):
    if not val or val == "undefined":
        return 0.0
    try:
        return float(val.replace(",", "."))
    except ValueError:
        return 0.0

def to_bool(val):
    return str(val).lower() in ["+", "true", "yes", "1", "да"]

def get_preview_picture(row):
    img = row.get("pathImg")
    if img:
        img_val = img.strip()
        return img_val if img_val else None
    return None

def run_conversion(base_dir=None, out_file=None):
    if not base_dir:
        base_dir = find_project_root()
    if not out_file:
        out_file = os.path.join(base_dir, "import_data.json")

    csv_path = os.path.join(base_dir, "shared", "csv_ru")

    en_furniture = load_csv_list(base_dir, "config/furniture.csv")
    furniture_options = []
    for row in en_furniture:
        fur_id = row["id"]
        furniture_options.append({
            "external_code": f"opt_furniture_color_{fur_id}",
            "slug": fur_id,
            "value": {
                "ru": row["name"]
            },
            "meta": {
                "hex": row["HEX_color"],
                "image": None
            },
            "param": row["HEX_color"]
        })

    en_glasses = load_csv_list(base_dir, "prices/glasses.csv")
    glass_color_options = []
    for row in en_glasses:
        glass_id = row["id"]
        glass_color_options.append({
            "external_code": f"opt_glass_color_{glass_id}",
            "slug": glass_id,
            "value": {
                "ru": row["name"]
            },
            "meta": {
                "hex": row["HEX_color"],
                "image": None
            },
            "param": row["HEX_color"]
        })

    en_doors = load_csv_list(base_dir, "config/doors.csv")
    door_options = []
    for row in en_doors:
        did = row["id"]
        door_options.append({
            "external_code": f"opt_door_type_{did}",
            "slug": did,
            "value": {
                "ru": row["name"]
            },
            "meta": {
                "hex": None,
                "image": None
            },
            "param": did
        })

    en_materials = load_csv_list(base_dir, "config/material.csv")
    material_options = []
    for row in en_materials:
        mid = row["id"]
        material_options.append({
            "external_code": f"opt_material_type_{mid}",
            "slug": mid,
            "value": {
                "ru": row["name"]
            },
            "meta": {
                "hex": None,
                "image": None
            },
            "param": mid
        })

    en_forms = load_csv_list(base_dir, "config/form.csv")
    form_options = []
    for row in en_forms:
        fid = row["id"]
        form_options.append({
            "external_code": f"opt_form_type_{fid}",
            "slug": fid,
            "value": {
                "ru": row["name"]
            },
            "meta": {
                "hex": None,
                "image": None
            },
            "param": fid
        })

    en_crossbar_types = load_csv_list(base_dir, "config/crossbar.csv")
    crossbar_type_options = []
    for row in en_crossbar_types:
        cid = row["id"]
        crossbar_type_options.append({
            "external_code": f"opt_crossbar_type_{cid}",
            "slug": cid,
            "value": {
                "ru": row["name"]
            },
            "meta": {
                "hex": None,
                "image": None
            },
            "param": cid
        })

    en_srv_limits = load_csv_list(base_dir, "limits/services.csv")
    service_limit_options = []
    for row in en_srv_limits:
        sid = row["id"]
        service_limit_options.append({
            "external_code": f"opt_srv_limit_{sid}",
            "slug": sid,
            "value": {
                "ru": sid
            },
            "meta": {
                "hex": None,
                "image": None
            },
            "param": to_float(row["value_max"])
        })

    thickness_options = [
        {"external_code": "opt_thickness_6mm", "slug": "6mm", "value": {"ru": "6 мм"}, "meta": {"hex": None, "image": None}, "param": 6.0},
        {"external_code": "opt_thickness_8mm", "slug": "8mm", "value": {"ru": "8 мм"}, "meta": {"hex": None, "image": None}, "param": 8.0},
        {"external_code": "opt_thickness_10mm", "slug": "10mm", "value": {"ru": "10 мм"}, "meta": {"hex": None, "image": None}, "param": 10.0}
    ]

    type_options = [
        {"external_code": "opt_sh_type_profile", "slug": "profile", "value": {"ru": "П-профиль"}, "meta": {"hex": None, "image": None}, "param": "profile"},
        {"external_code": "opt_sh_type_corner", "slug": "corner", "value": {"ru": "Угловой профиль"}, "meta": {"hex": None, "image": None}, "param": "corner"},
        {"external_code": "opt_sh_type_cap", "slug": "cap", "value": {"ru": "Заглушка"}, "meta": {"hex": None, "image": None}, "param": "cap"},
        {"external_code": "opt_sh_type_hinge", "slug": "hinge", "value": {"ru": "Петля"}, "meta": {"hex": None, "image": None}, "param": "hinge"},
        {"external_code": "opt_sh_type_track", "slug": "track", "value": {"ru": "Трек"}, "meta": {"hex": None, "image": None}, "param": "track"},
        {"external_code": "opt_sh_type_slide", "slug": "slide", "value": {"ru": "Ролики / Раздвижная система"}, "meta": {"hex": None, "image": None}, "param": "slide"},
        {"external_code": "opt_sh_type_connector", "slug": "connector", "value": {"ru": "Коннектор"}, "meta": {"hex": None, "image": None}, "param": "connector"},
        {"external_code": "opt_sh_type_crossbar", "slug": "crossbar", "value": {"ru": "Стабилизирующая штанга"}, "meta": {"hex": None, "image": None}, "param": "crossbar"},
        {"external_code": "opt_sh_type_fix", "slug": "fix", "value": {"ru": "Крепление к стене"}, "meta": {"hex": None, "image": None}, "param": "fix"},
        {"external_code": "opt_sh_type_fix_glass", "slug": "fix_glass", "value": {"ru": "Держатель стекла"}, "meta": {"hex": None, "image": None}, "param": "fix_glass"},
        {"external_code": "opt_sh_type_magnetic", "slug": "magnetic", "value": {"ru": "Магнитный уплотнитель"}, "meta": {"hex": None, "image": None}, "param": "magnetic"},
        {"external_code": "opt_sh_type_measure", "slug": "measure", "value": {"ru": "Замер"}, "meta": {"hex": None, "image": None}, "param": "measure"},
        {"external_code": "opt_sh_type_delivery", "slug": "delivery", "value": {"ru": "Доставка"}, "meta": {"hex": None, "image": None}, "param": "delivery"},
        {"external_code": "opt_sh_type_lift", "slug": "lift", "value": {"ru": "Подъем"}, "meta": {"hex": None, "image": None}, "param": "lift"},
        {"external_code": "opt_sh_type_montage", "slug": "montage", "value": {"ru": "Монтаж"}, "meta": {"hex": None, "image": None}, "param": "montage"}
    ]

    attr_chan_settings = {
        "channels": {
            "widget": {
                "is_public": True,
                "is_filterable": True,
                "sort_order": 10
            },
            "catalog": {
                "is_public": True,
                "is_filterable": True,
                "sort_order": 10
            }
        }
    }

    import_data = {
        "currencies": [
            {
                "external_code": "BYN",
                "code": "BYN",
                "symbol": "Br",
                "symbol_native": {"ru": "руб."},
                "name": {"ru": "Белорусский рубль"},
                "rate": 0.03691,
                "is_default": False,
                "is_active": True
            },
            {
                "external_code": "RUB",
                "code": "RUB",
                "symbol": "₽",
                "symbol_native": {"ru": "руб."},
                "name": {"ru": "Российский рубль"},
                "rate": 1.0,
                "is_default": True,
                "is_active": True
            },
            {
                "external_code": "USD",
                "code": "USD",
                "symbol": "$",
                "symbol_native": {"ru": "$"},
                "name": {"ru": "Доллар США"},
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
                "name": {"ru": "Цена продажи"},
                "description": {"ru": "Базовая розничная цена в системе"}
            }
        ],
        "languages": ["ru"],
        "families": [
            {
                "external_code": "fam_showers",
                "code": "shower",
                "name": {"ru": "Душевые ограждения"}
            }
        ],
        "types": [
            {
                "external_code": "type_shower_glass",
                "family_external_code": "fam_showers",
                "code": "shower_glass",
                "name": {"ru": "Стекло душевое"},
                "attached_attributes": [
                    {"code": "glass_thickness", "is_variant_only": True},
                    {"code": "color", "is_variant_only": False},
                    {"code": "autoImg", "is_variant_only": False},
                    {"code": "roughness", "is_variant_only": False},
                    {"code": "fluted", "is_variant_only": False}
                ]
            },
            {
                "external_code": "type_shower_profile",
                "family_external_code": "fam_showers",
                "code": "shower_profile",
                "name": {"ru": "Профиль душевой"},
                "attached_attributes": [
                    {"code": "type", "is_variant_only": False},
                    {"code": "furniture_type_id", "is_variant_only": True},
                    {"code": "glass_thickness", "is_variant_only": True}
                ]
            },
            {
                "external_code": "type_shower_handle",
                "family_external_code": "fam_showers",
                "code": "shower_handle",
                "name": {"ru": "Ручка душевая"},
                "attached_attributes": [
                    {"code": "type", "is_variant_only": False},
                    {"code": "furniture_type_id", "is_variant_only": True},
                    {"code": "door_type_ids", "is_variant_only": True},
                    {"code": "interface_name", "is_variant_only": True}
                ]
            },
            {
                "external_code": "type_shower_open_system",
                "family_external_code": "fam_showers",
                "code": "shower_open_system",
                "name": {"ru": "Система открывания"},
                "attached_attributes": [
                    {"code": "type", "is_variant_only": False},
                    {"code": "material_type_id", "is_variant_only": True},
                    {"code": "furniture_type_id", "is_variant_only": True}
                ]
            },
            {
                "external_code": "type_shower_crossbar",
                "family_external_code": "fam_showers",
                "code": "shower_crossbar",
                "name": {"ru": "Штанга стабилизационная"},
                "attached_attributes": [
                    {"code": "type", "is_variant_only": False},
                    {"code": "crossbar_type_id", "is_variant_only": True},
                    {"code": "furniture_type_id", "is_variant_only": True}
                ]
            },
            {
                "external_code": "type_shower_sealant",
                "family_external_code": "fam_showers",
                "code": "shower_sealant",
                "name": {"ru": "Уплотнитель душевой"},
                "attached_attributes": [
                    {"code": "type", "is_variant_only": False},
                    {"code": "glass_thickness", "is_variant_only": True}
                ]
            },
            {
                "external_code": "type_shower_doorstep",
                "family_external_code": "fam_showers",
                "code": "shower_doorstep",
                "name": {"ru": "Порог душевой"},
                "attached_attributes": [
                    {"code": "furniture_type_id", "is_variant_only": True}
                ]
            },
            {
                "external_code": "type_shower_service",
                "family_external_code": "fam_showers",
                "code": "shower_service",
                "name": {"ru": "Услуга душевой"},
                "attached_attributes": [
                    {"code": "type", "is_variant_only": False},
                    {"code": "form_type", "is_variant_only": True},
                    {"code": "door_type_ids", "is_variant_only": True}
                ]
            }
        ],
        "categories": [
            {"external_code": "cat_showers_glass", "slug": "shower-glass", "name": {"ru": "Стекла"}, "parent_external_code": None},
            {"external_code": "cat_showers_profiles", "slug": "shower-profiles", "name": {"ru": "Профили"}, "parent_external_code": None},
            {"external_code": "cat_showers_handles", "slug": "shower-handles", "name": {"ru": "Ручки"}, "parent_external_code": None},
            {"external_code": "cat_showers_open_systems", "slug": "shower-open-systems", "name": {"ru": "Петли и треки"}, "parent_external_code": None},
            {"external_code": "cat_showers_crossbars", "slug": "shower-crossbars", "name": {"ru": "Штанги"}, "parent_external_code": None},
            {"external_code": "cat_showers_sealants", "slug": "shower-sealants", "name": {"ru": "Уплотнители"}, "parent_external_code": None},
            {"external_code": "cat_showers_doorsteps", "slug": "shower-doorsteps", "name": {"ru": "Пороги"}, "parent_external_code": None},
            {"external_code": "cat_showers_services", "slug": "shower-services", "name": {"ru": "Услуги"}, "parent_external_code": None}
        ],
        "attributes": [
            {
                "external_code": "attr_sh_glass_thickness",
                "code": "glass_thickness",
                "name": {"ru": "Толщина стекла"},
                "type": "dictionary",
                "option_param_type": "numeric",
                "options": thickness_options,
                "settings": attr_chan_settings
            },
            {
                "external_code": "attr_sh_color",
                "code": "color",
                "name": {"ru": "Цвет стекла"},
                "type": "dictionary",
                "option_param_type": "string",
                "options": glass_color_options,
                "settings": attr_chan_settings
            },
            {"external_code": "attr_sh_auto_img", "code": "autoImg", "name": {"ru": "Авто-изображение"}, "type": "boolean"},
            {"external_code": "attr_sh_roughness", "code": "roughness", "name": {"ru": "Шероховатость"}, "type": "numeric"},
            {"external_code": "attr_sh_fluted", "code": "fluted", "name": {"ru": "Рифление"}, "type": "boolean"},
            {
                "external_code": "attr_sh_type",
                "code": "type",
                "name": {"ru": "Тип компонента"},
                "type": "dictionary",
                "option_param_type": "string",
                "options": type_options,
                "settings": attr_chan_settings
            },
            {
                "external_code": "attr_sh_furniture_type_id",
                "code": "furniture_type_id",
                "name": {"ru": "Цвет фурнитуры"},
                "type": "dictionary",
                "option_param_type": "string",
                "options": furniture_options,
                "settings": attr_chan_settings
            },
            {
                "external_code": "attr_sh_crossbar_type_id",
                "code": "crossbar_type_id",
                "name": {"ru": "Тип штанги"},
                "type": "dictionary",
                "option_param_type": "string",
                "options": crossbar_type_options,
                "settings": attr_chan_settings
            },
            {
                "external_code": "attr_sh_material_type_id",
                "code": "material_type_id",
                "name": {"ru": "Материал"},
                "type": "dictionary",
                "option_param_type": "string",
                "options": material_options,
                "settings": attr_chan_settings
            },
            {
                "external_code": "attr_sh_door_type_ids",
                "code": "door_type_ids",
                "name": {"ru": "Совместимые двери"},
                "type": "dictionary",
                "is_multiple": True,
                "option_param_type": "string",
                "options": door_options,
                "settings": attr_chan_settings
            },
            {"external_code": "attr_sh_interface_name", "code": "interface_name", "name": {"ru": "Имя интерфейса"}, "type": "string"},
            {
                "external_code": "attr_sh_form_type",
                "code": "form_type",
                "name": {"ru": "Форма кабины"},
                "type": "dictionary",
                "option_param_type": "string",
                "options": form_options,
                "settings": attr_chan_settings
            },
            {
                "external_code": "attr_sh_service_limit",
                "code": "shower_service_limits",
                "name": {"ru": "Лимиты параметров услуг"},
                "type": "dictionary",
                "option_param_type": "numeric",
                "options": service_limit_options,
                "settings": attr_chan_settings
            }
        ],
        "products": [],
        "complex_dictionaries": [],
        "pipelines": [],
        "binding_rules": []
    }

    en_furniture = load_csv_map(base_dir, "config/furniture.csv")
    furniture_records = []
    for fur_id, row in en_furniture.items():
        furniture_records.append({
            "external_code": f"rec_config_furniture_{fur_id}",
            "slug": fur_id,
            "name": {"ru": row["name"]},
            "meta": {
                "hex_color": row["HEX_color"],
                "metallic": to_float(row["metallic"]),
                "roughness": to_float(row["roughness"])
            }
        })
    import_data["complex_dictionaries"].append({
        "external_code": "dict_shower_furniture",
        "code": "shower_furniture",
        "name": {"ru": "Цвета фурнитуры"},
        "meta_schema": [
            {"key": "hex_color", "type": "text", "label": {"ru": "HEX Цвет"}},
            {"key": "metallic", "type": "number", "label": {"ru": "Металлик"}},
            {"key": "roughness", "type": "number", "label": {"ru": "Шероховатость"}}
        ],
        "records": furniture_records
    })

    en_measures = load_csv_map(base_dir, "limits/measure.csv", "form")
    measure_records = []
    for form_id, row in en_measures.items():
        measure_records.append({
            "external_code": f"rec_limit_measure_{form_id}",
            "slug": form_id,
            "name": {"ru": f"Лимиты размеров для {form_id}"},
            "meta": {
                "height_min": int(row["height_min"]),
                "height_max": int(row["height_max"]),
                "length_min": int(row["length_min"]),
                "length_max": int(row["length_max"])
            }
        })
    import_data["complex_dictionaries"].append({
        "external_code": "dict_shower_measure_limits",
        "code": "shower_measure_limits",
        "name": {"ru": "Лимиты размеров душевых"},
        "meta_schema": [
            {"key": "height_min", "type": "number", "label": {"ru": "Мин. высота"}},
            {"key": "height_max", "type": "number", "label": {"ru": "Макс. высота"}},
            {"key": "length_min", "type": "number", "label": {"ru": "Мин. длина"}},
            {"key": "length_max", "type": "number", "label": {"ru": "Макс. длина"}}
        ],
        "records": measure_records
    })

    en_interface = load_interface_csv(base_dir, "interface.csv")
    interface_records = []
    for inf_id, row in en_interface.items():
        interface_records.append({
            "external_code": f"rec_interface_{inf_id}",
            "slug": inf_id,
            "name": {"ru": row["name"]},
            "meta": {
                "show_admin": to_bool(row["show_admin"]),
                "show_manager": to_bool(row["show_manager"]),
                "show_user": to_bool(row["show_user"]),
                "value_admin": row["value_admin"],
                "value_manager": row["value_manager"],
                "value_user": row["value_user"]
            }
        })
    import_data["complex_dictionaries"].append({
        "external_code": "dict_shower_interface_settings",
        "code": "shower_interface_settings",
        "name": {"ru": "Параметры интерфейса калькулятора"},
        "meta_schema": [
            {"key": "show_admin", "type": "boolean", "label": {"ru": "Админ"}},
            {"key": "show_manager", "type": "boolean", "label": {"ru": "Менеджер"}},
            {"key": "show_user", "type": "boolean", "label": {"ru": "Пользователь"}},
            {"key": "value_admin", "type": "text", "label": {"ru": "Значение админа"}},
            {"key": "value_manager", "type": "text", "label": {"ru": "Значение менеджера"}},
            {"key": "value_user", "type": "text", "label": {"ru": "Значение пользователя"}}
        ],
        "records": interface_records
    })

    import_data["pipelines"].append({
        "external_code": "pl_showers",
        "code": "pl_showers",
        "slug": "showers",
        "name": {
            "ru": "Калькулятор душевых кабин"
        },
        "industry": "showers",
        "is_active": True,
        "sort_order": 10,
        "ui_state": {},
        "schema": {
            "shower_glass": {
                "profile": {
                    "label_key": {"ru": "Профиль"},
                    "type_code": "shower_profile",
                    "is_required": True
                },
                "handle": {
                    "label_key": {"ru": "Ручка"},
                    "type_code": "shower_handle",
                    "is_required": True
                },
                "open_system": {
                    "label_key": {"ru": "Система открывания"},
                    "type_code": "shower_open_system",
                    "is_required": True
                },
                "sealant": {
                    "label_key": {"ru": "Уплотнитель"},
                    "type_code": "shower_sealant",
                    "is_required": True
                },
                "doorstep": {
                    "label_key": {"ru": "Порог"},
                    "type_code": "shower_doorstep",
                    "is_required": False
                },
                "crossbar": {
                    "label_key": {"ru": "Штанга"},
                    "type_code": "shower_crossbar",
                    "is_required": False
                },
                "services": {
                    "label_key": {"ru": "Услуги"},
                    "type_code": "shower_service",
                    "is_required": False,
                    "is_multiple": True
                }
            },
            "shower_profile": {
                "cap": {
                    "label_key": {"ru": "Заглушка"},
                    "type_code": "shower_profile",
                    "is_required": True
                }
            },
            "shower_crossbar": {
                "fix": {
                    "label_key": {"ru": "Крепление к стене"},
                    "type_code": "shower_crossbar",
                    "is_required": True
                },
                "fix_glass": {
                    "label_key": {"ru": "Держатель стекла"},
                    "type_code": "shower_crossbar",
                    "is_required": True
                }
            },
            "shower_open_system": {
                "connector": {
                    "label_key": {"ru": "Соединитель трека"},
                    "type_code": "shower_open_system",
                    "is_required": False
                },
                "slide": {
                    "label_key": {"ru": "Ролики"},
                    "type_code": "shower_open_system",
                    "is_required": True
                },
                "sealant": {
                    "label_key": {"ru": "Уплотнитель"},
                    "type_code": "shower_sealant",
                    "is_required": True
                }
            }
        }
    })

    for row in en_glasses:
        glass_id = row["id"]
        glass_ext_code = f"prod_shower_glass_{glass_id}"
        product = {
            "external_code": glass_ext_code,
            "product_type_external_code": "type_shower_glass",
            "category_external_code": "cat_showers_glass",
            "catalog_type": "product",
            "unit_code": "m2",
            "slug": f"shower-glass-{glass_id}",
            "preview_picture": get_preview_picture(row),
            "name": {"ru": row["name"]},
            "code": f"glass_{glass_id}",
            "is_active": True,
            "eav": {
                "color": glass_id,
                "autoImg": to_bool(row["autoImg"]),
                "roughness": to_float(row["roughness"]),
                "fluted": to_bool(row["fluted"])
            },
            "variants": []
        }

        thicknesses = [("6", "price_6mm"), ("8", "price_8mm"), ("10", "price_10mm")]
        for thick_slug, col_name in thicknesses:
            price_val = to_float(row[col_name])
            parent_var_code = f"var_shower_glass_{glass_id}_{thick_slug}mm"
            product["variants"].append({
                "external_code": parent_var_code,
                "sku": f"GLASS-{glass_id}-{thick_slug}MM",
                "cost_price": round(price_val * 0.7, 2),
                "currency": "USD",
                "price": price_val,
                "is_default": thick_slug == "8",
                "is_active": True,
                "eav": {
                    "glass_thickness": f"{thick_slug}mm"
                }
            })

        import_data["products"].append(product)

    en_profiles = load_csv_list(base_dir, "prices/profile.csv")
    profile_groups = {}
    for row in en_profiles:
        ptype = row["type"]
        if ptype not in profile_groups:
            profile_groups[ptype] = []
        profile_groups[ptype].append(row)

    type_name_map = {
        "profile": "Профиль П-образный из алюминия в полимерном покрытии",
        "corner": "Профиль угловой 90 градусов для стекла, мм",
        "cap": "Заглушка П-профиля"
    }

    for ptype, rows in profile_groups.items():
        base_name = type_name_map.get(ptype, ptype)
        product = {
            "external_code": f"prod_shower_profile_{ptype}",
            "product_type_external_code": "type_shower_profile",
            "category_external_code": "cat_showers_profiles",
            "catalog_type": "product",
            "unit_code": "pcs",
            "slug": f"shower-profile-{ptype}",
            "name": {"ru": base_name},
            "code": f"profile_{ptype}",
            "is_active": True,
            "eav": {
                "type": ptype
            },
            "variants": []
        }
        for row in rows:
            fur_color = row["furniture_type_id"]
            thicknesses = [("6", "price_6mm"), ("8", "price_8mm"), ("10", "price_10mm")]
            for thick_slug, col_name in thicknesses:
                price_val = to_float(row[col_name])
                product["variants"].append({
                    "external_code": f"var_shower_profile_{ptype}_{fur_color}_{thick_slug}mm",
                    "sku": f"PROFILE-{ptype.upper()}-{fur_color.upper()}-{thick_slug}MM",
                    "cost_price": round(price_val * 0.7, 2),
                    "currency": "USD",
                    "price": price_val,
                    "is_default": thick_slug == "8",
                    "is_active": True,
                    "eav": {
                        "glass_thickness": f"{thick_slug}mm",
                        "furniture_type_id": fur_color
                    }
                })
        import_data["products"].append(product)

    en_handles = load_csv_list(base_dir, "prices/handle.csv")
    handle_groups = {}
    for row in en_handles:
        htype = row["type"]
        if htype not in handle_groups:
            handle_groups[htype] = []
        handle_groups[htype].append(row)

    handle_name_map = {
        "knob": "Ручка-кноб душевая",
        "bracket": "Ручка-скоба душевая",
        "holder": "Ручка-полотенцедержатель душевая",
        "sliding": "Ручка утопленная для раздвижных дверей"
    }

    for htype, rows in handle_groups.items():
        base_name = handle_name_map.get(htype, htype)
        product = {
            "external_code": f"prod_shower_handle_{htype}",
            "product_type_external_code": "type_shower_handle",
            "category_external_code": "cat_showers_handles",
            "catalog_type": "product",
            "unit_code": "pcs",
            "slug": f"shower-handle-{htype}",
            "name": {"ru": base_name},
            "code": f"handle_{htype}",
            "is_active": True,
            "eav": {
                "type": htype
            },
            "variants": []
        }
        for row in rows:
            fur_color = row["furniture_type_id"]
            row_id = row["id"]
            product["variants"].append({
                "external_code": f"var_shower_handle_{htype}_{fur_color}_{row_id}",
                "sku": f"HANDLE-{htype.upper()}-{fur_color.upper()}-{row_id.upper()}",
                "cost_price": round(to_float(row["price"]) * 0.7, 2),
                "currency": "USD",
                "price": to_float(row["price"]),
                "preview_picture": get_preview_picture(row),
                "is_default": True,
                "is_active": True,
                "eav": {
                    "furniture_type_id": fur_color,
                    "door_type_ids": [x.strip() for x in row["door_type_ids"].split(",") if x.strip()],
                    "interface_name": row["interface_name"]
                }
            })
        import_data["products"].append(product)

    en_crossbars = load_csv_list(base_dir, "prices/crossbar.csv")
    crossbar_groups = {}
    for row in en_crossbars:
        ctype = row["type"]
        if ctype not in crossbar_groups:
            crossbar_groups[ctype] = []
        crossbar_groups[ctype].append(row)

    crossbar_name_map = {
        "crossbar": "Стабилизирующая штанга",
        "fix": "Крепление штанги к стене",
        "fix_glass": "Держатель стекла для штанги"
    }

    for ctype, rows in crossbar_groups.items():
        base_name = crossbar_name_map.get(ctype, ctype)
        product = {
            "external_code": f"prod_shower_crossbar_{ctype}",
            "product_type_external_code": "type_shower_crossbar",
            "category_external_code": "cat_showers_crossbars",
            "catalog_type": "product",
            "unit_code": "pcs",
            "slug": f"shower-crossbar-{ctype}",
            "name": {"ru": base_name},
            "code": f"crossbar_{ctype}",
            "is_active": True,
            "eav": {
                "type": ctype
            },
            "variants": []
        }
        for row in rows:
            fur_color = row["furniture_type_id"]
            row_id = row["id"]
            cb_type = row["crossbar_type_id"]
            product["variants"].append({
                "external_code": f"var_shower_crossbar_{ctype}_{cb_type}_{fur_color}_{row_id}",
                "sku": f"CROSSBAR-{ctype.upper()}-{cb_type.upper()}-{fur_color.upper()}-{row_id.upper()}",
                "cost_price": round(to_float(row["price"]) * 0.7, 2),
                "currency": "USD",
                "price": to_float(row["price"]),
                "is_default": True,
                "is_active": True,
                "eav": {
                    "crossbar_type_id": cb_type,
                    "furniture_type_id": fur_color
                }
            })
        import_data["products"].append(product)

    en_open_systems = load_csv_list(base_dir, "prices/open_system.csv")
    opensys_groups = {}
    for row in en_open_systems:
        otype = row["type"]
        if otype not in opensys_groups:
            opensys_groups[otype] = []
        opensys_groups[otype].append(row)

    opensys_name_map = {
        "hinge": "Петли душевые",
        "track": "Трек направляющий",
        "slide": "Раздвижная система для стеклянных дверей",
        "connector": "Коннектор трека угловой"
    }

    for otype, rows in opensys_groups.items():
        base_name = opensys_name_map.get(otype, otype)
        product = {
            "external_code": f"prod_shower_opensys_{otype}",
            "product_type_external_code": "type_shower_open_system",
            "category_external_code": "cat_showers_open_systems",
            "catalog_type": "product",
            "unit_code": "pcs",
            "slug": f"shower-opensys-{otype}",
            "name": {"ru": base_name},
            "code": f"opensys_{otype}",
            "is_active": True,
            "eav": {
                "type": otype
            },
            "variants": []
        }
        for row in rows:
            fur_color = row["furniture_type_id"]
            row_id = row["id"]
            mat_type = row["material_type_id"]
            product["variants"].append({
                "external_code": f"var_shower_opensys_{otype}_{mat_type}_{fur_color}_{row_id}",
                "sku": f"OPENSYS-{otype.upper()}-{mat_type.upper()}-{fur_color.upper()}-{row_id.upper()}",
                "cost_price": round(to_float(row["price"]) * 0.7, 2),
                "currency": "USD",
                "price": to_float(row["price"]),
                "is_default": True,
                "is_active": True,
                "eav": {
                    "material_type_id": mat_type,
                    "furniture_type_id": fur_color
                }
            })
        import_data["products"].append(product)

    en_sealants = load_csv_list(base_dir, "prices/sealant.csv")
    sealant_groups = {}
    for row in en_sealants:
        stype = row["type"]
        if stype not in sealant_groups:
            sealant_groups[stype] = []
        sealant_groups[stype].append(row)

    sealant_name_map = {
        "slide": "Уплотнитель для раздвижных дверей, 3м",
        "hinge": "Уплотнитель для распашных дверей, 3м",
        "magnetic": "Магнитный уплотнитель, 3м"
    }

    for stype, rows in sealant_groups.items():
        base_name = sealant_name_map.get(stype, stype)
        product = {
            "external_code": f"prod_shower_sealant_{stype}",
            "product_type_external_code": "type_shower_sealant",
            "category_external_code": "cat_showers_sealants",
            "catalog_type": "product",
            "unit_code": "pcs",
            "slug": f"shower-sealant-{stype}",
            "name": {"ru": base_name},
            "code": f"sealant_{stype}",
            "is_active": True,
            "eav": {
                "type": stype
            },
            "variants": []
        }
        for row in rows:
            thicknesses = [("6", "price_6mm"), ("8", "price_8mm"), ("10", "price_10mm")]
            for thick_slug, col_name in thicknesses:
                price_val = to_float(row[col_name])
                product["variants"].append({
                    "external_code": f"var_shower_sealant_{stype}_{thick_slug}mm",
                    "sku": f"SEALANT-{stype.upper()}-{thick_slug}MM",
                    "cost_price": round(price_val * 0.7, 2),
                    "currency": "USD",
                    "price": price_val,
                    "is_default": thick_slug == "8",
                    "is_active": True,
                    "eav": {
                        "glass_thickness": f"{thick_slug}mm"
                    }
                })
        import_data["products"].append(product)

    en_doorsteps = load_csv_list(base_dir, "prices/doorstep.csv")
    product = {
        "external_code": "prod_shower_doorstep_doorsteps",
        "product_type_external_code": "type_shower_doorstep",
        "category_external_code": "cat_showers_doorsteps",
        "catalog_type": "product",
        "unit_code": "pcs",
        "slug": "shower-doorstep-doorsteps",
        "name": {"ru": "Порог душевой"},
        "code": "doorsteps",
        "is_active": True,
        "eav": {},
        "variants": []
    }
    for row in en_doorsteps:
        fur_color = row["furniture_type_id"]
        row_id = row["id"]
        product["variants"].append({
            "external_code": f"var_shower_doorstep_{row_id}",
            "sku": f"DOORSTEP-{fur_color.upper()}-{row_id.upper()}",
            "cost_price": round(to_float(row["price"]) * 0.7, 2),
            "currency": "USD",
            "price": to_float(row["price"]),
            "is_default": True,
            "is_active": True,
            "eav": {
                "furniture_type_id": fur_color
            }
        })
    import_data["products"].append(product)

    en_services = load_csv_list(base_dir, "prices/services.csv")
    service_groups = {}
    for row in en_services:
        stype = row["type"]
        if stype not in service_groups:
            service_groups[stype] = []
        service_groups[stype].append(row)

    service_name_map = {
        "measure": "Услуга замера",
        "delivery": "Услуга доставки",
        "lift": "Подъем на этаж",
        "montage": "Монтажные работы"
    }

    for stype, rows in service_groups.items():
        base_name = service_name_map.get(stype, stype)
        product = {
            "external_code": f"prod_shower_service_{stype}",
            "product_type_external_code": "type_shower_service",
            "category_external_code": "cat_showers_services",
            "catalog_type": "service",
            "unit_code": "pcs",
            "slug": f"shower-service-{stype}",
            "name": {"ru": base_name},
            "code": f"service_{stype}",
            "is_active": True,
            "eav": {
                "type": stype
            },
            "variants": []
        }
        for row in rows:
            row_id = row["id"]
            product["variants"].append({
                "external_code": f"var_shower_service_{stype}_{row_id}",
                "sku": f"SERVICE-{stype.upper()}-{row_id.upper()}",
                "cost_price": round(to_float(row["price_1"]) * 0.7, 2),
                "currency": "USD",
                "price": to_float(row["price_1"]),
                "is_default": True,
                "is_active": True,
                "eav": {
                    "form_type": row["form"],
                    "door_type_ids": [x.strip() for x in row["doors"].split(",") if x.strip()]
                }
            })
        import_data["products"].append(product)

    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(import_data, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_base = os.path.abspath(os.path.join(script_dir, ".."))
    run_conversion(default_base, "./import/import_data.json")
