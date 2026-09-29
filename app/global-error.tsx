"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600 }}>Something went wrong.</h1>
          <p style={{ color: "#55555f", fontSize: 14 }}>We couldn&apos;t complete your request. Please try again.{error.digest ? ` Reference: ${error.digest}` : ""}</p>
          <button onClick={reset} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 6, border: "1px solid #d4d4d9", background: "#fff", cursor: "pointer" }}>
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
