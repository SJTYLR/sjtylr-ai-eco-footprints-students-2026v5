#!/usr/bin/env python3
"""
Reposition stacked bar section to be after Equivalencies card
"""

import sys

with open('/home/z/my-project/src/app/page.tsx', 'r') as f:
    lines = f.readlines()

# Find the line where stacked bar section starts (line with "h-8 mb-2 relative bg-white")
stacked_bar_start = None
for i, line in enumerate(lines):
    if 'h-8 mb-2 relative bg-white' in line and not stacked_bar_start:
        stacked_bar_start = i

# Find where Impact Equivalencies card ends (look for Lightbulb Hours)
equiv_end = None
for i, line in enumerate(lines):
    if 'Lightbulb Hours' in line:
        equiv_end = i
        break

# Find Relative Impact Breakdown card opening
relative_impact_open = None
for i, line in enumerate(lines[stacked_bar_start:], equiv_end]):
    if 'Relative Impact Breakdown' in line and '</CardHeader>' in lines[i+1]:
        relative_impact_open = i
        break

# Extract the entire stacked bar section (from start to relative_impact_open)
stacked_bar_section = []
stacked_bar_in_section = False
for i in range(stacked_bar_start, equiv_end):
    line = lines[i]
    if line.strip() == '':
        continue
    
    stacked_bar_section.append(line)
    
    # Stop when we hit the next card header
    if 'CardTitle' in line and 'Time-Based Projections' in line:
        break

# Find a clean insertion point (look for end of Equivalencies card closing)
insertion_point = None
for i in range(equiv_end):
    line = lines[i]
    if '</Card>' in line and i < len(lines) - 1:
        insertion_point = i
        break

# Now build new content
new_lines = []

# Keep everything before insertion point
new_lines.extend(lines[:insertion_point])

# Add Equivalencies CardContent closing tag
new_lines.append('              </CardContent>\n')
new_lines.append('            </Card>\n')

# Add Impact Equivalencies CardHeader opening
new_lines.append('\n            <Card className="mb-8">\n')

# Add the stacked bar section
if stacked_bar_section:
    new_lines.extend(stacked_bar_section)
else:
    print("No stacked bar section found - nothing to reposition")

# Add Relative Impact Breakdown Card opening
new_lines.append('              <CardHeader\n')
new_lines.append('                className="cursor-pointer"\n')
new_lines.append('                onClick={() => setShowProjections(!showProjections)}\n')

# Keep everything after Relative Impact Breakdown header
new_lines.extend(lines[relative_impact_open:])

# Write back
with open('/home/z/my-project/src/app/page.tsx', 'w') as f:
    f.writelines(new_lines)
    
print("Stacked bar section repositioned successfully!")
