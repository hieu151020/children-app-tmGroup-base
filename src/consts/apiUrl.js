import { isDevelopment } from "consts/index";

const ROOT_URL = `${
  isDevelopment ? "http://103.104.122.210:10000" : window.location.origin
}/api`;
export const BASE_URL = "http://103.143.142.245:9035/api/v1";

// Dont remove this command
// ImportAPIURL
export const APP_MANAGEMENT_URL = `${ROOT_URL}/app-management`;
// export const APP_INTEGRATION_URL = `${ROOT_URL}/app-integration`;
export const APP_INTEGRATION_URL = `${BASE_URL}/app-integration`;
export const USER_URL = `${ROOT_URL}/user`;
export const PLATFORM_URL = `${ROOT_URL}/platform-management`;
export const LIST_NEW = `${ROOT_URL}/posts`;
export const AUTH_URL = `${BASE_URL}/auth`;
export const UPLOAD = `${BASE_URL}/upload/single`;
