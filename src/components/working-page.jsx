import { useEffect, useState } from "react";
import Spinner from "./Spinner";

const messages = [
    "Analizando ingresos y gastos en busca de patrones financieros.",
    "Procesando tu información con algoritmos inteligentes.",
    "Detectando posibles gastos hormiga en tus movimientos.",
    "Revisando compras impulsivas que afectan tu ahorro.",
    "Evaluando riesgos financieros para mejorar tu estabilidad.",
    "Generando un reporte con recomendaciones personalizadas.",
    "Optimizando la lectura de tus datos de manera segura."
];

const WorkingPage = () => {
    const [file, setFile] = useState(null);
    const [userData, setUserData] = useState(null);

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const storedFile = localStorage.getItem("uploadedFile");
        const storedUser = localStorage.getItem("userData");

        if (!storedFile || !storedUser) {
            window.location.href = "/";
            return;
        }

        setFile(storedFile); // aquí tienes el Excel en base64
        setUserData(JSON.parse(storedUser));

        console.log("Archivo cargado:", storedFile);
        console.log("User Data:", storedUser);

    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-[88dvh] w-full">

            <Spinner />

            <p className="mt-8 text-2xl text-texto2">Datos recibidos con exito</p>
            <p className="mt-2 text-2xl text-texto">{messages[index]}</p>
        </div>
    );
};

export default WorkingPage;
