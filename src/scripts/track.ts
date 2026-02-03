import { trackEvent } from '../lib/analytics';

const tracked = document.querySelectorAll<HTMLElement>('[data-track]');
tracked.forEach((element) => {
  element.addEventListener('click', () => {
    const name = element.getAttribute('data-track');
    if (name) trackEvent(name);
  });
});
