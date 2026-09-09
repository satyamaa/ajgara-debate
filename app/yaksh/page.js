"use client";

import { useState } from "react";
import "./yaksh.css";

export default function YakshPage() {
  const [question, setQuestion] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!question.trim()) {
      setMessage("Please enter your question.");
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
  name: name.trim(),
  email: email.trim(),
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setQuestion("");
      setName("");
      setEmail("");

      setMessage(
        "Your question has been submitted successfully. Thank you!"
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="yaksh-page">
      <div className="yaksh-container">
        <p className="yaksh-eyebrow">THE QUESTIONS RETURN</p>

        <h1>
          Aaj Ka Yaksh.
        </h1>

        <p className="yaksh-subtitle">
          Submit a question that deserves to be asked.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            YOUR QUESTION <span>*</span>
          </label>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you ask Yaksh?"
            required
          />

          <div className="yaksh-fields">
            <div>
              <label>
                YOUR NAME <small>(optional)</small>
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label>
                EMAIL <small>(optional)</small>
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading
              ? "SUBMITTING..."
              : "SUBMIT YOUR QUESTION →"}
          </button>

          {message && (
            <p className="yaksh-message">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}