import express from 'express';
const router = express.Router();

const TEAMS = ["MongolZ","VP","COL","Apogee","M80","NAVI","Falcons","MIBR","Liquid","MOUZ"];
const ROUND_DURATION = 180;
const NO_EVENT_TIME = 20;
let furiaKills = 2;

let liveData = {
  furiaScore:10,opponentScore:8,opponent:"Liquid",time:74,opponentLive:3,c4:false,round:19,ended:false,
  events:["FalleN eliminou 2 adversários com AK-47"],highlights:[],
  stats:[
    {player:"YEKINDAR",kills:16,deaths:10,assists:7,weapon:"AK-47",alive:true},
    {player:"yuurih",kills:15,deaths:14,assists:4,weapon:"Glock‑18",alive:true},
    {player:"FalleN",kills:11,deaths:9,assists:3,weapon:"AWP",alive:true},
    {player:"KSCERATO",kills:8,deaths:12,assists:6,weapon:"MP5",alive:false},
    {player:"chelo",kills:7,deaths:11,assists:9,weapon:"AK-47",alive:false}
  ]
};

function updateLiveData() {
  if(liveData.time<=1&&liveData.ended){
    liveData.ended=false;liveData.time=ROUND_DURATION;liveData.events=[];liveData.highlights=[];
  }
  liveData.time=Math.max(liveData.time-1,0);
  const alive=liveData.stats.filter(p=>p.alive);
  if(alive.length==0){liveData.opponentScore++;endRound(2,"Todos os jogadores foram eliminados")}
  if(furiaKills>4){liveData.furiaScore++;endRound(1,"Todos os oponentes foram eliminados")}
  const inFirst=(ROUND_DURATION-liveData.time)<NO_EVENT_TIME;
  if(!inFirst&&!liveData.ended){
    if(!liveData.c4){
      if(Math.random()<0.01){liveData.c4=true;liveData.time=30;liveData.highlights=["A C4 foi armada!"]}
    } else if(Math.random()<0.01){
      liveData.c4=false;liveData.time=0;liveData.highlights=["A C4 foi desarmada!"];liveData.opponentScore++;endRound(2,"A C4 foi defusada");
    }
    if(Math.random()<0.03){
      const p=alive[Math.floor(Math.random()*alive.length)];
      p.kills++;furiaKills++;liveData.opponentLive--;liveData.events=[`${p.player} eliminou 1 adversário com ${p.weapon}`];
    }
    if(Math.random()<0.02){
      const p=alive[Math.floor(Math.random()*alive.length)];
      p.deaths++;p.alive=false;liveData.events=[`${p.player} foi eliminado`];
    }
  }
  if(liveData.time===0){
    if(liveData.c4){liveData.furiaScore++;endRound(1,"A C4 explodiu")}
    else if(!liveData.ended){liveData.opponentScore++;endRound(2,"A C4 não foi armada")}
  }
}

function endRound(winner,reason){
  liveData.time=7;furiaKills=0;liveData.ended=true;
  liveData.highlights=winner===1?["FURIA vence o round! "+reason]:[`${liveData.opponent} vence o round! `+reason];
  liveData.round++;liveData.c4=false;liveData.stats.forEach(p=>p.alive=true);liveData.opponentLive=5;
  if(liveData.round>30){resetMatch();return}
}

function resetMatch(){
  liveData.furiaScore=0;liveData.opponentScore=0;liveData.round=1;
  liveData.time=ROUND_DURATION;liveData.ended=false;liveData.c4=false;liveData.events=[];liveData.highlights=["A partida começou!"];
  liveData.opponent=TEAMS[Math.floor(Math.random()*TEAMS.length)];
  liveData.stats.forEach(p=>{p.alive=true;p.kills=0;p.deaths=0;p.assists=0});
  liveData.opponentLive=5;furiaKills=0;
}

setInterval(updateLiveData,1000);

router.get("/",(req,res)=>res.json(liveData));

export { router as liveSimRouter, liveData }
