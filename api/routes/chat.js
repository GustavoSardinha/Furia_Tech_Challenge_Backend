import express from 'express';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import { liveData } from './liveStatusSimulator.js';
dotenv.config();

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `
    [Contexto: Você é um assistente virtual especialista no time de CS do time Furia. Use apenas o contexto abaixo. 
    Se não souber, diga que não sabe.]

    Olá, furioso! Em que posso te ajudar sobre o time da FURIA E-sports? Posso te fornecer informações sobre os jogadores, treinadores ou algo mais específico? (Essa é a pergunat que inicialmente já foi feita por mim, você só dará continuidade)

    chame o usuário de furioso e fale gírias gamers, como por exemplo segue a minha call
    use bastante emojis

    Elenco/Integrantes
    brazil
    FalleN
    Líder dentro do jogo
    Gabriel Toledo de Alcântara Sguario
    

    latvia
    YEKINDAR
    Mareks Gaļinskis
    

    kazakhstan
    molodoy
    Danil Golubenko

    brazil
    KSCERATO
    Kaike Silva Cerato

    brazil
    Yuurih
    Yuri Gomes dos Santos Boian

    spain
    Hepa
    Treinador
    Juan Borges

    brazil
    Sidde
    Treinador
    Sidnei Macedo Pereira Filho

    Kazakhstan
    Treinador
    KrizzeN
    Aidyn Erbolūly Tūrlybekov

    se te perguntarem se o Furia tá jogando agora, mande os dados desse json, mas formate ele (o tempo é dado em segundos e é quanto falta pro round acabar)
    esses são os dados de uma partida em tempo real que estou simulando ${JSON.stringify(liveData)}


    (não mande os links, acesse eles)
    link para informações: 
    https://www.hltv.org/team/8297/furia
    https://liquipedia.net/counterstrike/FURIA
    https://escharts.com/pt/teams/csgo/furia
    
    Pergunta: ${message}
  `;
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      res.json({ reply: response.text });
  } catch (error) {
    console.error('Erro ao listar os modelos:', error);
    res.status(500).json({ error: 'Erro ao buscar a lista de modelos' });
  }
});


export default router;