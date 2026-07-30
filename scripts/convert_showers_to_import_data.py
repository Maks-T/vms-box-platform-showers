import os
import csv
import json
import urllib.request
import urllib.error

MARKUP_PERCENT = 30.0
STOCK_DEFAULT = 10.0

CURRENCIES = [
  {
    "external_code": "BYN",
    "code": "BYN",
    "symbol": "Br",
    "symbol_native": {"ru": "руб."},
    "name": {"ru": "Белорусский рубль"},
    "rate": 1.0,
    "is_default": True,
    "is_active": True
  },
  {
    "external_code": "RUB",
    "code": "RUB",
    "symbol": "₽",
    "symbol_native": {"ru": "руб."},
    "name": {"ru": "Российский рубль"},
    "rate": 0.0472,
    "is_default": False,
    "is_active": True
  },
  {
    "external_code": "USD",
    "code": "USD",
    "symbol": "$",
    "symbol_native": {"ru": "$"},
    "name": {"ru": "Доллар США"},
    "rate": 3.6963,
    "is_default": False,
    "is_active": True
  }
]

FIELD_LABELS = {
  "hex_color": "HEX Цвет",
  "metallic": "Металличность",
  "roughness": "Шероховатость",
  "height_min": "Мин. высота",
  "height_max": "Макс. высота",
  "length_min": "Мин. длина",
  "length_max": "Макс. длина",
  "show_admin": "Админ",
  "show_manager": "Менеджер",
  "show_user": "Пользователь",
  "value_admin": "Значение админа",
  "value_manager": "Значение менеджера",
  "value_user": "Значение пользователя",
}

PRODUCT_TYPE_NAMES = {
  "shower_glass": "Стекло душевое",
  "shower_profile": "Профиль душевой",
  "shower_handle": "Ручка душевая",
  "shower_open_system": "Система открывания",
  "shower_crossbar": "Штанга стабилизационная",
  "shower_sealant": "Уплотнитель душевой",
  "shower_doorstep": "Порог душевой",
  "shower_service": "Услуга душевой",
}

CATEGORY_NAMES = {
  "cat_showers_glass": "Стекла",
  "cat_showers_profiles": "Профили",
  "cat_showers_handles": "Ручки",
  "cat_showers_open_systems": "Петли и треки",
  "cat_showers_crossbars": "Штанги",
  "cat_showers_sealants": "Уплотнители",
  "cat_showers_doorsteps": "Пороги",
  "cat_showers_services": "Услуги",
}


