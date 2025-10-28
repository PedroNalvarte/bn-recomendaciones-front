// src/components/WorkingPage.jsx
import { useEffect, useState } from "react";
import Spinner from "./Spinner"; // Make sure you have this component
import { sendDataToBackend } from "../utils/api"; // Import the API function

const messages = [
    "Analizando ingresos y gastos...",
    "Procesando tu información con algoritmos inteligentes...",
    "Detectando patrones financieros...",
    "Generando reporte personalizado...",
    "Optimizando la visualización de datos...",
];

const WorkingPage = () => {
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect for rotating messages
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 3000); // Rotate every 3 seconds
        return () => clearInterval(interval);
    }, []);

    // Effect to load data and call API
    useEffect(() => {
        console.log("WorkingPage mounted. Attempting to load data...");
        const storedFileBase64 = localStorage.getItem("uploadedFile");
        const storedUserJson = localStorage.getItem("userData");

        // Validate data presence
        if (!storedFileBase64 || !storedUserJson) {
            console.error("Datos iniciales no encontrados en localStorage. Redirigiendo a /");
            // Use setTimeout to allow potential error state update before redirect
            setError("Datos requeridos no encontrados. Serás redirigido.");
            setTimeout(() => { window.location.href = "/"; }, 3000);
            return;
        }

        let userData;
        try {
            userData = JSON.parse(storedUserJson);
            if (!userData || typeof userData !== 'object' || !userData.nombres) {
                throw new Error("Formato de userData inválido.");
            }
        } catch (parseError) {
            console.error("Error parseando userData:", parseError);
            setError("Hubo un problema al recuperar tus datos. Serás redirigido.");
            setIsLoading(false); // Stop loading
            setTimeout(() => { window.location.href = "/"; }, 3000);
            return;
        }

        console.log("Datos recuperados de localStorage OK.");

        // Async function to call the backend
        const callApi = async () => {
            setIsLoading(true);
            setError(null);
            console.log("Calling sendDataToBackend...");
            try {
                const analysisData = await sendDataToBackend(userData, storedFileBase64);
                console.log("Análisis recibido:", analysisData);

                sessionStorage.setItem("analysisResult", JSON.stringify(analysisData));
                console.log("Resultados guardados en sessionStorage.");

                console.log("Redirigiendo a /success...");
                window.location.href = "/success"; // Adjust if your route is different

            } catch (apiError) {
                // --- ERROR ---
                console.error("Error en la llamada API:", apiError);
                setError(`Error al procesar el archivo: ${apiError.message}`);
                setIsLoading(false); // Stop loading to show error
                // Optional: Automatically redirect after showing error for a while
                // setTimeout(() => { window.location.href = "/"; }, 5000);
            }
        };

        callApi(); // Execute the API call

    }, []); // Empty dependency array means run once on mount

    // --- Render ---
    return (
        <div className="flex flex-col items-center justify-center h-[88dvh] w-full text-center px-4">
            <Spinner />
            <p className="mt-8 text-2xl text-gray-700">Datos recibidos con éxito</p>

            {/* Show error message if exists, otherwise show loading messages */}
            {error ? (
                <p className="mt-4 text-xl text-red-500 font-semibold">{error}</p>
            ) : (
                <p className="mt-2 text-xl text-gray-500 animate-pulse">{messages[index]}</p>
            )}

            {/* Optional: Button to go back if there's an error */}
            {error && !isLoading && (
                <button
                    onClick={() => window.location.href = "/"}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                >
                    Volver al Inicio
                </button>
            )}
        </div>
    );
};

export default WorkingPage;