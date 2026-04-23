import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.join(__dirname, 'src/pages');

// Simple glob replacement since we don't have glob package in container natively without npm install
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

    // Replace <table className="..."> with our unified one
    content = content.replace(/<table\s+className="[^"]+"/g, '<table className="min-w-full divide-y divide-gray-200"');
    
    // Replace <thead className="..."> with unified one
    content = content.replace(/<thead\s+className="[^"]+"/g, '<thead className="bg-gray-50"');
    
    // Replace <tbody className="..."> with unified one
    content = content.replace(/<tbody\s+className="[^"]+"/g, '<tbody className="bg-white divide-y divide-gray-200"');
    
    // Replace row hovers inside tbody
    content = content.replace(/<tr\s+key=\{[^}]+\}\s+className="[^"]*hover:[^"]+"/g, (match) => {
        return match.replace(/className="[^"]+"/, 'className="hover:bg-gray-50 transition-colors"');
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf-8');
        modifiedFiles++;
        console.log(`Modified: ${file}`);
    }
});

console.log(`Total files modified: ${modifiedFiles}`);
