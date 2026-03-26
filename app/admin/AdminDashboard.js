"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("../components/RichTextEditor"), { ssr: false });
import { slugify } from "../../lib/slugify";

const CATEGORIES = ["Câmeras", "DVR / NVR", "Alarmes", "Cerca Elétrica", "Controle de Acesso"];

const C = {
  dark:     "#1a1d20",
  gray:     "#32373c",
  muted:    "#6b7280",
  border:   "#e5e7eb",
  bg:       "#f9fafb",
  white:    "#ffffff",
  blue:     "#126798",
  blueBg:   "#eff6ff",
  danger:   "#dc2626",
  dangerBg: "#fef2f2",
  green:    "#16a34a",
  greenBg:  "#f0fdf4",
};

function Btn({ children, onClick, variant = "primary", disabled, style = {}, type = "button" }) {
  const base = {
    border: "none", borderRadius: 9999, fontFamily: "inherit",
    fontSize: "0.82rem", fontWeight: 700, cursor: disabled ? "default" : "pointer",
    padding: "8px 18px", transition: "all 0.2s", opacity: disabled ? 0.6 : 1, ...style,
  };
  const variants = {
    primary: { background: C.blue, color: "#fff" },
    gray:    { background: C.gray, color: "#fff" },
    outline: { background: "transparent", color: C.gray, border: `1px solid ${C.border}` },
    danger:  { background: C.danger, color: "#fff" },
    ghost:   { background: "transparent", color: C.muted, border: "none", padding: "4px 10px" },
    green:   { background: C.green, color: "#fff" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, required, rows }) {
  const inputStyle = {
    width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "10px 12px", fontFamily: "inherit", fontSize: "0.88rem", color: C.dark,
    outline: "none", boxSizing: "border-box", resize: rows ? "vertical" : undefined,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: "0.72rem", fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>}
      {rows
        ? <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder} required={required} style={inputStyle} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} style={inputStyle} />
      }
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, paddingTop: 4 }}>
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────
// IMAGE UPLOAD HELPER
// ──────────────────────────────────────────────
function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setError(data.error || "Erro no upload"); return null; }
    return data.url;
  }

  return { upload, uploading, error, setError };
}

