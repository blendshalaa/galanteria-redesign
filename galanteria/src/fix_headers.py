import os
import re

directory = "/home/blend/Galanteria-front/galanteria/src/Pages"

template = """<div className='editorial-page-header'>
          <div className='header-top'>
            <span className='bento-eyebrow'>Galanteria Group</span>
            <div className='header-line'></div>
          </div>
          <h1>{1}</h1>
        </div>"""

pattern = re.compile(
    r"<div\s+className=['\"]([a-zA-Z0-9_-]+-text)['\"]>\s*<h1>\s*(.*?)\s*</h1>\s*</div>",
    re.DOTALL
)

count = 0
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(".jsx"):
            filepath = os.path.join(root, file)
            with open(filepath, "r") as f:
                content = f.read()
            
            def replacer(match):
                title = match.group(2)
                return template.replace("{1}", title.strip())
            
            new_content = pattern.sub(replacer, content)
            
            if new_content != content:
                with open(filepath, "w") as f:
                    f.write(new_content)
                print(f"Updated: {filepath}")
                count += 1

print(f"Total files updated: {count}")
