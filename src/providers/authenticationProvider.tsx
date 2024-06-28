import { LOGOUT_REDIRECT_URI } from "../consts/configAWS";
import { PERMISSION_ENUM } from "../consts/index";
// import { showError } from "../helpers/toast";
import { useLogoutUser } from "../hooks/users/useUsersHooks";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AuthService from "../services/authService";
import cachedService from "../services/cachedServices";
import httpService from "../services/httpServices";
import locationService from "../services/locationServices";
import userService from "../services/userService";

type ActionPostMessage = "logout";
export interface EventListenerI {
  data: {
    action: ActionPostMessage;
    idApp: string;
    value: any;
  };
}

export interface IUser {
  id: number;
  username: string;
  subId: string;
  password: null;
  isVerifyOtp: boolean;
  lastName: null;
  firstName: null;
  phone: null;
  email: null;
  role: string;
  avatar: null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthenticationContextI {
  loading: boolean;
  isLogged: boolean;
  user: IUser | null;
  isAdmin: boolean;
  isAppManager: boolean;
  isUser: boolean;
  initialPathName: string;
  accessToken: string;
  logout: () => void;
  loginPopup: () => void;
  loginPopupCallback: () => any;
  eventListener: (e: any) => void;
  loginRedirect: () => void;
  loginRedirectCallback: () => Promise<IUser | unknown>;
}

const AuthenticationContext = createContext<AuthenticationContextI>({
  loading: false,
  isLogged: false,
  user: {} as any,
  isAdmin: false,
  isAppManager: false,
  isUser: false,
  initialPathName: "",
  accessToken: "",
  logout: () => {},
  loginPopup: () => {},
  loginPopupCallback: () => Promise.resolve({} as any),
  loginRedirect: () => {},
  loginRedirectCallback: () => Promise.resolve({} as any),
  eventListener: () => {},
});

export const useAuth = () => useContext(AuthenticationContext);

const authService = new AuthService();
locationService.setInitialPathname();
cachedService.initialState();

const AuthenticationProvider = ({ children }: { children: any }) => {
  //! State
  const [isTokenAttached, setTokenAttached] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [isCheckingAuth, setCheckingAuth] = useState(false);
  const { mutateAsync: logoutUser } = useLogoutUser();

  const isLogged = httpService.getTokenStorage();
  const token = httpService.getTokenStorage();

  const onGetUserDataSuccess = useCallback((user: IUser | null) => {
    setTokenAttached(false);
    if (user) {
      httpService.saveUserStorage(user);
      setTokenAttached(true);
      setUserData(user);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    (async () => {
      try {
        setCheckingAuth(true);
        httpService.attachTokenToHeader();
        const response = await userService.profile();

        const user = response?.data?.data;
        if (user) {
          onGetUserDataSuccess(user);
        }
      } catch (error) {
        showError(error);
      } finally {
        setCheckingAuth(false);
      }
    })();
  }, [token, onGetUserDataSuccess]);

  const loginPopup = useCallback(async () => {
    try {
      const loginPopupBinded = authService.loginPopup.bind(authService);
      const user = await loginPopupBinded();
      if (user) {
        window.location.reload();
      }
    } catch (error) {
      showError(error);
    }
  }, []);

  const loginRedirectCallback = useCallback(() => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user = await authService.loginRedirectCallback();
          if (user) {
            // onGetUserDataSuccess(user);
            resolve(user);
          }
        } catch (error) {
          console.error(error);
          reject(error);
        }
      })();
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser(token || "");
      authService.removeUser();
      window.location.href = LOGOUT_REDIRECT_URI;
      httpService.clearAuthStorage();
      window.sessionStorage.clear();
    } catch (error) {
      showError(error);
    }
  }, [userData, logoutUser]);

  const eventListener = useCallback((cb: (e: any) => void) => {
    const addEventListener = window.addEventListener as any;
    const eventMethod = addEventListener
      ? "addEventListener"
      : ("attachEvent" as any);
    const eventer = window[eventMethod] as any;
    const messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    eventer(messageEvent, cb, false);
  }, []);

  //! Return
  const value = useMemo(() => {
    return {
      accessToken: token,
      loading: isCheckingAuth,
      isLogged: !!isLogged,
      user: userData,
      isAdmin: userData?.role === PERMISSION_ENUM.ADMIN,
      isAppManager: userData?.role === PERMISSION_ENUM.APP_MANAGER,
      isUser: userData?.role === PERMISSION_ENUM.USER,
      initialPathName: locationService.initialPathname,
      loginRedirect: authService.loginRedirect.bind(authService),
      loginRedirectCallback,
      loginPopupCallback: authService.loginPopupCallback.bind(authService),
      loginPopup,
      logout,
      eventListener,
    };
  }, [
    userData,
    isCheckingAuth,
    authService,
    token,
    loginPopup,
    loginRedirectCallback,
    eventListener,
    logout,
  ]);

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
