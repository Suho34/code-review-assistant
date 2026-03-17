# 🧠 Mockmind AI: The Ultimate Code Review & Interview Assistant

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Gemini](https://img.shields.io/badge/Powered_by-Gemini_Pro-8E75B2?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)

**Mockmind AI** is a state-of-the-art platform designed to transform how developers prepare for technical interviews. Leveraging the power of Google's Gemini Pro and the Vercel AI SDK, it provides an immersive, real-time interview simulation with deep performance analytics and a premium developer-first aesthetic.

---

## 📽️ Visual Preview

### 💬 Immersive Chat Interface
![Chat Interface Placeholder](https://via.placeholder.com/1000x600/0a0a0a/ffffff?text=Premium+Chat+Interface+with+Real-time+AI+Streaming)
*Real-time streaming responses with terminal-inspired design.*

### 📊 Performance Analytics Dashboard
![Dashboard Placeholder](https://via.placeholder.com/1000x600/0a0a0a/ffffff?text=Interactive+Performance+Radar+and+Score+Trends)
*Interactive charts and radar maps visualizing your technical growth.*

---

## 🚀 Key Features

### 🤖 Intelligent Interview Simulations
Engage in dynamic, context-aware technical interviews. Our AI roleplays as a senior engineer, adapting its questions based on your responses and the specific interview type (System Design, Frontend, Backend, etc.).

### 📊 Deep Performance Analytics
Receive more than just a score. After every session, our AI generates a comprehensive report featuring:
- **Performance Radar**: Visual breakdown of your strengths and weaknesses across key domains.
- **Score Trends**: Track your progress over time with interactive charts.
- **Detailed Feedback**: Actionable insights on what to improve and "Good-to-know" technical tidbits.

### 🎭 Premium UI/UX
- **Immersive Chat Interface**: A distraction-free, terminal-inspired design with real-time streaming responses.
- **Fluid Animations**: High-performance animations powered by Framer Motion and Rive for a truly premium feel.
- **Dark-First Aesthetic**: A sleek, high-contrast dark mode designed for developers.

---

## 🏗️ Technical Architecture

Mockmind AI follows a robust, scalable architecture leveraging modern serverless and AI patterns.

```mermaid
graph TD
    User([User / Candidate]) <--> |Next.js App Router| FE[Frontend / UI Components]
    FE <--> |Vercel AI SDK / React Hooks| CH[Chat Interface]
    CH <--> |API Routes| BE[Next.js API Layer]
    BE <--> |Gemini Pro| AI[Google AI SDK]
    BE <--> |Prisma ORM| DB[(PostgreSQL Database)]
    BE <--> |Upstash| RL[Rate Limiting / Redis]
    BE <--> |Better Auth| AUTH[Authentication Provider]
```

### System Flow
1. **Frontend**: Built with Next.js 16, utilizing React Server Components for performance and Shadcn UI for styling.
2. **AI Layer**: Uses the Vercel AI SDK to stream responses from Gemini Pro, ensuring a zero-latency feel for the user.
3. **Data Persistance**: Prisma ORM manages sessions, chat history, and feedback reports in a PostgreSQL database.
4. **Security**: Rate limiting is handled via Upstash Redis to prevent abuse, while Better Auth manages user security.

---

## 🛠️ Tech Stack

- **Core**: [Next.js 16](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **AI Infrastructure**: [Vercel AI SDK](https://sdk.vercel.ai/), [Google Gemini Pro API](https://deepmind.google/technologies/gemini/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) (Dark Mode Optimized)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/), [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Analytics & Real-time**: [Recharts](https://recharts.org/), [Upstash Redis](https://upstash.com/)
- **Motion**: [Framer Motion](https://www.framer.com/motion/), [Rive](https://rive.app/)

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL instance (Local or Host)
- Google AI (Gemini) API Key

### Installation & Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/Suho34/code-review-assistant.git
   cd code-review-assistant
   npm install
   ```

2. **Database Propagation**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Run Dev Environment**
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Variable Guide

Create a `.env` file in the root directory. Below are the required variables:

| Variable | Description | Example / Link |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Gemini Pro API Key | [Get Key Here](https://aistudio.google.com/) |
| `BETTER_AUTH_SECRET` | Secret for Auth encryption | `openssl rand -hex 32` |
| `UPSTASH_REDIS_REST_URL` | Redis URL for rate limiting | [Upstash Console](https://console.upstash.com/) |
| `UPSTASH_REDIS_REST_TOKEN` | Redis Token for rate limiting | [Upstash Console](https://console.upstash.com/) |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

---

## 📄 License

This project is intended for demonstration purposes. All rights reserved.

---

Developed with ❤️ by the **Mockmind AI** team.
