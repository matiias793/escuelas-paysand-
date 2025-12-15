const fs = require('fs');

// Data Definitions
const updates = {
    partida_agua_mineral: [
        "007", "019", "028", "044", "053", "059", "065", "066", "068", "072",
        "075", "079", "084", "086", "090", "108"
    ],
    servicios_alimentacion: {
        "INTERNADO": ["076", "081"],
        "DOBLE_COPA_LECHE": ["091", "104", "002", "113"],
        "DOBLE_COPA_LECHE_Y_ALMUERZO": [
            "048", "021", "027", "095", "014", "015", "025", "039", "035", "063",
            "071", "087", "097", "111", "114", "117", "058"
        ],
        "COPA_LECHE_Y_ALMUERZO": [
            "001", "077", "088", "089", "105", "099", "026", "103", "006", "106",
            "107", "033", "109", "115", "116", "064", "009", "110",
            "004", "096", "005", "010", "011", "098", "013", "023", "042", "100",
            "054", "057", "101", "092", "093", "112", "007", "012", "016", "017",
            "018", "019", "020", "022", "024", "028", "029", "030", "031", "032",
            "034", "036", "037", "038", "040", "041", "043", "044", "045", "046",
            "047", "049", "050", "051", "052", "053", "055", "056", "059", "060",
            "062", "065", "066", "067", "068", "070", "072", "075", "078", "079",
            "080", "082", "084", "085", "086", "090", "102", "108"
        ]
    }
};

// Recreate the initial seed list roughly to match what we have in schools.ts
// (Minimal properties needed to reconstruct the file)
// Note: We need the ZONES as well to be accurate.
// fetching the list from the previous step context mentally
const initialList = [
    { n: 1, z: 'Urbana' }, { n: 2, z: 'Urbana' }, { n: 4, z: 'Urbana' }, { n: 5, z: 'Urbana' }, { n: 6, z: 'Urbana' },
    { n: 7, z: 'Rural' }, { n: 9, z: 'Rural' }, { n: 10, z: 'Urbana' }, { n: 11, z: 'Urbana' }, { n: 12, z: 'Rural' },
    { n: 13, z: 'Urbana' }, { n: 14, z: 'Urbana' }, { n: 15, z: 'Urbana' }, { n: 16, z: 'Rural' }, { n: 17, z: 'Rural' },
    { n: 18, z: 'Rural' }, { n: 19, z: 'Rural' }, { n: 20, z: 'Rural' }, { n: 21, z: 'Urbana' }, { n: 22, z: 'Rural' },
    { n: 23, z: 'Urbana' }, { n: 24, z: 'Rural' }, { n: 25, z: 'Urbana' }, { n: 26, z: 'Urbana' }, { n: 27, z: 'Urbana' },
    { n: 28, z: 'Rural' }, { n: 29, z: 'Rural' }, { n: 30, z: 'Rural' }, { n: 31, z: 'Rural' }, { n: 32, z: 'Rural' },
    { n: 34, z: 'Rural' }, { n: 35, z: 'Urbana' }, { n: 36, z: 'Rural' }, { n: 37, z: 'Rural' }, { n: 38, z: 'Rural' },
    { n: 39, z: 'Urbana' }, { n: 40, z: 'Rural' }, { n: 41, z: 'Rural' }, { n: 42, z: 'Urbana' }, { n: 43, z: 'Rural' },
    { n: 44, z: 'Rural' }, { n: 45, z: 'Rural' }, { n: 46, z: 'Rural' }, { n: 47, z: 'Rural' }, { n: 48, z: 'Urbana' },
    { n: 49, z: 'Rural' }, { n: 50, z: 'Rural' }, { n: 51, z: 'Rural' }, { n: 52, z: 'Rural' }, { n: 53, z: 'Rural' },
    { n: 54, z: 'Urbana' }, { n: 55, z: 'Rural' }, { n: 56, z: 'Rural' }, { n: 57, z: 'Urbana' }, { n: 58, z: 'Urbana' },
    { n: 59, z: 'Rural' }, { n: 60, z: 'Rural' }, { n: 62, z: 'Rural' }, { n: 63, z: 'Urbana' }, { n: 64, z: 'Rural' },
    { n: 65, z: 'Rural' }, { n: 66, z: 'Rural' }, { n: 67, z: 'Rural' }, { n: 68, z: 'Rural' }, { n: 70, z: 'Rural' },
    { n: 71, z: 'Urbana' }, { n: 72, z: 'Rural' }, { n: 75, z: 'Rural' }, { n: 76, z: 'Rural' }, { n: 77, z: 'Urbana' },
    { n: 78, z: 'Rural' }, { n: 79, z: 'Rural' }, { n: 80, z: 'Rural' }, { n: 81, z: 'Rural' }, { n: 82, z: 'Rural' },
    { n: 84, z: 'Rural' }, { n: 85, z: 'Rural' }, { n: 86, z: 'Rural' }, { n: 87, z: 'Urbana' }, { n: 88, z: 'Urbana' },
    { n: 89, z: 'Urbana' }, { n: 90, z: 'Rural' }, { n: 91, z: 'Urbana' }, { n: 92, z: 'Urbana' }, { n: 93, z: 'Urbana' },
    { n: 95, z: 'Urbana' }, { n: 97, z: 'Urbana' }, { n: 99, z: 'Urbana' }, { n: 102, z: 'Rural' }, { n: 103, z: 'Urbana' },
    { n: 104, z: 'Urbana' }, { n: 106, z: 'Urbana' }, { n: 107, z: 'Urbana' }, { n: 108, z: 'Rural' }, { n: 109, z: 'Urbana' },
    { n: 110, z: 'Rural' }, { n: 111, z: 'Urbana' }, { n: 112, z: 'Urbana' }, { n: 113, z: 'Urbana' }, { n: 114, z: 'Urbana' },
    { n: 115, z: 'Urbana' }, { n: 116, z: 'Urbana' }, { n: 117, z: 'Urbana' }
];

