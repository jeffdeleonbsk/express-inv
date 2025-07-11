
export interface IAuthService {
    getUserId(requestHeader: string): string | undefined;
    getToken(payload: any): string;
}
