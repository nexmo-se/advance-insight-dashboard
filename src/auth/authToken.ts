import { useCallback, useEffect, useState } from "react";
import { generateToken } from "opentok-jwt";
import { DateTime } from "luxon";
import {useSession} from '../components/SessionProvider'
import {IOpentokJWT} from './types'

export const useAuthToken = () => {
  const [jwt, setJWT] = useState<IOpentokJWT>({account: '', project: ''});
  const { apiKey, apiSecret } = useSession();

  const generateJwt = () => {
    if (jwt) {
        return;
    }
    if (apiKey && apiSecret) {
      const currentTime = DateTime.utc().toMillis() / 1000;
      const expires = currentTime + 300; // 5 minutes expirity
      const accountJwt = generateToken(apiKey, apiSecret, "account", expires);
      const projectJwt = generateToken(apiKey, apiSecret, "project", expires);
      setJWT({
        account: accountJwt,
        project: projectJwt,
      });
      return;
    } else {
      setJWT({account: '', project: ''});
    }
  };

  return {jwt, generateJwt};
};
