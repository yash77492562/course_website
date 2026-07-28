import os
import re

def process_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()

    # Generic replaces
    content = content.replace("style={{ padding: '20px' }}", "className=\"p-[20px]\"")
    content = content.replace("style={{ paddingLeft: '32px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px' }}", "className=\"pl-[32px] pr-[24px] pt-[16px] pb-[16px]\"")
    content = content.replace("style={{ marginBottom: '20px' }}", "className=\"mb-[20px]\"")
    content = content.replace("style={{ display: 'flex', alignItems: 'center', gap: '6px' }}", "className=\"flex items-center gap-[6px]\"")
    content = content.replace("style={{ maxWidth: '720px' }}", "className=\"max-w-[720px]\"")
    
    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
print("Done")