// ──────────────────────────────────────────────
// PRODUCTS TAB
// ──────────────────────────────────────────────
function ProductsTab({ products, setProducts }) {
  const emptyForm = {
    name: "", brand: "", category: "Câmeras",
    image: "", imageMode: "url",
    images: [],       // gallery extra images
    description: "",
    video: "",
    slug: "",
    slugEdited: false,
  };

  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [editId, setEditId]         = useState(null);
  const [saving, setSaving]         = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formError, setFormError]   = useState("");

  const mainFileRef    = useRef(null);
  const galleryFileRef = useRef(null);

  const mainUpload    = useImageUpload();
  const galleryUpload = useImageUpload();

  function openCreate() {
    setEditId(null); setForm(emptyForm); setPreviewUrl(""); setFormError(""); setShowForm(true);
  }

  function openEdit(p) {
    const imgs = (() => { try { return JSON.parse(p.images || "[]"); } catch { return []; } })();
    setEditId(p.id);
    setForm({ name: p.name, brand: p.brand, category: p.category, image: p.image, imageMode: "url", images: imgs, description: p.description || "", video: p.video || "", slug: p.slug || "", slugEdited: true });
    setPreviewUrl(p.image);
    setFormError(""); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setShowForm(false); setEditId(null); setForm(emptyForm); setPreviewUrl(""); setFormError("");
  }

  async function handleMainUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await mainUpload.upload(file);
    if (url) { setForm(f => ({ ...f, image: url })); setPreviewUrl(url); }
  }

  async function handleGalleryUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    for (const file of files) {
      const url = await galleryUpload.upload(file);
      if (url) setForm(f => ({ ...f, images: [...f.images, url] }));
    }
    e.target.value = "";
  }

  function addGalleryUrl(url) {
    if (!url.trim()) return;
    setForm(f => ({ ...f, images: [...f.images, url.trim()] }));
  }

  function removeGalleryImage(idx) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.image) { setFormError("Adicione uma imagem principal ao produto."); return; }
    setSaving(true); setFormError("");
    const payload = {
      name: form.name, brand: form.brand, category: form.category,
      image: form.image, images: form.images,
      description: form.description, video: form.video,
      slug: form.slug || form.name, // API will slugify + ensure uniqueness
    };
    const res = await fetch(editId ? `/api/admin/products/${editId}` : "/api/admin/products", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setFormError(data.error || "Erro ao salvar"); return; }
    if (editId) { setProducts(ps => ps.map(p => p.id === editId ? data : p)); }
    else        { setProducts(ps => [...ps, data]); }
    cancelForm();
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) { setProducts(ps => ps.filter(p => p.id !== id)); setConfirmDelete(null); }
  }

  // gallery URL input state
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: C.dark, marginBottom: 2 }}>Produtos</h2>
          <p style={{ fontSize: "0.8rem", color: C.muted }}>{products.length} produto{products.length !== 1 ? "s" : ""} cadastrado{products.length !== 1 ? "s" : ""}</p>
        </div>
        {!showForm && <Btn onClick={openCreate}>+ Novo Produto</Btn>}
      </div>

      {/* ── FORM ── */}
      {showForm && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, marginBottom: 28 }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.dark, marginBottom: 20 }}>
            {editId ? "Editar Produto" : "Novo Produto"}
          </h3>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Row 1: name + brand */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Nome do produto" value={form.name} onChange={e => {
                const name = e.target.value;
                setForm(f => ({
                  ...f,
                  name,
                  slug: f.slugEdited ? f.slug : slugify(name),
                }));
              }} placeholder="ex: Câmera Bullet VHL 1220 B" required />
              <Input label="Marca" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="ex: Intelbras" required />
            </div>

            {/* Slug */}
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>URL da página (slug)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.82rem", color: C.muted, whiteSpace: "nowrap" }}>/produtos/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value, slugEdited: true }))}
                  placeholder="ex: camera-dome-intelbras-vhl-1220-d"
                  style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontFamily: "inherit", fontSize: "0.88rem", color: C.blue, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <p style={{ fontSize: "0.72rem", color: C.muted, marginTop: 4 }}>
                Gerado automaticamente a partir do nome. Edite para personalizar. Use apenas letras minúsculas, números e hífens.
              </p>
            </div>

            {/* Row 2: category */}
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Categoria</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontFamily: "inherit", fontSize: "0.88rem", color: C.dark, outline: "none" }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* ── IMAGEM PRINCIPAL ── */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
              <SectionTitle>📷 Imagem Principal</SectionTitle>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                {["url", "upload"].map(mode => (
                  <button key={mode} type="button" onClick={() => setForm(f => ({ ...f, imageMode: mode }))}
                    style={{ padding: "6px 16px", borderRadius: 9999, fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                      background: form.imageMode === mode ? C.gray : "transparent",
                      color: form.imageMode === mode ? "#fff" : C.muted,
                      border: `1px solid ${form.imageMode === mode ? C.gray : C.border}` }}>
                    {mode === "url" ? "URL externa" : "Upload de arquivo"}
                  </button>
                ))}
              </div>
              {form.imageMode === "url" ? (
                <Input value={form.image}
                  onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setPreviewUrl(e.target.value); }}
                  placeholder="https://exemplo.com/imagem.jpg" />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input ref={mainFileRef} type="file" accept="image/*" onChange={handleMainUpload} style={{ display: "none" }} />
                  <Btn variant="outline" onClick={() => mainFileRef.current?.click()} disabled={mainUpload.uploading}>
                    {mainUpload.uploading ? "Enviando..." : "Selecionar imagem"}
                  </Btn>
                  {form.image && !mainUpload.uploading && <span style={{ fontSize: "0.78rem", color: C.green }}>✓ Imagem carregada</span>}
                </div>
              )}
              {previewUrl && (
                <div style={{ marginTop: 12, width: 90, height: 90, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={() => setPreviewUrl("")} />
                </div>
              )}
              {mainUpload.error && <p style={{ color: C.danger, fontSize: "0.8rem", marginTop: 6 }}>{mainUpload.error}</p>}
            </div>

            {/* ── GALERIA DE FOTOS ── */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
              <SectionTitle>🖼️ Galeria de Fotos Adicionais</SectionTitle>
              <p style={{ fontSize: "0.78rem", color: C.muted, marginBottom: 12 }}>Fotos extras exibidas na página do produto (além da imagem principal).</p>

              {/* Upload múltiplo */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
                <input ref={galleryFileRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: "none" }} />
                <Btn variant="outline" onClick={() => galleryFileRef.current?.click()} disabled={galleryUpload.uploading}>
                  {galleryUpload.uploading ? "Enviando..." : "+ Upload de fotos"}
                </Btn>
                <span style={{ fontSize: "0.75rem", color: C.muted }}>ou</span>
                <div style={{ display: "flex", gap: 8, flex: 1, minWidth: 240 }}>
                  <input
                    type="text" value={galleryUrlInput}
                    onChange={e => setGalleryUrlInput(e.target.value)}
                    placeholder="Colar URL de imagem..."
                    style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", fontFamily: "inherit", fontSize: "0.83rem", color: C.dark, outline: "none" }}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addGalleryUrl(galleryUrlInput); setGalleryUrlInput(""); }}}
                  />
                  <Btn variant="gray" onClick={() => { addGalleryUrl(galleryUrlInput); setGalleryUrlInput(""); }} style={{ padding: "8px 14px" }}>Adicionar</Btn>
                </div>
              </div>

              {/* Thumbnails da galeria */}
              {form.images.length > 0 && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {form.images.map((src, i) => (
                    <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
                      <div style={{ width: 80, height: 80, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      </div>
                      <button type="button" onClick={() => removeGalleryImage(i)}
                        style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: C.danger, color: "#fff", border: "2px solid #fff", fontSize: "0.7rem", fontWeight: 900, cursor: "pointer", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {galleryUpload.error && <p style={{ color: C.danger, fontSize: "0.8rem", marginTop: 6 }}>{galleryUpload.error}</p>}
            </div>

            {/* ── DESCRIÇÃO ── */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
              <SectionTitle>📝 Descrição do Produto</SectionTitle>
              <Input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder={"Descreva o produto: especificações técnicas, diferenciais, aplicações recomendadas...\n\nSepare parágrafos com uma linha em branco."}
                rows={6}
              />
            </div>

            {/* ── VÍDEO ── */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
              <SectionTitle>🎬 Vídeo (YouTube)</SectionTitle>
              <Input
                value={form.video}
                onChange={e => setForm(f => ({ ...f, video: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
              />
              {form.video && (() => {
                const patterns = [/youtube\.com\/watch\?v=([^&]+)/, /youtu\.be\/([^?]+)/];
                for (const p of patterns) { const m = form.video.match(p); if (m) return (
                  <div style={{ marginTop: 10, padding: "8px 14px", background: C.greenBg, border: `1px solid #bbf7d0`, borderRadius: 8, fontSize: "0.78rem", color: C.green, fontWeight: 600 }}>
                    ✓ Vídeo YouTube detectado — ID: {m[1]}
                  </div>
                ); }
                return <div style={{ marginTop: 10, padding: "8px 14px", background: C.dangerBg, border: `1px solid #fecaca`, borderRadius: 8, fontSize: "0.78rem", color: C.danger }}>URL de vídeo inválida. Use um link do YouTube.</div>;
              })()}
            </div>

            {/* Error + actions */}
            {formError && (
              <div style={{ background: C.dangerBg, border: `1px solid #fecaca`, borderRadius: 8, padding: "10px 14px", color: C.danger, fontSize: "0.83rem" }}>{formError}</div>
            )}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <Btn type="submit" disabled={saving}>{saving ? "Salvando..." : editId ? "Salvar alterações" : "Criar produto"}</Btn>
              <Btn variant="outline" onClick={cancelForm}>Cancelar</Btn>
              {editId && (
                <a href={`/produtos/${form.slug || editId}`} target="_blank" rel="noopener noreferrer"
                  style={{ marginLeft: "auto", fontSize: "0.78rem", color: C.blue, display: "flex", alignItems: "center", gap: 4 }}>
                  Ver página pública ↗
                </a>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ── TABLE ── */}
      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: C.muted, border: `1px dashed ${C.border}`, borderRadius: 12 }}>
          <p style={{ fontWeight: 700 }}>Nenhum produto cadastrado</p>
          <p style={{ fontSize: "0.83rem", marginTop: 4 }}>Clique em "+ Novo Produto" para começar</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <thead>
              <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                {["Imagem", "Nome", "Marca", "Categoria", "Detalhes", "Ações"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "0.72rem", fontWeight: 700, color: C.muted, textAlign: "left", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const imgs = (() => { try { return JSON.parse(p.images || "[]"); } catch { return []; } })();
                return (
                  <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ width: 52, height: 52, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 600, color: C.dark, maxWidth: 200 }}>{p.name}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ display: "inline-block", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", background: C.gray, padding: "3px 10px", borderRadius: 9999 }}>{p.brand}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.83rem", color: C.muted }}>{p.category}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {imgs.length > 0 && (
                          <span style={{ fontSize: "0.7rem", color: C.blue }}>🖼️ {imgs.length} foto{imgs.length > 1 ? "s" : ""} extra</span>
                        )}
                        {p.description && (
                          <span style={{ fontSize: "0.7rem", color: C.green }}>📝 Descrição</span>
                        )}
                        {p.video && (
                          <span style={{ fontSize: "0.7rem", color: "#7c3aed" }}>🎬 Vídeo</span>
                        )}
                        {!imgs.length && !p.description && !p.video && (
                          <span style={{ fontSize: "0.7rem", color: "#d1d5db" }}>—</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {confirmDelete === p.id ? (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: "0.78rem", color: C.danger, fontWeight: 600 }}>Confirmar exclusão?</span>
                          <Btn variant="danger" onClick={() => handleDelete(p.id)} style={{ padding: "5px 12px", fontSize: "0.75rem" }}>Sim</Btn>
                          <Btn variant="outline" onClick={() => setConfirmDelete(null)} style={{ padding: "5px 12px", fontSize: "0.75rem" }}>Não</Btn>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <Btn variant="outline" onClick={() => openEdit(p)} style={{ padding: "5px 14px", fontSize: "0.75rem" }}>Editar</Btn>
                          <a href={`/produtos/${p.slug || p.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.72rem", color: C.blue, fontWeight: 600, padding: "5px 10px" }}>Ver ↗</a>
                          <Btn variant="ghost" onClick={() => setConfirmDelete(p.id)} style={{ color: C.danger }}>Excluir</Btn>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// BLOG TAB
// ──────────────────────────────────────────────
function BlogTab({ posts, setPosts }) {
  const emptyForm = { date: "", title: "", excerpt: "", readTime: "", content: "", coverImage: "", coverImageMode: "url", slug: "", slugEdited: false };
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [editId, setEditId]         = useState(null);
  const [saving, setSaving]         = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError]           = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  const coverFileRef = useRef(null);
  const coverUpload  = useImageUpload();

  function openCreate() { setEditId(null); setForm(emptyForm); setCoverPreview(""); setError(""); setShowForm(true); }
  function openEdit(p)  {
    setEditId(p.id);
    setForm({ date: p.date, title: p.title, excerpt: p.excerpt, readTime: p.readTime, content: p.content || "", coverImage: p.coverImage || "", coverImageMode: "url", slug: p.slug || "", slugEdited: true });
    setCoverPreview(p.coverImage || "");
    setError(""); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function cancelForm() { setShowForm(false); setEditId(null); setForm(emptyForm); setCoverPreview(""); setError(""); }

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await coverUpload.upload(file);
    if (url) { setForm(f => ({ ...f, coverImage: url })); setCoverPreview(url); }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setError("");
    const payload = { ...form, slug: form.slug || form.title, coverImage: form.coverImage || "" };
    const res = await fetch(editId ? `/api/admin/blog/${editId}` : "/api/admin/blog", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Erro ao salvar"); return; }
    if (editId) { setPosts(ps => ps.map(p => p.id === editId ? data : p)); }
    else        { setPosts(ps => [data, ...ps]); }
    cancelForm();
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) { setPosts(ps => ps.filter(p => p.id !== id)); setConfirmDelete(null); }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: C.dark, marginBottom: 2 }}>Artigos do Blog</h2>
          <p style={{ fontSize: "0.8rem", color: C.muted }}>{posts.length} artigo{posts.length !== 1 ? "s" : ""} cadastrado{posts.length !== 1 ? "s" : ""}</p>
        </div>
        {!showForm && <Btn onClick={openCreate}>+ Novo Artigo</Btn>}
      </div>

      {showForm && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, marginBottom: 28 }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.dark, marginBottom: 20 }}>{editId ? "Editar Artigo" : "Novo Artigo"}</h3>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Data (exibição)" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="ex: Mar 2025" required />
              <Input label="Tempo de leitura" value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))} placeholder="ex: 4 min" required />
            </div>
            <Input label="Título" value={form.title} onChange={e => {
              const title = e.target.value;
              setForm(f => ({ ...f, title, slug: f.slugEdited ? f.slug : slugify(title) }));
            }} placeholder="ex: 5 dicas de segurança para o inverno" required />

            {/* Slug */}
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>URL do artigo (slug)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.82rem", color: C.muted, whiteSpace: "nowrap" }}>/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value, slugEdited: true }))}
                  placeholder="ex: como-escolher-sistema-de-alarme"
                  style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontFamily: "inherit", fontSize: "0.88rem", color: C.blue, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <p style={{ fontSize: "0.72rem", color: C.muted, marginTop: 4 }}>
                Gerado automaticamente a partir do título. Edite para personalizar.
              </p>
            </div>

            {/* ── IMAGEM DE CAPA ── */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
              <SectionTitle>🖼️ Imagem de Capa</SectionTitle>
              <p style={{ fontSize: "0.78rem", color: C.muted, marginBottom: 12 }}>
                Exibida no topo do artigo e nos cards da home. Recomendado: 1200×630px.
              </p>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                {["url", "upload"].map(mode => (
                  <button key={mode} type="button" onClick={() => setForm(f => ({ ...f, coverImageMode: mode }))}
                    style={{ padding: "6px 16px", borderRadius: 9999, fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                      background: form.coverImageMode === mode ? C.gray : "transparent",
                      color: form.coverImageMode === mode ? "#fff" : C.muted,
                      border: `1px solid ${form.coverImageMode === mode ? C.gray : C.border}` }}>
                    {mode === "url" ? "URL externa" : "Upload de arquivo"}
                  </button>
                ))}
              </div>
              {form.coverImageMode === "url" ? (
                <Input
                  value={form.coverImage}
                  onChange={e => { setForm(f => ({ ...f, coverImage: e.target.value })); setCoverPreview(e.target.value); }}
                  placeholder="https://exemplo.com/imagem-capa.jpg"
                />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input ref={coverFileRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: "none" }} />
                  <Btn variant="outline" onClick={() => coverFileRef.current?.click()} disabled={coverUpload.uploading}>
                    {coverUpload.uploading ? "Enviando..." : "Selecionar imagem"}
                  </Btn>
                  {form.coverImage && !coverUpload.uploading && <span style={{ fontSize: "0.78rem", color: C.green }}>✓ Imagem carregada</span>}
                </div>
              )}
              {coverPreview && (
                <div style={{ marginTop: 12, position: "relative", display: "inline-block" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverPreview} alt="capa" onError={() => setCoverPreview("")}
                    style={{ display: "block", maxWidth: "100%", maxHeight: 180, borderRadius: 8, border: `1px solid ${C.border}`, objectFit: "cover" }} />
                  <button type="button" onClick={() => { setForm(f => ({ ...f, coverImage: "" })); setCoverPreview(""); }}
                    style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: C.danger, color: "#fff", border: "2px solid #fff", fontSize: "0.75rem", fontWeight: 900, cursor: "pointer", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ×
                  </button>
                </div>
              )}
              {coverUpload.error && <p style={{ color: C.danger, fontSize: "0.8rem", marginTop: 6 }}>{coverUpload.error}</p>}
            </div>

            <Input label="Resumo" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Breve descrição do artigo exibida nos cards da home..." required rows={3} />
            {/* Rich text editor */}
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                Conteúdo completo
              </div>
              <RichTextEditor
                key={editId ?? "new"}
                value={form.content}
                onChange={(html) => setForm(f => ({ ...f, content: html }))}
              />
              <p style={{ fontSize: "0.72rem", color: C.muted, marginTop: 5 }}>
                Use a barra de ferramentas para formatar o texto. O conteúdo é salvo como HTML e exibido na página do artigo.
              </p>
            </div>

            {error && <div style={{ background: C.dangerBg, border: `1px solid #fecaca`, borderRadius: 8, padding: "10px 14px", color: C.danger, fontSize: "0.83rem" }}>{error}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <Btn type="submit" disabled={saving}>{saving ? "Salvando..." : editId ? "Salvar alterações" : "Criar artigo"}</Btn>
              <Btn variant="outline" onClick={cancelForm}>Cancelar</Btn>
            </div>
          </form>
        </div>
      )}

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: C.muted, border: `1px dashed ${C.border}`, borderRadius: 12 }}>
          <p style={{ fontWeight: 700 }}>Nenhum artigo cadastrado</p>
          <p style={{ fontSize: "0.83rem", marginTop: 4 }}>Clique em "+ Novo Artigo" para começar</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <thead>
              <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                {["Capa", "Data", "Título", "Resumo", "Leitura", "Artigo", "Ações"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "0.72rem", fontWeight: 700, color: C.muted, textAlign: "left", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < posts.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <td style={{ padding: "12px 16px" }}>
                    {p.coverImage ? (
                      <div style={{ width: 60, height: 40, borderRadius: 6, overflow: "hidden", border: `1px solid ${C.border}` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div style={{ width: 60, height: 40, borderRadius: 6, background: C.bg, border: `1px dashed ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: "#d1d5db" }}>
                        sem capa
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.78rem", fontWeight: 700, color: C.gray, whiteSpace: "nowrap" }}>{p.date}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.88rem", fontWeight: 600, color: C.dark, maxWidth: 240 }}>{p.title}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: C.muted, maxWidth: 280 }}>{p.excerpt.length > 80 ? p.excerpt.slice(0, 80) + "..." : p.excerpt}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.78rem", color: C.muted, whiteSpace: "nowrap" }}>{p.readTime}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {p.content
                      ? <span style={{ fontSize: "0.72rem", fontWeight: 700, color: C.green, background: C.greenBg, border: "1px solid #bbf7d0", borderRadius: 9999, padding: "3px 10px" }}>Publicado</span>
                      : <span style={{ fontSize: "0.72rem", fontWeight: 700, color: C.muted, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9999, padding: "3px 10px" }}>Rascunho</span>
                    }
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {confirmDelete === p.id ? (
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: "0.78rem", color: C.danger, fontWeight: 600 }}>Confirmar?</span>
                        <Btn variant="danger" onClick={() => handleDelete(p.id)} style={{ padding: "5px 12px", fontSize: "0.75rem" }}>Sim</Btn>
                        <Btn variant="outline" onClick={() => setConfirmDelete(null)} style={{ padding: "5px 12px", fontSize: "0.75rem" }}>Não</Btn>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Btn variant="outline" onClick={() => openEdit(p)} style={{ padding: "5px 14px", fontSize: "0.75rem" }}>Editar</Btn>
                        <a href={`/blog/${p.slug || p.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.72rem", color: C.blue, fontWeight: 600, padding: "5px 10px" }}>Ver ↗</a>
                        <Btn variant="ghost" onClick={() => setConfirmDelete(p.id)} style={{ color: C.danger }}>Excluir</Btn>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// MAIN DASHBOARD
// ──────────────────────────────────────────────
export default function AdminDashboard({ initialProducts, initialBlogPosts }) {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts]   = useState(initialProducts);
  const [posts, setPosts]         = useState(initialBlogPosts);

  const tabs = [
    { key: "products", label: `Produtos (${products.length})` },
    { key: "blog",     label: `Blog (${posts.length})` },
  ];

  return (
    <div style={{ padding: "36px 5%", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: C.dark, marginBottom: 4 }}>Painel Administrativo</h1>
        <p style={{ fontSize: "0.83rem", color: C.muted }}>Gerencie produtos (fotos, descrição, vídeo) e artigos do blog.</p>
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 28, borderBottom: `2px solid ${C.border}` }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ background: "transparent", border: "none", borderBottom: activeTab === t.key ? `2px solid ${C.blue}` : "2px solid transparent",
              marginBottom: -2, padding: "10px 24px", fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 700,
              color: activeTab === t.key ? C.blue : C.muted, cursor: "pointer", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "28px 28px" }}>
        {activeTab === "products"
          ? <ProductsTab products={products} setProducts={setProducts} />
          : <BlogTab posts={posts} setPosts={setPosts} />
        }
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: C.muted, textDecoration: "none" }}>
          ← Ver site público
        </a>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href="/api/admin/backup/uploads"
            download
            style={{
              fontSize: "0.8rem", fontWeight: 700, color: C.blue,
              textDecoration: "none", border: `1px solid ${C.blue}`,
              borderRadius: 9999, padding: "6px 16px",
              background: C.blueBg, transition: "all 0.2s",
            }}
          >
            ↓ Backup de imagens
          </a>
          <a
            href="/api/admin/export"
            download
            style={{
              fontSize: "0.8rem", fontWeight: 700, color: C.green,
              textDecoration: "none", border: `1px solid ${C.green}`,
              borderRadius: 9999, padding: "6px 16px",
              background: C.greenBg, transition: "all 0.2s",
            }}
          >
            ↓ Exportar seed.js
          </a>
        </div>
      </div>
    </div>
  );
}
