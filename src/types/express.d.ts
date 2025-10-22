declare module 'express' {
  interface Request {
    // Cookie properties
    cookies?: {
      [key: string]: string;
    };
    signedCookies?: {
      [key: string]: any;
    };

    // User property untuk JWT (optional)
    user?: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
  }
}
