import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default function UserData({ onData }) {
    const [open, setOpen] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault(); // evita recarga de página
        const formData = new FormData(event.target);

        const data = {
            nombres: formData.get("nombres"),
            apellidos: formData.get("apellidos"),
            edad: formData.get("edad"),
            correo: formData.get("correo"),
        };

        if (validateForm(data)) {

            onData?.({
                isValid: true,
                data: data,
            });

        }
    };

    const validateForm = data => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.nombres || !data.apellidos || !data.edad || !data.correo) {
            showToast("Por favor, completa todos los campos.");
            return false;
        }

        if (data.edad < 18 || data.edad > 50) {
            showToast("La edad debe estar entre 18 y 50 años.");
            return false;
        }

        if (!emailRegex.test(data.correo)) {
            showToast("Por favor ingresa un correo válido");
            return false;
        }

        showToast("Los datos ingresados son correctos", "#3DB20F");
        setOpen(false);
        return true;

    }

    const showToast = (text, color = "#C21D03") => {
        Toastify({
            text,
            duration: 3000,
            gravity: "bottom",
            position: "center",
            style: { background: color, borderRadius: "8px" },
        }).showToast();
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button
                    id="action-button"
                    className="px-24 h-full cursor-pointer text-white text-xl rounded-2xl"
                >
                    Analizar
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

                <Dialog.Content className="fixed max-h-[50vh] top-1/2 left-1/2 w-[90%] md:w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg">
                    <div className="flex justify-between items-center ">
                        <Dialog.Title className="text-xl font-bold">Antes de analizar tu archivo</Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-gray-500 hover:text-black">
                                <FontAwesomeIcon
                                    icon={faX}
                                    size="1x"
                                    className="text-black outline-none"
                                />
                            </button>
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mt-2 prose prose-sm max-w-none overflow-y-auto max-h-[50vh]">
                            <p>Para ofrecerte un análisis personalizado y más útil, necesitamos algunos datos básicos:</p>

                            <div className="mt-5 flex gap-2">
                                <input
                                    className=" h-[40px] w-full text-[16px] text-texto bg-bg px-3 py-1 rounded-lg border border-text-gray-500 outline-none focus:border-primary transition-all duration-150 ease-in-out"
                                    name="nombres"
                                    type="text"
                                    placeholder="Nombres"
                                />

                                <input
                                    className=" h-[40px] w-full text-[16px] text-texto bg-bg px-3 py-1 rounded-lg border border-text-gray-500 outline-none focus:border-primary transition-all duration-150 ease-in-out"
                                    name="apellidos"
                                    type="text"
                                    placeholder="Apellidos"
                                />
                            </div>

                            <div className="mt-3 grid gap-2 grid-cols-3">
                                <input
                                    className="col-span-1 h-[40px] w-full text-[16px] text-texto bg-bg px-3 py-1 rounded-lg border border-text-gray-500 outline-none focus:border-primary transition-all duration-150 ease-in-out"
                                    name="edad"
                                    type="number"
                                    placeholder="Edad"
                                />

                                <input
                                    className="col-span-2 h-[40px] w-full text-[16px] text-texto bg-bg px-3 py-1 rounded-lg border border-text-gray-500 outline-none focus:border-primary transition-all duration-150 ease-in-out"
                                    name="correo"
                                    type="text"
                                    placeholder="Correo electrónico"
                                />
                            </div>

                            <p className="text-texto2 text-[12px] mt-5">🔒 La información que registres será almacenada de forma segura y utilizada únicamente para estudios pertinentes orientados a mejorar y desarrollar servicios financieros.</p>




                        </div>

                        <div className="mt-4 flex flex-col w-full items-center gap-1">

                            <button
                                id="action-button"
                                type="submit"
                                className="px-4 py-2 w-[60%] text-white rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-200"
                            >
                                Continuar
                            </button>

                            <Dialog.Close asChild>
                                <button className="px-4 rounded text-texto2 hover:text-texto cursor-pointer">
                                    Cancelar
                                </button>
                            </Dialog.Close>
                        </div>

                    </form>


                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
