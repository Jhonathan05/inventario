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

    // Due to /<th/ match, <thead might have been accidentally altered to <thead ... className="...">
    // Let's reset all <thead ...> carefully back to <thead className="bg-gray-50">
    content = content.replace(/<thead[^>]*>/g, '<thead className="bg-gray-50">');
    
    fs.writeFileSync(file, content, 'utf-8');
});

console.log("Fixed thead syntax error.");
