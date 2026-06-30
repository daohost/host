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
  name: "MEV Machines",
  symbol: "MEVBOTS",
  socials: ["https://t.me/mevmachines", "https://github.com/mevmachines"],
  activity: [Activity.MEV],
  images: {
    seedToken: "/seedMEVBOTS.png",
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
      unitId: "mevminer",
    },
  ],
  params: {
    vePeriod: 360,
    pvpFee: 100,
    totalSupply: 1_000_000e18,
  },
  funding: [
    {
      type: FundingType.SEED,
      start: 1785542400, // 1 aug 2026
      end: 1801440000, // 1 feb 2027
      minRaise: 10000,
      maxRaise: 5000000,
      raised: 0,
    },
    {
      type: FundingType.TGE,
      start: 1827619200, // 1 dec 2027
      end: 1828223999, // 7 dec 2027
      minRaise: 1000000,
      maxRaise: 1500000,
      raised: 0,
    },
  ],
  vesting: [
    {
      name: "Development",
      allocation: 300_000,
      start: 1843430400, // 1 jun 2028
      end: 2158963200, // 1 jun 2038
      address: "0xe6C2AA6e67EF1B806B9Daec7147b113051a445E8",
    },
  ],
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
      name: "mevminer",
      description: "MEV-searcher for Ethereum blockchain",
      status: UnitStatus.BUILDING_PROTOTYPE,
      revenueShare: 50,
      type: UnitType.MEV_SEARCHER,
      emoji: "",
      pool: {
        repos: ["mevmachines/mevminer"],
        label: {
          name: "MEVBOTS:mevminer",
          description: "Building MEV machine for Ethereum",
          color: "#ae4cff",
        },
      },
    },
  ],
  metaData: {
    agents: [],
  },
};
