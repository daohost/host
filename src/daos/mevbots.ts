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
  phase: LifecyclePhase.INCEPTION,
  name: "MEV Machines",
  symbol: "MEVBOTS",
  socials: ["https://t.me/mevmachines", "https://github.com/mevmachines"],
  activity: [Activity.MEV],
  images: {
    seedToken: "/seedMEVBOTS.png",
    tgeToken: "/tgeMEVBOTS.png",
    token: "/mevbots.png",
    xToken: "/xMEVBOTS.png",
    daoToken: "/daoMEVBOTS.png",
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
      start: 1785769200, // 3 aug 2026 15:00
      end: 1809097200, // 30 apr 2027
      minRaise: 10000,
      maxRaise: 10000000,
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
      allocation: 200_000,
      start: 1843430400, // 1 jun 2028
      end: 2158963200, // 1 jun 2038
    },
  ],
  governanceSettings: {},
  deployer: "0x0",
  salts: {
    "1": {
      // 0x999995c72dd0c41241552c9c889a93dc78d99999
      [ContractIndices.SEED_TOKEN_1]:
        "0xce4effbbe3dba0a28d68fe6584e88165ba2a39782cf737cb4864a5b02be9f6ed",
      // 0x7777042a204de85811a07ead6f4c9c89e3ec7777
      [ContractIndices.TGE_TOKEN_2]:
        "0xc8a9d2a62d142f596413fc1a84af18b3cd3cfd0fb7f1f304a20c335f04eb94e8",
      // 0x888889b59aaa4530d8fbda42abec985037288888
      [ContractIndices.TOKEN_3]:
        "0x8fc8bb7c859462873fd4de28df77eb5c0b992ed92e363a52e5e3bbecb6521644",
      // 0x1111e50b7cf1614a9307b1bdf8b3fd243d431111
      [ContractIndices.X_TOKEN_4]:
        "0x80f98a15e0b5b0ae7fdca5b6c2dc2313cc5b0ed83bfddc08fb9fa81c19a3297e",
      // 0x33335a92befed42e6db65707f5330e62f8413333
      [ContractIndices.DAO_TOKEN_5]:
        "0x41431bb0020c6598ee776b162ba7a777d2998acb844aa1d64b26a21fc36fa26f",
    },
  },
  metaDataLocation: "local",
  unitEmitData: [
    {
      name: "mevminer",
      description: "Ethereum MEV-searcher",
      status: UnitStatus.PROTOTYPE,
      revenueShare: 50,
      type: UnitType.MEV_SEARCHER,
      emoji: "🤖",
      pool: {
        repos: ["mevmachines/mevminer"],
        label: {
          name: "track:by:host",
          description: "Issue for tracking by Host Agent",
          color: "#ae4cff",
        },
      },
    },
  ],
  metaData: {
    agents: [],
  },
};
