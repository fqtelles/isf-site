"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect, useCallback } from "react";

// ── Toolbar button ────────────────────────────────────────────────────────────
function TBtn({ onClick, active, title, children, disabled }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      style={{
        background: active ? "#1a1d20" : "transparent",
        color: active ? "#fff" : "#32373c",
        border: "none",
        borderRadius: 6,
        padding: "5px 9px",
        cursor: disabled ? "default" : "pointer",
        fontFamily: "inherit",
        fontSize: "0.8rem",
        fontWeight: 700,
        lineHeight: 1,
        opacity: disabled ? 0.4 : 1,
        transition: "background 0.15s, color 0.15s",
        minWidth: 30,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span style={{ width: 1, background: "#e5e7eb", margin: "0 4px", alignSelf: "stretch", display: "inline-block" }} />;
}

// ── Link modal ────────────────────────────────────────────────────────────────
function setLinkPrompt(editor) {
  const prev = editor.getAttributes("link").href || "";
  const url = window.prompt("URL do link:", prev);
  if (url === null) return; // cancelled
  if (url === "") {
    editor.chain().focus().unsetLink().run();
  } else {
    editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
  }
}

// ── Toolbar ───────────────────────────────────────────────────────────────────
function Toolbar({ editor }) {
  if (!editor) return null;
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center",
      background: "#f9fafb", border: "1px solid #e5e7eb",
      borderBottom: "none", borderRadius: "8px 8px 0 0",
      padding: "6px 8px",
    }}>
      {/* Paragraph / Heading */}
      <select
        value={
          editor.isActive("heading", { level: 2 }) ? "h2"
          : editor.isActive("heading", { level: 3 }) ? "h3"
          : editor.isActive("heading", { level: 4 }) ? "h4"
          : "p"
        }
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") editor.chain().focus().setParagraph().run();
          else editor.chain().focus().setHeading({ level: parseInt(v.slice(1)) }).run();
        }}
        style={{
          background: "transparent", border: "1px solid #e5e7eb", borderRadius: 6,
          padding: "4px 6px", fontFamily: "inherit", fontSize: "0.78rem",
          color: "#32373c", cursor: "pointer", outline: "none",
        }}
      >
        <option value="p">Parágrafo</option>
        <option value="h2">Título H2</option>
        <option value="h3">Título H3</option>
        <option value="h4">Título H4</option>
      </select>

      <Divider />

      {/* Inline formatting */}
      <TBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Negrito (Ctrl+B)">
        <strong>B</strong>
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Itálico (Ctrl+I)">
        <em>I</em>
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Sublinhado (Ctrl+U)">
        <span style={{ textDecoration: "underline" }}>U</span>
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Tachado">
        <span style={{ textDecoration: "line-through" }}>S</span>
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Código inline">
        {"</>"}
      </TBtn>

      <Divider />

      {/* Alignment */}
      <TBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Alinhar à esquerda">
        ≡
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Centralizar">
        ≡
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Alinhar à direita">
        ≡
      </TBtn>

      <Divider />

      {/* Lists */}
      <TBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista com marcadores">
        • —
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerada">
        1. —
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citação">
        ❝
      </TBtn>

      <Divider />

      {/* Link */}
      <TBtn onClick={() => setLinkPrompt(editor)} active={editor.isActive("link")} title="Inserir/editar link">
        🔗
      </TBtn>

      <Divider />

      {/* History */}
      <TBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Desfazer (Ctrl+Z)">
        ↩
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Refazer (Ctrl+Y)">
        ↪
      </TBtn>
    </div>
  );
}

// ── Rich Text Editor ──────────────────────────────────────────────────────────
export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        style: [
          "min-height:320px",
          "padding:16px",
          "font-size:0.93rem",
          "line-height:1.8",
          "color:#1a1d20",
          "font-family:inherit",
          "outline:none",
        ].join(";"),
      },
    },
  });

  // Sync when the value is reset from outside (e.g. switching posts)
  const prevValue = useCallback(() => value, [value]);
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      // Avoid overwriting while user is typing by comparing previous value
      editor.commands.setContent(value || "", false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, prevValue]);

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", overflow: "hidden" }}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <style>{`
        .tiptap:focus { outline: none; }
        .tiptap p { margin: 0 0 12px; }
        .tiptap p:last-child { margin-bottom: 0; }
        .tiptap h2 { font-size: 1.3rem; font-weight: 800; color: #1a1d20; margin: 20px 0 8px; }
        .tiptap h3 { font-size: 1.1rem; font-weight: 700; color: #1a1d20; margin: 16px 0 6px; }
        .tiptap h4 { font-size: 0.97rem; font-weight: 700; color: #32373c; margin: 12px 0 4px; }
        .tiptap ul, .tiptap ol { padding-left: 22px; margin: 0 0 12px; }
        .tiptap li { margin-bottom: 4px; }
        .tiptap blockquote { border-left: 3px solid #126798; padding-left: 14px; color: #6b7280; font-style: italic; margin: 16px 0; }
        .tiptap code { background: #f3f4f6; padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
        .tiptap a { color: #126798; text-decoration: underline; }
        .tiptap strong { font-weight: 700; }
        .tiptap em { font-style: italic; }
        .tiptap s { text-decoration: line-through; }
      `}</style>
    </div>
  );
}
