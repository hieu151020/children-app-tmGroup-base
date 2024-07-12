import {
  CLIENT_ID,
  CLIENT_SECRET,
  COGNITO_URI,
  REDIRECT_URI,
} from "../consts/config";
import { User, UserManager } from "oidc-client-ts";

class AuthService {
  userManager: UserManager;
  constructor() {
    const settings = {
      authority: COGNITO_URI,
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      client_secret: CLIENT_SECRET,
      scope: "openid email profile aws.cognito.signin.user.admin",
      response_type: "code",
      loadUserInfo: true,
      automaticSilentRenew: true,
      popup_redirect_uri: "/login/callback",
    };

    this.userManager = new UserManager(settings);
  }

  getUser(): Promise<User | null> {
    return this.userManager.getUser();
  }

  login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  loginPopup(): Promise<User | null> {
    return this.userManager.signinPopup();
  }

  loginPopupCallback(): Promise<void> {
    return this.userManager.signinPopupCallback();
  }

  logout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  removeUser(): Promise<void> {
    return this.userManager.removeUser();
  }

  loginRedirect(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  loginRedirectCallback(url?: string): Promise<User> {
    return this.userManager.signinRedirectCallback(url);
  }
}

export default AuthService;
