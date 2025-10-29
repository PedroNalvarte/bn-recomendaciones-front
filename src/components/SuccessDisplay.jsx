// src/components/SuccessDisplay.jsx
import React, { useEffect, useState } from 'react';
import DataChart from './data-chart.jsx';

const SuccessDisplay = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("SuccessDisplay mounted. Attempting to load results...");
        // --- Read data from sessionStorage ---
        const storedResult = sessionStorage.getItem("analysisResult");

        if (storedResult) {
            try {
                const data = JSON.parse(storedResult);
                if (!data || typeof data !== 'object' || !data.resumen) {
                    throw new Error("Formato de analysisResult inválido.");
                }
                console.log("Datos de análisis recuperados de sessionStorage:", data);
                setAnalysisData(data);
                // Optional: Clean up sessionStorage after reading if not needed anymore
                // sessionStorage.removeItem("analysisResult");
            } catch (parseError) {
                console.error("Error parseando analysisResult:", parseError);
                setError("No se pudieron cargar los resultados correctamente.");
                // Optional: Redirect if data is corrupt
                // setTimeout(() => { window.location.href = "/"; }, 3000);
            }
        } else {
            console.warn("No se encontraron datos de análisis en sessionStorage.");
            setError("No hay resultados para mostrar. Por favor, realiza un análisis primero.");
            // Redirect if user lands here directly
            // setTimeout(() => { window.location.href = "/"; }, 3000);
        }
    }, []); // Run once on mount

    // --- Render Loading/Error States ---
    if (error) {
        return (
            <div className="text-red-400 text-center mt-10 p-4">
                <p className="font-semibold text-lg">{error}</p>
                <button
                    onClick={() => window.location.href = "/"}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-secondary cursor-pointer transition duration-300"
                >
                    Volver al Inicio
                </button>
            </div>
        );
    }

    if (!analysisData) {
        // You could add a more sophisticated loading indicator here
        return <div className="text-center mt-10 p-4 text-gray-600">Cargando resultados...</div>;
    }

    // --- Render Successful Results ---
    const { resumen, perfil_ml, recomendaciones, grafico } = analysisData;

    return (
        <div className="h-[88dvh] w-full px-[20%] py-8">
            <h1 className="text-2xl mb-6 text-gray-950">Tus Resultados</h1>

            <div className='grid grid-cols-3 gap-[10%]'>
                <div id='action-button' className='col-span-1 rounded-lg p-3'>
                    <p className='text-bg'>Gasto mensual promedio</p>
                    <div className='py-3 text-center'>
                        <p className='text-bg text-4xl font-medium'>S/. {resumen?.gasto_mensual_promedio?.toFixed(0) ?? 'N/A'}</p>
                    </div>
                </div>

                <div id='action-button' className='col-span-1 rounded-lg p-3'>
                    <p className='text-bg'>Ingreso mensual promedio</p>
                    <div className='py-3 text-center'>
                        <p className='text-bg text-4xl font-medium'>S/. {resumen?.ingreso_mensual_promedio?.toFixed(0) ?? 'N/A'}</p>
                    </div>
                </div>

                <div id='action-button' className='col-span-1 rounded-lg p-3'>
                    <p className='text-bg'>Ahorro estimado mensual</p>
                    <div className='text-center'>
                        <p className='text-bg text-3xl font-medium'>S/. {resumen?.ahorro_estimado_mensual?.monto?.toFixed(0) ?? 'N/A'}</p>
                        <p className='text-bg text-3xl font-medium'>({resumen?.ahorro_estimado_mensual?.porcentaje?.toFixed(1) ?? 'N/A'}%)</p>
                    </div>
                </div>

            </div>

            <h1 className="text-2xl mt-10 mb-6 text-gray-950">Recomendaciones</h1>

            {recomendaciones && recomendaciones.length > 0 ? (
                <ul className="list-decimal space-y-2 pl-5 text-gray-600">
                    {recomendaciones.map((rec, index) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No hay recomendaciones específicas en este momento. ¡Sigue así!</p>
            )}

            <h1 className="text-2xl mt-10 mb-6 text-gray-950">Grafico de gastos e ingresos</h1>


            <DataChart grafico={grafico} />

        </div>

    );
};

export default SuccessDisplay;