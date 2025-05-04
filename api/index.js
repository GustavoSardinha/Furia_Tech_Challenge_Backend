import express from 'express';
import http from 'http';
import cors from 'cors';
import chatRouter from './routes/chat.js';
import matchesRouter from './routes/matches.js';
import {liveSimRouter} from './routes/liveStatusSimulator.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/livestatus', liveSimRouter);

app.get('/', (req, res) => res.send('Bot ativo'));

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
