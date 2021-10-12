export interface IContext {
  twitchClient?: any,
  patreonClient?: any,
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
