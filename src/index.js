import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  AuthenticationProvider,
  CallbackLoginPopup,
  CallbackLogout,
} from "app-launcher-auth";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  COGNITO_URI,
  LOGOUT_REDIRECT_URI,
  REDIRECT_URI,
  ROOT_URI,
} from "./consts/config";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthenticationProvider
    config={{
      authority:COGNITO_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      scope: "openid email profile aws.cognito.signin.user.admin",
      response_type: "code",
      launchUrl: ROOT_URI,
      logoutRedirectLink: LOGOUT_REDIRECT_URI,
    }}
  >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login/callback" element={<CallbackLoginPopup />} />
        <Route path="/logout" element={<CallbackLogout />} />
      </Routes>
    </BrowserRouter>
  </AuthenticationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
