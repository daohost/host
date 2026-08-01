/**
 💰 Mined Value
 @alpha
 */
export interface IMinedValue {
  id: string;
  miner: string;
  name: string;
  strategies: string[];
  profit: number;
  income: number;
  cost: number;
  time?: number;
  location?: string;
  protocols?: string[];
  description?: string;
  inputSenders?: string[];
  inputAssets?: string[];
  inputAmounts?: bigint[];
  outputReceivers?: string[];
  outputAssets?: string[];
  outputAmounts?: bigint[];
}

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

  // symbol of tradable DAO token lowercased
  dao: string;

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

  // Created artifacts IDs or other value type IDs
  made: string[];

  // Tracked value
  value: IMinedValue[];

  // workflows
  workflows: IWorkflow[];

  // bootstrapped and launched time
  takeOff?: number;

  // stop time
  complete?: number;

  // Received Artifacts IDs or other value type IDs
  received?: string[];

  // keep bot's account address used in flight
  account?: string;

  // keep bot's contract address used in flight
  contract?: string;
}

/** Bot's Service */
export interface IService extends IServiceMetaData {
  state: IServiceState;
}

export interface IServiceMetaData {
  name: string;
  version: string;
  changelog?: IChangelog;
  features?: IFeature[];
  providers?: IProvider[];
  gauges?: IGauge[];
  miniGauges?: IMiniGauge[];
  stateObjects?: IStateObject[];
  charts?: IChart[];
  activityIndicator?: IActivityIndicator;
  description?: string;
}

export interface IChangelog {
  [version: string]: string | string[];
}

export interface IServiceState {
  [key: string]:
    | number
    | string
    | boolean
    | string[]
    | object
    | undefined
    | { [leve2Key: string]: string[] };
}

/** Bot's Service feature */
export interface IFeature {
  name: string;
  status: FeatureStatus;
  image?: string;
  description?: string;
  level?: number;
  blockedBy?: string[];
  issues?: string[] | number[];
}

export enum FeatureStatus {
  LIVE = "Live",
  BATTLE_TEST = "Battle test",
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
  showInFlightWindow?: boolean;
}

export interface IGauge {
  title: string;
  stateKeyValue: string;
  redZoneStart?: number;
  yellowZoneStart?: number;
  subTitle?: string;
  stateKeySubValue?: string;
  description?: string;
  showInFlightWindow?: boolean;
}

export interface IMiniGauge {
  title: string;
  stateKeyValue: string;
  redZoneStart?: number;
  yellowZoneStart?: number;
  description?: string;
  showInFlightWindow?: boolean;
}

export interface IStateObject {
  title: string;
  stateKey: string;
  description?: string;
  goodOrBad?: boolean;
  showInFlightWindow?: boolean;
  categories?: IStateObjectItemCategory[];
}

export interface IStateObjectItemCategory {
  name: string;
  reasons: string[];
  description?: string;
  color?: string;
}

export interface IChart {
  title: string;
  workflowKey: string[];
  workflowValueIndex: (number | "all")[];
  subTitle?: string;
  description?: string;
  showInFlightWindow?: boolean;
  lines?: {
    name: string;
    value: number;
    color?: `#${string}`;
  }[];
}

export interface IActivityIndicator {
  /** Title shows on mouse over */
  title: string;
  /** Good/bad, green/red, etc. indicator */
  booleanStateKey?: string;
  /** State key with color of indicator */
  colorStateKey?: string;
  /** Impulse triggered by workflow item */
  impulseWorkflowKey?: string;
  /** Waiting / ready triggered status by workflow item */
  waitingOrReadyWorkflowKey?: string;
}

export interface IWorkflow {
  /** Unique ID of workflow, as example block number */
  id: string;
  /** Compact storage of workflow items. Format: time:name:any_data */
  items: string[];
}
