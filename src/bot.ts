/**
 🤖 Bot
 @alpha
 */
export interface IBot {
  // software name and version
  software: string;

  description?: string;

  services: {
    [serviceName: string]: IServiceMetaData;
  };
}

/**
 🚀 Bot session
 @alpha
 */
export interface IFlight {
  // unique flight id
  id: string;

  // human readable flight status string
  status: string;

  // software name and version
  software: string;

  // dashboard gauges
  dashboard: {
    [title: string]: {
      [key: string]: string;
    };
  };

  // synced state of services
  services: {
    [serviceName: string]: IServiceState;
  };

  // not default settings
  settings: {
    [envSetting: string]: string;
  };

  // roles of bot in this flight
  roles: string[];

  // Service constructor time (ms)
  created: number;

  // last update time (ms)
  time: number;

  // bootstrapped and launched time
  takeOff?: number;

  // stop time
  complete?: number;

  // Created artifacts IDs or other value type IDs
  made: string[];

  // Received Artifacts IDs or other value type IDs
  received?: string[];

  // workflows
  workflows: IWorkflow[];
}

/** Bot's Service */
export interface IService extends IServiceMetaData {
  state: IServiceState;
}

export interface IServiceMetaData {
  name: string;
  version: string;
  features: IFeature[];
  providers?: IProvider[];
  gauges?: IGauge[];
  miniGauges?: IMiniGauge[];
  stateObjects?: IStateObject[];
  description?: string;
}

export interface IServiceState {
  [key: string]: number | string | boolean | string[] | object | undefined;
}

/** Bot's Service feature */
export interface IFeature {
  name: string;
  status: FeatureStatus;
  image?: string;
  description?: string;
}

export enum FeatureStatus {
  LIVE = "Live",
  DEVELOPMENT = "Development",
  BACKLOG = "Backlog",
}

export interface IProvider {
  name: string;
  image?: string;
  plan?: string;
  stateKeyCalls?: string;
  stateKeyCost?: string;
  description?: string;
}

export interface IGauge {
  title: string;
  stateKeyValue: string;
  subTitle?: string;
  stateKeySubValue?: string;
  description?: string;
}

export interface IMiniGauge {
  title: string;
  stateKeyValue: string;
  description?: string;
}

export interface IStateObject {
  title: string;
  stateKey: string;
  description?: string;
}

export interface IWorkflow {
  /** Unique ID of workflow, as example block number */
  id: string;
  /** Compact storage of workflow items. Format: time:name:any_data */
  items: string[];
}
