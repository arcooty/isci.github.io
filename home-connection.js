(() => {
  const initialize = ({window,document,history,fetch,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame}) => {
(() => {
  const copy=document.querySelector('[data-hero-copy]');
  const toggle=document.querySelector('.hero-platform-toggle');
  const address=document.getElementById('hero-address');
  const caption=document.getElementById('hero-platform-label');
  const feedback=document.querySelector('.hero-copy-status');
  if(!copy || !toggle || !address || !caption) return;
  const platforms=[
    {address:'oyna.robsarcade.online',label:'Java Edition',name:'Java',icon:'desktop'},
    {address:'bedrock.robsarcade.online',label:'Bedrock / Mobil · Port: 6426',name:'Bedrock',icon:'mobile-screen-button'}
  ];
  let selected=0,resetTimer;
  function render(animate=false) {
    clearTimeout(resetTimer);
    const current=platforms[selected],next=platforms[1-selected];
    address.textContent=current.address;
    caption.textContent=current.label;
    copy.title=current.name+' adresini kopyala';
    copy.setAttribute('aria-label',copy.title);
    copy.querySelector('i').className='fa-regular fa-copy';
    toggle.title=next.name+' adresini göster';
    toggle.setAttribute('aria-label',toggle.title);
    toggle.setAttribute('aria-pressed',String(selected===1));
    toggle.querySelector('i:last-child').className='fa-solid fa-'+next.icon;
    if(feedback) feedback.textContent='';
    if(animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      address.animate?.([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});
    }
  }
  toggle.addEventListener('click',()=>{selected=1-selected;render(true);});
  copy.addEventListener('click',async()=>{
    const index=selected,current=platforms[index];
    try {
      await navigator.clipboard.writeText(current.address);
      if(selected!==index) return;
      copy.querySelector('i').className='fa-solid fa-check';
      if(feedback) feedback.textContent=current.name+' adresi kopyalandı.';
      clearTimeout(resetTimer);
      resetTimer=setTimeout(()=>render(),1800);
    } catch {
      if(feedback) feedback.textContent='Adres kopyalanamadı: '+current.address;
    }
  });
  render();
})();

  };
  if (window.ARCADE_NAVIGATION) window.ARCADE_NAVIGATION.register('home-connection.js',initialize);
  else initialize({window,document,history:typeof history!=='undefined'?history:undefined,fetch:typeof fetch==='function'?fetch:undefined,setTimeout:typeof setTimeout==='function'?setTimeout:undefined,clearTimeout:typeof clearTimeout==='function'?clearTimeout:undefined,setInterval:typeof setInterval==='function'?setInterval:undefined,clearInterval:typeof clearInterval==='function'?clearInterval:undefined,requestAnimationFrame:typeof requestAnimationFrame==='function'?requestAnimationFrame:undefined});
})();