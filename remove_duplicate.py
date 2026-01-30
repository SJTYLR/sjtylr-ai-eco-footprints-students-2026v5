#!/usr/bin/env python3
"""
Remove duplicate Relative Impact Breakdown section
"""

with open('/home/z/my-project/src/app/page.tsx', 'r') as f:
    lines = f.readlines()

# Find line 692 (second occurrence of "Relative Impact Breakdown")
target_line = None
for i, line in enumerate(lines):
    if i < 680 and 'Relative Impact Breakdown' in line:
        target_line = i

# Find the end of the second occurrence (go until we find the closing of the section)
if target_line:
    end_line = None
    for i in range(target_line, min(len(lines), 720)):
        # Look for the pattern of the section ending
        if '</CardContent>' in lines[i] and '            </Card>' in lines[i+1]:
            end_line = i + 1
            break

# Remove the duplicate section (lines 688 to end_line)
if end_line and target_line:
    new_lines = lines[:target_line] + lines[end_line+1:]
    
    with open('/home/z/my-project/src/app/page.tsx', 'w') as f:
        f.writelines(new_lines)
    
    print(f"Removed lines {target_line} to {end_line} ({end_line - target_line + 1} lines deleted)")
