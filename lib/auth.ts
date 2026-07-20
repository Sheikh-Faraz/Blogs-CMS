// import jwt, { JwtPayload } from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET;

// if (!JWT_SECRET) {
//   throw new Error("JWT_SECRET is not defined in environment variables");
// }

// // Define the shape of your token payload
// interface TokenPayload extends JwtPayload {
//   userId: string;
// }

// export const generateToken = (userId: string): string => {
//   return jwt.sign({ userId }, JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// export const verifyToken = (token: string): TokenPayload | null => {
//   try {
//     return jwt.verify(token, JWT_SECRET) as TokenPayload;
//   } catch {
//     return null;
//   }
// };




import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

interface TokenPayload extends JWTPayload {
  userId: string;
}

// Generate JWT
export const generateToken = async (
  userId: string
): Promise<string> => {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
};

// Verify JWT
export const verifyToken = async (
  token: string
): Promise<TokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, secret);

    return payload as TokenPayload;
  } catch {
    return null;
  }
};