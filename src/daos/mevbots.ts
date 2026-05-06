import { Activity } from "../activity";
import { ChainName } from "../chains";
import {
  ContractIndices,
  FundingType,
  IDAOData,
  LifecyclePhase,
  UnitStatus,
  UnitType,
} from "../host.types";
import { IMinedValue } from "../bot";

export const mevbots: IDAOData = {
  phase: LifecyclePhase.DRAFT,
  name: "MevBots Network",
  symbol: "MEVBOTS",
  socials: [],
  activity: [Activity.MEV],
  images: {
    token: "/mevbots.png",
  },
  deployments: {},
  chainSettings: {
    ["1"]: {
      bbRate: 50,
    },
  },
  initialChain: ChainName.ETHEREUM,
  units: [
    {
      unitId: "net",
    },
  ],
  params: {
    vePeriod: 180,
    pvpFee: 100,
    totalSupply: 1_000_000e18,
  },
  funding: [
    {
      type: FundingType.SEED,
      start: 1780272000, // Monday, 1 June 2026 at 0:00:00
      end: 1796083200, // Tuesday, 1 December 2026 at 0:00:00
      minRaise: 10000,
      maxRaise: 5000000,
      raised: 0,
    },
  ],
  vesting: [],
  governanceSettings: {},
  deployer: "0x0",
  salts: {
    "1": {
      // 0x999995c72dd0c41241552c9c889a93dc78d99999
      [ContractIndices.SEED_TOKEN_1]:
        "0xce4effbbe3dba0a28d68fe6584e88165ba2a39782cf737cb4864a5b02be9f6ed",
      // 0x411111111ccda11471c111a2413a3a5f31153a1a
      [ContractIndices.TGE_TOKEN_2]:
        "0x7ae69a9d46cb4ab73f53a2302cbb063d917a85b525e72fda632cdee74e3214a8",
      // 0x888889b59aaa4530d8fbda42abec985037288888
      [ContractIndices.TOKEN_3]:
        "0x8fc8bb7c859462873fd4de28df77eb5c0b992ed92e363a52e5e3bbecb6521644",
    },
  },
  metaDataLocation: "local",
  unitEmitData: [
    {
      name: "mevbots",
      description: "Network of MEV Searchers",
      status: UnitStatus.BUILDING_PROTOTYPE,
      revenueShare: 50,
      type: UnitType.MEV_SEARCHER,
      emoji: "",
      pool: {
        repos: ["daohost/mevbot"],
        label: {
          name: "MEVBOT:Ethereum",
          description: "Building MEVBOT for Ethereum chain",
          color: "#4cbaff",
        },
      },
    },
  ],
  metaData: {
    agents: [],
  },
};

/**
 ◆◆ MEVBOTS DAO Knowledge
 ◆◆◆ mevbots.net Architecture
 MevBots is a network of Maximum Extractable Value (MEV) machines.
 Nodes (bots) generates value by creating an `IMevArtifact`.
 Each artifact includes complete data to research or execute MEV opportunity.
 A bot session is represented by a public `IFlight` object.

 @todo move knowledge to separate @daohost/mev library
 */

export interface IMevMiner {
  name?: string;
  links?: string[];
  contracts: { [addr: `0x${string}`]: IMevContract };
}

export interface IMevContract {
  tag?: string;
  selectors?: { [selector: `0x${string}`]: string };
}

export const mevMiners: { [addr: `0x${string}`]: IMevMiner } = {
  ["0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13".toLowerCase()]: {
    name: "JaredFromSubway",
    contracts: {
      ["0x1f2F10D1C40777AE1Da742455c65828FF36Df387".toLowerCase()]: {
        tag: "MEV Bot 2",
      },
    },
  },
  ["0x11111215b72E894C60F24E91ac2c8cCb1D373911".toLowerCase()]: {
    name: "mevbots",
    contracts: {
      ["0x3F7F239206b2949dDcADFA4C1beb82e2E8215cFf".toLowerCase()]: {
        tag: "Test contract",
      },
    },
  },
};

