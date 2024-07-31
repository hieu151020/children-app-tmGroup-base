import {
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { httpService, useAuth } from "app-launcher-auth";
import axios from "axios";
import { getMessaging, onMessage } from "firebase/messaging";
import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import { BASE_URL } from "./consts/apiUrl";
import { CLIENT_ID, cognitoClient, getToken, messaging } from "./consts/config";

function App() {
  const { user, loginPopup, isLaunchFromApp, accessToken } = useAuth();
  const isLoggedStorage = httpService.getTokenStorage();

  const [isLogged, setIsLogged] = useState(!!isLoggedStorage);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingNoti, setLoadingNoti] = useState(false);
  const [noti, setNoti] = useState({
    title: "",
    body: "",
  });
  const [userInfoLogin, setUserInfoLogin] = useState({
    username: "",
    email: "",
    password: "",
    code: "",
  });
  const [isSignup, setSignup] = useState(false);
  const [tokenService, setTokenService] = useState();
  const [isSendCode, setIsSendCode] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      setLoadingData(true);
      try {
        // const permission = await Notification.requestPermission();
        // if (permission === "granted") {
        getToken(messaging, {
          vapidKey:
            "BEWDYnw8VUtOpgQ8_aZFctLrSusm3EnDVCEo-tq9JYUnJe7n38-qA1cT_xBs1A9w3l3QqWhfbCZyINYbAQABFr4",
        })
          .then(async (currentToken) => {
            if (currentToken) {
              console.log(currentToken, "currentToken");
              // const response = await axios.get(
              //   `${BASE_URL}/app-integration/${appId}`,
              //   {
              //     headers: {
              //       Authorization: `Bearer ${token}`,
              //     },
              //   }
              // );
              // const detailApp = response?.data?.data;
              // console.log(detailApp, "data");
              const body = {
                appClientId:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseWdyaXoxaTAwMmxhMDkyaGo5bHVhbnQiLCJpYXQiOjE3MjA2NzE3MzksImV4cCI6MTcyMzI2MzczOX0.sw_GkJugW6JSo3LgWt8AyqZ7eY5ndZSpu2vu1dvUruQ",
                appClientName:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseWdyaXoxaTAwMmxhMDkyaGo5bHVhbnQiLCJpYXQiOjE3MjA2NzE3MzksImV4cCI6MTcyMzI2MzczOX0.sw_GkJugW6JSo3LgWt8AyqZ7eY5ndZSpu2vu1dvUruQ",
                appClientSecret:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseWdyaXoxaTAwMmxhMDkyaGo5bHVhbnQiLCJpYXQiOjE3MjA2NzE3MzksImV4cCI6MTcyMzI2MzczOX0.sw_GkJugW6JSo3LgWt8AyqZ7eY5ndZSpu2vu1dvUruQ",
                // appClientId: CLIENT_ID,
                // appClientName: CLIENT_NAME,
                // appClientSecret: CLIENT_SECRET,
                loginRedirectUri: "https://marketplace-app-3.twenty-tech.com/",
                tokenCognito: accessToken,
              };
              const res = await httpService.post(
                `${BASE_URL}/connect/code`,
                body
              );
              const tokenResponse = await httpService.post(
                `${BASE_URL}/connect/token_service`,
                {
                  code: res.data.data,
                  fcmToken: currentToken,
                }
              );
              setTokenService(tokenResponse?.data?.data);
              setLoadingData(false);
            } else {
              setLoadingData(false);

              console.log(
                "No registration token available. Request permission to generate one."
              );
            }
          })
          .catch((err) => {
            setLoadingData(false);

            console.log("An error occurred while retrieving token. ", err);
            // ...
          });
        // } else {
        //   console.error("Permission not granted for Notification");
        // }
      } catch (error) {
        setLoadingData(false);

        console.error("Error getting permission", error);
      }
    };
    if (accessToken) {
      requestPermission();
    }
  }, [accessToken]);

  useEffect(() => {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
    });
  }, []);

  const sendNoti = async () => {
    if (!tokenService) {
      alert("Don't have permission");
      return;
    }
    setLoadingNoti(true);
    const body = {
      title: noti.title || "Notification Title",
      subTitle: "Notification Subtitle",
      imageUrl: "https://example.com/image.png",
      body: noti.body || "This is the body of the notification.",
      data: '{"key":"value"}',
      type: "DEFAULT",
      userId: "2",
      token: tokenService,
    };

    await axios
      .post(`${BASE_URL}/notification-logs/send-noti`, body, {
        headers: tokenService,
      })
      .then((res) => {
        console.log(res);
        setNoti({
          title: "",
          body: "",
        });
        setLoadingNoti(false);
        alert("Send noti success");
        // setData(res.data);
      })
      .catch((err) => {
        setLoadingNoti(false);
        console.log(err);
      });
  };

  if (loadingData) {
    return <span>Loading...</span>;
  }

  const handleLogin = async () => {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: userInfoLogin.username,
        PASSWORD: userInfoLogin.password,
      },
    };
    try {
      const command = new InitiateAuthCommand(params);
      const { AuthenticationResult } = await cognitoClient.send(command);
      // const session = await signInAws(userInfoLogin.username, userInfoLogin.password);
      console.log("Log in successful", AuthenticationResult);
      if (AuthenticationResult) {
        // sessionStorage.setItem("idToken", AuthenticationResult.IdToken || '');
        // sessionStorage.setItem("accessToken", AuthenticationResult.AccessToken || '');
        // sessionStorage.setItem("refreshToken", AuthenticationResult.RefreshToken || '');
        setIsLogged(true);
        httpService.saveTokenStorage(AuthenticationResult.AccessToken || "");
      }
    } catch (error) {
      alert(`Sign in failed: ${error}`);
    }
  };

  const handleSignUp = async () => {
    console.log(CLIENT_ID, "CLIENT_ID");
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
    // if (password !== confirmPassword) {
    //   alert('Passwords do not match');
    //   return;
    // }
    try {
      const command = new SignUpCommand(params);
      console.log(command, "command");
      const response = await cognitoClient.send(command);
      setIsSendCode(true);
      console.log(response, "response");
      // await signUpAws(userInfoLogin.email, userInfoLogin.password);
    } catch (error) {
      alert(`Sign up failed: ${error}`);
    }
  };

  const handleConfirmSignUp = async () => {
    const params = {
      ClientId: CLIENT_ID,
      Username: userInfoLogin.username,
      ConfirmationCode: userInfoLogin.code,
    };
    try {
      const command = new ConfirmSignUpCommand(params);
      await cognitoClient.send(command);
      console.log("User confirmed successfully");
      setIsSendCode(false);
      setSignup(false);
      return true;
    } catch (error) {
      console.error("Error confirming sign up: ", error);
      throw error;
    }
  };

  const logout = () => {
    setIsLogged(false);
    httpService.clearAuthStorage();
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 70,
          backgroundColor: "#2E7D32",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "center",
          paddingTop: 12,
        }}
      >
        <div>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              {
                label: "Home",
                href: "https://marketplace-mvp.twenty-tech.com/",
              },
              {
                label: "Todos",
                href: "https://marketplace-mvp.twenty-tech.com/",
              },
            ].map((el) => {
              return (
                <li key={el.label}>
                  <a
                    href={el.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    {el.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="container" style={{ padding: 12, paddingLeft: 92 }}>
        <div
          style={{
            borderRadius: "8px",
            border: "1px solid #f1f1f1",
            padding: 8,
          }}
        >
          {isLogged && (
            <Fragment>
              <h2 style={{ marginBottom: 8, marginTop: 0 }}>app Monday</h2>
              <h3 style={{ marginBottom: 8, marginTop: 0 }}>
                Welcome: {isLogged ? user?.email : "-"}
              </h3>
            </Fragment>
          )}
          {isLogged ? (
            <span>You are logged</span>
          ) : (
            <h3>
              {isSignup ? "Signup" : isSendCode ? "Verify code" : "Login"}{" "}
            </h3>
          )}

          {!isLaunchFromApp && !isLogged && (
            <Fragment>
              {isSendCode ? (
                <div style={{ marginBottom: 2 }}>
                  <div>Verify code</div>
                  <input
                    placeholder="Enter code"
                    value={userInfoLogin.code}
                    onChange={(e) =>
                      setUserInfoLogin((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                  />
                </div>
              ) : (
                <div style={{ marginBottom: 2 }}>
                  <div>
                    <div>Username</div>
                    <input
                      placeholder="Enter username"
                      value={userInfoLogin.username}
                      onChange={(e) =>
                        setUserInfoLogin((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {isSignup && (
                    <div>
                      <div>Email</div>
                      <input
                        placeholder="Enter email"
                        value={userInfoLogin.email}
                        onChange={(e) =>
                          setUserInfoLogin((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                  <div>
                    <div>Password</div>

                    <input
                      placeholder="Enter password"
                      type="password"
                      value={userInfoLogin.password}
                      onChange={(e) =>
                        setUserInfoLogin((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              {!isLogged && (
                <button onClick={isSignup ? handleSignUp : handleLogin}>
                  Submit
                </button>
              )}

              {!isLogged && isSendCode && (
                <button onClick={handleConfirmSignUp}>Verify code</button>
              )}
              {!isLogged && (
                <button
                  onClick={() => setSignup((prev) => !prev)}
                  style={{ marginLeft: 6 }}
                >
                  {!isSignup ? "Create an account" : "Login"}
                </button>
              )}
            </Fragment>
          )}
          {isLogged && <button onClick={logout}>Logout</button>}
        </div>
        <h2>Push Notification:</h2>
        {/* <button onClick={() => handleConnectApp(0)}>mockapp</button> */}

        {isLogged && (
          <>
            {" "}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 8,
                marginTop: 12,
              }}
            >
              <div
                style={{
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #f1f1f1",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  marginBottom: "10px",
                }}
              >
                <input
                  placeholder="Enter title noti"
                  value={noti.title}
                  onChange={(e) =>
                    setNoti((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
                <input
                  placeholder="Enter body noti"
                  value={noti.body}
                  onChange={(e) =>
                    setNoti((prev) => ({
                      ...prev,
                      body: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <button disabled={loadingNoti} onClick={sendNoti}>
              Send noti
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
