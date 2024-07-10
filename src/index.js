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
import { LOGOUT_REDIRECT_URI, REDIRECT_URI } from "./consts/configAWS";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthenticationProvider
    config={{
      authority:
        "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_7wzWV6yyL",
      client_id: "450mbafbnrds0p8e5rk3jf4jt5",
      client_secret: "3tl8inakfht7kf2nktso58ighcr0t6v3fm9t69kh71sj3vn4htv",
      redirect_uri: REDIRECT_URI,
      scope: "openid email profile aws.cognito.signin.user.admin",
      response_type: "code",
      launchUrl: "https://marketplace-demo-app.twenty-tech.com",
      logoutRedirectLink: LOGOUT_REDIRECT_URI,
      // apiGetUserUrl: `https://marketplace-mvp.twenty-tech.com/api/user/get-user-info`,
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
