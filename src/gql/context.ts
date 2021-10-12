import { ApiClient as TwitchClient } from '@twurple/api';
import { AccessToken, RefreshingAuthProvider } from '@twurple/auth';
import TwitchCredentials from '../credentials/twitch'
import { IContext } from '../interfaces/IGraphql.interface'
import axios from 'axios';

interface GqlContext {
  accessToken?: string,
  refreshToken?: string,
  twitchCreds?: {
    onTokenRefresh?: (credentials: AccessToken) => Promise<void>,
  },
  patreonCreds?: {
    accessToken: string,
    refreshToken: string
    onTokenRefresh?: (credentials: AccessToken) => Promise<void>,
  }
}

export default ({ accessToken, refreshToken, twitchCreds, patreonCreds } : GqlContext) => {
  const context: IContext = {};

  if (!accessToken || !refreshToken) {
    console.log("Missing TWITCH_CLIENT_ID and/or TWITCH_SECRET environment variables")
    throw new Error("Missing TWITCH_CLIENT_ID and/or TWITCH_SECRET environment variables");
  }

  const authProvider = new RefreshingAuthProvider(
    {
        clientId: TwitchCredentials.clientId,
        clientSecret: TwitchCredentials.clientSecret,
        onRefresh: (credentials) => {
          if (twitchCreds?.onTokenRefresh) {
            twitchCreds.onTokenRefresh(credentials)
          }
        }
    },
    {
      accessToken,
      refreshToken,
      expiresIn: 0,
      obtainmentTimestamp: 0
    }
  );
  context['twitchClient'] = new TwitchClient({ authProvider })

  if (patreonCreds?.accessToken && patreonCreds?.refreshToken) {
    context['patreonClient'] = axios.create({
      baseURL: 'https://www.patreon.com/api/oauth2/v2/',
      timeout: 1000,
      headers: { 'Authorization': `Bearer ${patreonCreds.accessToken}` },
    });
  }

  return context
}
