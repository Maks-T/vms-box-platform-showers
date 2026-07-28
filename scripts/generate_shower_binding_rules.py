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
        print(f"Error: {import_file} not found.")
        return

    with open(import_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    data["binding_rules"] = []
    rule_idx = 1

    # Вспомогательные функции поиска
    products = data.get("products", [])

    def get_products_by_type(type_ext_code):
        return [p for p in products if p.get("product_type_external_code") == type_ext_code]

    glasses_products   = get_products_by_type("type_shower_glass")
    profiles_products  = get_products_by_type("type_shower_profile")
    handles_products   = get_products_by_type("type_shower_handle")
    crossbars_products = get_products_by_type("type_shower_crossbar")
    opensys_products   = get_products_by_type("type_shower_open_system")
    sealants_products  = get_products_by_type("type_shower_sealant")
    doorsteps_products = get_products_by_type("type_shower_doorstep")
    services_products  = get_products_by_type("type_shower_service")

    # =========================================================================
    # 1. ПРИВЯЗКИ К СТЕКЛУ (Родитель: variant -> shower_glass)
    # =========================================================================
    for glass_prod in glasses_products:
        for glass_var in glass_prod.get("variants", []):
            glass_var_code = glass_var["external_code"]

            # Извлекаем толщину стекла
            thick_opt = glass_var.get("eav", {}).get("glass_thickness")
            if not thick_opt:
                sku_parts = glass_var.get("sku", "").split("-")
                thick_slug = sku_parts[2].lower() if len(sku_parts) >= 3 else "8mm"
                thick_opt = f"opt_thickness_{thick_slug}"

            thick_code = thick_opt.replace("opt_thickness_", "") # "6mm", "8mm", "10mm"

            # -----------------------------------------------------------------
            # 1.1. Профили (role: profile)
            # -----------------------------------------------------------------
            for prof_prod in profiles_products:
                p_type = prof_prod.get("eav", {}).get("type")
                if p_type != "opt_sh_type_profile":
                    continue  # Берем только П-профиль, заглушки и уголки пойдут в свои слоты

                for prof_var in prof_prod.get("variants", []):
                    prof_thick = prof_var.get("eav", {}).get("glass_thickness")
                    furniture_col = prof_var.get("eav", {}).get("furniture_type_id", "")
                    color_slug = furniture_col.replace("opt_furniture_color_", "")

                    if prof_thick == thick_opt:
                        data["binding_rules"].append({
                            "external_code": f"rule_{glass_var_code}_prof_{prof_var['external_code']}",
                            "pipeline_external_code": "pl_showers",
                            "name": f"Профиль {color_slug} ({thick_code}) к стеклу {glass_var['sku']}",
                            "role": "profile",
                            "parent_type_key": "variant",
                            "parent_external_code": glass_var_code,
                            "child_type_key": "variant",
                            "child_external_code": prof_var["external_code"],
                            "conditions": {
                                "and": [
                                    {"var": "context.furniture_color", "op": "==", "val": color_slug}
                                ]
                            },
                            "quantity_formula": "partition_count + (framing ? 1 : 0)",
                            "is_required": True,
                            "sort_order": rule_idx
                        })
                        rule_idx += 1

            # -----------------------------------------------------------------
            # 1.2. Уплотнители (role: sealant)
            # -----------------------------------------------------------------
            for seal_prod in sealants_products:
                stype_opt = seal_prod.get("eav", {}).get("type", "")
                stype = stype_opt.replace("opt_sh_type_", "")  # "slide", "hinge", "magnetic"

                for seal_var in seal_prod.get("variants", []):
                    seal_thick = seal_var.get("eav", {}).get("glass_thickness")

                    if seal_thick == thick_opt:
                        data["binding_rules"].append({
                            "external_code": f"rule_{glass_var_code}_seal_{seal_var['external_code']}",
                            "pipeline_external_code": "pl_showers",
                            "name": f"Уплотнитель {stype} ({thick_code}) к стеклу {glass_var['sku']}",
                            "role": "sealant",
                            "parent_type_key": "variant",
                            "parent_external_code": glass_var_code,
                            "child_type_key": "variant",
                            "child_external_code": seal_var["external_code"],
                            "conditions": {
                                "and": [
                                    {"var": "context.sealant_type", "op": "==", "val": stype}
                                ]
                            },
                            "quantity_formula": "1",
                            "is_required": True,
                            "sort_order": rule_idx
                        })
                        rule_idx += 1

            # -----------------------------------------------------------------
            # 1.3. Ручки (role: handle)
            # -----------------------------------------------------------------
            for hd_prod in handles_products:
                for hd_var in hd_prod.get("variants", []):
                    furniture_col = hd_var.get("eav", {}).get("furniture_type_id", "")
                    color_slug = furniture_col.replace("opt_furniture_color_", "")
                    door_types_opts = hd_var.get("eav", {}).get("door_type_ids", [])
                    door_slugs = [d.replace("opt_door_type_", "") for d in door_types_opts]

                    data["binding_rules"].append({
                        "external_code": f"rule_{glass_var_code}_handle_{hd_var['external_code']}",
                        "pipeline_external_code": "pl_showers",
                        "name": f"Ручка {hd_var['sku']} к стеклу {glass_var['sku']}",
                        "role": "handle",
                        "parent_type_key": "variant",
                        "parent_external_code": glass_var_code,
                        "child_type_key": "variant",
                        "child_external_code": hd_var["external_code"],
                        "conditions": {
                            "and": [
                                {"var": "context.furniture_color", "op": "==", "val": color_slug},
                                {"var": "context.door", "op": "in", "val": door_slugs}
                            ]
                        },
                        "quantity_formula": "1",
                        "is_required": True,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

            # -----------------------------------------------------------------
            # 1.4. Штанги стабилизационные (role: crossbar)
            # -----------------------------------------------------------------
            for cb_prod in crossbars_products:
                cb_type_opt = cb_prod.get("eav", {}).get("type", "")
                if cb_type_opt != "opt_sh_type_crossbar":
                    continue  # Фиксы к стене и стеклу идут в дочерние слоты штанги

                for cb_var in cb_prod.get("variants", []):
                    furniture_col = cb_var.get("eav", {}).get("furniture_type_id", "")
                    color_slug = furniture_col.replace("opt_furniture_color_", "")
                    crossbar_type_opt = cb_var.get("eav", {}).get("crossbar_type_id", "")
                    cb_shape = crossbar_type_opt.replace("opt_cb_type_", "")  # "rect", "round", "corner"

                    data["binding_rules"].append({
                        "external_code": f"rule_{glass_var_code}_cb_{cb_var['external_code']}",
                        "pipeline_external_code": "pl_showers",
                        "name": f"Штанга {cb_shape} {color_slug} к стеклу {glass_var['sku']}",
                        "role": "crossbar",
                        "parent_type_key": "variant",
                        "parent_external_code": glass_var_code,
                        "child_type_key": "variant",
                        "child_external_code": cb_var["external_code"],
                        "conditions": {
                            "and": [
                                {"var": "context.furniture_color", "op": "==", "val": color_slug},
                                {"var": "context.crossbar_type", "op": "==", "val": cb_shape}
                            ]
                        },
                        "quantity_formula": "1",
                        "is_required": False,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

            # -----------------------------------------------------------------
            # 1.5. Системы открывания: Петли / Трек / Ролики (role: open_system)
            # -----------------------------------------------------------------
            for os_prod in opensys_products:
                os_type_opt = os_prod.get("eav", {}).get("type", "")
                os_type = os_type_opt.replace("opt_sh_type_", "")  # "hinge", "track", "slide"

                if os_type == "connector":
                    continue # Соединители трека привязываются к треку

                for os_var in os_prod.get("variants", []):
                    furniture_col = os_var.get("eav", {}).get("furniture_type_id", "")
                    color_slug = furniture_col.replace("opt_furniture_color_", "")
                    mat_opt = os_var.get("eav", {}).get("material_type_id", "")
                    mat_slug = mat_opt.replace("opt_material_type_", "")

                    data["binding_rules"].append({
                        "external_code": f"rule_{glass_var_code}_os_{os_var['external_code']}",
                        "pipeline_external_code": "pl_showers",
                        "name": f"Система открывания {os_type} {color_slug} {mat_slug} к стеклу",
                        "role": "open_system",
                        "parent_type_key": "variant",
                        "parent_external_code": glass_var_code,
                        "child_type_key": "variant",
                        "child_external_code": os_var["external_code"],
                        "conditions": {
                            "and": [
                                {"var": "context.furniture_color", "op": "==", "val": color_slug},
                                {"var": "context.furniture_material", "op": "==", "val": mat_slug}
                            ]
                        },
                        "quantity_formula": "1",
                        "is_required": True,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

            # -----------------------------------------------------------------
            # 1.6. Порожки (role: doorstep)
            # -----------------------------------------------------------------
            for ds_prod in doorsteps_products:
                for ds_var in ds_prod.get("variants", []):
                    furniture_col = ds_var.get("eav", {}).get("furniture_type_id", "")
                    color_slug = furniture_col.replace("opt_furniture_color_", "")

                    data["binding_rules"].append({
                        "external_code": f"rule_{glass_var_code}_ds_{ds_var['external_code']}",
                        "pipeline_external_code": "pl_showers",
                        "name": f"Порог {color_slug} к стеклу {glass_var['sku']}",
                        "role": "doorstep",
                        "parent_type_key": "variant",
                        "parent_external_code": glass_var_code,
                        "child_type_key": "variant",
                        "child_external_code": ds_var["external_code"],
                        "conditions": {
                            "and": [
                                {"var": "context.furniture_color", "op": "==", "val": color_slug},
                                {"var": "context.doorstep", "op": "==", "val": True}
                            ]
                        },
                        "quantity_formula": "1",
                        "is_required": False,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

            # -----------------------------------------------------------------
            # 1.7. Услуги (role: services)
            # -----------------------------------------------------------------
            for srv_prod in services_products:
                srv_type_opt = srv_prod.get("eav", {}).get("type", "")
                srv_type = srv_type_opt.replace("opt_sh_type_", "") # "montage", "measure", "delivery", "lift"

                for srv_var in srv_prod.get("variants", []):
                    form_opt = srv_var.get("eav", {}).get("form_type", "")
                    form_slug = form_opt.replace("opt_form_type_", "") if form_opt else None
                    door_opts = srv_var.get("eav", {}).get("door_type_ids", [])
                    door_slugs = [d.replace("opt_door_type_", "") for d in door_opts]

                    and_conditions = []
                    if form_slug:
                        and_conditions.append({"var": "context.form", "op": "==", "val": form_slug})
                    if door_slugs:
                        and_conditions.append({"var": "context.door", "op": "in", "val": door_slugs})

                    data["binding_rules"].append({
                        "external_code": f"rule_{glass_var_code}_srv_{srv_var['external_code']}",
                        "pipeline_external_code": "pl_showers",
                        "name": f"Услуга {srv_type} к стеклу {glass_var['sku']}",
                        "role": "services",
                        "parent_type_key": "variant",
                        "parent_external_code": glass_var_code,
                        "child_type_key": "variant",
                        "child_external_code": srv_var["external_code"],
                        "conditions": {"and": and_conditions} if and_conditions else None,
                        "quantity_formula": "1",
                        "is_required": False,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

    # =========================================================================
    # 2. ИЕРАРХИЧЕСКИЕ ПРИВЯЗКИ 2-ГО УРОВНЯ (Заглушки к Профилю)
    # =========================================================================
    for prof_prod in profiles_products:
        p_type = prof_prod.get("eav", {}).get("type")
        if p_type != "opt_sh_type_profile":
            continue

        for prof_var in prof_prod.get("variants", []):
            prof_var_code = prof_var["external_code"]
            prof_furniture = prof_var.get("eav", {}).get("furniture_type_id")
            prof_thick = prof_var.get("eav", {}).get("glass_thickness")

            # Ищем соответствующую заглушку (cap) с таким же цветом и толщиной
            for cap_prod in profiles_products:
                if cap_prod.get("eav", {}).get("type") == "opt_sh_type_cap":
                    for cap_var in cap_prod.get("variants", []):
                        if cap_var.get("eav", {}).get("furniture_type_id") == prof_furniture and \
                           cap_var.get("eav", {}).get("glass_thickness") == prof_thick:

                            data["binding_rules"].append({
                                "external_code": f"rule_p_{prof_var_code}_cap_{cap_var['external_code']}",
                                "pipeline_external_code": "pl_showers",
                                "name": f"Заглушка к профилю {prof_var['sku']}",
                                "role": "cap",
                                "parent_type_key": "variant",
                                "parent_external_code": prof_var_code,
                                "child_type_key": "variant",
                                "child_external_code": cap_var["external_code"],
                                "conditions": None,  # Уже точно совпадает по родительскому профилю
                                "quantity_formula": "1",
                                "is_required": True,
                                "sort_order": rule_idx
                            })
                            rule_idx += 1

    # =========================================================================
    # 3. ИЕРАРХИЧЕСКИЕ ПРИВЯЗКИ 2-ГО УРОВНЯ (Фиксы к Штанге)
    # =========================================================================
    for cb_prod in crossbars_products:
        if cb_prod.get("eav", {}).get("type") == "opt_sh_type_crossbar":
            for cb_var in cb_prod.get("variants", []):
                cb_var_code = cb_var["external_code"]
                cb_furniture = cb_var.get("eav", {}).get("furniture_type_id")
                cb_type = cb_var.get("eav", {}).get("crossbar_type_id")

                # Крепление к стене (fix)
                for fix_prod in crossbars_products:
                    if fix_prod.get("eav", {}).get("type") == "opt_sh_type_fix":
                        for fix_var in fix_prod.get("variants", []):
                            if fix_var.get("eav", {}).get("furniture_type_id") == cb_furniture and \
                               fix_var.get("eav", {}).get("crossbar_type_id") == cb_type:

                                data["binding_rules"].append({
                                    "external_code": f"rule_cb_{cb_var_code}_fix_{fix_var['external_code']}",
                                    "pipeline_external_code": "pl_showers",
                                    "name": f"Крепление к стене для штанги {cb_var['sku']}",
                                    "role": "fix",
                                    "parent_type_key": "variant",
                                    "parent_external_code": cb_var_code,
                                    "child_type_key": "variant",
                                    "child_external_code": fix_var["external_code"],
                                    "conditions": None,
                                    "quantity_formula": "1",
                                    "is_required": True,
                                    "sort_order": rule_idx
                                })
                                rule_idx += 1

                # Держатель стекла (fix_glass)
                for fixg_prod in crossbars_products:
                    if fixg_prod.get("eav", {}).get("type") == "opt_sh_type_fix_glass":
                        for fixg_var in fixg_prod.get("variants", []):
                            if fixg_var.get("eav", {}).get("furniture_type_id") == cb_furniture and \
                               fixg_var.get("eav", {}).get("crossbar_type_id") == cb_type:

                                data["binding_rules"].append({
                                    "external_code": f"rule_cb_{cb_var_code}_fixglass_{fixg_var['external_code']}",
                                    "pipeline_external_code": "pl_showers",
                                    "name": f"Держатель стекла для штанги {cb_var['sku']}",
                                    "role": "fix_glass",
                                    "parent_type_key": "variant",
                                    "parent_external_code": cb_var_code,
                                    "child_type_key": "variant",
                                    "child_external_code": fixg_var["external_code"],
                                    "conditions": None,
                                    "quantity_formula": "1",
                                    "is_required": True,
                                    "sort_order": rule_idx
                                })
                                rule_idx += 1

    # Запись в файл
    with open(import_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"BOM rules for Showers successfully generated! Total rules count: {len(data['binding_rules'])}")

if __name__ == "__main__":
    run_rules_generation()
