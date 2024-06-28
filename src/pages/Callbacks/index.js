import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService, httpService, useAuth } from "app-launcher-auth";
import userService from "../../services/userService";
import BaseUrl from "../../consts/baseUrl";

function Callback() {
  const navigate = useNavigate();
  const auth = useAuth();
  React.useEffect(() => {
    auth.loginRedirectCallback().then(async (res) => {
      try {
        const accessTokenCognito = res.access_token;
        const user = await userService.loginWithCognito(accessTokenCognito);
        if (user.data.statuscode === 200) {
          httpService.saveTokenStorage(user.data.data);
          navigate(BaseUrl.Login);
        }
      } catch (error) {
        navigate(BaseUrl.Login);
      }
    });
  }, []);
  return <div>callback</div>;
}
export default Callback;