// Helper to check if a number matches a string ID with leading zeros
const matches = (num, strId) => num === parseInt(strId, 10);

const schools = initialList.map(item => {
    let foodService = 'Sin Información';
    let hasBoarding = false;
    let hasWaterBudget = false;

    // Water Budget Logic
    if (updates.partida_agua_mineral.some(id => matches(item.n, id))) {
        hasWaterBudget = true;
    }

    // Food Service Logic
    if (updates.servicios_alimentacion.INTERNADO.some(id => matches(item.n, id))) {
        foodService = 'Régimen de Internado';
        hasBoarding = true;
    } else if (updates.servicios_alimentacion.DOBLE_COPA_LECHE.some(id => matches(item.n, id))) {
        foodService = 'Doble copa de leche';
    } else if (updates.servicios_alimentacion.DOBLE_COPA_LECHE_Y_ALMUERZO.some(id => matches(item.n, id))) {
        foodService = 'Doble copa de leche + Almuerzo';
    } else if (updates.servicios_alimentacion.COPA_LECHE_Y_ALMUERZO.some(id => matches(item.n, id))) {
        foodService = 'Copa de leche + Almuerzo';
    }

    // Construct Object
    return {
        id: item.n.toString(),
        number: item.n,
        name: `Escuela N° ${item.n}`,
        zone: item.z,
        location: {},
        category: 'Sin Categoría',
        hasBoarding,
        contact: { directorName: '', phone: '', email: '' },
        foodService,
        staff: { totalHours: 0, contractTypes: [] },
        supplies: { hasWaterBudget }
    };
});

// Output TS File Content
const fileContent = `import { School } from '@/types';

export const schools: School[] = ${JSON.stringify(schools, null, 2)};
`;

fs.writeFileSync('src/data/schools.ts', fileContent);
console.log('Successfully updated src/data/schools.ts');
