const fs = require('fs');

const filePath = 'src/data/schools.ts';
let fileContent = fs.readFileSync(filePath, 'utf8');

// Regex to extract the array content reliably
// Matches "export const schools: School[] = " followed by the array until the end ;
const match = fileContent.match(/export const schools: School\[\] = (\[[\s\S]*\]);/);

if (!match || !match[1]) {
    console.error("Could not find array in file matching regex");
    process.exit(1);
}

const arrayString = match[1];
let schools;
try {
    schools = JSON.parse(arrayString);
} catch (e) {
    console.error("Failed to parse extracted JSON:", e.message);
    try {
        schools = eval('(' + arrayString + ')');
    } catch (e2) {
        console.error("Failed to eval extracted content:", e2.message);
        process.exit(1);
    }
}

// UPDATE LOGIC
// Requirements:
// 1. CBR: 16, 17, 50 -> hasCBR = true
// 2. Pluridocentes: 007, 012, 016, 024, 032, 052, 085, 110 -> ruralModal = 'PLURIDOCENTE'
// 3. Unidocentes: All other RURALS -> ruralModal = 'UNIDOCENTE'
// 4. Urban -> ruralModal = null (or undefined)

const cbrIds = ["016", "017", "050"];
const pluridocenteIds = ["007", "012", "016", "024", "032", "052", "085", "110"];

// Helper to match IDs (handles string/number mismatch, leading zeros)
const matches = (schoolId, list) => list.includes(schoolId.toString().padStart(3, '0')) || list.includes(schoolId.toString());

schools = schools.map(school => {
    const id = school.number.toString().padStart(3, '0');

    // A. CBR
    school.hasCBR = matches(id, cbrIds);

    // B. Modalidad Rural
    if (school.zone === 'Rural') {
        if (matches(id, pluridocenteIds)) {
            school.ruralModal = 'PLURIDOCENTE';
        } else {
            school.ruralModal = 'UNIDOCENTE';
        }
    } else {
        // Explicitly set to null or delete property for Urban if preferred. 
        // Typescript says optional string or null.
        school.ruralModal = null;
    }

    return school;
});

// OUTPUT
const newContent = `import { School } from '@/types';

export const schools: School[] = ${JSON.stringify(schools, null, 2)};
`;

fs.writeFileSync(filePath, newContent);
console.log('Successfully applied Rural Classification updates.');
