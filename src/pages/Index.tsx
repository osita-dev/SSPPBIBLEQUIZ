const steps = [
  { num: "1️⃣", text: "Go to Lovable AI" },
  { num: "2️⃣", text: "Generate your UI" },
  { num: "3️⃣", text: "Copy the generated source files" },
  { num: "4️⃣", text: "Replace the matching files in your local project" },
  { num: "5️⃣", text: "Run the project again" },
];

const editableFiles = [
  "src/components/*",
  "src/pages/*",
  "src/App.tsx",
  "src/App.css",
  "src/index.css",
  "index.html",
  "tailwind.config.ts",
  "package.json (name only)",
];

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <div className="mx-auto max-w-3xl px-6 py-20 space-y-16">

        {/* Hero */}
        <section className="text-center space-y-5 pt-12 pb-4">
          <div className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            <span className="glow-heart text-5xl sm:text-6xl">💖</span>
            <h1 className="typing-text text-4xl sm:text-5xl font-bold tracking-tight text-foreground mx-auto mt-3" style={{ maxWidth: 'max-content' }}>
              Welcome to Lovable Stack
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-medium">
            AI-assisted building, fully editable by you.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Lovable AI generated your initial layout.
            <br />
            Now it's yours to shape.
          </p>
        </section>

        {/* How It Works */}
        <section className="rounded-2xl bg-card p-8 sm:p-10 space-y-6" style={{ boxShadow: "var(--shadow-soft)" }}>
          <h2 className="text-2xl font-semibold text-foreground">
            💖 How Lovable AI Works With Your Project
          </h2>
          <p className="text-sm text-muted-foreground">
            Lovable Stack ships with a starter demo template. When you generate a project using Lovable AI:
          </p>
          <ol className="space-y-3">
            {steps.map((s) => (
              <li key={s.num} className="flex items-start gap-3 text-sm text-foreground">
                <span className="shrink-0 text-base">{s.num}</span>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
          <p className="text-sm font-medium text-primary">Done.</p>
        </section>

        {/* Editable Files */}
        <section className="rounded-2xl bg-card p-8 sm:p-10 space-y-6" style={{ boxShadow: "var(--shadow-soft)" }}>
          <h2 className="text-2xl font-semibold text-foreground">
            🧩 Editable Files
          </h2>
          <p className="text-sm text-muted-foreground">
            Only these files should be replaced when updating from Lovable AI:
          </p>
          <ul className="grid gap-2">
            {editableFiles.map((f) => (
              <li key={f} className="rounded-lg bg-secondary px-4 py-2.5 text-sm font-mono text-secondary-foreground">
                {f}
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-muted p-5 space-y-2 mt-4">
            <p className="text-sm text-foreground font-medium">Architecture note</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The base template handles tooling, configuration, and environment setup.
              Lovable AI only replaces UI and layout logic.
              This separation keeps your project stable.
            </p>
          </div>
        </section>

        <footer className="text-center pb-8">
          <p className="text-xs text-muted-foreground">
            Built with Lovable Stack
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
