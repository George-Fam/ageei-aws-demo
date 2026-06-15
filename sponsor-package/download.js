(() => {
  const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const button = document.querySelector('[data-pdf-download]');
  if (!button) return;

  const missing = lang === 'fr' ? 'PDF bientôt disponible' : 'PDF coming soon';
  const label = lang === 'fr' ? 'Télécharger le PDF' : 'Download PDF';
  const cmsUrl = location.hostname === 'localhost' ? '/cms-api' : 'https://cms.ageei.org';

  fetch(`${cmsUrl}/items/sponsor_package`)
    .then((response) => response.json())
    .then((payload) => {
      const data = Array.isArray(payload.data) ? payload.data[0] : payload.data;
      const value = data && data[lang];
      const fileId = typeof value === 'string' ? value : value && value.id;

      if (!fileId) {
        button.textContent = missing;
        return;
      }

      button.href = `${cmsUrl}/assets/${fileId}/package-${lang}.pdf`;
      button.textContent = label;
      button.classList.remove('disabled');
      button.removeAttribute('aria-disabled');
    })
    .catch(() => {
      button.textContent = missing;
    });
})();
