'use strict';

self.addEventListener('push', function(event) {
  event.waitUntil(
    self.registration.showNotification('Notification', {
        body: event.data.text(),
        tag: 'seal'
    })
  );
});
