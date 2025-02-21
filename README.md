# Fairway Boss\n\n![Fairway Boss Logo](#) <!-- Replace \"#\" with a logo URL if you add one later -->\n\n

**Fairway Boss** is a golf simulation game built with React (frontend) and Node.js (backend), using MongoDB for data persistence. 
Train your skills, compete in tournaments, manage your equipment, and climb the leaderboard in this immersive golfing experience!\n\n
## Features\n\n- **User Authentication**: Register and log in with JWT-based security.\n- 

**Player Progression**: Train stats (Driving, Irons, Putting, Mental), level up, and track milestones.\n- 
**Tournaments**: Play weekly tournaments with dynamic courses, weather, and tactics (Aggressive, Conservative, Balanced).\n- 
**Shop**: Buy and sell equipment to boost your stats, with category-based restrictions.\n- 
**Leaderboard**: Compare your wins against AI golfers (static for now, expandable to real player rankings).\n- 
**Persistent Data**: MongoDB stores users, player data, milestones, and items locally.\n\n

## Project Structure\n\n```\nfairway-boss/\n├── client/             # React frontend\n│   ├── src/\n│   │   ├── components/ # Home, Training, Tournament, Shop, etc.\n│   │   ├── App.js      # Main app with tabbed navigation\n│   │   └── index.js    # React entry point\n│   └── package.json    # Client dependencies (React, axios, etc.)\n├── server/             # Node.js backend\n│   ├── routes/         # API routes (auth, player, shop, etc.)\n│   │   └── utils.js    # Shared utilities (loadPlayer, checkMilestones)\n│   ├── index.js        # Server entry point with MongoDB setup\n│   └── package.json    # Server dependencies (express, mongodb, etc.)\n└── README.md           # This file\n```\n\n## Prerequisites\n\n- **Node.js**: v22.14.0 or compatible (your current version).\n- **MongoDB**: Installed locally (e.g., `mongod --dbpath C:\\data\\db`).\n- **Git**: To clone and manage the repo.\n\n## Setup Instructions (Local)\n\n### 1. Clone the Repository\n```bash\ngit clone https://github.com/chline1337/fairway-boss.git\ncd fairway-boss\n```\n\n### 2. Install Dependencies\n- **Server:**\n  ```bash\n  cd server\n  npm install\n  ```\n- **Client:**\n  ```bash\n  cd ../client\n  npm install\n  ```\n\n### 3. Start MongoDB\nEnsure MongoDB is running locally:\n```bash\nmongod --dbpath C:\\data\\db  # Adjust path as needed\n```\n- Create the `C:\\data\\db` directory if it doesn’t exist.\n\n### 4. Run the Server\n```bash\ncd server\nnpm start\n```\n- Runs on `http://localhost:5000`.\n- Initializes `users`, `players`, `milestones`, `playerMilestones`, and `items` collections in `fairwayboss` database.\n\n### 5. Run the Client\nIn a new terminal:\n```bash\ncd client\nnpm start\n```\n- Opens `http://localhost:3000` in your browser (proxied to server via `package.json`).\n\n### 6. Play the Game\n- Register/login → Explore tabs (Player, Training, Tournament, Shop, Leaderboard).\n- Train stats, buy equipment, play tournaments, and track progress in MongoDB Compass (`mongodb://localhost:27017/fairwayboss`).\n\n## Database Collections\n\n- **`users`**: User credentials (`username`, `password`, `email`).\n- **`players`**: Player data (`name`, `stats`, `cash`, `equipment`, etc.).\n- **`milestones`**: Global milestone definitions (`name`, `target`, `reward`).\n- **`playerMilestones`**: Per-player milestone progress (`userId`, `milestoneId`, `progress`).\n- **`items`**: Shop items (`name`, `cost`, `stat`, `boost`, `category`).\n\n## Contributing\n\nFeel free to fork, submit issues, or send pull requests! Planned enhancements:\n- Dynamic leaderboard via `/leaderboard` endpoint.\n- Golf-themed UI images.\n- Expanded item and milestone sets.\n\n## Credits\n\n- **Developed by**: [chline1337](https://github.com/chline1337)\n- **AI Assistance**: Built with help from Grok (xAI) for code, debugging, and README drafting.\n\n## License\n\nThis project is unlicensed—use it freely for personal enjoyment!\n\n---\n\nHappy golfing with *Fairway Boss*! 🏌️‍♂️"

---

### Notes
- **JSON Structure:** Wrapped the entire README text in a `"readme"` key within a JSON object, enclosed in a Markdown code block (```json).
- **Escaping:** Markdown content inside JSON doesn’t need extra escaping here—GitHub will render it as a code block, preserving the text as-is.
- **Readability:** It’s a single string value, so it’s compact but still legible when viewed raw on GitHub.

### Adding to GitHub
1. **Save the File:**
   - Copy this into `fairway-boss/README.md`.
2. **Commit and Push:**
   ```bash
   git add README.md
   git commit -m "Add README in JSON structure"
   git push origin master