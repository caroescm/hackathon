"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Upload, X, FileText } from "lucide-react";

type Paso = {
  paso_id: string;
  pasos: { id: string; nombre: string; orden: number } | null;
};

const TIPOS_ACEPTADOS = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;

export default function SubirDocumento() {
  const supabase = createClient();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pasoId, setPasoId] = useState("");
  const [pasos, setPasos] = useState<Paso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("proceso_paciente")
        .select("paso_id, pasos(id, nombre, orden)")
        .eq("paciente_id", user.id)
        .order("orden", { referencedTable: "pasos", ascending: true })
        .then(({ data }) => {
          const filas = (data as Paso[] | null) ?? [];
          setPasos(filas);
          if (filas.length > 0 && !pasoId) {
            setPasoId(filas[0].paso_id);
          }
        });
    });
  }, [isOpen]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setError("");
    if (!f) { setFile(null); return; }
    if (!TIPOS_ACEPTADOS.includes(f.type)) {
      setError("Solo se aceptan archivos PDF, JPG, PNG o WEBP.");
      setFile(null);
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`El archivo no puede superar ${MAX_SIZE_MB} MB.`);
      setFile(null);
      return;
    }
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError("Selecciona un archivo."); return; }
    if (!pasoId) { setError("Selecciona el paso al que pertenece este documento."); return; }

    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Sesión expirada. Recarga la página."); setLoading(false); return; }

    // Nombre único para evitar colisiones en Storage
    const ext = file.name.split(".").pop();
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

    const { error: dbError } = await supabase.from("documentos").insert({
      paciente_id: user.id,
      nombre: file.name,
      estado: "enviado",
      paso_id: pasoId,
    });

    if (dbError) {
      // Si falla el registro en DB, eliminar el archivo ya subido para no dejar huérfanos
      await supabase.storage.from("documentos").remove([storagePath]);
      setError(`Error al registrar el documento: ${dbError.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    cerrarModal();
    router.refresh();
  }

  function cerrarModal() {
    setIsOpen(false);
    setFile(null);
    setPasoId("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Upload size={16} />
        Subir documento
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={cerrarModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Subir documento</h2>
              <button
                onClick={cerrarModal}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selector de archivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Archivo <span className="text-red-500">*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="doc-file-input"
                />
                <label
                  htmlFor="doc-file-input"
                  className="flex flex-col items-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-lg px-4 py-5 cursor-pointer hover:border-primary hover:bg-primary-light/30 transition-colors"
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
                        Haz clic para seleccionar un archivo
                      </span>
                      <span className="text-xs text-muted">PDF, JPG, PNG, WEBP · Máx. {MAX_SIZE_MB} MB</span>
                    </>
                  )}
                </label>
              </div>

              {/* Selector de paso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Etapa de tratamiento <span className="text-red-500">*</span>
                </label>
                {pasos.length === 0 ? (
                  <p className="text-sm text-muted">Cargando etapas…</p>
                ) : (
                  <select
                    value={pasoId}
                    onChange={(e) => setPasoId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {pasos.map((p) => (
                      <option key={p.paso_id} value={p.paso_id}>
                        {p.pasos?.nombre ?? p.paso_id}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={cerrarModal}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={loading}
                  disabled={!file || !pasoId}
                >
                  Subir documento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
