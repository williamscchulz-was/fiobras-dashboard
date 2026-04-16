importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyD5RolINTR58dWJ9xEfCfqTxQw-NBeoeeI",
  authDomain:        "fiobras-hub.firebaseapp.com",
  databaseURL:       "https://fiobras-hub-default-rtdb.firebaseio.com",
  projectId:         "fiobras-hub",
  storageBucket:     "fiobras-hub.firebasestorage.app",
  messagingSenderId: "504628003811",
  appId:             "1:504628003811:web:adcc27c0f04e72b02b96d6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || '🔧 Fiobras Manutenção';
  const body  = payload.notification?.body  || 'Nova notificação de manutenção';

  self.registration.showNotification(title, {
    body,
    icon:             '/manutencao/icon-192.png',
    badge:            '/manutencao/icon-192.png',
    tag:              'fiobras-manut',
    renotify:         true,
    requireInteraction: true,
    vibrate:          [300, 100, 300, 100, 300],
    data:             payload.data || {}
  });
});
