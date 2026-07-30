import os
import json


def find_project_root():
  curr = os.path.abspath(os.getcwd())
  while curr != os.path.dirname(curr):
    if os.path.exists(os.path.join(curr, "import")):
      return curr
    curr = os.path.dirname(curr)
  return os.path.abspath(os.getcwd())


def run_rules_generation():
  project_root = find_project_root()
  import_file = os.path.join(project_root, "import", "import_data.json")

  if not os.path.exists(import_file):
    return

  with open(import_file, "r", encoding="utf-8") as f:
    data = json.load(f)

  data["binding_rules"] = []
  rule_idx = 1

  products = data.get("products", [])

  def get_products_by_type(type_ext_code):
    return [p for p in products if p.get("product_type_external_code") == type_ext_code]

  glasses_products = get_products_by_type("type_shower_glass")
  profiles_products = get_products_by_type("type_shower_profile")
  handles_products = get_products_by_type("type_shower_handle")
  crossbars_products = get_products_by_type("type_shower_crossbar")
  opensys_products = get_products_by_type("type_shower_open_system")
  sealants_products = get_products_by_type("type_shower_sealant")
  doorsteps_products = get_products_by_type("type_shower_doorstep")

  for glass_prod in glasses_products:
    for glass_var in glass_prod.get("variants", []):
      glass_var_code = glass_var["external_code"]

      thick_opt = glass_var.get("eav", {}).get("glass_thickness")
      if not thick_opt:
        sku_parts = glass_var.get("sku", "").split("-")
        thick_slug = sku_parts[2].lower() if len(sku_parts) >= 3 else "8mm"
        if not thick_slug.endswith("mm"):
          thick_slug += "mm"
        thick_opt = f"opt_thickness_{thick_slug}"

      target_profile = None
      for p_prod in profiles_products:
        if p_prod.get("eav", {}).get("type") == "opt_sh_type_profile":
          for p_var in p_prod.get("variants", []):
            if p_var.get("eav", {}).get("glass_thickness") == thick_opt and \
              p_var.get("eav", {}).get("furniture_type_id") == "opt_furniture_color_chrome":
              target_profile = p_var
              break
          if target_profile:
            break

      if isinstance(target_profile, dict):
        data["binding_rules"].append({
          "external_code": f"rule_{glass_var_code}_profile",
          "pipeline_external_code": "pl_showers",
          "name": "Профиль (П-профиль)",
          "role": "profile",
          "parent_type_key": "variant",
          "parent_external_code": glass_var_code,
          "child_type_key": "variant",
          "child_external_code": target_profile["external_code"],
          "conditions": None,
          "quantity_formula": "partition_count + (framing ? 1 : 0)",
          "is_required": True,
          "sort_order": rule_idx
        })
        rule_idx += 1

      target_cap = None
      for p_prod in profiles_products:
        if p_prod.get("eav", {}).get("type") == "opt_sh_type_cap":
          for p_var in p_prod.get("variants", []):
            if p_var.get("eav", {}).get("glass_thickness") == thick_opt and \
              p_var.get("eav", {}).get("furniture_type_id") == "opt_furniture_color_chrome":
              target_cap = p_var
              break
          if target_cap:
            break

      if isinstance(target_cap, dict):
        data["binding_rules"].append({
          "external_code": f"rule_{glass_var_code}_cap",
          "pipeline_external_code": "pl_showers",
          "name": "Заглушка профиля",
          "role": "cap",
          "parent_type_key": "variant",
          "parent_external_code": glass_var_code,
          "child_type_key": "variant",
          "child_external_code": target_cap["external_code"],
          "conditions": None,
          "quantity_formula": "1",
          "is_required": False,
          "sort_order": rule_idx
        })
        rule_idx += 1

      target_handle = None
      for h_prod in handles_products:
        for h_var in h_prod.get("variants", []):
          if h_var.get("eav", {}).get("furniture_type_id") == "opt_furniture_color_chrome" and \
            h_var.get("eav", {}).get("interface_name") == "Ручка-кноб 1":
            target_handle = h_var
            break
        if target_handle:
          break

      if isinstance(target_handle, dict):
        data["binding_rules"].append({
          "external_code": f"rule_{glass_var_code}_handle",
          "pipeline_external_code": "pl_showers",
          "name": "Ручка",
          "role": "handle",
          "parent_type_key": "variant",
          "parent_external_code": glass_var_code,
          "child_type_key": "variant",
          "child_external_code": target_handle["external_code"],
          "conditions": None,
          "quantity_formula": "1",
          "is_required": True,
          "sort_order": rule_idx
        })
        rule_idx += 1

      target_opensys = None
      for os_prod in opensys_products:
        if os_prod.get("eav", {}).get("type") == "opt_sh_type_hinge":
          for os_var in os_prod.get("variants", []):
            if os_var.get("eav", {}).get("furniture_type_id") == "opt_furniture_color_chrome" and \
              os_var.get("eav", {}).get("material_type_id") == "opt_material_type_stainless":
              target_opensys = os_var
              break
        if target_opensys:
          break

      if isinstance(target_opensys, dict):
        data["binding_rules"].append({
          "external_code": f"rule_{glass_var_code}_opensys",
          "pipeline_external_code": "pl_showers",
          "name": "Система открывания",
          "role": "open_system",
          "parent_type_key": "variant",
          "parent_external_code": glass_var_code,
          "child_type_key": "variant",
          "child_external_code": target_opensys["external_code"],
          "conditions": None,
          "quantity_formula": "1",
          "is_required": True,
          "sort_order": rule_idx
        })
        rule_idx += 1

      target_sealant = None
      for s_prod in sealants_products:
        if s_prod.get("eav", {}).get("type") == "opt_sh_type_slide":
          for s_var in s_prod.get("variants", []):
            if s_var.get("eav", {}).get("glass_thickness") == thick_opt:
              target_sealant = s_var
              break
          if target_sealant:
            break

      if isinstance(target_sealant, dict):
        data["binding_rules"].append({
          "external_code": f"rule_{glass_var_code}_sealant",
          "pipeline_external_code": "pl_showers",
          "name": "Уплотнитель",
          "role": "sealant",
          "parent_type_key": "variant",
          "parent_external_code": glass_var_code,
          "child_type_key": "variant",
          "child_external_code": target_sealant["external_code"],
          "conditions": None,
          "quantity_formula": "1",
          "is_required": True,
          "sort_order": rule_idx
        })
        rule_idx += 1

      target_crossbar = None
      for cb_prod in crossbars_products:
        if cb_prod.get("eav", {}).get("type") == "opt_sh_type_crossbar":
          for cb_var in cb_prod.get("variants", []):
            if cb_var.get("eav", {}).get("furniture_type_id") == "opt_furniture_color_chrome" and \
              cb_var.get("eav", {}).get("crossbar_type_id") == "opt_cb_type_rect":
              target_crossbar = cb_var
              break
        if target_crossbar:
          break

      if isinstance(target_crossbar, dict):
        data["binding_rules"].append({
          "external_code": f"rule_{glass_var_code}_crossbar",
          "pipeline_external_code": "pl_showers",
          "name": "Штанга",
          "role": "crossbar",
          "parent_type_key": "variant",
          "parent_external_code": glass_var_code,
          "child_type_key": "variant",
          "child_external_code": target_crossbar["external_code"],
          "conditions": None,
          "quantity_formula": "1",
          "is_required": False,
          "sort_order": rule_idx
        })
        rule_idx += 1

      target_fix = None
      for cb_prod in crossbars_products:
        if cb_prod.get("eav", {}).get("type") == "opt_sh_type_fix":
          for fix_var in cb_prod.get("variants", []):
            if fix_var.get("eav", {}).get("furniture_type_id") == "opt_furniture_color_chrome" and \
              fix_var.get("eav", {}).get("crossbar_type_id") == "opt_cb_type_rect":
              target_fix = fix_var
              break
        if target_fix:
          break

      if isinstance(target_fix, dict):
        data["binding_rules"].append({
          "external_code": f"rule_{glass_var_code}_fix",
          "pipeline_external_code": "pl_showers",
          "name": "Крепление штанги к стене",
          "role": "fix",
          "parent_type_key": "variant",
          "parent_external_code": glass_var_code,
          "child_type_key": "variant",
          "child_external_code": target_fix["external_code"],
          "conditions": None,
          "quantity_formula": "1",
          "is_required": False,
          "sort_order": rule_idx
        })
        rule_idx += 1

      target_fix_glass = None
      for cb_prod in crossbars_products:
        if cb_prod.get("eav", {}).get("type") == "opt_sh_type_fix_glass":
          for fg_var in cb_prod.get("variants", []):
            if fg_var.get("eav", {}).get("furniture_type_id") == "opt_furniture_color_chrome" and \
              fg_var.get("eav", {}).get("crossbar_type_id") == "opt_cb_type_rect":
              target_fix_glass = fg_var
              break
        if target_fix_glass:
          break

      if isinstance(target_fix_glass, dict):
        data["binding_rules"].append({
          "external_code": f"rule_{glass_var_code}_fixglass",
          "pipeline_external_code": "pl_showers",
          "name": "Держатель стекла для штанги",
          "role": "fix_glass",
          "parent_type_key": "variant",
          "parent_external_code": glass_var_code,
          "child_type_key": "variant",
          "child_external_code": target_fix_glass["external_code"],
          "conditions": None,
          "quantity_formula": "1",
          "is_required": False,
          "sort_order": rule_idx
        })
        rule_idx += 1

      target_doorstep = None
      for ds_prod in doorsteps_products:
        for ds_var in ds_prod.get("variants", []):
          if ds_var.get("eav", {}).get("furniture_type_id") == "opt_furniture_color_chrome":
            target_doorstep = ds_var
            break
        if target_doorstep:
          break

      if isinstance(target_doorstep, dict):
        data["binding_rules"].append({
          "external_code": f"rule_{glass_var_code}_doorstep",
          "pipeline_external_code": "pl_showers",
          "name": "Порог",
          "role": "doorstep",
          "parent_type_key": "variant",
          "parent_external_code": glass_var_code,
          "child_type_key": "variant",
          "child_external_code": target_doorstep["external_code"],
          "conditions": None,
          "quantity_formula": "1",
          "is_required": False,
          "sort_order": rule_idx
        })
        rule_idx += 1

  with open(import_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
  run_rules_generation()
