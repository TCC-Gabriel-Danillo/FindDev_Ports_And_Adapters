import Constants from "expo-constants";

// GIT
export const GIT_CLIENT_SECRET = Constants?.manifest?.extra?.git_cliet_secret;
export const GIT_CLIENT_ID = Constants?.manifest?.extra?.git_client_id;
export const GIT_AUTHORIZATION_ENDPOINT = Constants?.manifest?.extra?.git_authorization_endpoint;
export const GIT_TOKEN_ENDPOINT = Constants?.manifest?.extra?.git_token_endpoint;
export const GIT_REVOCATION_ENDPOINT = Constants?.manifest?.extra?.git_revocation_endpoint;