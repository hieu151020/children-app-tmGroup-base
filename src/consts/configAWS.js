const isDevelopment = true;
export const ROOT_URI =
  "https://marketplace.auth.ap-southeast-1.amazoncognito.com";
export const COGNITO_URI =
  "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_7wzWV6yyL";
export const WELL_KNOW =
  "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_7wzWV6yyL/.well-known/openid-configuration";
export const CLIENT_ID = "450mbafbnrds0p8e5rk3jf4jt5";
export const CLIENT_SECRET =
  "3tl8inakfht7kf2nktso58ighcr0t6v3fm9t69kh71sj3vn4htv";
export const REDIRECT_URI = isDevelopment
  ? "http://localhost:3000/login/callback"
  : `${window.location.origin}/login/callback`;
export const LOGOUT_URI = isDevelopment
  ? "http://localhost:3000/logout"
  : `${window.location.origin}/logout`;
export const LOGOUT_REDIRECT_URI = `${ROOT_URI}/logout?client_id=${CLIENT_ID}&logout_uri=${LOGOUT_URI}`;
