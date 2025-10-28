// src/utils/api.js

/**
 * Sends user data and the financial file (as base64) to the backend API.
 * @param {object} userData - Object with { nombres, apellidos, edad, correo }
 * @param {string} fileBase64 - The Excel file content as a base64 string (including the header).
 * @returns {Promise<object>} A promise resolving with the analysis result.
 */
async function sendDataToBackend(userData, fileBase64) {

    const payload = {
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        edad: parseInt(userData.edad, 10),
        correo: userData.correo,
        file: fileBase64,
    };

    const backendUrl = "http://127.0.0.1:8000/process";

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend error:", response.status, errorData);
            throw new Error(
                `Error del servidor: ${errorData.detail || response.statusText}`
            );
        }

        const result = await response.json();
        console.log("Analysis result received:", result);
        if (result && result.analysis) {
            return result.analysis;
        } else {
            throw new Error("La respuesta del servidor no tiene el formato esperado.");
        }

    } catch (error) {
        console.error("Error sending data to backend:", error);

        throw new Error(`No se pudo conectar con el servidor: ${error.message}`);
    }
}

export { sendDataToBackend };