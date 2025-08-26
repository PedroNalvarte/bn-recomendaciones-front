import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import ReactMarkdown from "react-markdown";
import tycContent from "../content/tyc.md?raw";

export default function TyC() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="bg-secondary my-6 px-14 rounded-lg text-texto2 font-medium cursor-pointer hover:scale-105 transition-transform duration-200"
                >Términos y condiciones
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

                <Dialog.Content className="fixed max-h-[70vh] top-1/2 left-1/2 w-[90%] md:w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg">
                    <div className="flex justify-between items-center ">
                        <Dialog.Title className="text-xl font-bold">Términos y condiciones del servicio</Dialog.Title>
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

                    <div className="mt-4 prose prose-sm max-w-none overflow-y-auto max-h-[50vh]">
                        <ReactMarkdown>{tycContent}</ReactMarkdown>
                    </div>

                    {/* <div className="mt-4 flex justify-end gap-2">
                        <Dialog.Close asChild>
                            <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                                Cancelar
                            </button>
                        </Dialog.Close>
                        <button
                            onClick={() => alert("Acción confirmada")}
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Confirmar
                        </button>
                    </div> */}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
