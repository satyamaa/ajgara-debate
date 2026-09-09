"use client";

import { useEffect, useState } from "react";

export default function MediaPage() {
  const [media, setMedia] = useState([]);

  const [form, setForm] = useState({
    title: "",
    url: "",
    thumbnail: "",
    description: "",
    altText: "",
    type: "IMAGE",
  });

  async function loadMedia() {
    const res = await fetch("/api/media");
    const data = await res.json();

    if (data.success) setMedia(data.media);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function addMedia(e) {
    e.preventDefault();

    const res = await fetch("/api/media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
      return;
    }

    setForm({
      title: "",
      url: "",
      thumbnail: "",
      description: "",
      altText: "",
      type: "IMAGE",
    });

    loadMedia();
  }

  async function deleteMedia(id) {
    if (!confirm("Delete this media?")) return;

    await fetch("/api/media", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadMedia();
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1100px", margin: "auto" }}>
      <h1>Media Library</h1>

      <form onSubmit={addMedia} className="form">
        <h2>+ Add Media</h2>

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="IMAGE">Image</option>
          <option value="VIDEO">Video</option>
          <option value="DOCUMENT">Document</option>
          <option value="OTHER">Other</option>
        </select>

        <input
          placeholder="Media URL"
          value={form.url}
          onChange={(e) =>
            setForm({ ...form, url: e.target.value })
          }
          required
        />

        <input
          placeholder="Thumbnail URL"
          value={form.thumbnail}
          onChange={(e) =>
            setForm({
              ...form,
              thumbnail: e.target.value,
            })
          }
        />

        <input
          placeholder="Alt text"
          value={form.altText}
          onChange={(e) =>
            setForm({
              ...form,
              altText: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <button type="submit">Save Media</button>
      </form>

      <h2 style={{ marginTop: "40px" }}>Media</h2>

      {media.length === 0 ? (
        <p>No media yet.</p>
      ) : (
        media.map((item) => (
          <div className="question" key={item.id}>
            <h3>{item.title}</h3>

            <p>Type: {item.type}</p>

            <p>
              <a href={item.url} target="_blank">
                Open Media
              </a>
            </p>

            <button onClick={() => deleteMedia(item.id)}>
              🗑 Delete
            </button>
          </div>
        ))
      )}
    </main>
  );
}