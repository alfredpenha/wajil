/*
Event mapping (dataLayer -> GA4):

Funnel steps:
1) page_view -> page_view (auto or via dataLayer event)
2) view_menu -> view_menu
3) view_item -> view_item
4) generate_lead -> generate_lead

Supporting:
- scroll_depth -> scroll_depth (percent)
- time_on_page -> time_on_page (seconds)
- click_whatsapp -> click_whatsapp
- click_call -> click_call
- click_maps -> click_maps
- click_instagram -> click_instagram
- click_facebook -> click_facebook
- click_tiktok -> click_tiktok
- error_validation -> error_validation
- select_delivery_method -> select_delivery_method
- view_gallery -> view_gallery
*/

const TTL_DAYS = 30;
const TTL_MS = TTL_DAYS * 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'wajil_attribution';
const VISITOR_KEY = 'wajil_visitor_id';
const SESSION_KEY = 'wajil_session_id';

const ACQ_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'ttclid'
];

const EVENT_DEDUPE_WINDOW_MS = 2000;
const eventDedupe = new WeakMap();
const eventDedupeGlobal = new Map();

const now = () => Date.now();

const safeParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const readStorage = (key) => safeParse(localStorage.getItem(key));
const writeStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const randomId = () => {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;
};

const getVisitorId = () => {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = randomId();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
};

const getSessionId = () => {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = randomId();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

const parseAcquisition = () => {
  const params = new URLSearchParams(window.location.search);
  const acq = {};
  ACQ_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) acq[key] = value;
  });
  return acq;
};

const hasAcquisition = (acq) => ACQ_KEYS.some((key) => acq[key]);

const updateAttribution = () => {
  const current = parseAcquisition();
  const timestamp = now();
  let stored = readStorage(STORAGE_KEY) || {};

  if (stored.expiresAt && stored.expiresAt < timestamp) {
    stored = {};
  }

  if (hasAcquisition(current)) {
    if (!stored.first) {
      stored.first = { ...current, ts: timestamp };
    }
    stored.last = { ...current, ts: timestamp };
    stored.expiresAt = timestamp + TTL_MS;
  } else if (stored.first && !stored.expiresAt) {
    stored.expiresAt = timestamp + TTL_MS;
  }

  writeStorage(STORAGE_KEY, stored);

  return {
    current,
    first: stored.first || {},
    last: stored.last || {},
    expiresAt: stored.expiresAt || null
  };
};

const buildAcquisitionContext = (attribution) => {
  const acq = {};
  ACQ_KEYS.forEach((key) => {
    acq[key] = attribution.current[key] || attribution.last[key] || null;
    acq[`first_touch_${key}`] = attribution.first[key] || null;
    acq[`last_touch_${key}`] = attribution.last[key] || null;
  });
  acq.first_touch_ts = attribution.first.ts || null;
  acq.last_touch_ts = attribution.last.ts || null;
  return acq;
};

const buildContext = (content = {}) => {
  const attribution = updateAttribution();
  return {
    page_url: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    referrer: document.referrer || null,
    acquisition: buildAcquisitionContext(attribution),
    device: {
      viewport_w: window.innerWidth,
      viewport_h: window.innerHeight,
      user_agent: navigator.userAgent
    },
    ids: {
      session_id: getSessionId(),
      visitor_id: getVisitorId()
    },
    content,
    currency: 'MXN'
  };
};

const shouldFire = (eventName, element) => {
  const timestamp = now();
  if (!element) {
    const last = eventDedupeGlobal.get(eventName) || 0;
    if (timestamp - last < EVENT_DEDUPE_WINDOW_MS) return false;
    eventDedupeGlobal.set(eventName, timestamp);
    return true;
  }
  let map = eventDedupe.get(element);
  if (!map) {
    map = new Map();
    eventDedupe.set(element, map);
  }
  const last = map.get(eventName) || 0;
  if (timestamp - last < EVENT_DEDUPE_WINDOW_MS) return false;
  map.set(eventName, timestamp);
  return true;
};

