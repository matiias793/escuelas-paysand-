const fs = require('fs');

// Read the current file to get the base schools array
// We will do a bit of a hack to load the module in Node without transpiling TS
// Since the file is simple "export const schools = [...]", we can just read it as text, 
// remove the TS parts, eval it (or just parse JSON if it was JSON) 
// BUT, since we generated it previously as a JS object, let's just use the known data logic again to handle it cleanly.

// Actually, better approach: 
// 1. Read existing file content string.
// 2. Extract the JSON part.
// 3. Parse it.
// 4. Apply updates.
// 5. Write back.

const filePath = 'src/data/schools.ts';
let fileContent = fs.readFileSync(filePath, 'utf8');

// The file looks like:
// import { School } from '@/types';
// export const schools: School[] = [...objects...];

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
    // Fallback: try to just eval the string if it's valid JS object literal
    // This is dangerous but we own the file.
    try {
        schools = eval('(' + arrayString + ')');
    } catch (e2) {
        console.error("Failed to eval extracted content:", e2.message);
        process.exit(1);
    }
}

// DEFINITION OF UPDATES
const updates = {
    especial: ["077", "088"],
    tiempo_completo: ["014", "015", "039", "087", "097", "111", "114", "117"],
    alimentacion: {
        internado: ["076", "081"],
        rural_especial: ["064"]
    }
};

// HELPER
const matches = (schoolId, list) => list.includes(schoolId.toString().padStart(3, '0')) || list.includes(schoolId.toString());

// APPLY LOGIC
schools = schools.map(school => {
    // Ensure ID format for matching
    const id = school.number.toString().padStart(3, '0');

    // 1. Tags / Categories
    if (matches(id, updates.especial)) {
        school.category = 'Especial';
    } else if (matches(id, updates.tiempo_completo)) {
        school.category = 'Tiempo Completo';
    }
    // If not matched above, keys remain as populated (Común usually) or 'Sin Categoría' if it was new.
    // Requirement implies "Marcar ÚNICAMENTE", but doesn't explicitly say "Unmark others". 
    // However, if a school was erroneously marked TC before, we should probably reset it?
    // Let's assume the previous seed was "Común" by default so we are just elevating these.

    // 2. Food Service Logic
    // STRICT ORDER APPLIES

    // A. Internados
    if (matches(id, updates.alimentacion.internado)) {
        school.foodService = 'Régimen de Internado';
        school.hasBoarding = true;
    }

    // B. Rural Specific Mapping
    else if (matches(id, updates.alimentacion.rural_especial)) {
        school.foodService = 'Copa de leche + Almuerzo';
    }

    // C. All Other Rurals
    else if (school.zone === 'Rural') {
        school.foodService = 'Solo Almuerzo';
        // Ensure not marked as boarding unless it was 76/81 (handled above)
        if (school.foodService !== 'Régimen de Internado') {
            school.hasBoarding = false;
        }
    }

    return school;
});

// Write back
const newContent = `import { School } from '@/types';

export const schools: School[] = ${JSON.stringify(schools, null, 2)};
`;

fs.writeFileSync(filePath, newContent);
console.log('Successfully applied strict data updates.');
