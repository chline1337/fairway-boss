# Fairway Boss

![Fairway Boss Logo](#) <!-- Replace "#" with a logo URL if you add one later -->

**Fairway Boss** is a golf simulation game built with React (frontend) and Node.js (backend), using MongoDB for data persistence. Train your skills, compete in tournaments, manage your equipment, and climb the leaderboard in this immersive golfing experience!

## Features

- **User Authentication**: Register and log in with JWT-based security.
- **Player Progression**: Train stats (Driving, Irons, Putting, Mental), level up, and track milestones.
- **Tournaments**: Play weekly tournaments with dynamic courses, weather, and tactics (Aggressive, Conservative, Balanced).
- **Shop**: Buy and sell equipment to boost your stats, with category-based restrictions.
- **Leaderboard**: Compare your wins against AI golfers (static for now, expandable to real player rankings).
- **Persistent Data**: MongoDB stores users, player data, milestones, and items locally.

## Project Structure

fairway-boss/
- ├── client/             # React frontend.
- │   ├── src/
- │   │   ├── components/ # Home, Training, Tournament, Shop, etc.
- │   │   ├── App.js      # Main app with tabbed navigation
- │   │   └── index.js    # React entry point
- │   └── package.json    # Client dependencies (React, axios, etc.)
- ├── server/             # Node.js backend
- │   ├── routes/         # API routes (auth, player, shop, etc.)
- │   │   └── utils.js    # Shared utilities (loadPlayer, checkMilestones)
- │   ├── index.js        # Server entry point with MongoDB setup
- │   └── package.json    # Server dependencies (express, mongodb, etc.)
- └── README.md           # This file


## Prerequisites

- **Node.js**: v22.14.0 or compatible (your current version).
- **MongoDB**: Installed locally (e.g., `mongod --dbpath C:\data\db`).
- **Git**: To clone and manage the repo.

## Setup Instructions (Local)

### 1. Clone the Repository

git clone https://github.com/chline1337/fairway-boss.git
cd fairway-boss

### 2. Install Dependencies

Server
cd server
npm install

Client
cd ../client
npm install


### 3. Start MongoDB
Ensure MongoDB is running locally:
bash
mongod --dbpath C:\data\db  # Adjust path as needed
Create the C:\data\db directory if it doesn’t exist.
###  4. Run the Server
bash
cd server
npm start
Runs on http://localhost:5000.
Initializes users, players, milestones, playerMilestones, and items collections in fairwayboss database.

### 5. Run the Client
In a new terminal:
bash
cd client
npm start
Opens http://localhost:3000 in your browser (proxied to server via package.json).
###  6. Play the Game

Register/login → Explore tabs (Player, Training, Tournament, Shop, Leaderboard).
Train stats, buy equipment, play tournaments, and track progress in MongoDB Compass (mongodb://localhost:27017/fairwayboss).

###  Database Collections
users: User credentials (username, password, email).
players: Player data (name, stats, cash, equipment, etc.).
milestones: Global milestone definitions (name, target, reward).
playerMilestones: Per-player milestone progress (userId, milestoneId, progress).
items: Shop items (name, cost, stat, boost, category).

###  Contributing
Feel free to fork, submit issues, or send pull requests! Planned enhancements:
Dynamic leaderboard via /leaderboard endpoint.
Golf-themed UI images.
Expanded item and milestone sets.

###  Credits
- Developed by: chline1337
- AI Assistance: Built with help from Grok (xAI) for code, debugging, and README drafting.

### License
This project is unlicensed—use it freely for personal enjoyment!
