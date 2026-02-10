// Обработка формы и переход на Thank You
const form = document.getElementById('registration-form');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = {
      name: formData.get('name')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      phone: formData.get('phone')?.toString().trim(),
      ts: new Date().toISOString(),
    };

    try {
      localStorage.setItem('pwa-landing-registration', JSON.stringify(data));
    } catch (e) {
      console.warn('Не удалось сохранить данные в localStorage', e);
    }

    window.location.href = 'thank-you.html';
  });
}

// Регистрация service worker для PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker зарегистрирован:', registration.scope);
      })
      .catch((err) => {
        console.error('Ошибка регистрации ServiceWorker:', err);
      });
  });
}
