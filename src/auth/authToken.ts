import { generateToken } from "opentok-jwt";
import { DateTime } from "luxon";

export const generateJwt = (apiKey: string | null, apiSecret: string| null) : {account: string, project: string} | null => {

    if (apiKey && apiSecret) {
      const currentTime = DateTime.utc().toMillis() / 1000;
      const expires = parseInt((currentTime + 180).toFixed(0)); // 3 minutes expirity
      const accountJwt = generateToken(apiKey, apiSecret, "account", expires);
      const projectJwt = generateToken(apiKey, apiSecret, "project", expires);
      return {
        account: accountJwt,
        project: projectJwt
      }
    } else {
      return null
    }
};

// Doc: https://able.bio/AnasT/apollo-graphql-async-access-token-refresh--470t1c8