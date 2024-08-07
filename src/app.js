import axios from "axios";
import { getMessaging, onMessage } from "firebase/messaging";
import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import { BASE_URL, CONNECT_CODE, CONNECT_TOKEN } from "./consts/apiUrl";
import {
  APP_ID,
  CLIENT_ID,
  CLIENT_NAME,
  getToken,
  LOGIN_REDIRECT_URI,
  messaging,
  VAPID_KEY_FIREBASE,
} from "./consts/config";
import { useAuth } from "./providers/authenticationProvider.tsx";
import httpServices from "./services/httpServices.ts";


function App() {
  const {
    user,
    isLaunchFromApp,
    accessToken,
    loginAws,
    signUpAws,
    confirmSignUpAws,
    isLogged,
    loading,
    logout,
  } = useAuth();

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
          vapidKey: VAPID_KEY_FIREBASE,
        })
          .then(async (currentToken) => {
            if (currentToken) {
              const body = {
                appClientId: CLIENT_ID,
                appClientName: CLIENT_NAME,
                appClientSecret: "",
                loginRedirectUri: LOGIN_REDIRECT_URI,
                tokenCognito: accessToken,
              };

              const res = await httpServices.post(CONNECT_CODE, body);
              const tokenResponse = await httpServices.post(CONNECT_TOKEN, {
                code: res.data.data,
                fcmToken: currentToken,
              });

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
            alert(`Fail to connect: ${err.response.data.messages[0]}`);
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
  }, [isLogged]);

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
      imageUrl: "",
      body: noti.body || "This is the body of the notification.",
      data: `{"type":"CHILDREN_APP","appId":"${APP_ID}"}`,
      type: "DEFAULT",
      topicId: APP_ID,
      token: tokenService,
    };

    await axios
      .post(`${BASE_URL}/notification-logs/send-noti`, body)
      .then((res) => {
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

  const handleLogin = async () => {
    await loginAws(userInfoLogin);
  };

  const handleSignUp = async () => {
    const res = await signUpAws(userInfoLogin);
    if (res) {
      setIsSendCode(true);
    }
  };

  const handleConfirmSignUp = async () => {
    await confirmSignUpAws(userInfoLogin);

    setIsSendCode(false);
    setSignup(false);
  };

  //!Render

  if (loadingData || loading) {
    return <span>Loading...</span>;
  }

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
              <h2 style={{ marginBottom: 8, marginTop: 0 }}>{CLIENT_NAME}</h2> 
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

              {!isLogged && !isSendCode && (
                <button onClick={isSignup ? handleSignUp : handleLogin}>
                  Submit
                </button>
              )}

              {!isLogged && isSendCode && (
                <button onClick={handleConfirmSignUp}>Verify code</button>
              )}
              {!isLogged && (
                <button
                  onClick={() => {
                    setSignup((prev) => !prev);
                    setIsSendCode(false);
                  }}
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