/** The type of artifacts the bot obtains depends on its role */
export enum MevBotRole {
  /** 🟨 Extracts OPPORTUNITY artifacts */
  EXTRACTOR = "EXTRACTOR",
  /** 🟩 listening for Extractors and mines VALUE artifacts */
  MAKER = "MAKER",
  /** 🟪 Researching and updating artifacts, creating BOX artifacts */
  RESEARCHER = "RESEARCHER",
}

/** 📜 Best MEV strategies */
export enum MevStrategy {
  /** 🥪 */
  SANDWICH_SWAP = "SANDWICH_SWAP",
  /** 🍔 */
  SANDWICH_JIT_SWAP = "SANDWICH_JIT_SWAP",
  /** 🥞 */
  SANDWICH_JIT = "SANDWICH_JIT",
  /** 🔁 */
  ARB = "ARB",
  /** ♻️ */
  ARB_BACKRUN = "ARB_BACKRUN",
  /** 🔫 */
  LIQUIDATION = "LIQUIDATION",
}

/** 🧠 MevBot MEV API V1 ABI methods. */
export enum MevMethod {
  /** 🥪 Front-run intercepted transaction by swap.
   ```solidity
   function sandwichSwapFrontrun(bytes calldata data) external payable returns (bytes32 result)
   ```
   */
  sandwichSwapFrontrun = "sandwichSwapFrontrun",

  /** 🥪 Back-run intercepted transaction by swap in UniswapV2-like pool.
   ```solidity
   function sandwichSwapBackrun(bytes calldata data) external payable returns (bytes32 result)
   ```
   */
  sandwichSwapBackrun = "sandwichSwapBackrun",

  sandwichJitSwapFrontrun = "sandwichJitSwapFrontrun",

  sandwichJitFrontrun = "sandwichJitFrontrun",

  sandwichJitBackrun = "sandwichJitBackrun",

  /** ⚖️ Arbitrage across multiple pools or DEXes.
   ```solidity
   function arb(bytes calldata data) external payable returns (bytes32 result)
   ```
   */
  arb = "arb",

  liquidate = "liquidate",

  /** 🧩 Multi-call aggregation for efficiency or chaining. */
  multicall = "multicall",
}

/** 🏷️ The fundamental type of MEV artifact. */
export enum ArtifactType {
  /** ✨ A discovered opportunity before mining. */
  OPPORTUNITY = "OPPORTUNITY",

  /** 💰 A mined MEV value, confirmed on-chain. */
  VALUE = "VALUE",

  /** 📦 A container (box) combining several artifacts. */
  BOX = "BOX",
}

/**
 💎 Maximum Extractable Value Artifact
 _______ ◆
 _____ ◆◆◆◆◆
 __ ◆◆◆◆◆◆◆◆◆◆◆
 ◆◆◆◆◆◆ MEV ◆◆◆◆◆◆
 __ ◆◆◆◆◆◆◆◆◆◆◆
 _____ ◆◆◆◆◆
 _______ ◆
 🧠 Represents a single unit of MEV intelligence — opportunity, mined value,
 or even a curated collection (BOX) of multiple artifacts.
 @alpha
 */
export interface IMevArtifact {
  /** 🧬 Unique identifier for this artifact.
   * Can vary depending on artifact type:
   * • 💎 VALUE → `0x{bundleHash}`
   * • 🥪 Sandwich Opportunity → `sandwich-0x{victimTxHash}`
   * • 🔁 Arbitrage → `arb-{blockNumber}-{poolIds}`
   * • 🔙 Backrun → `backrun-0x{victimTxHash}`
   * • 💥 Liquidation → `liquidate-{platform}-{block}-{user}`
   * • 📦 Box → `box-{customId}`
   */
  id:
    | `0x${string}`
    | `sandwich-0x${string}`
    | `arb-${string}-${string}`
    | `backrun-0x${string}`
    | `liquidate-${string}-${string}-0x${string}`
    | `box-${string}`;

  /** 🏷️ Type of artifact — opportunity, mined value, or a box of artifacts. */
  type: ArtifactType;

  /** 🔗 Related artifacts IDs. e.g. VALUE ↔️ OPPORTUNITY, BOX ↔️ OPPORTUNITY. */
  relatedArtifacts?: string[];

  /** 📜 Which MEV strategy (or strategies) were used to extract value. */
  strategy: MevStrategy[];

  /** ⏰ Creation timestamp in milliseconds. */
  created: number;

