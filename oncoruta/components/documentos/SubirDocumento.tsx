"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import { useIdioma } from "@/lib/i18n/IdiomaContext";

const TIPOS_ACEPTADOS = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE_MB = 10;

export default function SubirDocumento({ triggerLabel }: { triggerLabel?: string } = {}) {
  const supabase = createClient();
  const router = useRouter();
  const { idioma } = useIdioma();

  const es = idioma === "es";

  const TIPOS_DOCUMENTO = es
    ? [
        { value: "historia_clinica", label: "Historia clínica" },
        { value: "resultado_examen", label: "Resultado de examen" },
        { value: "referencia",       label: "Hoja de referencia" },
        { value: "otro",             label: "Otro" },
      ]
    : [
        { value: "historia_clinica", label: "Kawsay qillqa" },
        { value: "resultado_examen", label: "Llanachiy tarisqa" },
        { value: "referencia",       label: "Qillqa kachasqa" },
        { value: "otro",             label: "Huk" },
      ];

  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [tipo, setTipo] = useState(TIPOS_DOCUMENTO[0].value);
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setError("");
    if (!f) { setFile(null); return; }
    if (!TIPOS_ACEPTADOS.includes(f.type)) {
      setError(es ? "Solo se aceptan archivos PDF, JPG o PNG." : "PDF, JPG o PNG rillachu.");
      setFile(null);
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(es
        ? `El archivo no puede superar ${MAX_SIZE_MB} MB.`
        : `Qillqa ${MAX_SIZE_MB} MB aswan kanmanchu.`);
      setFile(null);
      return;
    }
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError(es ? "Selecciona un archivo." : "Qillqata akllayuqtinki.");
      return;
    }

    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError(es ? "Sesión expirada. Recarga la página." : "Sesión tukun. Kutichimuytaq.");
      setLoading(false);
      return;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${user.id}/${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("documentos")
      .upload(storagePath, file, { upsert: false });

    if (uploadError) {
      setError(`Error al subir el archivo: ${uploadError.message}`);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("documentos").getPublicUrl(storagePath);
    const url = urlData.publicUrl;

    const { error: dbError } = await supabase.from("documentos").insert({
      paciente_id: user.id,
      tipo,
      descripcion: descripcion.trim() || null,
      url,
      nombre: file.name,
      estado: "enviado",
    });

    if (dbError) {
      await supabase.storage.from("documentos").remove([storagePath]);
      setError(`Error al registrar el documento: ${dbError.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    setEnviado(true);
    router.refresh();
  }

  function cerrarModal() {
    setIsOpen(false);
    setFile(null);
    setTipo(TIPOS_DOCUMENTO[0].value);
    setDescripcion("");
    setError("");
    setEnviado(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Upload size={16} />
        {triggerLabel ?? (es ? "Subir documento" : "Qillqa apachiy")}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={cerrarModal} />

          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                {es ? "Subir documento" : "Qillqa apachiy"}
              </h2>
              <button
                onClick={cerrarModal}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {enviado ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {es ? "¡Documento subido correctamente!" : "¡Qillqa apachisqaña!"}
                </p>
                <p className="text-xs text-muted">
                  {es ? "El equipo del INEN revisará tu documento." : "INEN-manta runakuna qillqaykita qhawankiku."}
                </p>
                <Button variant="secondary" size="sm" onClick={cerrarModal}>
                  {es ? "Cerrar" : "Wichqay"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tipo de documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    {es ? "Tipo de documento" : "Qillqa rikch'aq"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {TIPOS_DOCUMENTO.map((doc) => (
                      <option key={doc.value} value={doc.value}>{doc.label}</option>
                    ))}
                  </select>
                </div>

                {/* Archivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    {es ? "Archivo" : "Qillqa"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="doc-file-input"
                  />
                  <label
                    htmlFor="doc-file-input"
                    className="flex flex-col items-center gap-2 w-full border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-lg px-4 py-5 cursor-pointer hover:border-primary hover:bg-primary-light/30 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    {file ? (
                      <>
                        <FileText size={24} className="text-primary" />
                        <span className="text-sm font-medium text-foreground text-center break-all">{file.name}</span>
                        <span className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="text-muted" />
                        <span className="text-sm text-muted text-center">
                          {es ? "Haz clic para seleccionar un archivo" : "Kayta tocay qillqata akllanapaq"}
                        </span>
                        <span className="text-xs text-muted">
                          {es ? `PDF, JPG, PNG · Máx. ${MAX_SIZE_MB} MB` : `PDF, JPG, PNG · Aswan ${MAX_SIZE_MB} MB`}
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    {es ? "Descripción o notas" : "Willakuy o qillqay"}{" "}
                    <span className="text-gray-400 dark:text-slate-500 font-normal">
                      {es ? "(Opcional)" : "(Mana wakichisqachu)"}
                    </span>
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                    placeholder={es
                      ? "Ej: Resultado de mamografía del 10 de junio"
                      : "Ej: Mamografía tarisqan huniy killapi"}
                    className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="ghost" className="flex-1" onClick={cerrarModal} disabled={loading}>
                    {es ? "Cancelar" : "Saqiy"}
                  </Button>
                  <Button type="submit" className="flex-1" loading={loading} disabled={!file}>
                    {es ? "Subir" : "Apachiy"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
