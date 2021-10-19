import { ApiClient as TwitchClient } from '@twurple/api';
import { AccessToken, RefreshingAuthProvider } from '@twurple/auth';
import TwitchCredentials from '../credentials/twitch';
import {
  GqlContext,
  IContext,
  IOAuthCredentials,
} from '../interfaces/IGraphql.interface';
import { isNil } from 'ramda';
import { PatreonClient } from '../lib/PatreonClient';

const addTwitchClientToContext = (context, twitchCreds: IOAuthCredentials) => {
  const authProvider = new RefreshingAuthProvider(
    {
      clientId: TwitchCredentials.clientId,
      clientSecret: TwitchCredentials.clientSecret,
      onRefresh: (credentials) => {
        if (twitchCreds?.onTokenRefresh) {
          twitchCreds.onTokenRefresh(credentials);
        }
      },
    },
    {
      accessToken: twitchCreds?.accessToken,
      refreshToken: twitchCreds?.refreshToken,
      expiresIn: 0,
      obtainmentTimestamp: 0,
    }
  );
  context['twitchClient'] = new TwitchClient({ authProvider });
};

const addPatreonClientToContext = (
  context,
  patreonCreds: IOAuthCredentials
) => {
  if (isNil(patreonCreds?.accessToken) || isNil(patreonCreds?.refreshToken))
    return context;

  context['patreonClient'] = new PatreonClient(patreonCreds);

  return context;
};

const createGqlContext = ({ twitchCreds, patreonCreds }: GqlContext) => {
  const context: IContext = {};

  addTwitchClientToContext(context, twitchCreds);
  addPatreonClientToContext(context, patreonCreds);

  return context;
};

export default createGqlContext;
