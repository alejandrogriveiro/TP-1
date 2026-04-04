// Requerimos el módulo File System basado en promesas de NodeJS
const fs = require('fs').promises;

const API_URL = 'https://thronesapi.com/api/v2/Characters'; 
const FILE_PATH = './personajes.json';
const NEW_FILE_PATH = './nombres_ids.json';

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
        
        console.log("Status de la respuesta POST:", response.status); // Mostramos el status de la operación
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
        await fs.writeFile(ruta, JSON.stringify(datos, null, 2));
        console.log(`✅ Archivo guardado/actualizado correctamente en: ${ruta}`);
    } catch (error) {
        console.error("❌ Error al guardar el archivo JSON:", error);
    }
}

// ========================================================
// Métodos comunes y avanzados - File System
// ========================================================

// Función auxiliar para leer y parsear el archivo JSON
async function leerArchivoPersonajes(ruta) {
    try {
        const dataRaw = await fs.readFile(ruta, 'utf-8');
        return JSON.parse(dataRaw);
    } catch (error) {
        console.error(`❌ Error al leer el archivo ${ruta}:`, error);
        return [];
    }
}

// 2.a) Agregar un personaje al final del archivo
async function agregarPersonajeAlFinal() {
    try {
        console.log("\n--- 2.a) Agregando un personaje al FINAL ---");
        const personajes = await leerArchivoPersonajes(FILE_PATH);
        personajes.push({ id: 999, fullName: "Luis Garcia", family: "Garcia" });
        await persistirDatosJSON(personajes, FILE_PATH); // Sobrescribe el archivo
        console.log("✅ Personaje agregado al FINAL (push).");
    } catch (error) {
        console.error("❌ Error en 2.a:", error);
    }
}

// 2.b) Agregar dos personajes al inicio del archivo
async function agregarPersonajesAlInicio() {
    try {
        console.log("\n--- 2.b) Agregando dos personajes al INICIO ---");
        const personajes = await leerArchivoPersonajes(FILE_PATH);
        personajes.unshift(
            { id: 1000, fullName: "Marcela Lopez", family: "Lopez" },
            { id: 1001, fullName: "Raul Romero", family: "Romero" }
        );
        await persistirDatosJSON(personajes, FILE_PATH); // Sobrescribe el archivo
        console.log("✅ Dos personajes agregados al INICIO (unshift).");
    } catch (error) {
        console.error("❌ Error en 2.b:", error);
    }
}

// 2.c) Eliminar el primer personaje, mostrar en consola el elemento eliminado
async function eliminarPrimerPersonaje() {
    try {
        console.log("\n--- 2.c) Eliminando el primer personaje ---");
        const personajes = await leerArchivoPersonajes(FILE_PATH);
        const pjEliminado = personajes.shift();
        await persistirDatosJSON(personajes, FILE_PATH); // Sobrescribe el archivo
        console.log("✅ Personaje ELIMINADO del inicio (shift):", pjEliminado);
    } catch (error) {
        console.error("❌ Error en 2.c:", error);
    }
}

// 2.d) Crear un nuevo archivo que solo contenga los: id y nombres de los personajes
async function crearArchivoNombresIds() {
    try {
        console.log("\n--- 2.d) Creando nuevo archivo con ID y Nombres ---");
        // Lee el archivo original que ya tiene todas las modificaciones de 2a, 2b y 2c
        const personajes = await leerArchivoPersonajes(FILE_PATH); 
        const mapeados = personajes.map(pj => {
            return { id: pj.id, nombre: pj.fullName };
        });
        await persistirDatosJSON(mapeados, NEW_FILE_PATH); // Crea el archivo nuevo
    } catch (error) {
        console.error("❌ Error en 2.d:", error);
    }
}

// 2.e) Ordenar por nombre y de forma decreciente, luego mostrar por consola
async function ordenarYMostrarDecreciente() {
    try {
        console.log("\n--- 2.e) Ordenando nuevo archivo de forma DECRECIENTE ---");
        // Lee el archivo NUEVO que creamos en el paso anterior
        const personajesMapeados = await leerArchivoPersonajes(NEW_FILE_PATH);
        
        const ordenadosDecreciente = personajesMapeados.sort((a, b) => {
            if (a.nombre < b.nombre) return 1;
            if (a.nombre > b.nombre) return -1;
            return 0;
        });
        console.log("✅ Personajes ordenados (Z-A):");
        console.table(ordenadosDecreciente); // Imprime una tabla completa en consola
    } catch (error) {
        console.error("❌ Error en 2.e:", error);
    }
}

// ==========================================
// FUNCIÓN PRINCIPAL DE EJECUCIÓN (MAIN)
// ==========================================
async function main() {
    // --- EJECUCIÓN PARTE 1 ---
    const todosLosPjs = await getAllPersonajes();
    if (todosLosPjs) {
        console.log("\n--- 1.d) Guardando archivo original por primera vez ---");
        await persistirDatosJSON(todosLosPjs, FILE_PATH);
    }

    const nuevoPersonaje = { firstName: "G. Alejandro", lastName: "Riveiro", fullName: "G. Alejandro Riveiro" };
    await postNuevoPersonaje(nuevoPersonaje);
    
    // ID 0 suele ser Daenerys en esta API
    await getPersonajeById(0);

    // --- EJECUCIÓN PARTE 2 ---
    console.log("\n=======================================================");
    console.log("--- INICIANDO PARTE 2: OPERACIONES CON EL ARCHIVO ---");
    
    // Ejecutamos cada operación. Cada una lee, modifica y guarda en disco.
    await agregarPersonajeAlFinal();
    await agregarPersonajesAlInicio();
    await eliminarPrimerPersonaje();
    await crearArchivoNombresIds();
    await ordenarYMostrarDecreciente();
    
    console.log("\n✅ ¡Ejecución del Trabajo Práctico finalizada con éxito!");
}

main();