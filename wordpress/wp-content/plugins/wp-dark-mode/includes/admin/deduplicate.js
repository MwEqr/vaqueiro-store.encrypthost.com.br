const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\Shimul\\Local Sites\\wpdarkmode\\app\\public\\wp-content\\plugins\\wp-dark-mode\\includes\\admin\\class-strings.php', 'utf8');

const regex = /'([^']+)'\s*=>\s*__\(\s*'([^']+)',\s*'wp-dark-mode'\s*\),/g;
let match;
const keys = new Map();
const duplicates = [];

while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const value = match[2];
    if (keys.has(key)) {
        duplicates.push(key);
    } else {
        keys.set(key, value);
    }
}

console.log('Duplicates found:', [...new Set(duplicates)]);

let output = 'array(\n';
for (const [key, value] of keys) {
    output += `\t\t\t\t\t'${key}'`.padEnd(40) + `=> __( '${value.replace(/'/g, "\\'")}', 'wp-dark-mode' ),\n`;
}
output += '\t\t\t\t)';

fs.writeFileSync('deduplicated_array.txt', output);
console.log('Deduplicated array written to deduplicated_array.txt');
