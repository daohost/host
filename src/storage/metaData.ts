import { IDAOMetaData } from "../host";
import { AgentRole } from "../agents";

export const metaData: { [symbol: string]: IDAOMetaData } = {
  host: {
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
  stbl: {
    agents: [
      {
        roles: [AgentRole.API_OPERATOR, AgentRole.TX_SENDER],
        unitIds: [
          "xstbl",
          "stability:stabilityFarm",
          "stability:stabilityMarket",
        ],
        name: "Stability Operator",
        telegram: "@stability_dao_bot",
        image: "OPERATOR.png",
        api: ["https://api.stability.farm", "https://api.stabilitydao.org"],
      },
    ],
  },
  mevbot: {
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
