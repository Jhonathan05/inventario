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

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    if (content.includes('<table')) {
        let hasOuterWrapper = content.includes('rounded-xl shadow-sm border border-gray-100 overflow-hidden');
        let hasGray200Wrapper = content.includes('rounded-xl shadow-sm border border-gray-200 overflow-hidden');
        let hasRoundedLgWrapper = content.includes('shadow ring-1 ring-black ring-opacity-5 rounded-lg');
        
        let hasInnerWrapper = content.includes('<div className="overflow-x-auto');
        
        if (!hasOuterWrapper && !hasOuterWrapper && !hasGray200Wrapper && !hasRoundedLgWrapper) {
            console.log(`WARNING: Potential missing outer wrapper in ${file}`);
        }
        if (!hasInnerWrapper) {
            console.log(`WARNING: Potential missing inner overflow wrapper in ${file}`);
        }
    }
});
