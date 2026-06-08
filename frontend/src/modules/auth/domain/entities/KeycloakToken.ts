
export type KeycloakToken = {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    accessTokenExpiresAt?: number;
    tokenType: string;
    scope: string;
};
