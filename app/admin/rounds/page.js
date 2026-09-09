"use client";

import { useEffect, useState } from "react";

export default function RoundsPage() {
  const [rounds, setRounds] = useState([]);
  const [editions, setEditions] = useState([]);

  const [form, setForm] = useState({
    editionId: "",
    name: "",
    roundNumber: "",
    description: "",
  });

  async function loadData() {
    const [roundRes, editionRes] = await Promise.all([
      fetch("/api/rounds"),
      fetch("/api/editions"),
    ]);

    const roundData = await roundRes.json();
    const editionData = await editionRes.json();

    if (roundData.success) setRounds(roundData.rounds);
    if (editionData.success) setEditions(editionData.editions);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addRound(e) {
    e.preventDefault();

    const res = await fetch("/api/rounds", {
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
      editionId: "",
      name: "",
      roundNumber: "",
      description: "",
    });

    loadData();
  }

  async function changeStatus(id, status) {
    await fetch("/api/rounds", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status,
      }),
    });

    loadData();
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1100px", margin: "auto" }}>
      <h1>Debate Rounds</h1>

      <form onSubmit={addRound} className="form">
        <h2>+ Add Round</h2>

        <select
          value={form.editionId}
          onChange={(e) =>
            setForm({
              ...form,
              editionId: e.target.value,
            })
          }
          required
        >
          <option value="">Select Edition</option>

          {editions.map((edition) => (
            <option key={edition.id} value={edition.id}>
              {edition.title}
            </option>
          ))}
        </select>

        <input
          placeholder="Round name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          required
        />

        <input
          type="number"
          placeholder="Round number"
          value={form.roundNumber}
          onChange={(e) =>
            setForm({
              ...form,
              roundNumber: e.target.value,
            })
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

        <button type="submit">Save Round</button>
      </form>

      <h2 style={{ marginTop: "40px" }}>Rounds</h2>

      {rounds.map((round) => (
        <div className="question" key={round.id}>
          <h2>
            {round.roundNumber}. {round.name}
          </h2>

          <p>
            Edition: <b>{round.edition.title}</b>
          </p>

          <p>
            Participants: {round.participants.length}
          </p>

          <p>
            Status: <b>{round.status}</b>
          </p>

          <button
            onClick={() =>
              changeStatus(round.id, "ACTIVE")
            }
          >
            ▶ Start
          </button>

          <button
            onClick={() =>
              changeStatus(round.id, "COMPLETED")
            }
          >
            ✓ Complete
          </button>
        </div>
      ))}
    </main>
  );
}