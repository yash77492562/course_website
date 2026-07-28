import os
import re

def process_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()

    # Pattern to match: className="A" className="B"
    # and merge to: className="A B"
    # We'll use a regex that handles both static and dynamic classNames carefully,
    # but since these are all static or template literals, we can write a simple sub.
    
    # Simple static merge: className="foo" className="bar" -> className="foo bar"
    content = re.sub(r'className="([^"]+)"\s+className="([^"]+)"', r'className="\1 \2"', content)
    
    # Handle the specific template literal one:
    # className="pl-[32px] pr-[24px] pt-[16px] pb-[16px]" className={`text-gray-700 text-base ${itemIndex > 0 ? 'border-t border-gray-100' : ''}`}
    content = content.replace('className="pl-[32px] pr-[24px] pt-[16px] pb-[16px]" className={`text-gray-700 text-base ${itemIndex > 0 ? \'border-t border-gray-100\' : \'\'}`}', 'className={`pl-[32px] pr-[24px] pt-[16px] pb-[16px] text-gray-700 text-base ${itemIndex > 0 ? \'border-t border-gray-100\' : \'\'}`}')
    
    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
print("Done")
