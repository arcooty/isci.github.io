(() => {
  if (window.ARCADE_NAVIGATION) return;
  document.documentElement.dataset.pageSession=crypto.randomUUID();
  const nativeFetch = window.fetch.bind(window);
  const modules = new Map();
  const deferredModules = new Set();
  const loadingScripts = new Map();
  let activeScope, currentURL = new URL(location.href), requestID = 0, requestController;
  const positions = new Map();
  let historyID = history.state?.arcadeEntry || crypto.randomUUID();
  history.replaceState({...history.state, arcadeEntry:historyID}, '', location.href);
  history.scrollRestoration = 'manual';

  function createScope() {
    const controller = new AbortController(), cleanups = [];
    const scope = {active:true};
    const listen = (target,type,callback,options) => {
      if (!scope.active) return;
      if (target === document && type === 'DOMContentLoaded' && document.readyState !== 'loading') {
        queueMicrotask(() => { if(scope.active) callback.call(document,new Event(type)); }); return;
      }
      const guarded = typeof callback === 'function' ? function(event) { if(scope.active) return callback.call(this,event); } : callback;
      target.addEventListener(type,guarded,options);
      cleanups.push(() => target.removeEventListener(type,guarded,options));
    };
    const proxy = target => new Proxy(target,{get(object,key) {
      if(key === 'addEventListener') return (type,callback,options)=>listen(object,type,callback,options);
      if(key === 'fetch') return scope.fetch;
      if(key === 'setTimeout') return scope.setTimeout;
      if(key === 'setInterval') return scope.setInterval;
      if(key === 'requestAnimationFrame') return scope.requestAnimationFrame;
      if(key === 'history') return scope.history;
      if(!scope.active && object===document && ['querySelector','getElementById'].includes(key)) return ()=>null;
      if(!scope.active && object===document && key==='querySelectorAll') return ()=>[];
      const value=Reflect.get(object,key,object); return typeof value==='function'?value.bind(object):value;
    },set(object,key,value) { Reflect.set(object,key,value,object); return true; }});
    scope.fetch = (input,options={}) => nativeFetch(input,{...options,signal:options.signal ? AbortSignal.any([controller.signal,options.signal]) : controller.signal});
    scope.setTimeout = (fn,delay,...args) => { const id=window.setTimeout(()=>{if(scope.active)fn(...args);},delay);cleanups.push(()=>clearTimeout(id));return id; };
    scope.setInterval = (fn,delay,...args) => { const id=window.setInterval(()=>{if(scope.active)fn(...args);},delay);cleanups.push(()=>clearInterval(id));return id; };
    scope.requestAnimationFrame = fn => { const id=window.requestAnimationFrame(time=>{if(scope.active)fn(time);});cleanups.push(()=>cancelAnimationFrame(id));return id; };
    scope.window=proxy(window);scope.document=proxy(document);
    scope.history=new Proxy(history,{get(target,key) {
      if(key==='pushState')return(state,title,url)=>{remember();historyID=crypto.randomUUID();target.pushState({...state,arcadeEntry:historyID},title,url);currentURL=new URL(location.href);};
      if(key==='replaceState')return(state,title,url)=>{target.replaceState({...target.state,...state,arcadeEntry:historyID},title,url);currentURL=new URL(location.href);};
      const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
    },set(target,key,value){Reflect.set(target,key,value,target);return true;}});
    scope.clearTimeout=window.clearTimeout.bind(window);scope.clearInterval=window.clearInterval.bind(window);
    scope.dispose=()=>{scope.active=false;controller.abort();cleanups.forEach(fn=>fn());};
    return scope;
  }
  activeScope=createScope();
  window.ARCADE_NAVIGATION={register(name,init){modules.set(name,init);if(!deferredModules.has(name))init(activeScope);}};

  function resolve(url) {
    const local=new URL(url,location.href);
    if(local.origin!==location.origin || !/\/[^/]+\.html$/.test(local.pathname)) return local;
    const theme=document.documentElement.dataset.themeVariant;
    if(theme && !local.searchParams.has('theme'))local.searchParams.set('theme',theme);
    const source=local.pathname.split('/').pop()+local.search+local.hash;
    const resolved=window.ARCADE_SITE?.resolveHref(source);
    return resolved ? new URL(resolved,new URL('.',local)) : local;
  }
  const remember=()=>positions.set(historyID,{x:scrollX,y:scrollY});
  window.addEventListener('scroll',remember,{passive:true});
  window.addEventListener('arcade-theme-change',()=>{queueMicrotask(()=>{currentURL=new URL(location.href);});});

  async function loadScript(script,preload=false) {
    if(!script.src) return;
    const url=new URL(script.getAttribute('src'),currentURL),name=url.pathname.split('/').pop();
    if(['theme.js','early-route.js','legacy-route.js','page-navigation.js'].includes(name)) return;
    if(modules.has(name)) {if(!preload)modules.get(name)(activeScope);return;}
    if(['api-config.js','site-map.js','server-data.js'].includes(name) && document.head.querySelector('script[data-navigation-shared="'+name+'"]')) return;
    if(url.origin!==location.origin) return;
    if(loadingScripts.has(name)){await loadingScripts.get(name);return;}
    if(preload)deferredModules.add(name);
    const loading=new Promise((done,fail)=>{
      const element=document.createElement('script');element.src=url.href;
      if(['api-config.js','site-map.js','server-data.js'].includes(name))element.dataset.navigationShared=name;
      element.onload=done;element.onerror=fail;document.head.append(element);
    });
    loadingScripts.set(name,loading);
    await loading;
    deferredModules.delete(name);
  }
  async function stylesFor(source) {
    const waits=[];
    for(const stylesheet of source.querySelectorAll('link[rel="stylesheet"]')) {
      const url=new URL(stylesheet.getAttribute('href'),currentURL);
      if([...document.querySelectorAll('link[rel="stylesheet"]')].some(link=>link.href===url.href))continue;
      waits.push(new Promise(done=>{
        const link=document.createElement('link');link.rel='stylesheet';link.href=url.href;link.dataset.navigationStyle='true';
        link.onload=done;link.onerror=done;document.head.insertBefore(link,document.getElementById('theme-variants'));
      }));
    }
    await Promise.all(waits);
  }
  function align(url,options) {
    const restore=options.restore;
    if(restore) {
      window.scrollTo({left:restore.x,top:restore.y,behavior:'instant'});
      requestAnimationFrame(()=>window.scrollTo({left:restore.x,top:restore.y,behavior:'instant'}));return;
    }
    let target;
    try {target=url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;}catch {}
    if(target) {
      const panel=target.closest('[role="tabpanel"]');
      if(panel?.hidden) document.querySelector('[aria-controls="'+CSS.escape(panel.id)+'"]')?.click();
      for(let parent=target;parent;parent=parent.parentElement)if(parent.matches('details'))parent.open=true;
      target.scrollIntoView({block:'start',behavior:'instant'});
    } else if(options.section && options.position) {
      const position=options.position;
      window.scrollTo({left:position.x,top:position.y,behavior:'instant'});
      requestAnimationFrame(()=>window.scrollTo({left:position.x,top:position.y,behavior:'instant'}));
    } else window.scrollTo({top:0,behavior:'instant'});
    const heading=document.querySelector('main h1,main');
    if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  }
  async function navigate(rawURL,options={}) {
    if(options.section && !options.pop)options.position={x:scrollX,y:scrollY};
    const url=resolve(rawURL),id=++requestID;
    requestController?.abort();requestController=new AbortController();
    if(url.pathname===currentURL.pathname && url.search===currentURL.search) {
      if(!options.pop){remember();historyID=crypto.randomUUID();history.pushState({arcadeEntry:historyID},'',url);}
      currentURL=url;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      requestAnimationFrame(()=>align(url,options));return;
    }
    document.documentElement.setAttribute('aria-busy','true');
    try {
      const response=await nativeFetch(url,{signal:requestController.signal});
      if(!response.ok)throw new Error('Page unavailable');
      const source=new DOMParser().parseFromString(await response.text(),'text/html');
      if(!source.querySelector('main'))throw new Error('Unsupported document');
      await stylesFor(source);
      const scripts=[...source.querySelectorAll('script')];
      for(const script of scripts)await loadScript(script,true);
      if(id!==requestID)return;
      const update=async()=>{
        if(!options.pop){remember();historyID=crypto.randomUUID();history.pushState({arcadeEntry:historyID},'',url);}
        currentURL=url;
        activeScope.dispose();activeScope=createScope();
        const neededStyles=new Set([...source.querySelectorAll('link[rel="stylesheet"]')].map(link=>new URL(link.getAttribute('href'),url).href));
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link=>{if(!neededStyles.has(link.href))link.remove();});
        document.head.querySelectorAll('style:not([data-navigation-persistent])').forEach(style=>style.remove());
        source.head.querySelectorAll('style').forEach(style=>document.head.append(style.cloneNode(true)));
        source.querySelectorAll('script').forEach(script=>script.remove());
        [...document.body.attributes].forEach(attribute=>document.body.removeAttribute(attribute.name));
        [...source.body.attributes].forEach(attribute=>document.body.setAttribute(attribute.name,attribute.value));
        document.body.replaceChildren(...source.body.childNodes);
        document.title=source.title;
        const metadata='meta[name="description"],meta[property^="og:"],link[rel="canonical"]';
        document.head.querySelectorAll(metadata).forEach(element=>element.remove());
        source.head.querySelectorAll(metadata).forEach(element=>document.head.append(element.cloneNode(true)));
        document.documentElement.style.visibility='';
        document.documentElement.removeAttribute('data-survival-view');
        document.documentElement.removeAttribute('data-survival-loading');
        for(const script of scripts)await loadScript(script);
        align(url,options);
        document.documentElement.dataset.navigationReady='true';
        window.dispatchEvent(new CustomEvent('arcade-page-change',{detail:{url:url.href}}));
      };
      await update();
      if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelector('main')?.animate([{opacity:0.86},{opacity:1}],{duration:140,easing:'ease-out'});
    } catch(error) {
      if(error.name!=='AbortError' && id===requestID)location.assign(url.href);
    } finally {if(id===requestID)document.documentElement.removeAttribute('aria-busy');}
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link || event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.download || link.target && link.target!=='_self')return;
    const url=resolve(link.href);
    if(url.origin!==location.origin || !/\/[^/]+\.html$/.test(url.pathname) || url.pathname.includes('/assets/') || url.pathname.includes('/previews/'))return;
    if(link.getAttribute('role')==='tab' || link.closest('.village-team-tabs'))return;
    event.preventDefault();
    navigate(url,{section:!!link.closest('.chunky-nav,.section-navigation,.community-navigation,.game-guide-toolbar,.survival-topic-toolbar,.guide-sidebar')});
  });
  window.addEventListener('popstate',event=>{
    const restore=positions.get(event.state?.arcadeEntry);
    historyID=event.state?.arcadeEntry || crypto.randomUUID();
    const destination=resolve(location.href);
    if(destination.pathname!==currentURL.pathname || destination.search!==currentURL.search)activeScope.dispose();
    navigate(location.href,{pop:true,restore:restore || {x:0,y:0}});
  });
  // Native details disclosure should keep the clicked question where it was.
  document.addEventListener('click',event=>{
    const summary=event.target.closest('summary');
    if(!summary || !summary.parentElement.closest('.faq-list,.village-faq'))return;
    const top=summary.getBoundingClientRect().top;
    requestAnimationFrame(()=>{const delta=summary.getBoundingClientRect().top-top;if(Math.abs(delta)>1)window.scrollBy({top:delta,behavior:'instant'});});
  },true);
})();
