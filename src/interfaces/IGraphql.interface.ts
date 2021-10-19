import { PatreonClient } from "lib/PatreonClient";

export interface IContext {
  twitchClient?: any,
  patreonClient?: PatreonClient,
}

export interface ArgumentsWithId {
  id: string
  [propName: string]: any;
}

export interface ArgumentsWithName {
  name: string
  [propName: string]: any;
}

export interface ArgumentsWithIds {
  ids: [string]
  [propName: string]: any;
}

export interface ArgumentsWithNames {
  names: [string]
  [propName: string]: any;
}

export interface RequestContext extends IContext {
  twitchClient: any,
}

export interface IInclude {
  attributes: any,
  id: string,
  type: string
}

export interface IPatreonUser {
  about: string
  fullName: string
  id: string
  imageUrl: string
  url: string
}

export interface IOAuthCredentials {
  expiresIn?: any;
  obtainmentTimestamp?: number;
  accessToken: string
  refreshToken: string
  onTokenRefresh?: (credentials: IOAuthCredentials) => Promise<any>
}

export interface GqlContext {
  twitchCreds?: IOAuthCredentials
  patreonCreds?: IOAuthCredentials
}
