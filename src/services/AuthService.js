import { UserManager, WebStorageStateStore } from "oidc-client";

export default class AuthService {

    constructor() {
        const AUTH0_DOMAIN = "https://dev.dfil-tech.eu/aac-hera"; // e.g. https://jerrie.auth0.com
        const settings = {
            userStore: new WebStorageStateStore({ store: window.localStorage }),
            authority: AUTH0_DOMAIN,
            client_id: "939da13d-1cd1-49c8-9a33-e776a8cb06ff", // hera client_id
            //client_id: "939da13d-1cd1-49c8-9a33-e776a8cb06ff", // localhost client_id for development
            redirect_uri: "https://dev.dfil-tech.eu/hera-contract-portal/static/callback.html", //hera callback
            //redirect_uri: "http://locahost:8000/static/callback.html", //localhost callback for dev
            response_type: "token id_token",
            scope: "profile openid",
            post_logout_redirect_uri: "https://dev.dfil-tech.eu/hera-contract-portal/", //hera redirect
            //post_logout_redirect_uri: "http://locahost:8000/", //localhost redirect for dev
            filterProtocolClaims: true,
            metadata: {
                issuer: AUTH0_DOMAIN + "/",
                authorization_endpoint: AUTH0_DOMAIN + "/eauth/authorize",
                end_session_endpoint: AUTH0_DOMAIN + "/v2/logout",
                jwks_uri: AUTH0_DOMAIN + "/.well-known/openid-configuration",
            }
        };
        this.userManager = new UserManager(settings);
    }
    getUser() {        
        return this.userManager.getUser();
    }
    getAccessToken() {        
        let userInfo = this.userManager.getUser();
        return userInfo.access_token;
    }
    login() {
        return this.userManager.signinRedirect();
    }
    logout() {
        return this.userManager.signoutRedirect();
    }
}
