import { Activity } from "../activity";
import { ChainName } from "../chains";
import {
  FundingType,
  IDAOData,
  LifecyclePhase,
  UnitStatus,
  UnitType,
} from "../host.types";
import { AgentRole } from "../agents";

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
      start: 1777593600, // Friday, 1 May 2026
      end: 1790726400, // Wednesday, 30 September 2026
      minRaise: 10000,
      maxRaise: 2500000,
      raised: 0,
    },
  ],
  vesting: [],
  governanceSettings: {},
  deployer: "0x0",
  salts: {},
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
    agents: [
      {
        roles: [AgentRole.MEV_SEARCHER],
        unitIds: ["net"],
        name: "MEVBOTS Agent",
        api: [],
      },
    ],
  },
};

/**
 ◆◆ MEVBOTS DAO Knowledge
 ◆◆◆ mevbots.net Architecture
 MevBots is a network of Maximum Extractable Value (MEV) searcher bots.
 Bot generates value by creating an `IMevArtifact` depending on its role.
 `MevBotRole.EXTRACTOR` creates `ArtifactType.OPPORTUNITY` and `ArtifactType.BOX` artifacts for supported `DeX`s.
 `MevBotRole.MAKER`  extracts mined value by processing `MevStrategy` opportunities and executing `MevMethod` on their contract. Upon success, it creates `ArtifactType.VALUE` artifacts.
 Maker's `IMevMiner` contract contains proprietary `IMevLogic` implementations.
 Each artifact includes an `IMevArtifactCallData` array and other data required for its execution or research.
 A bot session is represented by a public `IFlight` object.
 */

/** Contract implementing `IMev*` interface */
export interface IMevMiner {
  account: `0x${string}`;
  bundleSigner: `0x${string}`;
  contract: `0x${string}`;
  logic: {
    sandwich: IMevLogic;
    arbitrage: IMevLogic;
    liquidation: IMevLogic;
  };
}

export interface IMevLogic {
  name: string;
  implementation: `0x${string}`;
  methods: MevMethod[];
}

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
 ◆
 ◆◆◆◆◆
 ◆◆◆◆◆◆◆◆◆◆◆
 ◆◆◆◆◆◆ MEV ◆◆◆◆◆◆
 ◆◆◆◆◆◆◆◆◆◆◆
 ◆◆◆◆◆
 ◆
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

  /** 📒 Input data — instructions or transactions describing how profit was made. */
  callData: IMevArtifactCallData[];

  /** ⛓️ Blockchain block information at the moment of artifact creation. */
  block: {
    number: number;
    timestamp: number;
    baseFeePerGas: bigint;
    ethPrice: number;
  };

  mevMinedBy?: `0x${string}`;

  /** 📃 Strategy-specific data — e.g. `ISandwichOpportunity` or `IArbOpportunity`. */
  data: any;
}

/**
 📒 Call data and profitability details for executing an artifact.
 @alpha
 */
export interface IMevArtifactCallData {
  /** 💵 Token address representing the asset in which profit is counted. */
  incomeAsset: `0x${string}`;

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
    /** 🕳️ Victim transaction hash (used when composing an artifact). */
    hash?: `0x${string}`;
  }[];

  /** Bundle simulation */
  simulation?: {
    /** Custom simulation name, ex phase0 */
    name?: string;
    start: number;
    finish: number;
    success: boolean;
    error?: string;
    failureReason?: string;
  };

  /** Bundle hash of this callData */
  bubbleHash?: `0x${string}`;

  /** ⛏️ Whether the artifact was actually mined on-chain. */
  mined?: boolean;
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

  // roles of bot in this flight
  roles: MevBotRole[];

  // Service constructor time (ms)
  created: number;

  // last update time (ms)
  time: number;

  // bootstrapped and launched time
  takeOff?: number;

  // stop time
  complete?: number;

  // synced state of services
  services: {
    [serviceName: string]: IServiceState;
  };

  // not default settings
  settings: {
    [envSetting: string]: string;
  };

  // Created MEV Artifacts IDs
  made: string[];

  // Received MEV Artifacts IDs
  received?: string[];

  // software used
  software: string;
}

export interface IServiceState {
  [key: string]: number | string | boolean | string[];
}
