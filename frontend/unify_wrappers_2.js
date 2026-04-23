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

    // We want to force all known table wrappers to:
    // className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    
    // Specifically target ActasList
    content = content.replace(/className="glass rounded-2xl border border-charcoal-[0-9]+ overflow-hidden shadow-sm"/g, 'className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"');
    
    // Specifically target the others missed
    content = content.replace(/className="glass overflow-hidden mt-6"/g, 'className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6"');
    content = content.replace(/className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden"/g, 'className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6"');
    content = content.replace(/<div className="overflow-x-auto rounded-lg border border-gray-200 /g, '<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto ');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf-8');
        modifiedFiles++;
        console.log(`Modified wrapper in: ${file}`);
    }
});

console.log(`Total supplemental wrapper files modified: ${modifiedFiles}`);
