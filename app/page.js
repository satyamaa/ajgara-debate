export const dynamic = "force-dynamic";
import "./style.css";
import { prisma } from "../lib/prisma";
import QuestionForm from "./components/QuestionForm";
import MobileNav from "./components/MobileNav";


export default async function Home() {
  const [edition, questions, participants, posts] = await Promise.all([
    prisma.edition.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { year: "desc" },
    }),

    prisma.question.findMany({
      where: {
        isFeatured: true,
        status: "FEATURED",
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),

    prisma.participant.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),

    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <main>
      <nav className="nav">
        <div className="logo">
          AJGARA <span>DEBATE</span>
        </div>

        <div className="links">
          <a href="#about">About</a>
          <a href="#yaksh">आज का यक्ष</a>
          <a href="#journey">Journey</a>
          <a href="#media">Media</a>
          <button>EN / हिंदी</button>
        </div>
        <MobileNav />
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="heroOverlay">
          <p className="eyebrow">THE GREAT AJGARA DEBATE</p>

          <h1>
            सही सवाल,
            <br />
            <i>बेहतर कल की शुरुआत।</i>
          </h1>

          <p className="lead">
            प्रतापगढ़ की धरती से सवाल, तर्क और संवाद का एक नया मंच।
          </p>

          <div className="event">
            <b>
              {edition?.year
                ? `17 SEPTEMBER ${edition.year}`
                : "17 SEPTEMBER 2026"}
            </b>

            <span>AJGARA · PRATAPGARH</span>
          </div>

          <div className="actions">
            <a href="#yaksh" className="primary">
              आज का यक्ष प्रश्न →
            </a>

            <a href="#about" className="secondary">
              जानिए पहल के बारे में
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div>
          <strong>{participants.length}</strong>
          <span>हाल के प्रतिभागी</span>
        </div>

        <div>
          <strong>{questions.length}</strong>
          <span>Featured Questions</span>
        </div>

        <div>
          <strong>{edition?.year || "2026"}</strong>
          <span>Current Edition</span>
        </div>

        <div>
          <strong>{posts.length}</strong>
          <span>Latest Updates</span>
        </div>
      </section>

      {/* YAKSH */}
      <section id="yaksh" className="section question">
  <p className="eyebrow">AAJ KA YAKSH</p>

  <h2>आज का यक्ष आपसे पूछता है…</h2>

  {questions.length > 0 ? (
    <blockquote>
      “{questions[0].question}”
    </blockquote>
  ) : (
    <blockquote>
      “अगर कानून और न्याय के बीच टकराव हो जाए, तो आपका निर्णय क्या होगा?”
    </blockquote>
  )}

  <QuestionForm />
</section>

      {/* ABOUT */}
      <section id="about" className="section split">
        <div>
          <p className="eyebrow">ABOUT AJGARA</p>

          <h2>
            सवाल से संवाद,
            <br />
            संवाद से बदलाव।
          </h2>
        </div>

        <p>
          Ajgara Debate केवल एक प्रतियोगिता नहीं है। यह युवाओं,
          नागरिकों और समाज को विचार रखने, प्रश्न पूछने और सम्मानजनक
          संवाद करने के लिए एक साझा मंच देने की पहल है।
        </p>
      </section>

      {/* JOURNEY */}
      <section id="journey" className="section journey">
        <p className="eyebrow">DEBATE JOURNEY</p>

        <h2>एक सवाल से Grand Finale तक</h2>

        <div className="timeline">
          {[
            "ग्राम स्तर",
            "ब्लॉक स्तर",
            "जिला स्तर",
            "Top 36",
            "Top 16",
            "Top 8",
            "Grand Finale",
          ].map((x, i) => (
            <div key={x}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <span>{x}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PARTICIPANTS */}
      <section className="section">
        <p className="eyebrow">PARTICIPANTS</p>

        <h2>Ajgara की आवाज़ें</h2>

        {participants.length === 0 ? (
          <p>प्रतिभागियों की जानकारी जल्द उपलब्ध होगी।</p>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.id}
              style={{
                padding: "15px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <strong>{participant.name}</strong>

              {participant.village && (
                <span style={{ marginLeft: "10px" }}>
                  {participant.village}
                </span>
              )}
            </div>
          ))
        )}
      </section>

      {/* POSTS */}
      <section id="media" className="section dark">
        <p className="eyebrow">AJGARA STORIES</p>

        <h2>कहानियाँ, चेहरे और सवाल।</h2>

        <p>
          Debate की यात्रा, प्रतिभागियों की आवाज़ और Ajgara की पहचान—
          एक जगह।
        </p>

        {posts.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: "15px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <strong>{post.title}</strong>

                {post.excerpt && (
                  <p>{post.excerpt}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <button className="secondary">
          Media देखें →
        </button>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="logo">
          AJGARA <span>DEBATE</span>
        </div>

        <p>प्रतापगढ़ से संवाद</p>

        <small>© 2026 Ajgara Debate</small>
      </footer>
    </main>
  );
}