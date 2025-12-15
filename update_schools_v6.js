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

// Data to inject
const localities = [
    { "numero": "009", "localidad": "Colonia Paysandú" },
    { "numero": "016", "localidad": "Cerro Chato" },
    { "numero": "017", "localidad": "Piñera" },
    { "numero": "019", "localidad": "Estación Porvenir" },
    { "numero": "020", "localidad": "Arbolito" },
    { "numero": "022", "localidad": "Palmar de Quebracho" },
    { "numero": "024", "localidad": "Costa de Sacra" },
    { "numero": "029", "localidad": "Tiatucura" },
    { "numero": "030", "localidad": "Arroyo Malo" },
    { "numero": "031", "localidad": "Sauce de Buricayupí" },
    { "numero": "034", "localidad": "Puntas de Buricayupi" },
    { "numero": "036", "localidad": "Pueblo Araújo" },
    { "numero": "037", "localidad": "Puente de Guaviyu" },
    { "numero": "040", "localidad": "Colonia Pintos Viana" },
    { "numero": "041", "localidad": "Puntas de Cangüé" },
    { "numero": "043", "localidad": "Parada Km 444" },
    { "numero": "044", "localidad": "Colonia Las Delicias" },
    { "numero": "047", "localidad": "Colonia 19 de Abril" },
    { "numero": "049", "localidad": "Piedra Sola" },
    { "numero": "051", "localidad": "Guayabos" },
    { "numero": "052", "localidad": "El Eucalipto" },
    { "numero": "053", "localidad": "Colonia Arroyo Malo" },
    { "numero": "055", "localidad": "Colonia La Palma" },
    { "numero": "056", "localidad": "Colonia Juan Gutiérrez" },
    { "numero": "059", "localidad": "Sauce del Queguay Abajo" },
    { "numero": "062", "localidad": "Federación" },
    { "numero": "065", "localidad": "Ros de Oger" },
    { "numero": "067", "localidad": "Parada Rivas" },
    { "numero": "070", "localidad": "Santa Kilda" },
    { "numero": "072", "localidad": "Parada Dayman" },
    { "numero": "075", "localidad": "Saladero Guaviyú" },
    { "numero": "076", "localidad": "Paso Castell de Corrales" },
    { "numero": "080", "localidad": "Tres Bocas" },
    { "numero": "081", "localidad": "Cuchilla del Fuego" },
    { "numero": "082", "localidad": "Pandule" },
    { "numero": "086", "localidad": "Meseta de Artigas" },
    { "numero": "102", "localidad": "Colonia Ros de Oger" },
    { "numero": "110", "localidad": "Pueblo Gallinal" }
];

// Create a map for faster lookup
// Removing leading zeros for robust integer comparison
const localityMap = {};
localities.forEach(item => {
    const num = parseInt(item.numero, 10);
    localityMap[num] = item.localidad;
});

schools = schools.map(school => {
    // Check if we have a locality for this school number
    if (localityMap[school.number]) {
        if (!school.location) {
            school.location = {};
        }
        school.location.city = localityMap[school.number];
    }
    return school;
});

const newContent = `import { School } from '@/types';

export const schools: School[] = ${JSON.stringify(schools, null, 2)};
`;

fs.writeFileSync(filePath, newContent);
console.log('Successfully applied Rural Localities updates.');
