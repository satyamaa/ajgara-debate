"use client";

import { useState } from "react";

export default function QuestionForm() {
  const [question, setQuestion] = useState("");
  const [theme, setTheme] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!question.trim()) {
      setMessage("कृपया अपना सवाल लिखें।");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/question-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          theme: theme.trim(),
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const text = await response.text();

let data = {};

if (text) {
  try {
    data = JSON.parse(text);
  } catch {
    data = {};
  }
}

      if (!response.ok) {
        throw new Error(data.error || "कुछ गलत हो गया।");
      }

      setQuestion("");
      setTheme("");
      setName("");
      setEmail("");

      setMessage(
        "आपका सवाल सफलतापूर्वक भेज दिया गया है। धन्यवाद!"
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "650px",
        margin: "30px auto 0",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="अपना सवाल यहाँ लिखें..."
        rows={5}
        required
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          resize: "vertical",
        }}
      />

      <input
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="विषय (जैसे — युवा और विकास)"
        style={{
          width: "100%",
          padding: "13px",
          fontSize: "15px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="आपका नाम (वैकल्पिक)"
        style={{
          width: "100%",
          padding: "13px",
          fontSize: "15px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="आपका ईमेल (वैकल्पिक)"
        style={{
          width: "100%",
          padding: "13px",
          fontSize: "15px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      <button
        type="submit"
        className="primary"
        disabled={loading}
      >
        {loading ? "भेजा जा रहा है..." : "सवाल भेजें →"}
      </button>

      {message && (
        <p style={{ marginTop: "10px" }}>
          {message}
        </p>
      )}
    </form>
  );
} 