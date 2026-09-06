/**
 Bot is software with known compatible metadata to track running sessions ("flights") and generate user interface.
 */

/**
 🤖 Bot metadata.
 Default location is `metadata.json` in software folder.

 @alpha
 */
export interface IBot {
  /** Software name and version */
  software: string;

  /** Required description. What this software doing. */
  description: string;

  /** Layout and positioning of services on a flight page at https://dao.host */
  flightUI: {
    layout: FlightLayout;
    serviceNameGrid: string[][];
  };

  /** Metadata of services */
  services: {
    [serviceName: string]: IServiceMetaData;
  };
}

/**
 Flight page layout in cols x rows format for big album screens like 16x9 ratio.
 Can be used for 1-12 services.
 */
export enum FlightLayout {
  _1x1 = "_1x1",
  _2x1 = "_2x1",
  _3x1 = "_3x1",
  _3x2 = "_3x2",
  _3x3 = "_3x3",
  _4x3 = "_4x3",
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
  imagePostfix?: string;
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
