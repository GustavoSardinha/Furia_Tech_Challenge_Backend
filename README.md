# Fur-IA Backend API

## Descrição 📡⚙️🔗

O backend do projeto **Fur-IA Live Status** é um **servidor Node.js/Express** que fornece:

* **Endpoints REST** para consulta de informações de partidas e integração com Liquipedia.
* **Integração com o Gemini AI** para criação de um chatbot assitente especializado no time da FURIA.
* **Simulação de uma partida de CS** para acompanhar placar, eventos e estatísticas de jogadores tudo em tempo real.

Este serviço é responsável por toda a lógica de negócios e serve como backend para o frontend React. Assim, aqui temos uma API que integra o front-end com o chatbot especializado, uma API que traz dados sobre partidas anteriores e um algoritmo capaz de simular partidas de CS em tempo real com fallback de pooling.

---

## Tech Stack 🛠️📦💾

* **Node.js** v14+
* **Express** para roteamento HTTP
* **node-fetch** para chamadas externas à Liquipedia
* **cheerio** para parsing de HTML
* **@google/genai** para a integração com o Gemini AI

---

## Estrutura de Pastas 🗂️📁🔍

```
api/
├── routes/
│   ├── chat.js           # Rota /api/chat (Chatbot)
│   ├── matches.js        # Rota /api/matches (Scraping Liquipedia)
│   └── liveStatusSimulator.js  # Rota /api/livestatus + WS
├── package.json          # Dependências e scripts
└── README-backend.md     # Este documento
```

---

## Instalação e Execução 🔧🚀📦

1. **Clone o repositório**

   ```bash
   git clone https://github.com/SEU_USUARIO/SEU_REPO.git
   cd SEU_REPO/api
   ```

2. **Instale as dependências**

   ```bash
   npm install @google/genai
   npm install dotenv
   npm install cheerio
   ```
3. **Chave da API do GEMINI AI**
   Crie uma conta em [Gemini AI](https://ai.google.dev/gemini-api/docs/api-key?hl=pt-br) e pegue sua chave de API.
4. **Variáveis de ambiente**

   * (Opcional) Crie um arquivo `.env` para configurar variáveis, como porta do servidor e a chave do GEMINI AI.

5. **Inicie o servidor**

   ```bash
   npm start
   ```

5. **Padrão**

   * HTTP: `http://localhost:3001`

---

## Endpoints REST 🛣️🎯📝

### `POST /api/chat`

Roteia solicitações de chatbot para o `chatRouter`.

* **Body**: `message` (string)
* **Resposta**: JSON com `reply` (string)

### `GET /api/matches?page=FURIA`

Retorna JSON com:

* `results`: lista de partidas recentes (data, torneio, placar, adversário,).
* `upcoming`: próximos torneios (nome, ícone, data).

### `GET /api/livestatus`

Retorna JSON com o estado atual simulado da partida:

* `furiaScore`, `opponentScore`, `round`, `time`, `c4`, `ended`, `events`, `highlights`, `stats`.

---
## Agradecimentos 🙏🤝🚀
   Agradeço à equipe de recrutamento da FURIA pela oportunidade de participar deste desafio técnico que proporcionaram um ambiente desafiador e motivador. Estou ansioso para futuras oportunidades e para continuar aprimorando minhas habilidades na área. 
 