def find_project_root():
  curr = os.path.abspath(os.getcwd())
  while curr != os.path.dirname(curr):
    if os.path.exists(os.path.join(curr, "shared", "csv_ru")):
      return curr
    curr = os.path.dirname(curr)
  local_script_dir = os.path.dirname(os.path.abspath(__file__))
  possible_roots = [
    os.path.abspath(os.path.join(local_script_dir, "../../../../../")),
    os.path.abspath(os.path.join(local_script_dir, "../..")),
    local_script_dir
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
    return float(str(val).replace(",", ".").strip())
  except ValueError:
    return 0.0


def to_bool(val):
  return str(val).lower() in ["+", "true", "yes", "1", "да"]


def download_and_get_preview_picture(row, products_img_dir):
  img = row.get("pathImg")
  if not img:
    return None
  img_val = img.strip()
  if img_val.startswith("http://") or img_val.startswith("https://"):
    try:
      filename = img_val.split("/")[-1]
      local_path = os.path.join(products_img_dir, filename)
      if not os.path.exists(local_path):
        os.makedirs(products_img_dir, exist_ok=True)
        urllib.request.urlretrieve(img_val, local_path)
      return f"products/{filename}"
    except (urllib.error.URLError, ValueError, OSError):
      return None
  return img_val if img_val else None


def build_complex_dictionary(external_code, code, name, records_list, record_prefix):
  records = []
  for row in records_list:
    rec_id = row["id"].strip()
    records.append({
      "external_code": f"{record_prefix}_{rec_id}",
      "slug": rec_id,
      "name": {"ru": row["name"].strip()},
      "meta": {}
    })
  return {
    "external_code": external_code,
    "code": code,
    "name": {"ru": name},
    "meta_schema": [],
    "records": records
  }


def build_option(external_code, slug, name, hex_color=None, param=None):
  return {
    "external_code": external_code,
    "slug": slug,
    "value": {"ru": name},
    "meta": {"hex": hex_color, "image": None},
    "param": param if param is not None else slug
  }


def run_conversion(base_dir=None, out_file=None):
  if not base_dir:
    base_dir = find_project_root()
  if not out_file:
    out_file = os.path.join(base_dir, "import", "import_data.json")

  os.makedirs(os.path.dirname(out_file), exist_ok=True)
  products_img_dir = os.path.join(base_dir, "import", "export_images", "products")
  variants_img_dir = os.path.join(base_dir, "import", "export_images", "variants")

  en_furniture = load_csv_list(base_dir, "config/furniture.csv")
  furniture_options = []
  for row in en_furniture:
    fur_id = row["id"].strip()
    furniture_options.append(
      build_option(f"opt_furniture_color_{fur_id}", fur_id, row["name"].strip(), row["HEX_color"].strip(),
                   row["HEX_color"].strip()))

  en_glasses = load_csv_list(base_dir, "prices/glasses.csv")
  glass_color_options = []
  for row in en_glasses:
    glass_id = row["id"].strip()
    glass_color_options.append(
      build_option(f"opt_glass_color_{glass_id}", glass_id, row["name"].strip(), row["HEX_color"].strip(),
                   row["HEX_color"].strip()))

  en_doors = load_csv_list(base_dir, "config/doors.csv")
  door_options = []
  for row in en_doors:
    did = row["id"].strip()
    door_options.append(build_option(f"opt_door_type_{did}", did, row["name"].strip()))

  en_materials = load_csv_list(base_dir, "config/material.csv")
  material_options = []
  for row in en_materials:
    mid = row["id"].strip()
    material_options.append(build_option(f"opt_material_type_{mid}", mid, row["name"].strip()))

  en_forms = load_csv_list(base_dir, "config/form.csv")
  form_options = []
  for row in en_forms:
    fid = row["id"].strip()
    form_options.append(build_option(f"opt_form_type_{fid}", fid, row["name"].strip()))

  en_crossbar_types = load_csv_list(base_dir, "config/crossbar.csv")
  crossbar_type_options = []
  for row in en_crossbar_types:
    cid = row["id"].strip()
    crossbar_type_options.append(build_option(f"opt_cb_type_{cid}", cid, row["name"].strip()))

  thickness_options = [
    {"external_code": "opt_thickness_6mm", "slug": "6mm", "value": {"ru": "6 мм"}, "meta": {"hex": None, "image": None},
     "param": 6.0},
    {"external_code": "opt_thickness_8mm", "slug": "8mm", "value": {"ru": "8 мм"}, "meta": {"hex": None, "image": None},
     "param": 8.0},
    {"external_code": "opt_thickness_10mm", "slug": "10mm", "value": {"ru": "10 мм"},
     "meta": {"hex": None, "image": None}, "param": 10.0}
  ]

  type_options = [
    {"external_code": "opt_sh_type_profile", "slug": "profile", "value": {"ru": "П-профиль"},
     "meta": {"hex": None, "image": None}, "param": "profile"},
    {"external_code": "opt_sh_type_corner", "slug": "corner", "value": {"ru": "Угловой профиль"},
     "meta": {"hex": None, "image": None}, "param": "corner"},
    {"external_code": "opt_sh_type_cap", "slug": "cap", "value": {"ru": "Заглушка"},
     "meta": {"hex": None, "image": None}, "param": "cap"},
    {"external_code": "opt_sh_type_hinge", "slug": "hinge", "value": {"ru": "Петля"},
     "meta": {"hex": None, "image": None}, "param": "hinge"},
    {"external_code": "opt_sh_type_track", "slug": "track", "value": {"ru": "Трек"},
     "meta": {"hex": None, "image": None}, "param": "track"},
    {"external_code": "opt_sh_type_slide", "slug": "slide", "value": {"ru": "Ролики / Раздвижная система"},
     "meta": {"hex": None, "image": None}, "param": "slide"},
    {"external_code": "opt_sh_type_connector", "slug": "connector", "value": {"ru": "Коннектор"},
     "meta": {"hex": None, "image": None}, "param": "connector"},
    {"external_code": "opt_sh_type_crossbar", "slug": "crossbar", "value": {"ru": "Стабилизирующая штанга"},
     "meta": {"hex": None, "image": None}, "param": "crossbar"},
    {"external_code": "opt_sh_type_fix", "slug": "fix", "value": {"ru": "Крепление к стене"},
     "meta": {"hex": None, "image": None}, "param": "fix"},
    {"external_code": "opt_sh_type_fix_glass", "slug": "fix_glass", "value": {"ru": "Держатель стекла"},
     "meta": {"hex": None, "image": None}, "param": "fix_glass"},
    {"external_code": "opt_sh_type_magnetic", "slug": "magnetic", "value": {"ru": "Магнитный уплотнитель"},
     "meta": {"hex": None, "image": None}, "param": "magnetic"},
    {"external_code": "opt_sh_type_measure", "slug": "measure", "value": {"ru": "Замер"},
     "meta": {"hex": None, "image": None}, "param": "measure"},
    {"external_code": "opt_sh_type_delivery", "slug": "delivery", "value": {"ru": "Доставка"},
     "meta": {"hex": None, "image": None}, "param": "delivery"},
    {"external_code": "opt_sh_type_lift", "slug": "lift", "value": {"ru": "Подъем"},
     "meta": {"hex": None, "image": None}, "param": "lift"},
    {"external_code": "opt_sh_type_montage", "slug": "montage", "value": {"ru": "Монтаж"},
     "meta": {"hex": None, "image": None}, "param": "montage"}
  ]

  attr_chan_settings = {
    "channels": {
      "widget": {"is_public": True, "is_filterable": True, "sort_order": 10},
      "catalog": {"is_public": True, "is_filterable": True, "sort_order": 10}
    }
  }

  import_data: dict[str, list] = {
    "currencies": CURRENCIES,
    "price_types": [
      {
        "slug": "retail",
        "currency_code": "BYN",
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
        "name": {"ru": PRODUCT_TYPE_NAMES["shower_glass"]},
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
        "name": {"ru": PRODUCT_TYPE_NAMES["shower_profile"]},
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
        "name": {"ru": PRODUCT_TYPE_NAMES["shower_handle"]},
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
        "name": {"ru": PRODUCT_TYPE_NAMES["shower_open_system"]},
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
        "name": {"ru": PRODUCT_TYPE_NAMES["shower_crossbar"]},
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
        "name": {"ru": PRODUCT_TYPE_NAMES["shower_sealant"]},
        "attached_attributes": [
          {"code": "type", "is_variant_only": False},
          {"code": "glass_thickness", "is_variant_only": True}
        ]
      },
      {
        "external_code": "type_shower_doorstep",
        "family_external_code": "fam_showers",
        "code": "shower_doorstep",
        "name": {"ru": PRODUCT_TYPE_NAMES["shower_doorstep"]},
        "attached_attributes": [
          {"code": "furniture_type_id", "is_variant_only": True}
        ]
      },
      {
        "external_code": "type_shower_service",
        "family_external_code": "fam_showers",
        "code": "shower_service",
        "name": {"ru": PRODUCT_TYPE_NAMES["shower_service"]},
        "attached_attributes": [
          {"code": "type", "is_variant_only": False},
          {"code": "form_type", "is_variant_only": True},
          {"code": "door_type_ids", "is_variant_only": True}
        ]
      }
    ],
    "categories": [
      {"external_code": "cat_showers_glass", "slug": "shower-glass",
       "name": {"ru": CATEGORY_NAMES["cat_showers_glass"]}, "parent_external_code": None},
      {"external_code": "cat_showers_profiles", "slug": "shower-profiles",
       "name": {"ru": CATEGORY_NAMES["cat_showers_profiles"]}, "parent_external_code": None},
      {"external_code": "cat_showers_handles", "slug": "shower-handles",
       "name": {"ru": CATEGORY_NAMES["cat_showers_handles"]}, "parent_external_code": None},
      {"external_code": "cat_showers_open_systems", "slug": "shower-open-systems",
       "name": {"ru": CATEGORY_NAMES["cat_showers_open_systems"]}, "parent_external_code": None},
      {"external_code": "cat_showers_crossbars", "slug": "shower-crossbars",
       "name": {"ru": CATEGORY_NAMES["cat_showers_crossbars"]}, "parent_external_code": None},
      {"external_code": "cat_showers_sealants", "slug": "shower-sealants",
       "name": {"ru": CATEGORY_NAMES["cat_showers_sealants"]}, "parent_external_code": None},
      {"external_code": "cat_showers_doorsteps", "slug": "shower-doorsteps",
       "name": {"ru": CATEGORY_NAMES["cat_showers_doorsteps"]}, "parent_external_code": None},
      {"external_code": "cat_showers_services", "slug": "shower-services",
       "name": {"ru": CATEGORY_NAMES["cat_showers_services"]}, "parent_external_code": None}
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
      {"external_code": "attr_sh_interface_name", "code": "interface_name", "name": {"ru": "Имя интерфейса"},
       "type": "string"},
      {
        "external_code": "attr_sh_form_type",
        "code": "form_type",
        "name": {"ru": "Форма кабины"},
        "type": "dictionary",
        "option_param_type": "string",
        "options": form_options,
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
      "name": {"ru": row["name"].strip()},
      "meta": {
        "hex_color": row["HEX_color"].strip(),
        "metallic": to_float(row["metallic"]),
        "roughness": to_float(row["roughness"])
      }
    })
  import_data["complex_dictionaries"].append({
    "external_code": "dict_shower_furniture",
    "code": "shower_furniture",
    "name": {"ru": "Цвета фурнитуры"},
    "meta_schema": [
      {"key": "hex_color", "type": "text", "label": {"ru": FIELD_LABELS["hex_color"]}},
      {"key": "metallic", "type": "number", "label": {"ru": FIELD_LABELS["metallic"]}},
      {"key": "roughness", "type": "number", "label": {"ru": FIELD_LABELS["roughness"]}}
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
        "height_min": int(to_float(row["height_min"])),
        "height_max": int(to_float(row["height_max"])),
        "length_min": int(to_float(row["length_min"])),
        "length_max": int(to_float(row["length_max"]))
      }
    })
  import_data["complex_dictionaries"].append({
    "external_code": "dict_shower_measure_limits",
    "code": "shower_measure_limits",
    "name": {"ru": "Лимиты размеров душевых"},
    "meta_schema": [
      {"key": "height_min", "type": "number", "label": {"ru": FIELD_LABELS["height_min"]}},
      {"key": "height_max", "type": "number", "label": {"ru": FIELD_LABELS["height_max"]}},
      {"key": "length_min", "type": "number", "label": {"ru": FIELD_LABELS["length_min"]}},
      {"key": "length_max", "type": "number", "label": {"ru": FIELD_LABELS["length_max"]}}
    ],
    "records": measure_records
  })

  en_srv_limits = load_csv_map(base_dir, "limits/services.csv", "id")
  srv_limit_records = []
  for sid, row in en_srv_limits.items():
    srv_limit_records.append({
      "external_code": f"rec_limit_service_{sid}",
      "slug": sid,
      "name": {"ru": f"Лимит параметров {sid}"},
      "meta": {
        "value_max": int(to_float(row["value_max"]))
      }
    })
  import_data["complex_dictionaries"].append({
    "external_code": "dict_shower_service_limits",
    "code": "shower_service_limits",
    "name": {"ru": "Лимиты параметров услуг"},
    "meta_schema": [
      {"key": "value_max", "type": "number", "label": {"ru": "Макс. значение"}}
    ],
    "records": srv_limit_records
  })

  en_interface = load_interface_csv(base_dir, "interface.csv")
  interface_records = []
  for inf_id, row in en_interface.items():
    interface_records.append({
      "external_code": f"rec_interface_{inf_id}",
      "slug": inf_id,
      "name": {"ru": row["name"].strip()},
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
      {"key": "show_admin", "type": "boolean", "label": {"ru": FIELD_LABELS["show_admin"]}},
      {"key": "show_manager", "type": "boolean", "label": {"ru": FIELD_LABELS["show_manager"]}},
      {"key": "show_user", "type": "boolean", "label": {"ru": FIELD_LABELS["show_user"]}},
      {"key": "value_admin", "type": "text", "label": {"ru": FIELD_LABELS["value_admin"]}},
      {"key": "value_manager", "type": "text", "label": {"ru": FIELD_LABELS["value_manager"]}},
      {"key": "value_user", "type": "text", "label": {"ru": FIELD_LABELS["value_user"]}}
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
          "label_key": {"ru": "Профиль (П-профиль)"},
          "type_code": "shower_profile",
          "is_required": True
        },
        "cap": {
          "label_key": {"ru": "Заглушка профиля"},
          "type_code": "shower_profile",
          "is_required": False
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
        "crossbar": {
          "label_key": {"ru": "Штанга"},
          "type_code": "shower_crossbar",
          "is_required": False
        },
        "fix": {
          "label_key": {"ru": "Крепление штанги к стене"},
          "type_code": "shower_crossbar",
          "is_required": False
        },
        "fix_glass": {
          "label_key": {"ru": "Держатель стекла для штанги"},
          "type_code": "shower_crossbar",
          "is_required": False
        },
        "doorstep": {
          "label_key": {"ru": "Порог"},
          "type_code": "shower_doorstep",
          "is_required": False
        },
        "services": {
          "label_key": {"ru": "Услуги"},
          "type_code": "shower_service",
          "is_required": False,
          "is_multiple": True
        }
      }
    }
  })

  for row in en_glasses:
    glass_id = row["id"].strip()
    glass_ext_code = f"prod_shower_glass_{glass_id}"
    local_preview_path = download_and_get_preview_picture(row, products_img_dir)

    product = {
      "external_code": glass_ext_code,
      "product_type_external_code": "type_shower_glass",
      "category_external_code": "cat_showers_glass",
      "catalog_type": "product",
      "unit_code": "m2",
      "slug": f"shower-glass-{glass_id}",
      "preview_picture": local_preview_path,
      "name": {"ru": row["name"].strip()},
      "code": f"glass_{glass_id}",
      "is_active": True,
      "eav": {
        "color": f"opt_glass_color_{glass_id}",
        "autoImg": to_bool(row["autoImg"]),
        "roughness": to_float(row["roughness"]),
        "fluted": to_bool(row["fluted"])
      },
      "variants": []
    }

    variants = []
    thicknesses = [("6", "price_6mm"), ("8", "price_8mm"), ("10", "price_10mm")]
    for thick_slug, col_name in thicknesses:
      price_val = to_float(row[col_name])
      if price_val <= 0:
        continue
      parent_var_code = f"var_shower_glass_{glass_id}_{thick_slug}mm"
      variants.append({
        "external_code": parent_var_code,
        "sku": f"GLASS-{glass_id}-{thick_slug}MM",
        "cost_price": round(price_val / (MARKUP_PERCENT / 100 + 1), 2),
        "currency": row.get("currency", "USD").strip(),
        "markup": MARKUP_PERCENT,
        "is_default": thick_slug == "8",
        "is_active": True,
        "stock": STOCK_DEFAULT,
        "eav": {
          "glass_thickness": f"opt_thickness_{thick_slug}mm"
        }
      })
    product["variants"] = variants
    import_data["products"].append(product)

  en_profiles = load_csv_list(base_dir, "prices/profile.csv")
  profile_groups = {}
  for row in en_profiles:
    ptype = row["type"].strip()
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
        "type": f"opt_sh_type_{ptype}"
      },
      "variants": []
    }
    variants = []
    for row in rows:
      fur_color = row["furniture_type_id"].strip()
      thicknesses = [("6", "price_6mm"), ("8", "price_8mm"), ("10", "price_10mm")]
      for thick_slug, col_name in thicknesses:
        price_val = to_float(row[col_name])
        if price_val <= 0:
          continue
        variants.append({
          "external_code": f"var_shower_profile_{ptype}_{fur_color}_{thick_slug}mm",
          "sku": f"PROFILE-{ptype.upper()}-{fur_color.upper()}-{thick_slug}MM",
          "cost_price": round(price_val / (MARKUP_PERCENT / 100 + 1), 2),
          "currency": row.get("currency", "USD").strip(),
          "markup": MARKUP_PERCENT,
          "is_default": thick_slug == "8",
          "is_active": True,
          "stock": STOCK_DEFAULT,
          "eav": {
            "glass_thickness": f"opt_thickness_{thick_slug}mm",
            "furniture_type_id": f"opt_furniture_color_{fur_color}"
          }
        })
    product["variants"] = variants
    import_data["products"].append(product)

  en_handles = load_csv_list(base_dir, "prices/handle.csv")
  handle_groups = {}
  for row in en_handles:
    htype = row["type"].strip()
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

    opt_type = htype
    if opt_type == "sliding":
      opt_type = "slide"

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
        "type": f"opt_sh_type_{opt_type}"
      },
      "variants": []
    }
    variants = []
    for row in rows:
      fur_color = row["furniture_type_id"].strip()
      row_id = row["id"].strip()
      variants.append({
        "external_code": f"var_shower_handle_{htype}_{fur_color}_{row_id}",
        "sku": f"HANDLE-{htype.upper()}-{fur_color.upper()}-{row_id.upper()}",
        "cost_price": round(to_float(row["price"]) / (MARKUP_PERCENT / 100 + 1), 2),
        "currency": row.get("currency", "USD").strip(),
        "markup": MARKUP_PERCENT,
        "preview_picture": download_and_get_preview_picture(row, products_img_dir),
        "is_default": True,
        "is_active": True,
        "stock": STOCK_DEFAULT,
        "eav": {
          "furniture_type_id": f"opt_furniture_color_{fur_color}",
          "door_type_ids": [f"opt_door_type_{x.strip()}" for x in row["door_type_ids"].split(",") if x.strip()],
          "interface_name": row["interface_name"].strip()
        }
      })
    product["variants"] = variants
    import_data["products"].append(product)

  en_crossbars = load_csv_list(base_dir, "prices/crossbar.csv")
  crossbar_groups = {}
  for row in en_crossbars:
    ctype = row["type"].strip()
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
        "type": f"opt_sh_type_{ctype}"
      },
      "variants": []
    }
    variants = []
    for row in rows:
      fur_color = row["furniture_type_id"].strip()
      row_id = row["id"].strip()
      cb_type = row["crossbar_type_id"].strip()
      variants.append({
        "external_code": f"var_shower_crossbar_{ctype}_{cb_type}_{fur_color}_{row_id}",
        "sku": f"CROSSBAR-{ctype.upper()}-{cb_type.upper()}-{fur_color.upper()}-{row_id.upper()}",
        "cost_price": round(to_float(row["price"]) / (MARKUP_PERCENT / 100 + 1), 2),
        "currency": row.get("currency", "USD").strip(),
        "markup": MARKUP_PERCENT,
        "is_default": True,
        "is_active": True,
        "stock": STOCK_DEFAULT,
        "eav": {
          "crossbar_type_id": f"opt_cb_type_{cb_type}",
          "furniture_type_id": f"opt_furniture_color_{fur_color}"
        }
      })
    product["variants"] = variants
    import_data["products"].append(product)

  en_open_systems = load_csv_list(base_dir, "prices/open_system.csv")
  opensys_groups = {}
  for row in en_open_systems:
    otype = row["type"].strip()
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
        "type": f"opt_sh_type_{otype}"
      },
      "variants": []
    }
    variants = []
    for row in rows:
      fur_color = row["furniture_type_id"].strip()
      row_id = row["id"].strip()
      mat_type = row["material_type_id"].strip()
      item_price = to_float(row.get("price", 0))

      variants.append({
        "external_code": f"var_shower_opensys_{otype}_{mat_type}_{fur_color}_{row_id}",
        "sku": f"OPENSYS-{otype.upper()}-{mat_type.upper()}-{fur_color.upper()}-{row_id.upper()}",
        "cost_price": round(item_price / (MARKUP_PERCENT / 100 + 1), 2),
        "currency": row.get("currency", "USD").strip(),
        "markup": MARKUP_PERCENT,
        "is_default": True,
        "is_active": True,
        "stock": STOCK_DEFAULT,
        "eav": {
          "material_type_id": f"opt_material_type_{mat_type}",
          "furniture_type_id": f"opt_furniture_color_{fur_color}"
        }
      })
    product["variants"] = variants
    import_data["products"].append(product)

  en_sealants = load_csv_list(base_dir, "prices/sealant.csv")
  sealant_groups = {}
  for row in en_sealants:
    stype = row["type"].strip()
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
        "type": f"opt_sh_type_{stype}"
      },
      "variants": []
    }
    variants = []
    for row in rows:
      thicknesses = [("6", "price_6mm"), ("8", "price_8mm"), ("10", "price_10mm")]
      for thick_slug, col_name in thicknesses:
        price_val = to_float(row[col_name])
        if price_val <= 0:
          continue
        variants.append({
          "external_code": f"var_shower_sealant_{stype}_{thick_slug}mm",
          "sku": f"SEALANT-{stype.upper()}-{thick_slug}MM",
          "cost_price": round(price_val / (MARKUP_PERCENT / 100 + 1), 2),
          "currency": row.get("currency", "USD").strip(),
          "markup": MARKUP_PERCENT,
          "is_default": thick_slug == "8",
          "is_active": True,
          "stock": STOCK_DEFAULT,
          "eav": {
            "glass_thickness": f"opt_thickness_{thick_slug}mm"
          }
        })
    product["variants"] = variants
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
  variants = []
  for row in en_doorsteps:
    fur_color = row["furniture_type_id"].strip()
    row_id = row["id"].strip()
    variants.append({
      "external_code": f"var_shower_doorstep_{row_id}",
      "sku": f"DOORSTEP-{fur_color.upper()}-{row_id.upper()}",
      "cost_price": round(to_float(row["price"]) / (MARKUP_PERCENT / 100 + 1), 2),
      "currency": row.get("currency", "USD").strip(),
      "markup": MARKUP_PERCENT,
      "is_default": True,
      "is_active": True,
      "stock": STOCK_DEFAULT,
      "eav": {
        "furniture_type_id": f"opt_furniture_color_{fur_color}"
      }
    })
  product["variants"] = variants
  import_data["products"].append(product)

  en_services = load_csv_list(base_dir, "prices/services.csv")
  for row in en_services:
    sid = row["id"].strip()
    stype = row["type"].strip()
    sname = row["name"].strip()
    price1 = to_float(row["price_1"])
    currency = row.get("currency", "BYN").strip()

    form_type = row.get("form", "").strip()
    doors_str = row.get("doors", "").strip()

    product = {
      "external_code": f"prod_shower_service_{sid}",
      "product_type_external_code": "type_shower_service",
      "category_external_code": "cat_showers_services",
      "catalog_type": "service",
      "unit_code": "pcs",
      "slug": f"shower-service-{sid}",
      "name": {"ru": sname},
      "code": f"service_{sid}",
      "is_active": True,
      "eav": {
        "type": f"opt_sh_type_{stype}"
      },
      "variants": [
        {
          "external_code": f"var_shower_service_{sid}",
          "sku": f"SERVICE-{sid.upper()}",
          "name": {"ru": sname},
          "cost_price": round(price1 / (MARKUP_PERCENT / 100 + 1), 2),
          "currency": currency,
          "markup": MARKUP_PERCENT,
          "is_default": True,
          "is_active": True,
          "stock": STOCK_DEFAULT,
          "eav": {
            "form_type": f"opt_form_type_{form_type}" if form_type else "",
            "door_type_ids": [f"opt_door_type_{x.strip()}" for x in doors_str.split(",") if x.strip()]
          }
        }
      ]
    }
    import_data["products"].append(product)

  desc_map = {}
  detailed_prompts_path = os.path.join(base_dir, "import", "detailed_prompts.json")
  if os.path.exists(detailed_prompts_path):
    try:
      with open(detailed_prompts_path, 'r', encoding='utf-8') as pf:
        prompts_data = json.load(pf)
        for item in prompts_data:
          pcode = item.get("product_code")
          description = item.get("description")
          if pcode and description:
            desc_map[pcode] = description
    except (urllib.error.URLError, ValueError, OSError):
      pass

  for product in import_data["products"]:
    pcode = product.get("code")

    if pcode in desc_map:
      product["description"] = {
        "ru": desc_map[pcode]
      }

    if pcode:
      prod_img_file = f"{pcode}.jpg"
      prod_img_path = os.path.join(products_img_dir, prod_img_file)
      if os.path.exists(prod_img_path):
        product["preview_picture"] = f"products/{prod_img_file}"

    for variant in product.get("variants", []):
      vsku = variant.get("sku")
      if vsku:
        found_var_file = None
        for ext in [".jpg", ".JPG", ".png", ".PNG", ".webp", ".WEBP"]:
          for case_sku in [vsku, vsku.lower(), vsku.upper()]:
            test_file = f"{case_sku}{ext}"
            test_path = os.path.join(variants_img_dir, test_file)
            if os.path.exists(test_path):
              found_var_file = test_file
              break
          if found_var_file:
            break

        if found_var_file:
          variant["preview_picture"] = f"variants/{found_var_file}"

  import_data["complex_dictionaries"].append(
    build_complex_dictionary("dict_shower_forms", "shower_forms", "Формы душевых", en_forms, "rec_config_form")
  )
  import_data["complex_dictionaries"].append(
    build_complex_dictionary("dict_shower_doors", "shower_doors", "Типы дверей душевых", en_doors, "rec_config_door")
  )
  import_data["complex_dictionaries"].append(
    build_complex_dictionary("dict_shower_materials", "shower_materials", "Материалы душевых", en_materials,
                             "rec_config_material")
  )

  with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(import_data, f, indent=2, ensure_ascii=False)


if __name__ == '__main__':
  default_base = find_project_root()
  default_out = os.path.join(default_base, "import", "import_data.json")
  run_conversion(default_base, default_out)
