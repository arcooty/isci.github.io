window.ARCADECRAFT = Object.freeze({
  address: 'oyna.robsarcade.online', version: '26.2', discord: 'https://discord.gg/GerdDHzMWp',
  // ViaVersion/ViaBackwards 5.12.0 is installed; the 26.3 Grim fix awaits a cold restart.
  compatibility: Object.freeze({
    verifiedAt: '2026-09-26',
    java: Object.freeze({min:'1.9',max:'26.2',recommended:'26.2',notice:'26.3 bağlantı güncellemesi sürüyor. Şimdilik 26.2 ile katıl.'}),
    bedrock: Object.freeze({min:'26.30',max:'26.51',recommended:'26.51',versions:Object.freeze(['26.30','26.31','26.32','26.33','26.34','26.40','26.41','26.42','26.43','26.44','26.45','26.50','26.51'])})
  }),
  services: [
    {id:'velocity',name:'Ağ Girişi',state:'online'}, {id:'lobby',name:'Lobi',state:'online'},
    {id:'survival',name:'Survival',state:'online'}, {id:'events',name:'Etkinlik',state:'online'}
  ]
});
