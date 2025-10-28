import { useRef, useState } from "react";
import Dropzone from "../components/drop-zone.jsx";
import UserData from "../dialog/user-data.jsx";

export default function ActionArea() {

    const dropzoneRef = useRef();

    const [result, setResult] = useState(null);
    const [data, setData] = useState(null);

    if (data && result) {

        const file = result.file;

        // Convertir el archivo a base64 antes de guardarlo
        const reader = new FileReader();
        reader.onload = () => {
            const base64File = reader.result; // Excel en base64

            localStorage.setItem("uploadedFile", base64File);
            localStorage.setItem("userData", JSON.stringify(data.data));

            window.location.href = "/working";
        };

        reader.readAsDataURL(file); // convierte el Excel a base64
    }

    const retry = () => {

        dropzoneRef.current?.reset();

    }

    return (
        <div className="h-[45%] pt-3">
            <Dropzone className="h-[80%]" ref={dropzoneRef} onValidation={setResult} client:load />

            <div className="h-[15%] mt-7 flex justify-center">

                {result?.isValid == false && (
                    <button
                        id="action-button"
                        onClick={() => retry()}
                        className="px-24 h-full cursor-pointer text-white text-xl rounded-2xl"
                    >
                        Reintentar
                    </button>
                )}

                {result?.isValid == true && (
                    <UserData id="action-button" onData={setData} client:load />
                )}

            </div>


        </div>
    );


}