const pushEvent = (eventName, payload = {}, element) => {
  if (!shouldFire(eventName, element)) return;
  window.dataLayer = window.dataLayer || [];
  const context = buildContext(payload.content);
  window.dataLayer.push({
    event: eventName,
    ...context,
    ...payload
  });
};

const normalizeProduct = (element) => {
  if (!element) return {};
  return {
    product_id: element.dataset.productId || null,
    product_name: element.dataset.productName || null,
    category: element.dataset.productCategory || 'tamales',
    price: element.dataset.productPrice ? Number(element.dataset.productPrice) : null,
    quantity: element.dataset.productQuantity ? Number(element.dataset.productQuantity) : null
  };
};

const resolveCtaPlacement = (element) => {
  if (!element) return 'unknown';
  const track = element.getAttribute('data-track');
  if (track && track.startsWith('click_ubereats_')) {
    return track.replace('click_ubereats_', '');
  }
  const section = element.closest('section');
  return section?.id || 'unknown';
};

const isUberCta = (element) => {
  if (!element) return false;
  const href = element.getAttribute('href') || '';
  return href.includes('ubereats.com');
};

const detectSocialClick = (href) => {
  if (!href) return null;
  const url = href.toLowerCase();
  if (url.startsWith('tel:')) return 'click_call';
  if (url.includes('wa.me') || url.includes('whatsapp.com')) return 'click_whatsapp';
  if (url.includes('maps.google') || url.includes('goo.gl/maps') || url.includes('maps.app')) return 'click_maps';
  if (url.includes('instagram.com')) return 'click_instagram';
  if (url.includes('facebook.com')) return 'click_facebook';
  if (url.includes('tiktok.com')) return 'click_tiktok';
  return null;
};

const initCoreEvents = () => {
  pushEvent('page_view', {}, document.documentElement);

  const menuSection = document.querySelector('[data-analytics-section="menu"]') || document.querySelector('#producto');
  if (menuSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          pushEvent('view_menu', {}, menuSection);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(menuSection);
  }
};

const initScrollDepth = () => {
  const thresholds = [25, 50, 75, 90];
  const fired = new Set();

  const onScroll = () => {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const percent = Math.round((scrollTop / docHeight) * 100);
    thresholds.forEach((threshold) => {
      if (percent >= threshold && !fired.has(threshold)) {
        fired.add(threshold);
        pushEvent('scroll_depth', { percent: threshold });
      }
    });
  };

  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

const initTimeOnPage = () => {
  [10, 30, 60].forEach((seconds) => {
    setTimeout(() => {
      pushEvent('time_on_page', { seconds });
    }, seconds * 1000);
  });
};

const initClickHandlers = () => {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest('a');
    if (anchor) {
      const socialEvent = detectSocialClick(anchor.getAttribute('href'));
      if (socialEvent) {
        pushEvent(socialEvent, {}, anchor);
      }
      if (isUberCta(anchor)) {
        const placement = resolveCtaPlacement(anchor);
        const product = normalizeProduct(anchor.closest('[data-analytics-item]'));
        pushEvent(
          'generate_lead',
          {
            lead_method: 'ubereats',
            cta_location: placement,
            content: product
          },
          anchor
        );
      }
    }

    const productCard = target.closest('[data-analytics-item]');
    if (productCard) {
      const product = normalizeProduct(productCard);
      pushEvent('view_item', { content: product }, productCard);
    }

    const customEvent = target.closest('[data-analytics-event]');
    if (customEvent) {
      const name = customEvent.getAttribute('data-analytics-event');
      if (name) {
        pushEvent(name, {}, customEvent);
      }
    }
  });
};

const init = () => {
  initCoreEvents();
  initScrollDepth();
  initTimeOnPage();
  initClickHandlers();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
