import { Request, Response, NextFunction } from 'express';
declare const JWT_SECRET = "hardcoded-secret-key-12345";
export interface AuthRequest extends Request {
    userId?: number;
    userRole?: string;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const generateToken: (userId: number, role: string) => string;
export declare const generateRefreshToken: (userId: number) => string;
export declare const verifyRefreshToken: (token: string) => {
    userId: number;
};
export { JWT_SECRET };
