import { FundingType, IDAOData, LifecyclePhase } from "../host";
import { Activity } from "../activity";
import { ChainName } from "../chains";
import { UnitStatus, UnitType } from "../host.types";
import { AgentRole } from "../agents";

export const mevbot: IDAOData = {
  phase: LifecyclePhase.DRAFT,
  name: "MEV Bot",
  symbol: "MEVBOT",
  socials: [],
  activity: [Activity.MEV],
  images: {
    token: "/MEVBOT.png",
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
      unitId: "mevbot:ethereum",
    },
  ],
  params: {
    vePeriod: 120,
    pvpFee: 100,
    totalSupply: 1_000_000e18,
  },
  funding: [
    {
      type: FundingType.SEED,
      start: 1777593600, // Friday, 1 May 2026
      end: 1782864000, // Wednesday, 1 July 2026
      minRaise: 50000,
      maxRaise: 250000,
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
      name: "EthereumBot",
      description: "Ethereum MEV Searcher machine",
      status: UnitStatus.BUILDING_PROTOTYPE,
      revenueShare: 100,
      type: UnitType.MEV_SEARCHER,
      emoji: "🧙",
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
        unitIds: ["mevbot:ethereum"],
        name: "MEVBOT Agent",
        api: [],
      },
    ],
  },
};
