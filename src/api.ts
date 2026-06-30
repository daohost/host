import { IGithubIssueV2, IGithubUser } from "./unit";

export interface IAgentMemory {
  /** When generated */
  timestamp: number;

  /** Private memory data allow to show only overview by agent API */
  private: boolean;

  /** Memory data overview */
  overview: {
    [title: string]: string;
  };

  /** Timestamp when agent instance launched */
  started: number;

  /** EVM transaction sender */
  txSender?: {
    /** EOA */
    account: `0x${string}`;
    /** Coin balances */
    balance: {
      [chainId: string]: {
        coin: string;
        usd: number;
      };
    };
    /** Spent for gas */
    spent: {
      [date: string]: {
        txs: number;
        usd: {
          [chainId: string]: number;
        };
      };
    };
  };

  /** Data specific for agent */
  data: any;
}

export interface IHostAgentMemoryV3 extends IAgentMemory {
  data: {
    /** Prices of assets */
    prices: Prices;

    /** Total Value Locked in blockchains */
    chainTvl: { [chainId: string]: number };

    /** DAO runtime data. Updates each minute or faster. */
    daos: {
      [symbol: string]: IDAOAPIDataV2;
    };

    /** Instant Updates by subscribing to github application webhooks */
    builders: IBuildersMemoryV3;
  };
}

export interface IDAOAPIDataV2 {
  /** Price from Stability interchain oracle */
  oraclePrice: string;
  /** Coingecko price */
  coingeckoPrice?: string;
  /** Data for total revenue chart */
  revenueChart: RevenueChart;
  /** Extracted on-chain data */
  onChainData: {
    [chainId: string]: {
      stakingAPR: number;
      staked: number;
      units: {
        [unitId: string]: {
          pendingRevenueUSD: number;
          pendingRevenueAssetAmount: number;
          pendingRevenueAssetSymbol: string;
          pendingRevenueAssetAddress?: string;
        }[];
      };
      revenueTokens?: `0x${string}`[];
    };
  };
  /** Users / followers in tracked socials */
  socialUsers: {
    [socialLink: string]: number;
  };
  holders?: IDAOHolders;
}

export interface IDAOHolders {
  [addr: string]: IDAOHoldings;
}

export interface IDAOHoldings {
  address: `0x${string}`;
  balance: string;
  percentage?: string;
}

export type Prices = {
  [symbol: string]: {
    priceUsd: string;
    priceChange: number;
  };
};

export type RevenueChart = Record<number, string>;

/**
 DAO can build by installing Host Agent GitHub App and emitting `IUnitPool` by pool key of `IUnitEmitData`
 */
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
