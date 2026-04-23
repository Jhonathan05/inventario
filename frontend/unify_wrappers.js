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

const replacements = [
    {
        from: /<div className="glass overflow-hidden([^"]*)">\s*<div className="overflow-x-auto( sm:-mx-6 lg:-mx-8)?">/g,
        to: '<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden$1">\n                <div className="overflow-x-auto$2">'
    },
    {
        from: /<div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">/g,
        to: '<div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">\n                        <div className="overflow-x-auto">'
    },
    {
        from: /<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">/g,
        to: '<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">\n                <div className="overflow-x-auto">'
    },
    {
        from: /<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">/g,
        to: '<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">'
    }
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;

    replacements.forEach(rep => {
        content = content.replace(rep.from, rep.to);
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf-8');
        modifiedFiles++;
        console.log(`Modified wrapper in: ${file}`);
    }
});

console.log(`Total wrapper files modified: ${modifiedFiles}`);
