const fs = require('fs');

const filePath = 'src/data/schools.ts';
let fileContent = fs.readFileSync(filePath, 'utf8');

const match = fileContent.match(/export const schools: School\[\] = (\[[\s\S]*\]);/);

if (!match || !match[1]) {
    console.error("Could not find array in file");
    process.exit(1);
}

const arrayString = match[1];
let schools;
try {
    schools = JSON.parse(arrayString);
} catch (e) {
    try {
        schools = eval('(' + arrayString + ')');
    } catch (e2) {
        console.error("Failed to parse content");
        process.exit(1);
    }
}

// DEFINITION OF UPDATES
// TE: 1
// DT: 95, 71, 94, 2, 5, 23, 13, 48, 112
// TPA: 27
// TC: 58 (add to existing)
// JJC: 91, 116, 115, 109, 103
// JDT: 104, 91
// Arte: 113

const updates = {
    'Tiempo Extendido': ["1"],
    'Doble Turno': ["95", "71", "94", "2", "5", "23", "13", "48", "112"],
    'Tiempo Pedagógico Ampliado': ["27"],
    'Tiempo Completo': ["58", "63"], // This will just ADD to existing TC schools logic if we are careful, or here we explicitly set these.
    // Logic: Iterate schools. If ID matches list, set category.
    // Specific Overrides:
    'Jardín de Jornada Completa': ["91", "116", "115", "109", "103"],
    'Jardín de Jornada Doble Turno': ["104", "91"], // 91 is here too. User listed it in both. Last one implies JDT. 
    'Escuela de Arte': ["113"]
};

// Flatten to a mapping for simpler lookup: ID -> Category
// Use a specific order to resolve conflicts (91 case).
// Order of application: TE, DT, TPA, TC, JJC, JDT, Arte
const categoryMap = {};

// Helper
const addToMap = (list, category) => {
    list.forEach(id => {
        categoryMap[id.toString().padStart(3, '0')] = category;
        categoryMap[id.toString()] = category; // handle "1" vs "001"
    });
};

addToMap(updates['Tiempo Extendido'], 'Tiempo Extendido');
addToMap(updates['Doble Turno'], 'Doble Turno');
addToMap(updates['Tiempo Pedagógico Ampliado'], 'Tiempo Pedagógico Ampliado');
addToMap(updates['Tiempo Completo'], 'Tiempo Completo');
addToMap(updates['Jardín de Jornada Completa'], 'Jardín de Jornada Completa');
addToMap(updates['Jardín de Jornada Doble Turno'], 'Jardín de Jornada Doble Turno'); // 91 overwrites here
addToMap(updates['Escuela de Arte'], 'Escuela de Arte');


schools = schools.map(school => {
    const id = school.number.toString();
    const paddedId = id.padStart(3, '0');

    // Check if this school has a pending update in our map
    if (categoryMap[id] || categoryMap[paddedId]) {
        school.category = categoryMap[id] || categoryMap[paddedId];

        // Rename if it is a Garden
        if (school.category.includes('Jardín')) {
            school.name = school.name.replace('Escuela', 'Jardín');
        }
    }

    return school;
});

const newContent = `import { School } from '@/types';

export const schools: School[] = ${JSON.stringify(schools, null, 2)};
`;

fs.writeFileSync(filePath, newContent);
console.log('Successfully applied Urban Categorization updates.');
