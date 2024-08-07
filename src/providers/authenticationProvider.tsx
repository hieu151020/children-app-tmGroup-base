import { LOGOUT_REDIRECT_URI } from "../consts/config";
// import { showError } from "../helpers/toast";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { CLIENT_ID, cognitoClient } from "../consts/config";
import httpServices from "../services/httpServices.ts";

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
  loginAws:any
  signUpAws:any
  confirmSignUpAws:any
}

interface AuthenticationContextI {
  loading: boolean;
  isLogged: boolean;
  user: IUser | null;
  isAdmin?: boolean;
  isAppManager?: boolean;
  isUser?: boolean;
  initialPathName: string;
  accessToken: string;
  logout: () => void;
  loginPopup: () => void;
  loginPopupCallback: () => any;
  eventListener: (e: any) => void;
  loginRedirect: () => void;
  loginRedirectCallback: () => Promise<IUser | unknown>;
  loginAws:any,
  signUpAws:any,
  confirmSignUpAws:any
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
  loginAws:()=>{},
  signUpAws:()=>{},
  confirmSignUpAws:()=>{}
});

export const useAuth = () => useContext(AuthenticationContext);

// const authService = new AuthService();
// locationService.setInitialPathname();

const AuthenticationProvider = ({ children }: { children: any }) => {
  //! State
  const [isTokenAttached, setTokenAttached] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [isCheckingAuth, setCheckingAuth] = useState(false);

  const [isLogged,setLogged]=useState(!!httpServices.getTokenStorage())
  const [loading,setLoading]=useState(false)
  const token = httpServices.getTokenStorage();

  const onGetUserDataSuccess = useCallback((user: IUser | null) => {
    setTokenAttached(false);
    if (user) {
      httpServices.saveUserStorage(user);
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
        // httpServices.attachTokenToHeader();
        // const response = await userService.profile();

        // const user = response?.data?.data;
        // if (user) {
        //   onGetUserDataSuccess(user);
        // }
      } catch (error) {
        // showError(error);
      } finally {
        setCheckingAuth(false);
      }
    })();
  }, [token, onGetUserDataSuccess]);

  const loginPopup = useCallback(async () => {
    // try {
    //   const loginPopupBinded = authService.loginPopup.bind(authService);
    //   const user = await loginPopupBinded();
    //   if (user) {
    //     // window.location.reload();
    //   }
    // } catch (error) {
    //   // showError(error);
    // }
  }, []);

  const loginRedirectCallback = useCallback(() => {
    // return new Promise((resolve, reject) => {
    //   (async () => {
    //     try {
    //       const user = await authService.loginRedirectCallback();
    //       if (user) {
    //         // onGetUserDataSuccess(user);
    //         resolve(user);
    //       }
    //     } catch (error) {
    //       console.error(error);
    //       reject(error);
    //     }
    //   })();
    // });
  }, []);

  const logout = useCallback(async () => {
    try {
      // await logoutUser(token || "");
      // authService.removeUser();
      // window.location.href = LOGOUT_REDIRECT_URI;
      setLogged(false);
      httpServices.clearAuthStorage();
      window.sessionStorage.clear();
      window.location.reload()
    } catch (error) {
      // showError(error);
    }
  }, [userData]);

  const eventListener = useCallback((cb: (e: any) => void) => {
    const addEventListener = window.addEventListener as any;
    const eventMethod = addEventListener
      ? "addEventListener"
      : ("attachEvent" as any);
    const eventer = window[eventMethod] as any;
    const messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    eventer(messageEvent, cb, false);
  }, []);

   const loginAws = async (userInfoLogin: {
    username: string;
    email: string;
    password: string;
    code: string;
  }) => {
    setLoading(true)
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: userInfoLogin.username,
        PASSWORD: userInfoLogin.password,
      },
    };
    
    try {
      const command = new InitiateAuthCommand(params as any);
      const { AuthenticationResult } = await cognitoClient.send(command);
      if (AuthenticationResult) {
        httpServices.saveTokenStorage(AuthenticationResult.AccessToken||'')
        setLogged(true)
        setLoading(false)
        return AuthenticationResult;
      }
    } catch (error) {
      alert(`Sign in failed: ${error}`);
      setLoading(false)

    }
  };
  
   const signUpAws = async (userInfoLogin: {
    username: string;
    email: string;
    password: string;
    code: string;
  }) => {
    setLoading(true)

    const params = {
      ClientId: CLIENT_ID,
      Username: userInfoLogin.username,
      Password: userInfoLogin.password,
      UserAttributes: [
        {
          Name: "email",
          Value: userInfoLogin.email,
        },
      ],
    };
  
    try {
      const command = new SignUpCommand(params);
      await cognitoClient.send(command);
      setLoading(false)

      return true
    } catch (error) {
      alert(`Sign up failed: ${error}`);
      setLoading(false)

      return false
    }
  };
  
   const confirmSignUpAws = async (userInfoLogin: {
    username: string;
    email: string;
    password: string;
    code: string;
  }) => {
    setLoading(true)
    const params = {
      ClientId: CLIENT_ID,
      Username: userInfoLogin.username,
      ConfirmationCode: userInfoLogin.code,
    };
    try {
      const command = new ConfirmSignUpCommand(params);
      const res = await cognitoClient.send(command);
      if(res){
        alert('Sign up successfully!')
        setLoading(false)

      }
    } catch (error) {
      console.error("Error confirming sign up: ", error);
      setLoading(false)

      throw error;
    }
  };

  //! Return
  const value = useMemo(() => {
    return {
      accessToken: token,
      loading,
      isLogged,
      user: userData,
      // initialPathName: locationService.initialPathname,
      loginRedirectCallback,
      loginPopup,
      logout,
      eventListener,
      loginAws,
      signUpAws,
      confirmSignUpAws
    };
  }, [
    loading,
    userData,
    isCheckingAuth,
    token,
    loginPopup,
    loginRedirectCallback,
    eventListener,
    logout,
    loginAws,
    signUpAws,
    confirmSignUpAws
  ]);

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
