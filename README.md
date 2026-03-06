<div align="center">

# 🚀 Flowlo

### Project Management System

A full-stack project management app with **visual workflow boards** built by a solo developer.

</div>

---

## ✨ Features

| | |
|---|---|
| **🔐 Authentication** - JWT-based secure login | **✅ Task Management** - Assign tasks with priorities & due dates |
| **📁 Projects** - Create & track progress | **👥 Team Collaboration** - Assign members to projects |
| **📋 Boards** - Drag-and-drop workflow | **📊 Dashboard** - Project analytics & metrics |
| **🌿 Branches** - Customizable phases | **📱 Responsive** - Tailwind CSS design |

---

## 🧱 Tech Stack

| Frontend | Backend | Tools |
|----------|---------|-------|
| Next.js 15 | Next.js API Routes | ESLint |
| React 19 | Prisma ORM | PostCSS |
| TypeScript | MariaDB/MySQL | Git |
| Tailwind CSS | bcryptjs | |
| Lucide Icons | jose (JWT) | |

---

## ⚙️ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/flowlo.git
cd flowlo
npm install
```

### 2. Setup Database
Create a MySQL/MariaDB database named `flowlo`

### 3. Configure Environment
Create `.env`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/flowlo"
JWT_SECRET="your-super-secret-key"
```

### 4. Setup Database
```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Run
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # REST endpoints
│   ├── hooks/         # Custom React hooks
│   └── components/    # Reusable UI
├── lib/               # Utilities
└── prisma/            # Database schema
```

---

## 🌐 Key API Routes

| Auth | Projects | Tasks | Branches |
|------|----------|-------|----------|
| POST /auth/register | GET /projects | GET /tasks | GET /branches |
| POST /auth/login | POST /projects | POST /tasks | POST /branches |
| GET /auth/session | PUT /projects/[id] | PUT /tasks/[id] | PUT /branches/[id] |
| POST /auth/logout | DELETE /projects/[id] | DELETE /tasks/[id] | DELETE /branches/[id] |

---

## 🚧 Work in Progress

This is a **solo learning project** for Information Management studies. Current focus:
- Database optimization
- Code splitting (reducing 1.2k+ line services)
- Performance improvements
- Better error handling
