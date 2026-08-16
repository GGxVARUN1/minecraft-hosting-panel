# Minecraft Hosting Panel

A complete Minecraft server hosting panel similar to Bulkynode, built with React and Node.js.

## Features

- 🎮 Create and manage Minecraft servers
- 🖥️ Real-time server console
- 📊 Resource monitoring (CPU, RAM, Disk)
- 📁 File manager
- 🔐 User authentication
- 🎛️ Server configuration
- 📈 Billing system ready
- ⚙️ Auto-backup management
- 🚀 One-click server deployment

## Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Axios for API calls
- Socket.io for real-time updates

**Backend:**
- Node.js with Express
- MongoDB/MySQL
- JWT Authentication
- Docker support

## Installation

### Prerequisites
- Node.js 16+
- MongoDB or MySQL
- Docker (optional)

### Quick Start with Docker
```bash
docker-compose up
```

Access at `http://localhost:3000`

### Setup Frontend
```bash
cd frontend
npm install
npm start
```

### Setup Backend
```bash
cd backend
npm install
npm run dev
```

## Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/minecraft-panel
JWT_SECRET=your_secret_key
NODE_ENV=development
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Project Structure

```
minecraft-hosting-panel/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   └── package.json
├── backend/               # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── docker-compose.yml
└── README.md
```

## API Endpoints

**Auth:**
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login

**Servers:**
- GET `/api/servers` - List servers
- POST `/api/servers` - Create server
- POST `/api/servers/:id/start` - Start server
- POST `/api/servers/:id/stop` - Stop server
- POST `/api/servers/:id/restart` - Restart server

**Console:**
- GET `/api/console/:serverId` - Get logs
- POST `/api/console/:serverId/command` - Send command

## License

MIT

Made with ❤️ by GGxVARUN1
