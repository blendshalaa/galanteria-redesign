const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'Pages');

function refactorFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            refactorFiles(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Remove <NavBar />
            content = content.replace(/<NavBar\s*\/>/g, '');
            // Remove <Footer />
            content = content.replace(/<Footer\s*\/>/g, '');
            
            // Remove unused imports to prevent warnings (optional, but good)
            content = content.replace(/import NavBar from '.*?';?\n?/g, '');
            content = content.replace(/import Footer from '.*?';?\n?/g, '');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Refactored: ${fullPath}`);
            }
        }
    });
}

refactorFiles(directoryPath);
console.log('Done refactoring!');
