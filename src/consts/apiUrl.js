// export const BASE_URL = "http://103.143.142.245:9035/api/v1";
export const BASE_URL = process.env.REACT_APP_BASE_URL

// ImportAPIURL
export const APP_INTEGRATION_URL = `${BASE_URL}/app-integration`;
export const AUTH_URL = `${BASE_URL}/auth`;
export const UPLOAD = `${BASE_URL}/upload/single`;
export const CONNECT_CODE = `${BASE_URL}/connect/code`
export const CONNECT_TOKEN = `${BASE_URL}/connect/token_service`