  /** 🧰 Software or service name and version that created this artifact. */
  createdBy: string;

  /** 🕰️ Last updated time in milliseconds (optional). */
  updated?: number;

  /** Short description how this MEV Artifact work. */
  description?: string;

  /** Hashes of intercepted pending mempool transactions */
  intercepts?: `0x${string}`[];

  /** Result of intercepted transactions execution */
  interceptsExecution?: IInterceptExecution[];

  /** 📒 Input data — instructions or transactions describing how profit was made. */
  callData: IMevArtifactCallData[];

  /** ⛓️ Blockchain block information at the moment of artifact creation. */
  block: {
    number: number;
    timestamp: number;
    baseFeePerGas: bigint;
    ethPrice: number;
  };

  /** A value mined by artifact */
  value?: IMinedValue;

  /** Mined value data */
  mevMined?: any;

  /** NEV comparing object */
  compare?: {
    /** Lose reason/s */
    result: string;
    /** Actions triggered depend of result */
    actions?: string;
    /** Rows of compare table */
    items: ICompareItem[];
  };

  /** 📃 Strategy-specific data — e.g. `ISandwichOpportunity` or `IArbOpportunity`. */
  data: any;
}

export interface ICompareItem {
  title: string;
  we: string | number | bigint;
  competitor: string | number | bigint;
}

export interface IInterceptExecution {
  /** Pending transaction hash */
  intercept: `0x${string}`;
  /**
   true - success tx mined
   false - fail tx mined
   null - gone from mempool
   undefined - not known yet
   */
  success?: boolean | null;
  /** Block number where tx was mined */
  blockNumber?: number;
  /** Transaction index in block */
  index?: number;
  /** Hash of other tx with such nonce of sender */
  replacedBy?: `0x${string}`;
}

/**
 📒 Call data and profitability details for executing an artifact.
 @alpha
 */
export interface IMevArtifactCallData {
  /** 💵 Token address representing the asset in which profit is counted. */
  incomeAssets: `0x${string}`[];

  /** 💼 Tokens that must be available in the maker’s contract to realize profit. */
  investAssets?: `0x${string}`[];

  /** 📊 The amounts of each invested asset used during the process. */
  investedAmountsUsed?: bigint[];

  /** 💸 Estimated income in USD. */
  income: number;

  /** minAmountOut for backrun, etc */
  minIncome?: number;

  /** ⛽ Total gas cost in USD (including transaction fee & coinbase transfer). */
  cost: number;

  /** 🔁 All calls included in the MEV bundle. */
  calls: {
    /** 🧠 The MEV method executed (e.g. sandwich front‑run, back‑run, etc.). */
    mevMethod?: MevMethod;
    /** 🎯 Target contract address. */
    to?: `0x${string}`;
    /** 🧾 Raw calldata for this transaction. */
    data?: `0x${string}`;
    /** 👤 Sender address (maker or executor). */
    from?: `0x${string}`;
    /** 🪙 ETH value sent with the call. */
    value?: bigint;
    /** 🧱 Logical name of the contract (for reference). */
    contract?: string;
    /** 🕳️ Transaction hash (used when composing an artifact and on VALUE artifacts). */
    hash?: `0x${string}`;
    /** max_fee_per_gas from EIP-1559 */
    maxFee?: bigint;
    /** max_priority_fee_per_gas from EIP-1559 */
    maxPriorityFee?: bigint;
    /** Gas used */
    gas?: bigint;
  }[];

  /** Bundle simulation */
  simulation?: {
    /** 🏷️ Custom simulation name (e.g., "phase0") */
    name?: string;
    /** ⏰ Simulation start time, ms */
    start: number;
    /** 🏁 Simulation finish time, ms */
    finish: number;
    /** ✅ Indicates if the simulation was successful */
    success: boolean;
    /** ⚠️ Revert error text */
    error?: string;
    /** 💡 Parsed fail reason text */
    failureReason?: string;
  };

  /** Is it ready to be submitted to flashbots and other relays */
  readyToSubmit: boolean;

  /** Bundle hash of this callData */
  bubbleHash?: `0x${string}`;

  /** ⛏️ Whether the artifact was actually mined on-chain. */
  mined?: boolean;
}
