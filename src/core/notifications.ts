import "client-only";

function showNotification(title: string, content: string, registration: ServiceWorkerRegistration) {
  const options = {
    icon: "/android-icon-192x192.png",
    body: content,
  };
  if ("showNotification" in registration) {
    registration.showNotification(title, options);
  } else {
    new Notification(title, options);
  }
}

export async function sendNotification(title: string, content: string) {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  if (Notification.permission === "granted") {
    showNotification(title, content, registration);
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      showNotification(title, content, registration);
    }
  }
}
