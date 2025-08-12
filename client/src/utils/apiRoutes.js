export const HOST = import.meta.env.VITE_API_URL;

export const AUTH_ROUTE = `${HOST}/api/auth`;

// not-used
export const CHECK_USER = `${AUTH_ROUTE}/check-user`;

export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const GET_USER_INFO = `${AUTH_ROUTE}/userinfo`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/update-profile`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;