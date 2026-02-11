/**
 BUILDER activity.
 BUILDER is a team of engineers managed by DAOs.
 */

import { UnitComponentCategory } from "../host/types";

/**
 BUILDER data.

 @alpha
 @interface
 */
export interface IBuilderActivity {
  /** Safe multisig account of dev team */
  multisig: string[];
  /** Tracked Github repositories where development going on */
  /** @deprecated Use repos in IUnitPool  */
  repo?: string[];
  /** Engineers */
  workers: IWorker[];
  /** Conveyors of unit components. */
  /** @deprecated Use IUnitPool  */
  conveyors?: IConveyor[];
  /** Pools of development tasks. */
  /** @deprecated Use IUnitPool  */
  pools?: IPool[];
  /** Total salaries paid */
  /** @deprecated remove for simplifying  */
  burnRate: {
    /** Period of burning. Can be 1 month or any other. */
    period: string;
    /** How much USD was spent during period. */
    usdAmount: number;
  }[];
}

/**
 Engineer hired by a DAO. Can be human or machine (AI agent).

 @alpha
 @interface
 */
export interface IWorker {
  /** Github username */
  github: string;
  /** USD hourly rate */
  rate?: number;
  /** USD xTOKEN hourly rate */
  xRate?: number;
}

/**
 * Pool of development tasks. A set of open github issues.
 * @deprecated Use IUnitPool
 * @interface
 */
export interface IPool {
  /** Pool is always linked to a set of units. */
  unitIds: string[];
  /** Short name of the pool. */
  name: string;
  /** Label on github repositories identifying relation to the pool. */
  label: IGithubLabel;
  /** What need to be done by the pool? */
  description?: string;
  /** Each solved task in the pool must have an artifact of specified type. */
  artifacts?: ArtifactType[];
}

/**
 * Pool of development tasks for Unit. A set of open github issues.
 * @interface
 */
export interface IUnitPool {
  repos: string[];
  /** Label on github repositories identifying relation to the pool. */
  label: IGithubLabel;
  contractorSymbol?: string;
}

/**
 * Conveyor belt for building a components for units.
 * @deprecated All development work goes through IUnitPool for simplifying
 * @interface
 */
export interface IConveyor {
  /** Linked unit */
  unitId: string;
  componentCategory: UnitComponentCategory;
  name: string;
  symbol: string;
  type: string;
  label: IGithubLabel;
  description: string;
  issueTitleTemplate: string;
  taskIdIs: string;
  steps: IConveyorStep[];
}

export interface IGithubLabel {
  name: string;
  description: string;
  color: string;
}

export interface IGithubUser {
  username: string;
  img: string;
}

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

/** @deprecated Use IUnitPool only */
export const enum ArtifactType {
  URL_UI = "URL to UI page",
  URL_RELEASE = "Github package release link",
  DEPLOYMENT_ADDRESSES = "Deployment addresses",
  URL_API = "API endpoint",
  URL_STATIC = "Static content URL",
  CONTRACT_ADDRESS = "Address of deployed contract",
}

/** @deprecated Use IUnitPool only */
export interface IConveyorStep {
  name: string;
  issues: {
    repo: string;
    taskList?: string[];
    issueTemplate?: string;
    body?: string;
    generator?: string;
  }[];
  artifacts?: ArtifactType[];
  result?: string;
  guide?: string;
}

/** @deprecated Use IBuildersMemoryV3 */
export interface IBuildersMemoryV2 {
  [tokenSymbol: string]: {
    openIssues: {
      total: { [repo: string]: number };
      pools: { [poolName: string]: IGithubIssueV2[] };
    };
    conveyors: {
      [conveyorName: string]: {
        [taskId: string]: {
          [stepName: string]: IGithubIssueV2[];
        };
      };
    };
  };
}

export interface IBuildersMemoryV3 {
  [tokenSymbol: string]: {
    openIssues: {
      [unitId: string]: IGithubIssueV2[],
    };
    repos: {
      [repo: string]: {
        openIssues: number,
        private: boolean,
        access?: IGithubUser[],
        stars?: number,
      },
    },
  };
}
