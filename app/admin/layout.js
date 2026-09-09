import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f5f0e7",
      }}
    >
      <aside
        style={{
          width: "240px",
          background: "#17120f",
          color: "white",
          padding: "30px 18px",
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            letterSpacing: "3px",
            fontSize: "18px",
            marginBottom: "35px",
          }}
        >
          AJGARA
        </h2>

        <p
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            color: "#c99b43",
            marginBottom: "15px",
          }}
        >
          ADMIN PANEL
        </p>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <NavItem href="/admin" text="Dashboard" />
          <NavItem href="/admin/questions" text="Questions" />
          <NavItem
  href="/admin/submissions"
  text="Yaksh Submissions"
/>
          <NavItem
            href="/admin/participants"
            text="Participants"
          />
          <NavItem href="/admin/editions" text="Editions" />
          <NavItem href="/admin/rounds" text="Rounds" />
          <NavItem href="/admin/posts" text="Posts & Updates" />
          <NavItem href="/admin/media" text="Media Library" />
          <NavItem href="/admin/pages" text="Pages" />
        </nav>

        <div
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid #3a3029",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#d6c3a0",
              textDecoration: "none",
            }}
          >
            ← View Website
          </Link>
          <form
  action="/api/auth/logout"
  method="POST"
  style={{ marginTop: "15px" }}
>
  <button
    type="submit"
    style={{
      width: "100%",
      padding: "10px",
      background: "transparent",
      color: "#d6c3a0",
      border: "1px solid #55483d",
      cursor: "pointer",
    }}
  >
    Logout
  </button>
</form>
        </div>
      </aside>

      <section
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {children}
      </section>
    </div>
  );
}

function NavItem({ href, text }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "12px 14px",
        borderRadius: "6px",
        color: "#f5eee4",
        textDecoration: "none",
        fontSize: "15px",
      }}
    >
      {text}
    </Link>
  );
}