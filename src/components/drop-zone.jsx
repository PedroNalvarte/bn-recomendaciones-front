import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import * as XLSX from "xlsx";

const Dropzone = forwardRef(({ onValidation }, ref) => {
  const fileInputRef = useRef(null);
  const maxAllowedMB = 500;
  const expectedColumns = ["Nombre", "Edad", "Email"];

  const [validationResult, setValidationResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const showToast = (text, color = "#C21D03") => {
    Toastify({
      text,
      duration: 3000,
      gravity: "bottom",
      position: "center",
      style: { background: color, borderRadius: "8px" },
    }).showToast();
  };

  const handleFiles = (files) => {
    //console.log("Archivos recibidos:", files);

    const isFileValid = fileValidation(files);
    if (!isFileValid) return;

    const file = files[0];
    //console.log("Archivo seleccionado:", file);

    excelValidation(file).then((result) => {

      setValidationResult(result);
      setSelectedFile(file);

      onValidation?.({
        isValid: result,
        file: file,
      });
    });
  };

  const fileValidation = (files) => {
    if (!files || files.length === 0) {
      showToast("No se seleccionó ningún archivo");
      return false;
    }

    if (files.length > 1) {
      showToast("Solo se permite 1 archivo");
      return false;
    }

    const file = files[0];

    if (!file.name.endsWith(".xlsx")) {
      showToast("Solo se permiten archivos .xlsx");
      return false;
    }

    if (file.size > maxAllowedMB * 1024 * 1024) {
      showToast(`El archivo es demasiado grande. Máximo ${maxAllowedMB} MB.`);
      return false;
    }

    return true;
  };

  const excelValidation = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const firstRow = jsonData[0];

          if (!firstRow || firstRow.length === 0) {
            return resolve(false);
          }

          const isValid = expectedColumns.every((col) =>
            firstRow.includes(col)
          );

          resolve(isValid);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Exponemos un método reset al padre
  useImperativeHandle(ref, () => ({
    reset: () => {
      setValidationResult(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onValidation?.(null); // notificar al padre que vuelve a null
    },
  }));

  return (
    <div>
      {/* Zona de drag & click */}
      <div
        className="mx-[23%] border-6 border-[#F1F1F1] rounded-2xl p-6 text-center cursor-pointer hover:border-primary transition"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer?.files) {
            handleFiles(e.dataTransfer.files);
          }
        }}
      >
        <FontAwesomeIcon
          icon={faCirclePlus}
          size="4x"
          className="text-[#C21D03] h-18"
        />

        <p
          className={`mt-2 ${validationResult === null
            ? "text-gray-600"
            : validationResult
              ? "text-green-600"
              : "text-red-600"
            }`}
        >
          {validationResult === null
            ? "Cargue o arrastre y suelte su archivo"
            : validationResult
              ? "✅ Archivo correcto listo para analizar"
              : "❌ Archivo inválido"}
        </p>

        <p className="mt-2 text-gray-600">
          {selectedFile ? `${selectedFile.name}` : "Ningún archivo seleccionado"}
        </p>
      </div>

      {/* Input real */}
      <input
        ref={fileInputRef}
        id="fileInput"
        type="file"
        className="hidden"
        accept=".xlsx"
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
            e.target.value = ""; // reset para permitir subir el mismo archivo
          }
        }}
      />
    </div>
  );
});

export default Dropzone;
