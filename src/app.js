import { httpService, useAuth } from "app-launcher-auth";
import axios from "axios";
import { getMessaging, onMessage } from "firebase/messaging";
import React, { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./App.css";
import { BASE_URL } from "./consts/apiUrl";
import {
  getToken,
  messaging
} from "./consts/config";

function App() {
  const {
    isLogged,
    user,
    loginPopup,
    loading,
    logout,
    isLaunchFromApp,
    accessToken,
  } = useAuth();
  const [loadingData, setLoadingData] = useState(false);
  const [loadingNoti, setLoadingNoti] = useState(false);
  const [noti, setNoti] = useState({
    title: "",
    body: "",
  });
  const [tokenService, setTokenService] = useState();
  const [param] = useSearchParams();
  const token = param.get("token");
  const appId = param.get("id");

  useEffect(() => {
    const requestPermission = async () => {
      setLoadingData(true);
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
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
        } else {
          console.error("Permission not granted for Notification");
        }
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
    if(!tokenService){
      alert("Don't have permission")
      return
    }
    setLoadingNoti(true)
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
        setLoadingNoti(false)
        alert("Send noti success");
        // setData(res.data);
      })
      .catch((err) => {
        setLoadingNoti(false)
        console.log(err);
      });
  };

  if (loading||loadingData) {
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
              <h2 style={{ marginBottom: 8, marginTop: 0 }}>app Monday</h2>
              <h3 style={{ marginBottom: 8, marginTop: 0 }}>
                Welcome: {isLogged ? user?.email : "-"}
              </h3>
            </Fragment>
          )}
          <span style={{ marginBottom: 0 }}>Logged </span>

          {!isLaunchFromApp && (
            <Fragment>
              {!isLogged && <button onClick={loginPopup}>Login</button>}
              {isLogged && <button onClick={logout}>Logout</button>}
            </Fragment>
          )}
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
            <button disabled={loadingNoti} onClick={sendNoti}>Send noti</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
