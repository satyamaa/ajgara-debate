"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    questions: 0,
    participants: 0,
    editions: 0,
    posts: 0,
  });

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [q, p, e, posts] = await Promise.all([
          fetch("/api/questions").then((r) => r.json()),
          fetch("/api/participants").then((r) => r.json()),
          fetch("/api/editions").then((r) => r.json()),
          fetch("/api/posts").then((r) => r.json()),
        ]);

        setStats({
          questions: q.questions?.length || 0,
          participants: p.participants?.length || 0,
          editions: e.editions?.length || 0,
          posts: posts.posts?.length || 0,
        });

        setQuestions(q.questions?.slice(0, 5) || []);
      } catch (error) {
        console.error(error);
      }
    }

    loadDashboard();
  }, []);

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      <p
        style={{
          letterSpacing: "4px",
          fontSize: "13px",
        }}
      >
        AJGARA DEBATE
      </p>

      <h1
        style={{
          fontSize: "48px",
          margin: "10px 0 40px",
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <Stat title="Questions" value={stats.questions} />
        <Stat
          title="Participants"
          value={stats.participants}
        />
        <Stat title="Editions" value={stats.editions} />
        <Stat title="Posts" value={stats.posts} />
      </div>

      <section style={{ marginTop: "50px" }}>
        <h2>Recent Questions</h2>

        {questions.length === 0 ? (
          <p>No questions yet.</p>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              style={{
                padding: "20px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <strong>{q.question}</strong>

              <div style={{ marginTop: "8px" }}>
                Status: <b>{q.status}</b>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

function Stat({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "30px",
        background: "#fff",
      }}
    >
      <div
        style={{
          fontSize: "42px",
          fontWeight: "bold",
        }}
      >
        {value}
      </div>

      <div style={{ marginTop: "8px" }}>
        {title}
      </div>
    </div>
  );
}