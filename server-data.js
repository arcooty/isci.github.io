window.ARCADECRAFT = Object.freeze({
  address: 'oyna.robsarcade.online', version: '26.2', discord: 'https://discord.gg/GerdDHzMWp',
  // Verified against the installed ViaVersion/ViaBackwards 5.11.0 and Geyser b1245.
  compatibility: Object.freeze({
    verifiedAt: '2026-09-26',
    java: Object.freeze({min:'1.9',max:'26.2',recommended:'26.2'}),
    bedrock: Object.freeze({min:'26.30',max:'26.51',recommended:'26.51',versions:Object.freeze(['26.30','26.31','26.32','26.33','26.34','26.40','26.41','26.42','26.43','26.44','26.45','26.50','26.51'])})
  }),
  services: [
    {id:'velocity',name:'Ağ Girişi',state:'online'}, {id:'lobby',name:'Lobi',state:'online'},
    {id:'survival',name:'Survival',state:'online'}, {id:'events',name:'Etkinlik',state:'online'}
  ]
});
