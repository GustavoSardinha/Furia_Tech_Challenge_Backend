import express from 'express';
import { WebSocketServer } from 'ws';

const router = express.Router();

// Constants
const ROUND_DURATION = 180;  
const NO_EVENT_TIME = 20;    
let furiaKills = 2;

// Initial live data
let liveData = {
  furiaScore: 10,
  opponentScore: 8,
  opponent: "NAVI",
  time: 74,
  opponentLive: 3,
  c4: false,
  round: 19,
  ended: false,
  events: ["FalleN eliminou 2 adversários com AK-47"],
  highlights: [],
  stats: [
    { player: "YEKINDAR",   kills: 16, deaths: 10, assists:  7, weapon: "AK-47", alive: true },
    { player: "yuurih",   kills: 15, deaths: 14, assists:  4, weapon: "Glock‑18", alive: true },
    { player: "FalleN",   kills: 11, deaths:  9, assists:  3, weapon: "AWP", alive: true },
    { player: "KSCERATO", kills:  8, deaths: 12, assists:  6, weapon: "MP5", alive: false },
    { player: "chelo",    kills:  7, deaths: 11, assists:  9, weapon: "AK-47", alive: false },
  ],
};

router.get('/', (req, res) => {
  res.json(liveData);
});

// WebSocket server
const wss = new WebSocketServer({ noServer: true });
wss.on('connection', ws => {
  ws.send(JSON.stringify(liveData));
});

// Helper: broadcast to all clients
function broadcast(payload) {
  const data = JSON.stringify(payload);
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) client.send(data);
  });
}

// Update logic every second
function updateLiveData() {
    if(liveData.time <= 1 && liveData.ended){
        liveData.ended = false;
        liveData.time = ROUND_DURATION;
        liveData.events = [];
        liveData.highlights = [];
    }
    
  // Countdown timer
  liveData.time = Math.max(liveData.time - 1, 0);
  const alivePlayers = liveData.stats.filter(p => p.alive);
  if(alivePlayers.length == 0){
    liveData.opponentScore += 1;
    endRound(2, "Todos os jogadores foram eliminados");
  }
  if(furiaKills > 4){
    liveData.furiaScore += 1;
    endRound(1, "Todos os oponentes foram eliminados");
  }
  // Skip all mid-round events in the first NO_EVENT_TIME seconds
  const inFirstPhase = (ROUND_DURATION - liveData.time) < NO_EVENT_TIME;

  // C4 logic only after NO_EVENT_TIME
  if (!inFirstPhase && !liveData.ended) {
    if (!liveData.c4) {
      // Random chance to plant C4
      if (Math.random() < 0.01) {
        liveData.c4 = true;
        liveData.time = 30;
        liveData.highlights = ["A C4 foi armada!"];
      }
    } else {
      // Random chance to defuse C4
      if (Math.random() < 0.01) {
        liveData.c4 = false;
        liveData.time = 0;
        liveData.highlights = ["A C4 foi desarmada!"];
        liveData.opponentScore += 1;
        endRound(2, "A C4 foi defusada");
      }
    }
  }

  // Only allow kills/deaths after NO_EVENT_TIME
  if (!inFirstPhase && !liveData.ended) {
    // Random kill event
    if (Math.random() < 0.03) {
      const alive = liveData.stats.filter(p => p.alive);
      if (alive.length) {
        const p = alive[Math.floor(Math.random() * alive.length)];
        p.kills += 1;
        furiaKills += 1;
        liveData.opponentLive -= 1;
        liveData.events = [`${p.player} eliminou 1 adversário com ${p.weapon}`];
      }
    }
    // Random death event
    if (Math.random() < 0.02) {
      const alive = liveData.stats.filter(p => p.alive);
      if (alive.length) {
        const p = alive[Math.floor(Math.random() * alive.length)];
        p.deaths += 1;
        p.alive = false;
        liveData.events = [`${p.player} foi eliminado`];
      }
    }
  }

  // End-of-round logic
  if (liveData.time === 0) {
    if (liveData.c4) {
      // C4 exploded
      liveData.furiaScore += 1;
      endRound(1, "A C4 explodiu");
    } else if (!liveData.ended) {
      // Timeout without C4
      liveData.opponentScore += 1;
      endRound(2, "A C4 não foi armada");
    }
  }

  broadcast(liveData);
}

// Reset for next round
function endRound(winner, reason) {
    liveData.time = 7;
    furiaKills = 0;
    liveData.ended = true;
    liveData.highlights = winner === 1
    ? ["FURIA vence o round! " + reason]
    : winner === 2
      ? [`${liveData.opponent} vence o round! ` + reason]
      : ["Round empatado!"];
    liveData.round += 1;
    liveData.c4 = false;
    // revive all players
    liveData.stats.forEach(p => p.alive = true);
    liveData.opponentLive = 5;
}

setInterval(updateLiveData, 1000);

export { router as liveSimRouter, wss as liveWSS, liveData };
