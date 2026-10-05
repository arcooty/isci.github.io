(() => {
  const initialize = ({window, document, requestAnimationFrame}) => {
    document.addEventListener('click', event => {
      const summary = event.target.closest('.atlas-chapter > summary');
      if (!summary) return;
      const top = summary.getBoundingClientRect().top;
      requestAnimationFrame(() => {
        const delta = summary.getBoundingClientRect().top - top;
        if (Math.abs(delta) > 1) window.scrollBy({top: delta, behavior: 'instant'});
      });
    }, true);
  };
  if (window.ARCADE_NAVIGATION) window.ARCADE_NAVIGATION.register('survival-journey.js', initialize);
  else initialize({window, document, requestAnimationFrame: window.requestAnimationFrame.bind(window)});
})();
