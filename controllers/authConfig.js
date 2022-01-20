const msalConfig = {
    auth: {
        clientId: "d58dbe18-0432-4757-bc6f-7fd4cf9e1d99",
        authority: "https://login.microsoftonline.com/253861ec-a123-4b78-b200-9c73c3a2bf21/",
        redirectUri: "http://localhost:8000/form-test",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
const loginRequest = {
    scopes: ["openid", "profile", "User.Read", "User.ReadWrite"]
};

// Add here scopes for access token to be used at MS Graph API endpoints.
const tokenRequest = {
    scopes: ["Mail.Read"]
};