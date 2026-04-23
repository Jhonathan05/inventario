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
    const content = fs.readFileSync(file, 'utf-8');
    const openDivs = (content.match(/<div(\s|>)/g) || []).length;
    const closeDivs = (content.match(/<\/div>/g) || []).length;
    
    if (openDivs !== closeDivs) {
        console.log(`MISMATCH in ${file}: Opens (${openDivs}) vs Closes (${closeDivs})`);
    }

    // Check for specific "HelpDesk table pattern" imbalances
    if (content.includes('bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden') && 
        content.includes('overflow-x-auto')) {
        // This is a rough check, but let's see if we see <table> followed by exactly one </div> before something else
        // Actually, the Babel error is the best way to find them.
    }
});
