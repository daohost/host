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

export const mevbots: IDAOData = {
  phase: LifecyclePhase.DRAFT,
  name: "MevBots Network",
  symbol: "MEVBOTS",
  socials: ["https://t.me/mevmachines"],
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
      unitId: "eth",
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
      name: "Ethereum MEV",
      description: "MEV-searcher for Ethereum blockchain",
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
