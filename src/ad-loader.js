(() => {
  'use strict';

  const config = window.ARCHAEOLOGY_AD_CONFIG;
  const container = document.querySelector('#adSlot');
  const mount = document.querySelector('#adMount');
  const clientIsValid = /^ca-pub-\d+$/.test(config?.client || '');
  const slotIsValid = /^\d+$/.test(config?.slot || '');

  // Standard AdSense tags are allowed on the normal website, but not inside
  // Alt1's unsupported Windows Chromium WebView.
  if (window.alt1 || !config?.enabled || !clientIsValid || !slotIsValid || !container || !mount) return;

  const script = document.createElement('script');
  const advert = document.createElement('ins');
  advert.className = 'adsbygoogle';
  advert.style.display = 'block';
  advert.dataset.adClient = config.client;
  advert.dataset.adSlot = config.slot;
  advert.dataset.adFormat = 'auto';
  advert.dataset.fullWidthResponsive = 'true';

  const updateVisibility = () => {
    container.hidden = advert.dataset.adStatus !== 'filled';
  };
  const observer = new MutationObserver(updateVisibility);
  observer.observe(advert, { attributes: true, attributeFilter: ['data-ad-status'] });

  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.client)}`;
  script.crossOrigin = 'anonymous';
  script.addEventListener('error', () => {
    observer.disconnect();
    container.hidden = true;
    mount.replaceChildren();
  });
  script.addEventListener('load', () => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      observer.disconnect();
      container.hidden = true;
      mount.replaceChildren();
    }
  });

  mount.append(advert, script);
})();
