"use client";

import { useEffect, useState } from "react";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadQuestions() {
    setLoading(true);

    const res = await fetch("/api/questions");
    const data = await res.json();

    if (data.success) {
      setQuestions(data.questions);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  async function addQuestion(e) {
    e.preventDefault();

    if (!question.trim()) return;

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        theme,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
      return;
    }

    setQuestion("");
    setTheme("");
    loadQuestions();
  }

  async function updateQuestion(id, status, isFeatured = false) {
    const res = await fetch("/api/questions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status,
        isFeatured,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
      return;
    }

    loadQuestions();
  }

  async function deleteQuestion(id) {
    if (!confirm("Delete this question?")) return;

    await fetch("/api/questions", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadQuestions();
  }

  const pending = questions.filter(
    (q) => q.status === "PENDING"
  ).length;

  const approved = questions.filter(
    (q) =>
      q.status === "APPROVED" ||
      q.status === "FEATURED"
  ).length;

  const featured = questions.filter(
    (q) => q.isFeatured
  ).length;

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "auto",
      }}
    >
      <p
        style={{
          letterSpacing: "4px",
          fontSize: "12px",
          color: "#a8792f",
        }}
      >
        CONTENT MANAGEMENT
      </p>

      <h1 style={{ fontSize: "48px" }}>
        Questions
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "15px",
          margin: "30px 0",
        }}
      >
        <Stat title="Total" value={questions.length} />
        <Stat title="Pending" value={pending} />
        <Stat title="Approved" value={approved} />
        <Stat title="Featured" value={featured} />
      </div>

      <form
        onSubmit={addQuestion}
        style={{
          background: "white",
          padding: "25px",
          border: "1px solid #ddd",
          marginBottom: "40px",
        }}
      >
        <h2>+ Add Question</h2>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question..."
          rows={4}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
          }}
        />

        <input
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Theme (optional)"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
          }}
        />

        <button type="submit">
          Save Question
        </button>
      </form>

      <h2>Questions</h2>

      {loading ? (
        <p>Loading...</p>
      ) : questions.length === 0 ? (
        <p>No questions yet.</p>
      ) : (
        questions.map((q) => (
          <div
            key={q.id}
            style={{
              background: "white",
              padding: "22px",
              marginTop: "15px",
              border: "1px solid #ddd",
            }}
          >
            <h3>{q.question}</h3>

            {q.theme && (
              <p>
                Theme: <b>{q.theme}</b>
              </p>
            )}

            <p>
              Status: <b>{q.status}</b>
            </p>

            {q.status === "PENDING" && (
              <>
                <button
                  onClick={() =>
                    updateQuestion(q.id, "APPROVED")
                  }
                >
                  ✓ Approve
                </button>

                <button
                  onClick={() =>
                    updateQuestion(q.id, "REJECTED")
                  }
                >
                  ✕ Reject
                </button>
              </>
            )}

            <button
              onClick={() =>
                updateQuestion(
                  q.id,
                  "FEATURED",
                  true
                )
              }
            >
              ⭐ Featured
            </button>

            <button
              onClick={() => deleteQuestion(q.id)}
            >
              🗑 Delete
            </button>
          </div>
        ))
      )}
    </main>
  );
}

function Stat({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        border: "1px solid #ddd",
      }}
    >
      <div
        style={{
          fontSize: "36px",
          fontWeight: "bold",
        }}
      >
        {value}
      </div>

      <div>{title}</div>
    </div>
  );
}
