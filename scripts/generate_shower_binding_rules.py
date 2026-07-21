import os
import json

def find_project_root():
    curr = os.path.abspath(os.getcwd())
    while curr != os.path.dirname(curr):
        if os.path.exists(os.path.join(curr, "import/")):
            return curr
        curr = os.path.dirname(curr)
    return os.path.abspath(os.getcwd())

def run_rules_generation():
    project_root = find_project_root()
    import_file = os.path.join(project_root, "import/import_data.json")

    if not os.path.exists(import_file):
        print(f"Error: {import_file} not found.")
        return

    with open(import_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    data["binding_rules"] = []

    glasses_products = [p for p in data["products"] if p["product_type_external_code"] == "type_shower_glass"]
    profiles_products = [p for p in data["products"] if p["product_type_external_code"] == "type_shower_profile"]
    handles_products = [p for p in data["products"] if p["product_type_external_code"] == "type_shower_handle"]
    crossbars_products = [p for p in data["products"] if p["product_type_external_code"] == "type_shower_crossbar"]
    opensys_products = [p for p in data["products"] if p["product_type_external_code"] == "type_shower_open_system"]
    sealants_products = [p for p in data["products"] if p["product_type_external_code"] == "type_shower_sealant"]
    doorsteps_products = [p for p in data["products"] if p["product_type_external_code"] == "type_shower_doorstep"]
    services_products = [p for p in data["products"] if p["product_type_external_code"] == "type_shower_service"]

    rule_idx = 1

    for glass_prod in glasses_products:
        for glass_var in glass_prod["variants"]:
            glass_var_code = glass_var["external_code"]

            # Безопасное извлечение толщины стекла
            thick_val = glass_var.get("eav", {}).get("glass_thickness")
            if not thick_val:
                sku_parts = glass_var.get("sku", "").split("-")
                if len(sku_parts) >= 3:
                    thick_val = sku_parts[2].lower()  # Напр. "6mm"
                else:
                    thick_val = "8mm"

            # Безопасное извлечение ID цвета (из EAV варианта, EAV продукта или SKU)
            color_id = None
            if "eav" in glass_var and "color" in glass_var["eav"]:
                color_id = glass_var["eav"]["color"]
            elif "eav" in glass_prod and "color" in glass_prod["eav"]:
                color_id = glass_prod["eav"]["color"]
            else:
                sku_parts = glass_var.get("sku", "").split("-")
                if len(sku_parts) >= 2:
                    color_id = sku_parts[1]  # Напр. "id_1"
                else:
                    color_id = "id_1"

            glass_color_id = f"glass_{color_id}"  # Формируем "glass_id_1"

            for prof_prod in profiles_products:
                prof_slug = prof_prod["slug"]
                for prof_var in prof_prod["variants"]:
                    if prof_var["eav"].get("glass_thickness") == thick_val:
                        data["binding_rules"].append({
                            "external_code": f"rule_g_{glass_color_id}_{thick_val}_p_{prof_var['external_code']}",
                            "pipeline_external_code": "pl_showers",
                            "name": f"Match Profile {prof_slug} ({thick_val}) to Glass {glass_color_id} ({thick_val})",
                            "role": "profile",
                            "parent_type_key": "variant",
                            "parent_external_code": glass_var_code,
                            "child_type_key": "variant",
                            "child_external_code": prof_var["external_code"],
                            "conditions": None,
                            "quantity_formula": "1",
                            "is_required": True,
                            "sort_order": rule_idx
                        })
                        rule_idx += 1

            for seal_prod in sealants_products:
                seal_slug = seal_prod["slug"]
                for seal_var in seal_prod["variants"]:
                    if seal_var["eav"].get("glass_thickness") == thick_val:
                        data["binding_rules"].append({
                            "external_code": f"rule_g_{glass_color_id}_{thick_val}_s_{seal_var['external_code']}",
                            "pipeline_external_code": "pl_showers",
                            "name": f"Match Sealant {seal_slug} ({thick_val}) to Glass {glass_color_id} ({thick_val})",
                            "role": "sealant",
                            "parent_type_key": "variant",
                            "parent_external_code": glass_var_code,
                            "child_type_key": "variant",
                            "child_external_code": seal_var["external_code"],
                            "conditions": None,
                            "quantity_formula": "1",
                            "is_required": True,
                            "sort_order": rule_idx
                        })
                        rule_idx += 1

            for handle_prod in handles_products:
                hd_slug = handle_prod["slug"]
                for hd_var in handle_prod["variants"]:
                    data["binding_rules"].append({
                        "external_code": f"rule_g_{glass_color_id}_{thick_val}_h_{hd_var['external_code']}",
                        "pipeline_external_code": "pl_showers",
                        "name": f"Match Handle {hd_slug} to Glass {glass_color_id} ({thick_val})",
                        "role": "handle",
                        "parent_type_key": "variant",
                        "parent_external_code": glass_var_code,
                        "child_type_key": "variant",
                        "child_external_code": hd_var["external_code"],
                        "conditions": None,
                        "quantity_formula": "1",
                        "is_required": True,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

            for cb_prod in crossbars_products:
                cb_slug = cb_prod["slug"]
                for cb_var in cb_prod["variants"]:
                    data["binding_rules"].append({
                        "external_code": f"rule_g_{glass_color_id}_{thick_val}_cb_{cb_var['external_code']}",
                        "pipeline_external_code": "pl_showers",
                        "name": f"Match Crossbar {cb_slug} to Glass {glass_color_id} ({thick_val})",
                        "role": "crossbar",
                        "parent_type_key": "variant",
                        "parent_external_code": glass_var_code,
                        "child_type_key": "variant",
                        "child_external_code": cb_var["external_code"],
                        "conditions": None,
                        "quantity_formula": "1",
                        "is_required": False,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

            for os_prod in opensys_products:
                os_slug = os_prod["slug"]
                for os_var in os_prod["variants"]:
                    data["binding_rules"].append({
                        "external_code": f"rule_g_{glass_color_id}_{thick_val}_os_{os_var['external_code']}",
                        "pipeline_external_code": "pl_showers",
                        "name": f"Match OpenSys {os_slug} to Glass {glass_color_id} ({thick_val})",
                        "role": "open_system",
                        "parent_type_key": "variant",
                        "parent_external_code": glass_var_code,
                        "child_type_key": "variant",
                        "child_external_code": os_var["external_code"],
                        "conditions": None,
                        "quantity_formula": "1",
                        "is_required": True,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

            for ds_prod in doorsteps_products:
                ds_slug = ds_prod["slug"]
                for ds_var in ds_prod["variants"]:
                    data["binding_rules"].append({
                        "external_code": f"rule_g_{glass_color_id}_{thick_val}_ds_{ds_var['external_code']}",
                        "pipeline_external_code": "pl_showers",
                        "name": f"Match Doorstep {ds_slug} to Glass {glass_color_id} ({thick_val})",
                        "role": "doorstep",
                        "parent_type_key": "variant",
                        "parent_external_code": glass_var_code,
                        "child_type_key": "variant",
                        "child_external_code": ds_var["external_code"],
                        "conditions": None,
                        "quantity_formula": "1",
                        "is_required": False,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

            for srv_prod in services_products:
                srv_slug = srv_prod["slug"]
                for srv_var in srv_prod["variants"]:
                    data["binding_rules"].append({
                        "external_code": f"rule_g_{glass_color_id}_{thick_val}_srv_{srv_var['external_code']}",
                        "pipeline_external_code": "pl_showers",
                        "name": f"Match Service {srv_slug} to Glass {glass_color_id} ({thick_val})",
                        "role": "services",
                        "parent_type_key": "variant",
                        "parent_external_code": glass_var_code,
                        "child_type_key": "variant",
                        "child_external_code": srv_var["external_code"],
                        "conditions": None,
                        "quantity_formula": "1",
                        "is_required": False,
                        "sort_order": rule_idx
                    })
                    rule_idx += 1

    with open(import_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"BOM rules successfully compiled! Generated rules count: {len(data['binding_rules'])}")

if __name__ == "__main__":
    run_rules_generation()
