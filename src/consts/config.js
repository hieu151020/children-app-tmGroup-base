import { initializeApp } from "firebase/app";
import { getToken, onMessage } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging/sw";

const isDevelopment = true;
const env = "product";
let root_uri = "";
let cognito_uri = "";
let well_know = "";
let client_id = "";
let client_secret = "";
if (env === "product") {
  root_uri = "https://tmgroup.auth.eu-west-2.amazoncognito.com";
  cognito_uri =
    "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_K80SUFzCl";
  well_know =
    "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_K80SUFzCl/.well-known/openid-configuration";
  client_id = "1sp5663ef820vqrb7vem7uphn3";
  client_secret = "1l1toqncupfqka3l9uhjugdj1eohsidne12iqln8itocf37nmhbg";
}
else if (env === "dev") {
  root_uri = 'https://marketplace.auth.ap-southeast-1.amazoncognito.com';
  cognito_uri =
    'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_7wzWV6yyL';
  well_know =
    'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_7wzWV6yyL/.well-known/openid-configuration';
  client_id = "450mbafbnrds0p8e5rk3jf4jt5";
  client_secret = "3tl8inakfht7kf2nktso58ighcr0t6v3fm9t69kh71sj3vn4htv";
}
export const ROOT_URI = root_uri;
export const COGNITO_URI = cognito_uri;
export const WELL_KNOW = well_know;
export const CLIENT_ID = client_id;
export const CLIENT_SECRET = client_secret;
export const REDIRECT_URI = `${window.location.origin}/login/callback`;
export const LOGOUT_URI = `${window.location.origin}/logout`;
export const LOGOUT_REDIRECT_URI = `${ROOT_URI}/logout?client_id=${CLIENT_ID}&logout_uri=${LOGOUT_URI}`;

const firebaseConfig = {
  apiKey: "AIzaSyC2DrV8cY-R5MZG1GwtBqi9C-HV8KCa71Q",
  authDomain: "market-place-e8208.firebaseapp.com",
  projectId: "market-place-e8208",
  storageBucket: "market-place-e8208.appspot.com",
  messagingSenderId: "139934815468",
  appId: "1:139934815468:web:dad61481e513120780c1c9",
  measurementId: "G-MJVP17YZEH",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging();
const db = getFirestore(app);

export { messaging, getToken, onMessage, db };
