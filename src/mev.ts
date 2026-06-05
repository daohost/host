import { IArtifact, ICompareItem } from "./artifact";
import { IMinedValue } from "./bot";

export interface IMevMiner {
  name?: string;
  links?: string[];
  contracts: { [addr: `0x${string}`]: IMevContract };
}

export interface IMevContract {
  tag?: string;
  selectors?: { [selector: `0x${string}`]: string };
}

/** 📜 Best MEV strategies */
export enum MevStrategy {
  /** 🥪 */
  SANDWICH_SWAP = "SANDWICH_SWAP",
  /** 🍔 */
  SANDWICH_JIT_SWAP = "SANDWICH_JIT_SWAP",
  /** 🥞 */
  SANDWICH_JIT = "SANDWICH_JIT",
  /** 🌯 */
  SANDWICH_ARB = "SANDWICH_ARB",
  /** 🔁 */
  ARB = "ARB",
  /** ♻️ */
  ARB_BACKRUN = "ARB_BACKRUN",
  /** 💸 */
  LIQUIDATION = "LIQUIDATION",
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
export interface IMevArtifact extends IArtifact {
  /** 🧬 Unique identifier for this artifact.
   * Can vary depending on artifact type:
   * • 💎 VALUE → `0x{bundleHash}`
   * • 🥪 Sandwich Opportunity → `sandwich-0x{victimTxHash}`
   * • 🔁 Arbitrage → `arb-{blockNumber}-{poolIds}`
   * • 🔙 Backrun → `backrun-0x{victimTxHash}`
   * • 💥 Liquidation → `liquidate-{platform}-{block}-{user}`
   * • 📦 Box → `box-{customId}`
   * • ⛏️ any MEV mined → `mev-{hash}`
   */
  id:
    | `0x${string}`
    | `sandwich-0x${string}`
    | `arb-${string}-${string}`
    | `backrun-0x${string}`
    | `liquidate-${string}-${string}-0x${string}`
    | `box-${string}`
    | `mev-0x${string}`;

  /** 🔗 Related artifacts IDs. e.g. VALUE ↔️ OPPORTUNITY, BOX ↔️ OPPORTUNITY. */
  relatedArtifacts?: string[];

  /** 📜 Which MEV strategy (or strategies) were used to extract value. */
  strategy: MevStrategy[];

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

  /** When calldata sending was started */
  sendStart?: number;

  /** When calldata sending was finished */
  sendFinish?: number;

  /** Errors when sending calldata */
  sendError?: string;

  /** Bundle hash of this callData */
  bubbleHash?: `0x${string}`;

  /** ⛏️ Whether the artifact was actually mined on-chain. */
  mined?: boolean;
}

export const mevMiners: { [addr: `0x${string}`]: IMevMiner } = {
  ["0x11111215b72E894C60F24E91ac2c8cCb1D373911".toLowerCase()]: {
    name: "mevbots",
    contracts: {
      ["0x3F7F239206b2949dDcADFA4C1beb82e2E8215cFf".toLowerCase()]: {
        tag: "Test contract 1.1.0",
      },
      ["0x2eF1d1792457eA38e6aC89f61507A6Cf7fABAC7e".toLowerCase()]: {
        tag: "Fighter 0.3.1",
      },
    },
  },
  ["0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13".toLowerCase()]: {
    name: "JaredFromSubway",
    contracts: {
      ["0x1f2F10D1C40777AE1Da742455c65828FF36Df387".toLowerCase()]: {
        tag: "MEV Bot 2",
      },
    },
  },
};
