/**
 DAO can build by installing Host Agent GitHub App and emitting `IUnitPool` by pool key of `IUnitEmitData`
 */

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
      [unitId: string]: IGithubIssueV2[];
    };
    repos: {
      [repo: string]: {
        openIssues: number;
        private: boolean;
        access?: IGithubUser[];
        stars?: number;
      };
    };
  };
}
