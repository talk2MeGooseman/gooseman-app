import { ApiClient as TwitchClient } from 'twitch';
import { AccessToken, RefreshableAuthProvider, StaticAuthProvider } from 'twitch-auth';
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

  const authProvider = new RefreshableAuthProvider(
    new StaticAuthProvider(TwitchCredentials.clientId, accessToken),
    {
        clientSecret: TwitchCredentials.clientSecret,
        refreshToken,
        onRefresh: (credentials) => {
          if (twitchCreds?.onTokenRefresh) {
            twitchCreds.onTokenRefresh(credentials)
          }
        }
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
