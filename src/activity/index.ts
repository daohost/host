import { UnitType } from "../host/types";

/** Organization activities supported by OS. */
export enum Activity {
  /** Owner of Decentralized Finance protocols */
  DEFI = "DEFI",
  /** Owner of Maximum Extractable Value tools */
  MEV = "MEV",
  /** Owner of Software as a Service business */
  //SAAS_OPERATOR = "SAAS_OPERATOR",
}

export const activities: {
  [activity in Activity]: {
    title: string;
    unitTypes: UnitType[];
    description?: string;
  };
} = {
  [Activity.DEFI]: {
    title: "Decentralized Finance Protocol Operator",
    unitTypes: [UnitType.DEFI_PROTOCOL],
  },
  [Activity.MEV]: {
    title: "Maximum Extractable Value tools",
    unitTypes: [UnitType.MEV_SEARCHER],
  },
};
