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

// Logic: Shared Building
// List of numbers provided: 57, 101, 4, 96, 11, 98, 42, 100, 89, 105, 99, 26, 6, 106, 107, 33
const sharedBuildingList = [
    57, 101, 4, 96, 11, 98, 42, 100, 89, 105, 99, 26, 6, 106, 107, 33
];

const sharedSet = new Set(sharedBuildingList.map(n => n.toString()));

schools = schools.map(school => {
    if (sharedSet.has(school.number.toString())) {
        school.hasSharedBuilding = true;
    } else {
        // Ensure property exists if we want it consistent, or leave undefined if optional.
        // Type says `hasSharedBuilding?: boolean`. Let's leave it undefined if false to save space, or false.
        // Let's set it to false explicitly implies 'checked and not shared'. 
        // But for minimal diff, let's only set true. If we want to support logic, we check for truthy.
        // However, if we run this multiple times, we might want to reset previous Trues that are no longer true? 
        // For this specific task, we are adding. 
    }
    return school;
});

const newContent = `import { School } from '@/types';

export const schools: School[] = ${JSON.stringify(schools, null, 2)};
`;

fs.writeFileSync(filePath, newContent);
console.log('Successfully applied Shared Building updates.');
