window.ARCADECRAFT = Object.freeze({
  address: 'oyna.robsarcade.online', version: '26.2', discord: 'https://discord.gg/GerdDHzMWp',
  // Java 26.3 verified after deploying Grim 61117c2 with ViaVersion/ViaBackwards 5.12.0.
  // The previously verified Bedrock range is unchanged by this Java compatibility fix.
  compatibility: Object.freeze({
    verifiedAt: '2026-09-26',
    java: Object.freeze({min:'1.9',max:'26.3',recommended:'26.3',verifiedAt:'2026-09-30',notice:''}),
    bedrock: Object.freeze({min:'26.30',max:'26.51',recommended:'26.51',versions:Object.freeze(['26.30','26.31','26.32','26.33','26.34','26.40','26.41','26.42','26.43','26.44','26.45','26.50','26.51'])})
  }),
  services: [
    {id:'velocity',name:'Ağ Girişi',state:'online'}, {id:'lobby',name:'Lobi',state:'online'},
    {id:'survival',name:'Survival',state:'online'}, {id:'skyblock',name:'Skyblock',state:'testing'}, {id:'events',name:'Etkinlik',state:'online'},
    {id:'boxpvp',name:'Box PvP',state:'available'}, {id:'pillars',name:'Pillars',state:'available'}
  ]
});
