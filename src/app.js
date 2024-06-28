import "./App.css";
import { useAuth } from "app-launcher-auth";
import React, { Fragment, useEffect, useState } from "react";
// import AuthService from "./services/authServices";

import axios from "axios";
function App() {
  const { isLogged, user, loginPopup, loading, logout, isLaunchFromApp } =
    useAuth();
  const [data, setData] = useState([]);
  const appId = process.env.REACT_APP_APP_ID || 0;
  const dataMock = [
    {
      appClientId:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseHEwYnp5djAwMGoxd3psZHZ6amIxN3oiLCJpYXQiOjE3MTkwNTM5NDMsImV4cCI6MTcyMTY0NTk0M30.hVXQC-Q0FRFZ14N0L0we1NTy_ZsgPkrHdSePhjLCxPc",
      appClientName:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseHEwYnp5djAwMGoxd3psZHZ6amIxN3oiLCJpYXQiOjE3MTkwNTM5NDMsImV4cCI6MTcyMTY0NTk0M30.hVXQC-Q0FRFZ14N0L0we1NTy_ZsgPkrHdSePhjLCxPc",
      appClientSecret:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseHEwYnp5djAwMGoxd3psZHZ6amIxN3oiLCJpYXQiOjE3MTkwNTM5NDMsImV4cCI6MTcyMTY0NTk0M30.hVXQC-Q0FRFZ14N0L0we1NTy_ZsgPkrHdSePhjLCxPc",
      loginRedirectUri: "",
      fakeDataUrl: "https://pokeapi.co/api/v2/pokemon/ditto",
    },
    {
      appClientId:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseG9pN3gxYzAwMDFidmduMTJkNWswbm0iLCJpYXQiOjE3MTg5NjMwNTMsImV4cCI6MTcyMTU1NTA1M30.M_5PaxyjbFdgajZgnwGhJVl-1g_3XzZ8rLxX8XrApL0",
      appClientName:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseG9pN3gxYzAwMDFidmduMTJkNWswbm0iLCJpYXQiOjE3MTg5NjMwNTMsImV4cCI6MTcyMTU1NTA1M30.M_5PaxyjbFdgajZgnwGhJVl-1g_3XzZ8rLxX8XrApL0",
      appClientSecret:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseG9pN3gxYzAwMDFidmduMTJkNWswbm0iLCJpYXQiOjE3MTg5NjMwNTMsImV4cCI6MTcyMTU1NTA1M30.M_5PaxyjbFdgajZgnwGhJVl-1g_3XzZ8rLxX8XrApL0",
      loginRedirectUri: "",
      fakeDataUrl: "https://pokeapi.co/api/v2/pokemon/ditto",
    },
    {
      appClientId:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseG9pN3gxYzAwMDFidmduMTJkNWswbm0iLCJpYXQiOjE3MTg5NjMwNTMsImV4cCI6MTcyMTU1NTA1M30.M_5PaxyjbFdgajZgnwGhJVl-1g_3XzZ8rLxX8XrApL0",
      appClientName:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseG9pN3gxYzAwMDFidmduMTJkNWswbm0iLCJpYXQiOjE3MTg5NjMwNTMsImV4cCI6MTcyMTU1NTA1M30.M_5PaxyjbFdgajZgnwGhJVl-1g_3XzZ8rLxX8XrApL0",
      appClientSecret:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseG9pN3gxYzAwMDFidmduMTJkNWswbm0iLCJpYXQiOjE3MTg5NjMwNTMsImV4cCI6MTcyMTU1NTA1M30.M_5PaxyjbFdgajZgnwGhJVl-1g_3XzZ8rLxX8XrApL0",
      loginRedirectUri: "",
      fakeDataUrl: "https://pokeapi.co/api/v2/pokemon/ditto",
    },
  ];

  const handleConnectApp = async (appId) => {
    const token = localStorage.getItem("token");
    const body = {
      tokenCognito: token,
      appClientId: dataMock[appId].appClientId,
      appClientName: dataMock[appId].appClientName,
      appClientSecret: dataMock[appId].appClientSecret,
      loginRedirectUri: dataMock[appId].loginRedirectUri,
    };
    const res = await axios.post(
      "http://103.143.142.245:9035/api/v1/connect/code",
      body
    );
    await axios.post(
      "http://103.143.142.245:9035/api/v1/connect/token_service",
      {
        code: res.data.data,
      }
    );
    await axios
      .get(dataMock[appId].fakeDataUrl)
      .then((res) => {
        console.log(res);
        setData(res.data);
      })
      .catch();
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 8,
            marginTop: 12,
          }}
        >
          {appId === "0" &&
            data?.abilities?.map((el) => {
              return (
                <div
                  key={el.id}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #f1f1f1",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span>Name: {el.ability.name}</span>
                  <span>url: {el.ability.url}</span>
                </div>
              );
            })}
          {appId === "1" &&
            data?.game_indices?.map((el) => {
              return (
                <div
                  key={el.id}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #f1f1f1",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span>Version: {el.version.name}</span>
                  <span>url: {el.version.url}</span>
                </div>
              );
            })}
          {appId === "2" &&
            data?.stats?.map((el) => {
              return (
                <div
                  key={el.id}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #f1f1f1",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span>Base stats: {el.base_stat}</span>
                  <span>Version: {el.stat.name}</span>
                  <span>url: {el.stat.url}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
