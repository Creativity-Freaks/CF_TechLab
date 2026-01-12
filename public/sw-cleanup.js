(function(){
  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then((regs) => regs.forEach((reg) => reg.unregister().catch(() => {})))
        .catch(() => {});
    }
    if (window.caches && typeof caches.keys === 'function') {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
    }
  } catch(e) {
    // ignore
  }
})();
