importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyCv2YsaTAj38o55M8nBbZ_3s939XWLAmM4",
  authDomain:        "fiobras-preco.firebaseapp.com",
  databaseURL:       "https://fiobras-preco-default-rtdb.firebaseio.com",
  projectId:         "fiobras-preco",
  storageBucket:     "fiobras-preco.firebasestorage.app",
  messagingSenderId: "828256608601",
  appId:             "1:828256608601:web:8e73fde16eaa9ad5882c48"
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
