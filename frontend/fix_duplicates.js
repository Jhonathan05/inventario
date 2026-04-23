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
let fixed = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;

    // Detect double className attributes like className="..." className="..."
    content = content.replace(/(<[^>]+)(\s+className="[^"]+")([^>]*?)(\s+className="[^"]+")([^>]*>)/g, (match, p1, class1, mid, class2, end) => {
        // Keep the more specific one if possible, usually the first one (class1) because it has the properly modified text-right or the unified ones.
        return `${p1}${class1}${mid}${end}`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf-8');
        fixed++;
        console.log(`Fixed duplicate class in: ${file}`);
    }
});

console.log(`Fixed duplicate classes in ${fixed} files.`);
