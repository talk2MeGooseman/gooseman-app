import PatreonCredentials from '../credentials/patreon';
import { IOAuthCredentials } from '../interfaces/IGraphql.interface';
import axios from 'axios';
import { isNil } from 'ramda';

export class PatreonClient {
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

    const response = await axios.get('https://www.patreon.com/api/oauth2/api/campaigns/4776554/pledges?include=patron&page%5Bcount%5D=50&fields%5Bpledge%5D=total_historical_amount_cents,status', { headers: { Authorization: `Bearer ${this.credentials?.accessToken}` } });
    // const response = await this.patreonClient.get(
    //   'campaigns/4776554/members?include=user,currently_entitled_tiers&fields%5Bmember%5D=full_name,is_follower,lifetime_support_cents,currently_entitled_amount_cents,patron_status&fields%5Btier%5D=amount_cents,created_at,description,patron_count,title,url&fields%5Buser%5D=full_name,about,image_url,url'
    // );

    return response.data;
  }

  public async me() {
    if (await this.isPatreonTokenExpired()) {
      await this.refreshPatreonToken();
    }

    const response = await this.patreonClient.get(
      'identity?include=campaign&fields%5Buser%5D=about,created,first_name,full_name,image_url,last_name,thumb_url,url,vanity&fields%5Bcampaign%5D=summary,url,patron_count,creation_name'
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
    if (isNil(this.credentials?.accessToken) ||
      isNil(this.credentials?.refreshToken))
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
    const response = await axios.post(`https://www.patreon.com/api/oauth2/token?grant_type=refresh_token&refresh_token=${this.credentials.refreshToken}&client_id=${PatreonCredentials.clientId}&client_secret=${PatreonCredentials.clientSecret}`);

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
