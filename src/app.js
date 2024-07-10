import "./App.css";
import { httpService, useAuth } from "app-launcher-auth";
import React, { Fragment, useEffect, useState } from "react";
// import AuthService from "./services/authServices";
import axios from "axios";
import { getToken, messaging } from "./helpers/firebase";
import { getMessaging, onMessage } from "firebase/messaging";
import { useSearchParams } from "react-router-dom";

function App() {
  const { isLogged, user, loginPopup, loading, logout, isLaunchFromApp } =
    useAuth();
  const [data, setData] = useState([]);
  const [param] = useSearchParams();
  const token = param.get("token");
  console.log(param, token, "param");
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          getToken(messaging, {
            vapidKey:
              "BEWDYnw8VUtOpgQ8_aZFctLrSusm3EnDVCEo-tq9JYUnJe7n38-qA1cT_xBs1A9w3l3QqWhfbCZyINYbAQABFr4",
          })
            .then((currentToken) => {
              if (currentToken) {
                console.log(currentToken, "currentToken");
              } else {
                console.log(
                  "No registration token available. Request permission to generate one."
                );
              }
            })
            .catch((err) => {
              console.log("An error occurred while retrieving token. ", err);
              // ...
            });
        } else {
          console.error("Permission not granted for Notification");
        }
      } catch (error) {
        console.error("Error getting permission", error);
      }
    };
    requestPermission();
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
    });
  }, []);

  const handleConnectApp = async () => {
    const token = localStorage.getItem("token");
    const body = {
      appClientId:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseHEwYnp5djAwMGoxd3psZHZ6amIxN3oiLCJpYXQiOjE3MTkwNTM5NDMsImV4cCI6MTcyMTY0NTk0M30.hVXQC-Q0FRFZ14N0L0we1NTy_ZsgPkrHdSePhjLCxPc",
      appClientName:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseHEwYnp5djAwMGoxd3psZHZ6amIxN3oiLCJpYXQiOjE3MTkwNTM5NDMsImV4cCI6MTcyMTY0NTk0M30.hVXQC-Q0FRFZ14N0L0we1NTy_ZsgPkrHdSePhjLCxPc",
      appClientSecret:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseHEwYnp5djAwMGoxd3psZHZ6amIxN3oiLCJpYXQiOjE3MTkwNTM5NDMsImV4cCI6MTcyMTY0NTk0M30.hVXQC-Q0FRFZ14N0L0we1NTy_ZsgPkrHdSePhjLCxPc",
      loginRedirectUri: "",
      DataUrl: "http://103.143.142.245:9035/api/v1/app-intergration",
    };
    const res = await axios.post(
      "http://103.143.142.245:9035/api/v1/connect/code",
      body
    );
    await axios.post(
      "http://103.143.142.245:9035/api/v1/connect/token_service",
      {
        code: res.data.data,
        // fcmToken,
      }
    );
    await axios
      .get(body.DataUrl)
      .then((res) => {
        console.log(res);
        setData(res.data);
      })
      .catch();
  };

  const sendNoti = async () => {
    const body = {
      title: "Notification Title",
      subTitle: "Notification Subtitle",
      imageUrl: "https://example.com/image.png",
      body: "This is the body of the notification.",
      data: '{"key":"value"}',
      type: "DEFAULT",
    };

    await axios
      .post(
        "http://103.143.142.245:9035/api/v1/notification-logs/send-noti",
        body,
        {
          headers: token,
        }
      )
      .then((res) => {
        console.log(res);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (loading) {
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
          backgroundColor: "#2eb67d",
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
              <h2 style={{ marginBottom: 8, marginTop: 0 }}>MOCK APP</h2>
              <h3 style={{ marginBottom: 8, marginTop: 0 }}>
                Welcome: {isLogged ? user?.email : "-"}
              </h3>
            </Fragment>
          )}
          <span style={{ marginBottom: 0 }}>Logged: {`${isLogged}`}</span>

          {!isLaunchFromApp && (
            <Fragment>
              {!isLogged && <button onClick={loginPopup}>Login</button>}
              {isLogged && <button onClick={logout}>Logout</button>}
            </Fragment>
          )}
        </div>
        <h2>Todos:</h2>
        <button onClick={() => handleConnectApp(0)}>mockapp</button>
        <button onClick={sendNoti}>Send noti</button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 8,
            marginTop: 12,
          }}
        >
          {data && (
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                border: "1px solid #f1f1f1",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {data}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
