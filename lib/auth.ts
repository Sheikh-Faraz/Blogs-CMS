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