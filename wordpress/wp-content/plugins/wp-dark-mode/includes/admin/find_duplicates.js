const fs = require('fs');
const content = fs.readFileSync(process.argv[2], 'utf8');
const regex = /'([^']+)'\s+=>/g;
let match;
const counts = {};
while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    counts[key] = (counts[key] || 0) + 1;
}
for (const key in counts) {
    if (counts[key] > 1) {
        console.log(`${key}: ${counts[key]}`);
    }
}
