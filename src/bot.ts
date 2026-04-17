/**
 🚀 Bot session
 @alpha
 */
export interface IFlight {
  // unique flight id
  id: string;

  // human readable flight status string
  status: string;

  // software used
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

export interface IServiceState {
  [key: string]: number | string | boolean | string[] | object | undefined;
}

/** Bot's Service or Module feature */
export interface IFeature {
  name: string;
  status: FeatureStatus;
}

export enum FeatureStatus {
  LIVE = "Live",
  DEVELOPMENT = "Development",
  BACKLOG = "Backlog",
}

export interface IWorkflow {
  /** Unique ID of workflow, as example block number */
  id: string;
  /** Compact storage of workflow items. Format: time:name:any_data */
  items: string[];
}
