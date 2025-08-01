import { ref } from 'vue';

export function createIdleVue(options = {}) {
  const {
    store,
    router,
    idleTime = 1200000, // 20 minutes default
    startAtIdle = false
  } = options;

  const isIdle = ref(startAtIdle);
  let idleTimer = null;
  let lastActivity = Date.now();

  const resetTimer = () => {
    lastActivity = Date.now();
    if (isIdle.value) {
      isIdle.value = false;
    }
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
    idleTimer = setTimeout(() => {
      isIdle.value = true;
      // Clear localStorage and redirect to login when idle
      if (router) {
        localStorage.clear();
        router.push({ name: 'Login' });
      }
    }, idleTime);
  };

  const handleActivity = () => {
    resetTimer();
  };

  const start = () => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
    resetTimer();
  };

  const stop = () => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.removeEventListener(event, handleActivity, true);
    });
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
  };

  // Auto-start when created
  start();

  return {
    isIdle,
    start,
    stop,
    resetTimer
  };
} 