self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};

  // Default values (fallbacks)
  let title = 'Lab Notification';
  let options = {
    body: 'You have a new notification.',
    icon: '/path-to-icon.png',
    tag: 'general',
    data: {
      url: '/'
    }
  };

  // Customize based on notification type
  switch (data.type) {
    case 'result-upload':
      title = 'New Test Result Published!';
      options.body = 'Your medical test result is now available.';
      options.tag = 'result';
      options.data.url = data.url || '/patient/records';
      break;

    case 'promotion':
      title = data.title || 'Special Offer from AMLAD!';
      options.body = data.body || 'Check out our latest promotions!';
      options.tag = 'promotion';
      options.data.url = data.url || '/promotions';
      break;

    case 'newsletter':
      title = data.title || 'Latest Lab Newsletter';
      options.body = data.body || 'Stay updated with our latest news.';
      options.tag = 'newsletter';
      options.data.url = data.url || '/newsletters';
      break;

    case 'appointment-approved':
      title = 'Appointment Approved!';
      options.body = 'Your appointment has been approved. View details.';
      options.tag = 'appointment-approved';
      options.data.url = data.url || '/appointments';
      break;

    case 'appointment-rejected':
      title = 'Appointment Rejected';
      options.body = 'Unfortunately, your appointment request was rejected.';
      options.tag = 'appointment-rejected';
      options.data.url = data.url || '/appointments';
      break;

    case 'appointment-cancelled':
      title = 'Appointment Cancelled';
      options.body = 'Your appointment has been cancelled. Please reschedule.';
      options.tag = 'appointment-cancelled';
      options.data.url = data.url || '/appointments';
      break;

    default:
      // If no specific type, fallback
      title = data.title || 'Notification';
      options.body = data.body || 'Check the latest update.';
      options.data.url = data.url || '/';
  }

  // Show Notification
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data.url || '/';
  event.waitUntil(clients.openWindow(url));
});
