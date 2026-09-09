"use client";

import { useEffect, useState } from "react";

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    village: "",
    block: "",
    district: "",
    photoUrl: "",
    bio: "",
    score: "",
  });

  const [loading, setLoading] = useState(true);

  async function loadParticipants() {
    const res = await fetch("/api/participants");
    const data = await res.json();

    if (data.success) {
      setParticipants(data.participants);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadParticipants();
  }, []);

  function change(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function addParticipant(e) {
    e.preventDefault();

    const res = await fetch("/api/participants", {
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
      name: "",
      village: "",
      block: "",
      district: "",
      photoUrl: "",
      bio: "",
      score: "",
    });

    loadParticipants();
  }

  async function updateStatus(id, status) {
    await fetch("/api/participants", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status,
      }),
    });

    loadParticipants();
  }

  async function deleteParticipant(id) {
    if (!confirm("Delete this participant?")) return;

    await fetch("/api/participants", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadParticipants();
  }

  const registered = participants.filter(
    (p) => p.status === "REGISTERED"
  ).length;

  const qualified = participants.filter(
    (p) => p.status === "QUALIFIED"
  ).length;

  const winners = participants.filter(
    (p) => p.status === "WINNER"
  ).length;

  return (
    <main style={{ padding: "40px", maxWidth: "1100px", margin: "auto" }}>
      <h1>Participants</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          margin: "30px 0",
        }}
      >
        <div className="card">
          <b>{participants.length}</b>
          <span>Total</span>
        </div>

        <div className="card">
          <b>{registered}</b>
          <span>Registered</span>
        </div>

        <div className="card">
          <b>{qualified}</b>
          <span>Qualified</span>
        </div>

        <div className="card">
          <b>{winners}</b>
          <span>Winners</span>
        </div>
      </div>

      <form onSubmit={addParticipant} className="form">
        <h2>+ Add Participant</h2>

        <input
          name="name"
          value={form.name}
          onChange={change}
          placeholder="Participant name"
          required
        />

        <input
          name="village"
          value={form.village}
          onChange={change}
          placeholder="Village"
        />

        <input
          name="block"
          value={form.block}
          onChange={change}
          placeholder="Block"
        />

        <input
          name="district"
          value={form.district}
          onChange={change}
          placeholder="District"
        />

        <input
          name="photoUrl"
          value={form.photoUrl}
          onChange={change}
          placeholder="Photo URL"
        />

        <input
          name="score"
          type="number"
          value={form.score}
          onChange={change}
          placeholder="Score"
        />

        <textarea
          name="bio"
          value={form.bio}
          onChange={change}
          placeholder="Short bio"
          rows={3}
        />

        <button type="submit">Save Participant</button>
      </form>

      <h2 style={{ marginTop: "40px" }}>Participants</h2>

      {loading ? (
        <p>Loading...</p>
      ) : participants.length === 0 ? (
        <p>No participants yet.</p>
      ) : (
        participants.map((p) => (
          <div className="question" key={p.id}>
            <h3>{p.name}</h3>

            <p>
              {p.village || "—"} • {p.block || "—"} •{" "}
              {p.district || "—"}
            </p>

            <p>
              Score: <b>{p.score ?? "—"}</b>
            </p>

            <p>
              Status: <b>{p.status}</b>
            </p>

            <button
              onClick={() => updateStatus(p.id, "QUALIFIED")}
            >
              ✓ Qualified
            </button>

            <button
              onClick={() => updateStatus(p.id, "ELIMINATED")}
            >
              ✕ Eliminated
            </button>

            <button
              onClick={() => updateStatus(p.id, "WINNER")}
            >
              🏆 Winner
            </button>

            <button onClick={() => deleteParticipant(p.id)}>
              🗑 Delete
            </button>
          </div>
        ))
      )}
    </main>
  );
}