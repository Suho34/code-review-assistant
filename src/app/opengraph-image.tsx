import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MockMind — Master Tech Interviews with AI";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2563eb",
            borderRadius: "24px",
            width: "100px",
            height: "100px",
            marginBottom: "40px",
            boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.4)",
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.24h.01a4 4 0 0 0 7.944 0H12v-1.123A4 4 0 0 0 12 5Z" />
            <path d="M12 18.123V22" />
            <path d="M15 12h.01" />
            <path d="M18 9h.01" />
            <path d="M18 15h.01" />
            <path d="M21 12h.01" />
            <path d="M12 11V5" />
            <path d="M12 5h.01" />
          </svg>
        </div>
        <div
          style={{
            fontSize: "84px",
            fontWeight: "900",
            color: "white",
            letterSpacing: "-0.05em",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          MockMind
        </div>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "500",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.4",
          }}
        >
          Ace Your Tech Interviews with Real-time AI Feedback
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
