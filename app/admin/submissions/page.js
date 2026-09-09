"use client";

import { useEffect, useState } from "react";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadSubmissions() {
    try {
      const response = await fetch(
        "/api/question-submissions"
      );

      const data = await response.json();

      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function updateSubmission(id, status, isFeatured = false) {
    try {
      await fetch("/api/question-submissions", {
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

      loadSubmissions();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteSubmission(id) {
    if (!confirm("Delete this submission?")) return;

    try {
      await fetch("/api/question-submissions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      loadSubmissions();
    } catch (error) {
      console.error(error);
    }
  }

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
        AAJ KA YAKSH
      </p>

      <h1
        style={{
          fontSize: "44px",
          margin: "10px 0 40px",
        }}
      >
        Question Submissions
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {submissions.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                border: "1px solid #ddd",
                padding: "24px",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "15px",
                }}
              >
                {item.question}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                  lineHeight: "1.8",
                }}
              >
                <div>
                  <b>Name:</b>{" "}
                  {item.name || "Not provided"}
                </div>

                <div>
                  <b>Email:</b>{" "}
                  {item.email || "Not provided"}
                </div>

                <div>
                  <b>Status:</b> {item.status}
                </div>

                <div>
                  <b>Submitted:</b>{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() =>
                    updateSubmission(
                      item.id,
                      "APPROVED"
                    )
                  }
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateSubmission(
                      item.id,
                      "FEATURED",
                      true
                    )
                  }
                >
                  Feature
                </button>

                <button
                  onClick={() =>
                    updateSubmission(
                      item.id,
                      "REJECTED"
                    )
                  }
                >
                  Reject
                </button>

                <button
                  onClick={() =>
                    deleteSubmission(item.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}