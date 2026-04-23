import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.join(__dirname, 'src/pages');

function getFiles(dir, files = []) {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else if (name.endsWith('.jsx')) {
            files.push(name);
        }
    }
    return files;
}

const files = getFiles(targetDir);
let modifiedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;

    // Apply specific classes to <th>.
    // Categorias standard: px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
    
    // Replace <th className="...">, keeping track of alignment
    content = content.replace(/<th([^>]*)className="([^"]+)"/g, (match, beforeClass, existingClasses) => {
        let align = 'text-left';
        if (existingClasses.includes('text-right')) align = 'text-right';
        if (existingClasses.includes('text-center')) align = 'text-center';
        
        const newClasses = `px-6 py-3 ${align} text-xs font-medium text-gray-500 uppercase tracking-wider`;
        return `<th${beforeClass}className="${newClasses}"`;
    });

    // Also look for <th> without className but with or without other attributes
    content = content.replace(/<th(?!\s+className\s*=)([^>]*)>/g, (match, attrs) => {
        const newClasses = `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`;
        return `<th${attrs} className="${newClasses}">`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf-8');
        modifiedFiles++;
        console.log(`Modified TH in: ${file}`);
    }
});

console.log(`Total TH files modified: ${modifiedFiles}`);
