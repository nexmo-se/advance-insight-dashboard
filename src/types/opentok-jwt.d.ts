declare module "opentok-jwt" {
  export function generateToken(
    apiKey: string,
    secret: string,
    issuerType: "account" | "project",
    expires?: number 
  ): string;
}