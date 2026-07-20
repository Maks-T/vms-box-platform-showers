import os

target_dir = "/home/maks-t/vms-box-platform-showers/packages/box/valerie/industry-showers"

replacements = {
    "Cctv": "Showers",
    "cctv": "showers",
    "CCTV": "Showers"
}

for root, dirs, files in os.walk(target_dir):
    for file in files:
        file_path = os.path.join(root, file)
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
            
            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
        except Exception as e:
            print(f"Error processing content of {file_path}: {e}")

for root, dirs, files in os.walk(target_dir, topdown=False):
    for file in files:
        old_name = file
        new_name = file
        for old, new in replacements.items():
            new_name = new_name.replace(old, new)
        
        if new_name != old_name:
            old_path = os.path.join(root, old_name)
            new_path = os.path.join(root, new_name)
            os.rename(old_path, new_path)

    for directory in dirs:
        old_name = directory
        new_name = directory
        for old, new in replacements.items():
            new_name = new_name.replace(old, new)
        
        if new_name != old_name:
            old_path = os.path.join(root, old_name)
            new_path = os.path.join(root, new_name)
            os.rename(old_path, new_path)

print("Refactoring successfully completed!")