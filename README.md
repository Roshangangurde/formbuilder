# FormBuilder — Conversational Form Builder

A full-stack web app to create, share, and analyze conversational forms (like Typebot). Users build multi-step chat-style forms, share them via link, and track responses with analytics.

Live demo: [formbuilder-orpin-one.vercel.app](https://formbuilder-orpin-one.vercel.app)

---

## Features

- **Drag-and-drop form builder** — add text bubbles, input fields, rating stars, button choices, images, videos, and GIFs
- **3 themes** — Classic (blue), Warm (orange), Minimal (green) with live preview per field
- **Chat-style publish view** — respondents experience the form as a conversation
- **Folder organization** — drag forms into folders, manage workspace
- **Response analytics** — view count, start count, completion rate, per-response breakdown
- **Collaboration** — share forms with other users (view/edit roles)
- **22 Indian languages** — live translation via MyMemory API with localStorage cache; full RTL support for Urdu, Kashmiri, Sindhi
- **Dark / Light mode** — persisted per user

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Frontend | React 18, Vite, React Router v7, CSS Modules |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (bcryptjs) |
| HTTP | Axios |
| Charts | Recharts, Chart.js |
| Fonts | Google Noto Sans (Indic scripts) |
| Translation | MyMemory free API |
| Deploy | Vercel (frontend), Render (backend) |

---

## Screenshots

![Folder view](https://github.com/user-attachments/assets/b53b7373-7838-40d2-8994-85a536434535)
![Form builder](https://github.com/user-attachments/assets/c06f55a1-535c-4c72-908e-8a870a7bcf98)
![Response analytics](https://github.com/user-attachments/assets/363a6ee8-b7b5-4e1d-8ee3-3f3bd25578f6)

---

## Project Structure

```text
formbuilder-main/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT auth guard
│   ├── models/
│   │   ├── user.js
│   │   ├── form.js
│   │   └── folder.js
│   ├── routes/
│   │   ├── userRoutes.js          # register, login, profile
│   │   ├── formRoutes.js          # CRUD, share, submit, analytics
│   │   ├── folderRoutes.js        # folder CRUD
│   │   ├── translateRoutes.js     # proxy to MyMemory API
│   │   └── indexRoutes.js         # route aggregator
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── navbar/            # top navigation bar
        │   ├── sidebar/           # field-type picker
        │   ├── rating/            # star rating component
        │   └── sharemodal/        # share/invite modal
        ├── context/
        │   ├── AuthContext.jsx    # user + token state
        │   └── LanguageContext.jsx# i18n + RTL + lang attr
        ├── pages/
        │   ├── login/             # login page
        │   ├── register/          # register page
        │   ├── form/              # forms & folders dashboard
        │   ├── formbuilder/       # builder canvas
        │   ├── publishform/       # chat-style form fill
        │   ├── responses/         # analytics & responses
        │   ├── settings/          # profile & password
        │   ├── folder/            # single folder view
        │   └── protectedroute/    # auth guard
        ├── services/
        │   └── api.jsx            # Axios instance + interceptors
        ├── config/
        │   └── languages.js       # 22 language codes + UI strings
        └── index.css              # global styles, CSS variables, RTL rules
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
PORT=3000
```

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_BASE_URL=http://localhost:3000
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Overview

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/api/v1/user/register` | — | Register |
| POST | `/api/v1/user/login` | — | Login |
| GET | `/api/v1/forms` | JWT | List user's forms |
| POST | `/api/v1/forms` | JWT | Create form |
| PUT | `/api/v1/forms/:id` | JWT | Update form |
| DELETE | `/api/v1/forms/:id` | JWT | Delete form |
| GET | `/api/v1/forms/:id/public` | — | Get published form |
| POST | `/api/v1/forms/:id/submit` | — | Submit response |
| GET | `/api/v1/folders` | JWT | List folders |
| POST | `/api/v1/folders` | JWT | Create folder |
| POST | `/api/v1/translate` | — | Translate text array |

---

## Environment Variables

| Variable | Where | Description |
| -------- | ----- | ----------- |
| `MONGO_URI` | backend | MongoDB connection string |
| `JWT_SECRET` | backend | Secret for signing JWT tokens |
| `PORT` | backend | Server port (default 3000) |
| `VITE_BASE_URL` | frontend | Backend base URL |

---

## License

MIT
