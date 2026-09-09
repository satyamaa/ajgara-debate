"use client";

import { useEffect, useState } from "react";

export default function PagesPage() {
  const [pages, setPages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
  });

  async function loadPages() {
    const res = await fetch("/api/pages");
    const data = await res.json();

    if (data.success) setPages(data.pages);
  }

  useEffect(() => {
    loadPages();
  }, []);

  async function addPage(e) {
    e.preventDefault();

    const res = await fetch("/api/pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        isPublished: false,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
      return;
    }

    setForm({
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
    });

    loadPages();
  }

  async function publishPage(page) {
    await fetch("/api/pages", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...page,
        isPublished: true,
      }),
    });

    loadPages();
  }

  async function deletePage(id) {
    if (!confirm("Delete this page?")) return;

    await fetch("/api/pages", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadPages();
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1100px", margin: "auto" }}>
      <h1>Pages</h1>

      <form onSubmit={addPage} className="form">
        <h2>+ Add Page</h2>

        <input
          placeholder="Page title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <input
          placeholder="Slug e.g. about"
          value={form.slug}
          onChange={(e) =>
            setForm({ ...form, slug: e.target.value })
          }
        />

        <textarea
          rows={10}
          placeholder="Page content..."
          value={form.content}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
          required
        />

        <input
          placeholder="SEO title"
          value={form.metaTitle}
          onChange={(e) =>
            setForm({
              ...form,
              metaTitle: e.target.value,
            })
          }
        />

        <textarea
          placeholder="SEO description"
          value={form.metaDescription}
          onChange={(e) =>
            setForm({
              ...form,
              metaDescription: e.target.value,
            })
          }
        />

        <button type="submit">Save Draft</button>
      </form>

      <h2 style={{ marginTop: "40px" }}>All Pages</h2>

      {pages.map((page) => (
        <div className="question" key={page.id}>
          <h2>{page.title}</h2>

          <p>
            /{page.slug}
          </p>

          <p>
            Status:{" "}
            <b>
              {page.isPublished
                ? "PUBLISHED"
                : "DRAFT"}
            </b>
          </p>

          {!page.isPublished && (
            <button
              onClick={() => publishPage(page)}
            >
              ✓ Publish
            </button>
          )}

          <button
            onClick={() => deletePage(page.id)}
          >
            🗑 Delete
          </button>
        </div>
      ))}
    </main>
  );
}