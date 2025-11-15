const isProduction = process.env.NODE_ENV === "production";

export const cookiesOptions = {
  secure: isProduction,
  httpOnly: true,
  sameSite: isProduction ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};
