import { UnitStatus, UnitType } from "./host/types";

/**
 Revenue generating unit owned by a DAO.
 @interface
 */
export interface IUnit {
  /** Unique unit string id. For DeFi protocol its defiOrg:protocolKey. */
  unitId: string;
  /** Blockchains where Unit deployed. Filled only for initial DAO chain Host instance. */
  chainIds?: string[];
  /** DAO UID of Unit Developer (Pool tasks solver) */
  developerUid?: string;
}

/** Unit data that emitted, indexed and saved, translated by Host API later. */
export interface IUnitEmitData {
  /** Short name of the unit */
  name: string;
  /** Description of the unit */
  description?: string;
  /** Status of unit changes appear when unit starting to work and starting earning revenue */
  status: UnitStatus;
  /** Supported type of the Unit */
  type: UnitType;
  /** The share of a Unit's profit received by the DAO to which it belongs. 100 - 100%. */
  revenueShare: number;
  /** A unique emoji for the shortest possible representation of a Unit. */
  emoji?: string;
  /** Custom image location for Unit. When not used then DAO image used. */
  image?: string;
  /** Frontend endpoints of Unit */
  ui?: IUnitUILink[];
  /** Links to API of the Unit */
  api?: string[];
  /** Components of the Unit. */
  //components?: { [category in UnitComponentCategory]?: UnitComponent[] };
  pool?: IUnitPool;
}

export interface IUnitUILink {
  href: `https://${string}`;
  title: string;
}

/**
 * Pool of development tasks for Unit. A set of open GitHub issues.
 * @interface
 */
export interface IUnitPool {
  repos: string[];
  /** Label on github repositories identifying relation to the pool. */
  label: IGithubLabel;
  contractorSymbol?: string;
}

export interface IGithubLabel {
  name: string;
  description: string;
  color: string;
}

/** OFF-CHAIN only */
export interface IGithubUser {
  username: string;
  img: string;
}

/** OFF-CHAIN only */
export interface IGithubIssueV2 {
  repo: string;
  id: number;
  title: string;
  labels: IGithubLabel[];
  assignees: IGithubUser[];
  tasks?: {
    done: boolean;
    name: string;
    category?: string;
  }[];
  body?: string;
}
