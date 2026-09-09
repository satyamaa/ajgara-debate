"use client";

import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
  });

  async function loadPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();

    if (data.success) setPosts(data.posts);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function addPost(e) {
    e.preventDefault();

    const res = await fetch("/api/posts", {
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
      excerpt: "",
      content: "",
      coverImage: "",
    });

    loadPosts();
  }

  async function publish(id) {
    await fetch("/api/posts", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status: "PUBLISHED",
      }),
    });

    loadPosts();
  }

  async function deletePost(id) {
    if (!confirm("Delete this post?")) return;

    await fetch("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadPosts();
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1100px", margin: "auto" }}>
      <h1>Posts & Updates</h1>

      <form onSubmit={addPost} className="form">
        <h2>+ Add Post</h2>

        <input
          placeholder="Post title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <input
          placeholder="Short excerpt"
          value={form.excerpt}
          onChange={(e) =>
            setForm({ ...form, excerpt: e.target.value })
          }
        />

        <input
          placeholder="Cover image URL"
          value={form.coverImage}
          onChange={(e) =>
            setForm({
              ...form,
              coverImage: e.target.value,
            })
          }
        />

        <textarea
          rows={8}
          placeholder="Post content..."
          value={form.content}
          onChange={(e) =>
            setForm({
              ...form,
              content: e.target.value,
            })
          }
          required
        />

        <button type="submit">Save Draft</button>
      </form>

      <h2 style={{ marginTop: "40px" }}>All Posts</h2>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div className="question" key={post.id}>
            <h2>{post.title}</h2>

            <p>{post.excerpt}</p>

            <p>
              Status: <b>{post.status}</b>
            </p>

            <button onClick={() => publish(post.id)}>
              ✓ Publish
            </button>

            <button onClick={() => deletePost(post.id)}>
              🗑 Delete
            </button>
          </div>
        ))
      )}
    </main>
  );
}