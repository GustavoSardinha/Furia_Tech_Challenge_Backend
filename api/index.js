import express from 'express';
import http  from 'http';
import cors  from 'cors';
import chatRouter from './routes/chat.js';
import matchesRouter from './routes/matches.js';
import { liveSimRouter, liveWSS } from './routes/liveStatusSimulator.js';

const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas REST
app.use('/api/chat', chatRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/livestatus', liveSimRouter);

app.get('/', (req, res) => res.send('Bot ativo'));

// Captura upgrade apenas em /ws/livestatus
server.on('upgrade', (req, socket, head) => {
  if (req.url === '/ws/livestatus') {
    liveWSS.handleUpgrade(req, socket, head, ws => {
      liveWSS.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
