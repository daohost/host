import { Activity } from "../activity";
import { ChainName } from "../chains";
import {
  ContractIndices,
  FundingType,
  HOST_DESCRIPTION,
  IDAOData,
  LifecyclePhase,
  UnitStatus,
  UnitType
} from "../host.types";
import { AgentRole } from "../agents";

export const host: IDAOData = {
  phase: LifecyclePhase.DRAFT,
  name: "DAO Host",
  symbol: "HOST",
  socials: [
    "https://x.com/dao__host",
    "https://t.me/dao_host",
    "https://github.com/daohost",
  ],
  activity: [Activity.DEFI],
  images: {
    token: "/HOST.png",
  },
  deployments: {},
  chainSettings: {
    ["1"]: {
      bbRate: 20,
    },
  },
  initialChain: ChainName.ETHEREUM,
  units: [
    {
      unitId: "core",
    },
  ],
  params: {
    vePeriod: 365,
    pvpFee: 100,
    totalSupply: 10_000_000e18,
  },
  funding: [
    {
      type: FundingType.SEED,
      start: 1775001600, // Wednesday, 1 April 2026
      end: 1780272000, // Monday, 1 June 2026
      minRaise: 40000,
      maxRaise: 500000,
      raised: 0,
    },
    {
      type: FundingType.TGE,
      start: 1793577600, // Monday, 2 November 2026
      end: 1794182399, // Sunday, 8 November 2026, 23:59:59
      claim: 1794268800, // Tuesday, 10 November 2026
      minRaise: 400000,
      maxRaise: 1200000,
      raised: 0,
    },
  ],
  vesting: [],
  governanceSettings: {},
  deployer: "0x0",
  salts: {
    "1": {
      // 0x222226ef3c71fbd816ba5f9ab27f028c2ff22222
      [ContractIndices.SEED_TOKEN_1]:
        "0xe5259ed2f69e9b21d7c19f2b5a824853725b25c69eee5a4e40efbf9d49cc111b",
      // 0x888886c4c2d026b8b56045206120ad70f9388888
      [ContractIndices.TGE_TOKEN_2]:
        "0xee38eceaa03066de8f1eb144f7c149c7d48bc2b9205af04574c2e2242d029638",
      // 0x333335b8139bc92f132e0007c241ea90d5133333
      [ContractIndices.TOKEN_3]:
        "0xbfaa20e0a7c80565caef117a247516d4fb84f65619b563b950ec838211511b1c",
      // 0x999993a2df16b16b5aef90b12a2077382f499999
      [ContractIndices.X_TOKEN_4]:
        "0x71c818df4ad3e7e07df86778ca7603fa8cb30938e92e27cd9b22458c39d7fd6e",
      // 0x55555c9c44a6f65c2747e74d4111c6a20b355555
      [ContractIndices.DAO_TOKEN_5]:
        "0x307148d98c0fe7ec404a8e39d0c7519487774ff8bd5d261360c21a5f3f0b53e7",
      // 0x001c0a20546b0e00000000e0400f5ea000a9009b
      [ContractIndices.STAKING_6]:
        "0xb0ae071910e86a76af570f15d48941976db39bc85a4a59d8574ca4892c53fe63",
      // 0xbbbbb3c60d7b3ac2a522fa5ee539233aeecbbbbb
      [ContractIndices.TOKEN_BRIDGE_8]:
        "0x6cc6b5f1d517b246d07403c5d6845cbc0cd18ece639beaa702ccf8beaf262ba7",
      // 0xcccccda2181487bd0d8a4ff62af07b8c788ccccc
      [ContractIndices.X_TOKEN_BRIDGE_9]:
        "0x42f6027f204366c83216dcb74182c4eb9f83934ec730a95602228311ad5e43c9",
    },
  },
  metaDataLocation: "local",
  unitEmitData: [
    {
      name: "dao.host",
      description: HOST_DESCRIPTION,
      status: UnitStatus.BUILDING_PROTOTYPE,
      revenueShare: 100,
      type: UnitType.DEFI_PROTOCOL,
      emoji: "🍀",
      ui: [
        {
          href: "https://dao.host",
          title: "dao.host",
        },
      ],
      pool: {
        repos: [
          "daohost/host",
          "daohost/host-contracts",
          "daohost/host-agent",
          "daohost/host-ui",
        ],
        label: {
          name: "HOST:dao.host",
          description: "Building Host",
          color: "#00b243",
        },
      },
    },
  ],
  metaData: {
    agents: [
      {
        roles: [AgentRole.API_OPERATOR, AgentRole.TX_SENDER],
        unitIds: ["core"],
        name: "Host Agent",
        image: "BUILDER.png",
        api: ["https://api.dao.host/api/host-agent-memory"],
      },
    ],
  },
};
