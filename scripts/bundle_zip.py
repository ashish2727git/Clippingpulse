#!/usr/bin/env python3
import os
import zipfile

def create_bundle():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    output_zip = os.path.join(root_dir, 'clipperpulse-standalone.zip')
    
    exclude_dirs = {'node_modules', '.git', 'dist', '.aistudio', '__pycache__', '.temp'}
    
    print(f"📦 Packaging ClipperPulse Standalone App from {root_dir}...")
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            for file in files:
                if file.endswith('.zip') or file.endswith('.tar.gz') or file == 'bun.lock':
                    continue
                path = os.path.join(root, file)
                arcname = os.path.relpath(path, root_dir)
                zf.write(path, arcname)
    
    size_kb = os.path.getsize(output_zip) / 1024
    print(f"✓ Standalone ZIP created: {output_zip} ({size_kb:.1f} KB)")
    return output_zip

if __name__ == '__main__':
    create_bundle()
