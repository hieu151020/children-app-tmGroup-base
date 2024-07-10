importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyC2DrV8cY-R5MZG1GwtBqi9C-HV8KCa71Q",
  authDomain: "market-place-e8208.firebaseapp.com",
  projectId: "market-place-e8208",
  storageBucket: "market-place-e8208.appspot.com",
  messagingSenderId: "139934815468",
  appId: "1:139934815468:web:dad61481e513120780c1c9",
  measurementId: "G-MJVP17YZEH",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
