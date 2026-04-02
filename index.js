// Requerimos el módulo File System basado en promesas de NodeJS
const fs = require('fs').promises;

const API_URL = 'https://thronesapi.com/api/v2/Characters'; 
const FILE_PATH = './personajes.json';


// ==========================================
// API Fetch - File System
// ==========================================

// 1.a) Recuperar la información de todos los personajes (GET)
async function getAllPersonajes() {
    try {
        console.log("--- 1.a) Ejecutando GET de todos los personajes ---");
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(`✅ Se obtuvieron ${data.length} personajes.`);
        return data;
    } catch (error) {
        console.error("❌ Error al recuperar los personajes:", error);
    }
}

// 1.b) Agregar un nuevo personaje (POST)
async function postNuevoPersonaje(nuevoPj) {
    try {
        console.log("\n--- 1.b) Ejecutando POST para agregar personaje ---");
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoPj)
        });
        
        // La API pública suele ser de solo lectura, por lo que mostramos el status de la petición
        console.log("Status de la respuesta POST:", response.status);
    } catch (error) {
        console.error("❌ Error al hacer POST:", error);
    }
}

// 1.c) Buscar la información de un determinado personaje por ID (GET)
async function getPersonajeById(id) {
    try {
        console.log(`\n--- 1.c) Ejecutando GET del personaje con ID: ${id} ---`);
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        console.log("✅ Personaje encontrado:", data.fullName || data);
    } catch (error) {
        console.error(`❌ Error al buscar personaje con ID ${id}:`, error);
    }
}

// 1.d) Persistir los datos de la primer consulta en un archivo local JSON
async function persistirDatosJSON(datos, ruta) {
    try {
        console.log("\n--- 1.d) Persistiendo datos en disco ---");
        await fs.writeFile(ruta, JSON.stringify(datos, null, 2));
        console.log(`✅ Archivo guardado correctamente en: ${ruta}`);
    } catch (error) {
        console.error("❌ Error al guardar el archivo JSON:", error);
    }
}



// ==========================================
// FUNCIÓN PRINCIPAL DE EJECUCIÓN (MAIN)
// ==========================================
async function main() {
    // Recuperar la información de todos los personajes GET
    const todosLosPjs = await getAllPersonajes();
    if (todosLosPjs) {
        await persistirDatosJSON(todosLosPjs, FILE_PATH);
    }

    // Agregar un nuevo personaje POST
    const nuevoPersonaje = { firstName: "G. Alejandro", lastName: "Riveiro", fullName: "G. Alejandro Riveiro" };
    await postNuevoPersonaje(nuevoPersonaje);
    
    // Buscar la información de un determinado personaje x Id, Id 0 es Daenerys
    await getPersonajeById(0);

   
    
}


main();