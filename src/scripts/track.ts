// @ts-nocheck
const tracked = document.querySelectorAll('[data-track]');
tracked.forEach((element) => {
  element.addEventListener('click', () => {
    const name = element.getAttribute('data-track');
    const track = window.__trackEvent;
    if (name && typeof track === 'function') {
      track(name);
    }
  });
});
