"use client";

import { useEffect, useState } from "react";

export default function EditionsPage() {
  const [editions, setEditions] = useState([]);
  const [form, setForm] = useState({
    year: "",
    title: "",
    description: "",
  });

  async function loadEditions() {
    const res = await fetch("/api/editions");
    const data = await res.json();

    if (data.success) {
      setEditions(data.editions);
    }
  }

  useEffect(() => {
    loadEditions();
  }, []);

  async function addEdition(e) {
    e.preventDefault();

    const res = await fetch("/api/editions", {
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
      year: "",
      title: "",
      description: "",
    });

    loadEditions();
  }

  async function changeStatus(id, status) {
    await fetch("/api/editions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    loadEditions();
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1100px", margin: "auto" }}>
      <h1>Editions</h1>

      <form onSubmit={addEdition} className="form">
        <h2>+ Add Edition</h2>

        <input
          type="number"
          placeholder="Year"
          value={form.year}
          onChange={(e) =>
            setForm({ ...form, year: e.target.value })
          }
          required
        />

        <input
          placeholder="Edition title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
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

        <button type="submit">Save Edition</button>
      </form>

      <h2 style={{ marginTop: "40px" }}>All Editions</h2>

      {editions.map((edition) => (
        <div className="question" key={edition.id}>
          <h2>{edition.title}</h2>

          <p>Year: {edition.year}</p>

          <p>
            Status: <b>{edition.status}</b>
          </p>

          <p>
            Participants: {edition._count.participants} |
            Questions: {edition._count.questions} |
            Rounds: {edition.rounds.length}
          </p>

          <button
            onClick={() =>
              changeStatus(edition.id, "ACTIVE")
            }
          >
            Activate
          </button>

          <button
            onClick={() =>
              changeStatus(edition.id, "COMPLETED")
            }
          >
            Complete
          </button>
        </div>
      ))}
    </main>
  );
}