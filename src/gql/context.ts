import { ApiClient as TwitchClient } from '@twurple/api';
import { AccessToken, RefreshingAuthProvider } from '@twurple/auth';
import TwitchCredentials from '../credentials/twitch';
import PatreonCredentials from '../credentials/patreon';
import {
  GqlContext,
  IContext,
  IOAuthCredentials,
} from '../interfaces/IGraphql.interface';
import axios from 'axios';
import { isNil } from 'ramda';

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

class PatreonClient {
  private patreonClient: any;
  private credentials: IOAuthCredentials;

  constructor(patreonCreds: IOAuthCredentials) {
    this.credentials = patreonCreds;
    this.initPatreonClient();
  }

  public async getPatrons() {
    if (await this.isPatreonTokenExpired()) {
      await this.refreshPatreonToken();
    }

    const response = await this.patreonClient.get(
      'campaigns/4776554/members?include=user,currently_entitled_tiers,address&fields%5Bmember%5D=full_name,is_follower,last_charge_date,last_charge_status,lifetime_support_cents,currently_entitled_amount_cents,patron_status&fields%5Btier%5D=amount_cents,created_at,description,patron_count,title,url&fields%5Buser%5D=full_name,about,image_url,url'
    );

    return response.data;
  }

  public async me() {
    if (await this.isPatreonTokenExpired()) {
      await this.refreshPatreonToken();
    }

    const response = await this.patreonClient.get(
      'identity?include=campaign&fields%5Buser%5D=about,created,email,first_name,full_name,image_url,last_name,thumb_url,url,vanity&fields%5Bcampaign%5D=summary,url,patron_count,creation_name',
    );

    return response.data;
  }

  private initPatreonClient() {
    this.patreonClient = axios.create({
      baseURL: 'https://www.patreon.com/api/oauth2/v2/',
      timeout: 1000,
      headers: { Authorization: `Bearer ${this.credentials?.accessToken}` },
    });
  }

  private async isPatreonTokenExpired(): Promise<Boolean> {
    if (
      isNil(this.credentials?.accessToken) ||
      isNil(this.credentials?.refreshToken)
    )
      return true;

    const response = await axios.get(
      'https://www.patreon.com/api/oauth2/v2/identity',
      {
        headers: { Authorization: `Bearer ${this.credentials?.accessToken}` },
      }
    );

    return response.status === 401;
  }

  private async refreshPatreonToken() {
    const response = await axios.post(`https://www.patreon.com/api/oauth2/token?grant_type=refresh_token&refresh_token=${this.credentials.refreshToken}&client_id=${PatreonCredentials.clientId}&client_secret=${PatreonCredentials.clientSecret}`)

    const newCredentials = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      obtainmentTimestamp: Date.now(),
    };

    this.credentials = await this.credentials.onTokenRefresh(newCredentials);
    this.initPatreonClient();
  }
}

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
