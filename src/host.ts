/**
 Host prototype.
*/

import { chains, getChainByName } from "./chains";
import { Activity } from "./activity";
import { getTokenData, TokenData } from "./assets";
import { Validation } from "./validation";
import {
  ContractIndices,
  FundingType,
  IContractIndex,
  IDAOData,
  IDAOImages,
  IDAOMetaData,
  IDAOParameters,
  IFunding,
  IHostSettings,
  IVesting,
  LifecyclePhase,
} from "./host.types";
import { IUnit, IUnitEmitData } from "./unit";

export const daoContractIndices: {
  [index in ContractIndices]?: IContractIndex;
} = {
  [ContractIndices.SEED_TOKEN_1]: {
    name: "Seed token",
    description: "Seed round receipt token",
  },
  [ContractIndices.TGE_TOKEN_2]: {
    name: "Presale token",
    description: "TGE pre-sale receipt token",
  },
  [ContractIndices.TOKEN_3]: {
    name: "Token",
    description: "Main tradable DAO token",
  },
  [ContractIndices.X_TOKEN_4]: {
    name: "VE-token",
    description: "VE-tokenomics entry token",
  },
  [ContractIndices.DAO_TOKEN_5]: {
    name: "DAO token",
    description: "Governance token",
  },
  [ContractIndices.STAKING_6]: {
    name: "Staking",
    description: "Staking contract",
  },
  [ContractIndices.RECOVERY_7]: {
    name: "Recovery",
    description: "Accident recovery system contract",
  },
  [ContractIndices.TOKEN_BRIDGE_8]: {
    name: "Token bridge",
    description: "Bridge for main token",
  },
  [ContractIndices.X_TOKEN_BRIDGE_9]: {
    name: "VE-token bridge",
    description: "Bridge for VE-token",
  },
  [ContractIndices.DAO_TOKEN_BRIDGE_10]: {
    name: "DAO token bridge",
    description: "Bridge for Governance token",
  },
  [ContractIndices.VESTING_1_11]: {
    name: "Vesting 1",
  },
  [ContractIndices.VESTING_2_12]: {
    name: "Vesting 2",
  },
  [ContractIndices.VESTING_3_13]: {
    name: "Vesting 3",
  },
  [ContractIndices.VESTING_4_14]: {
    name: "Vesting 4",
  },
  [ContractIndices.VESTING_5_15]: {
    name: "Vesting 5",
  },
  [ContractIndices.VESTING_6_16]: {
    name: "Vesting 6",
  },
  [ContractIndices.VESTING_7_17]: {
    name: "Vesting 7",
  },
  [ContractIndices.VESTING_8_18]: {
    name: "Vesting 8",
  },
  [ContractIndices.VESTING_9_19]: {
    name: "Vesting 9",
  },
  [ContractIndices.VESTING_10_20]: {
    name: "Vesting 10",
  },
  [ContractIndices.REVENUE_ROUTER_21]: {
    name: "Revenue Router",
    description: "Revenue collector and utilizer contract",
  },
};

/**
 Typescript implementation of the Host
 Object of this class is Host instance deployed on a single blockchain.

 @class
 */
export class Host {
  /** Chain ID where instance deployed */
  chainId: string;

  /** Chain block timestamp */
  blockTimestamp: number = Math.floor(new Date().getTime() / 1000);

  /** Local DAOs storage (in form of a mapping) */
  daos: { [symbol: string]: IDAOData } = {};

  /** Actual DAO symbols at all blockchains */
  usedSymbols: { [name: string]: boolean } = {};

  /** All emitted events */
  events: string[] = [];

  /** Governance proposals. Can be created only at initialChain of DAO. */
  proposals: { [proposalId: string]: IProposal } = {};

  /** Current user address */
  from: string = "0x00";

  settings: IHostSettings = {
    priceDao: 1000,
    fundingFee: 1000, // 10%
    minNameLength: 1,
    maxNameLength: 20,
    minSymbolLength: 1,
    maxSymbolLength: 7,
    minVePeriod: 14, // days
    maxVePeriod: 365 * 4, // days
    minPvPFee: 10,
    maxPvPFee: 100,
    minFunding: 100e8,
    minFundingDuration: 12 * 3600,
    maxFundingDuration: 180 * 24 * 3600,
    minFundingRaise: 10000e8,
    maxFundingRaise: 1e20,
    minVestingNameLen: 1,
    maxVestingNameLen: 20,
    minCliff: 30 * 24 * 3600,
    minVestingDuration: 10 * 24 * 3600,
    maxVestingDuration: 10 * 365 * 24 * 3600,
  };

  constructor(chainId: string) {
    this.chainId = chainId;
  }

  static getTokensNaming(name: string, symbol: string) {
    return {
      seedName: `${name} SEED`,
      seedSymbol: `seed${symbol}`,
      tgeName: `${name} PRESALE`,
      tgeSymbol: `sale${symbol}`,
      tokenName: name,
      tokenSymbol: symbol,
      xName: `x${name}`,
      xSymbol: `x${symbol}`,
      daoName: `${name} DAO`,
      daoSymbol: `${symbol}_DAO`,
    };
  }

  static isLiveDAO(phase: LifecyclePhase) {
    return [
      LifecyclePhase.LIVE_CLIFF,
      LifecyclePhase.LIVE_VESTING,
      LifecyclePhase.LIVE,
    ].includes(phase);
  }

  /**
   * Create new DAO
   * @throws Error
   */
  createDAO(
    name: string,
    symbol: string,
    activity: Activity[],
    params: IDAOParameters,
    funding: IFunding[],
    metaDataLocation?: string,
  ): IDAOData {
    const dao: IDAOData = {
      phase: LifecyclePhase.DRAFT,
      name,
      symbol,
      activity,
      socials: [],
      images: {},
      deployments: {},
      units: [],
      params,
      chainSettings: {
        [this.chainId]: {
          bbRate: 50,
        },
      },
      initialChain: chains[this.chainId].name,
      funding,
      vesting: [],
      governanceSettings: {},
      deployer: this.from,
      salts: {},
      metaDataLocation: metaDataLocation,
      unitEmitData: [],
    };

    this.validate(dao);

    this.daos[dao.symbol] = dao;
    this.usedSymbols[dao.symbol] = true;
    this._emit("DAO created");
    this._sendCrossChainMessage(CROSS_CHAIN_MESSAGE.NEW_DAO_SYMBOL, {
      symbol,
    });
    return dao;
  }

  /** Add live compatible DAO */
  addLiveDAO(dao: IDAOData) {
    // todo _onlyVerifier
    this.validate(dao);
    this.daos[dao.symbol] = dao;
    this.usedSymbols[dao.symbol] = true;
    this._emit("DAO created");
    this._sendCrossChainMessage(CROSS_CHAIN_MESSAGE.NEW_DAO_SYMBOL, {
      symbol: dao.symbol,
    });
  }

  getDAOMetaData(symbol: string): IDAOMetaData {
    const dao = this.getDAO(symbol);
    if (dao.metaDataLocation === "local" && dao.metaData) {
      return dao.metaData;
    }
    return {};
  }

  /** Change lifecycle phase of a DAO */
  changePhase(symbol: string) {
    // anybody can call this

    const dao = this.getDAO(symbol);
    const currentTasks = this.tasks(symbol);
    if (currentTasks.length > 0) {
      throw new Error("SolveTasksFirst");
    }

    if (dao.phase === LifecyclePhase.DRAFT) {
      const seed = dao.funding[this.getFundingIndex(symbol, FundingType.SEED)];
      // SEED can be started not later than 1 week after must start
      // todo settings.maxSeedStartDelay
      if (
        seed.start < this.blockTimestamp &&
        this.blockTimestamp - seed.start > 7 * 86400
      ) {
        throw new Error("TooLateSoSetupFundingAgain");
      }
      /*// SEED can be started not later than 1 week before end
      if (seed.end - this.blockTimestamp < 7 * 86400) {
        throw new Error("TooLateSoSetupFundingAgain")
      }*/

      this.daos[symbol].phase = LifecyclePhase.INCEPTION;
    } else if (dao.phase === LifecyclePhase.INCEPTION) {
      const seed = dao.funding[this.getFundingIndex(symbol, FundingType.SEED)];
      if (seed.start > this.blockTimestamp) {
        throw new Error("WaitFundingStart");
      }
      // deploy seedToken
      this.daos[symbol].deployments[this.chainId] = {
        [ContractIndices.SEED_TOKEN_1]: "0xProxyDeployed",
      };
      this.daos[symbol].phase = LifecyclePhase.SEED;
    } else if (dao.phase === LifecyclePhase.SEED) {
      const seed = dao.funding[this.getFundingIndex(symbol, FundingType.SEED)];
      if (seed.end > this.blockTimestamp) {
        throw new Error("WaitFundingEnd");
      }

      const success = seed.raised >= seed.minRaise;

      if (success) {
        this.daos[symbol].phase = LifecyclePhase.DEVELOPMENT;
      } else {
        // send all raised back to seeders

        this.daos[symbol].phase = LifecyclePhase.SEED_FAILED;
      }
    } else if (dao.phase === LifecyclePhase.DEVELOPMENT) {
      const tge = dao.funding[this.getFundingIndex(symbol, FundingType.TGE)];
      if (tge.start > this.blockTimestamp) {
        throw new Error("WaitFundingStart");
      }

      // deploy tgeToken
      this.daos[symbol].deployments[this.chainId][ContractIndices.TGE_TOKEN_2] =
        "0xProxyDeployedTge";

      this.daos[symbol].phase = LifecyclePhase.TGE;
    } else if (dao.phase === LifecyclePhase.TGE) {
      const tge = dao.funding[this.getFundingIndex(symbol, FundingType.TGE)];

      if (tge.end > this.blockTimestamp) {
        throw new Error("WaitFundingEnd");
      }

      const success = tge.raised >= tge.minRaise;

      if (success) {
        // deploy token, xToken, staking, daoToken
        this.daos[symbol].deployments[this.chainId][ContractIndices.TOKEN_3] =
          "0xProxyToken";
        this.daos[symbol].deployments[this.chainId][ContractIndices.X_TOKEN_4] =
          "0xProxyXToken";
        this.daos[symbol].deployments[this.chainId][ContractIndices.STAKING_6] =
          "0xProxyStaking";
        this.daos[symbol].deployments[this.chainId][
          ContractIndices.DAO_TOKEN_5
        ] = "0xProxyDAOToken";

        // todo deploy vesting contracts and allocate token

        // todo seedToken holders became xToken holders by predefined rate

        // todo deploy v2 liquidity from TGE funds at predefined price

        this.daos[symbol].phase = LifecyclePhase.LIVE_CLIFF;
      } else {
        // send all raised TGE funds back to funders

        this.daos[symbol].phase = LifecyclePhase.DEVELOPMENT;
      }
    } else if (dao.phase === LifecyclePhase.LIVE_CLIFF) {
      // if any vesting started then phase changed
      const isVestingStarted = !!dao.vesting?.filter(
        (v) => v.start < this.blockTimestamp,
      ).length;
      if (!isVestingStarted) {
        throw new Error("WaitVestingStart");
      }

      this.daos[symbol].phase = LifecyclePhase.LIVE_VESTING;
    } else if (dao.phase === LifecyclePhase.LIVE_VESTING) {
      // if any vesting started then phase changed
      const isVestingEnded = !dao.vesting?.filter(
        (v) => v.end > this.blockTimestamp,
      ).length;
      if (!isVestingEnded) {
        throw new Error("WaitVestingEnd");
      }

      this.daos[symbol].phase = LifecyclePhase.LIVE;
    } else {
      // nothing to change
      throw new Error("ForeverLive");
    }
  }

  /** @throws Error */
  updateImages(symbol: string, images: IDAOImages) {
    // check DAO symbol
    const dao = this.getDAO(symbol);

    // instant execute for DRAFT
    if (dao.phase === LifecyclePhase.DRAFT) {
      this._onlyOwnerOf(symbol);
      this._updateImages(symbol, images);
      return true;
    }

    // create proposal for other phases
    return this._proposeAction(symbol, DAOAction.UPDATE_IMAGES, {
      images,
    });
  }

  /** @throws Error */
  updateSocials(symbol: string, socials: string[]) {
    // check DAO symbol
    const dao = this.getDAO(symbol);

    // instant execute for DRAFT
    if (dao.phase === LifecyclePhase.DRAFT) {
      this._onlyOwnerOf(symbol);
      this._updateSocials(symbol, socials);
      return true;
    }

    // create proposal for other phases
    return this._proposeAction(symbol, DAOAction.UPDATE_SOCIALS, {
      socials,
    });
  }

  /** @throws Error */
  updateUnits(
    symbol: string,
    units: IUnit[],
    unitsMetaData: IUnitEmitData[],
  ): string | true {
    // check DAO symbol
    const dao = this.getDAO(symbol);

    // instant execute for DRAFT
    if (dao.phase === LifecyclePhase.DRAFT) {
      this._onlyOwnerOf(symbol);
      this._updateUnits(symbol, units, unitsMetaData);
      return true;
    }

    // create proposal for other phases
    return this._proposeAction(symbol, DAOAction.UPDATE_UNITS, {
      units,
      unitsMetaData,
    });
  }

  /** @throws Error */
  updateFunding(symbol: string, funding: IFunding): string | true {
    // check DAO symbol
    const dao = this.getDAO(symbol);

    // validate payload
    this.validateFunding(dao.phase, [funding]);

    // instant execute for DRAFT
    if (dao.phase === LifecyclePhase.DRAFT) {
      this._onlyOwnerOf(symbol);
      this._updateFunding(symbol, funding);
      return true;
    }

    // create proposal for other phases
    return this._proposeAction(symbol, DAOAction.UPDATE_FUNDING, {
      funding,
    });
  }

  private _updateSocials(symbol: string, socials: string[]) {
    this.daos[symbol].socials = socials;
    this._emit(`Action ${DAOAction.UPDATE_SOCIALS}`);
  }

  private _updateUnits(
    symbol: string,
    units: IUnit[],
    unitsMetaData: IUnitEmitData[],
  ) {
    this.daos[symbol].units = units;
    this.daos[symbol].unitEmitData = unitsMetaData;
    this._emit(`Action ${DAOAction.UPDATE_UNITS}`);
  }

  private _updateFunding(symbol: string, funding: IFunding) {
    const dao = this.getDAO(symbol);

    const fundingExist =
      dao.funding.filter((f) => f.type === funding.type).length === 1;
    if (fundingExist) {
      const fundingIndex = this.getFundingIndex(symbol, funding.type);
      this.daos[symbol].funding[fundingIndex] = funding;
    } else {
      this.daos[symbol].funding.push(funding);
    }

    this._emit(`Action ${DAOAction.UPDATE_FUNDING}`);
  }

  updateVesting(symbol: string, vestings: IVesting[]) {
    // check DAO symbol
    const dao = this.getDAO(symbol);

    // validate
    this.validateVesting(dao.phase, vestings, this.getTgeData(dao));

    // instant execute for DRAFT
    if (dao.phase === LifecyclePhase.DRAFT) {
      this._onlyOwnerOf(symbol);
      this._updateVesting(symbol, vestings);
      return true;
    }

    // create proposal for other phases
    return this._proposeAction(symbol, DAOAction.UPDATE_VESTING, {
      vestings,
    });
  }

  revenue(
    symbol: string,
    unitIndex: number,
    asset: `0x${string}`,
    amount: bigint,
  ) {
    // todo implement Host.whitelistedAssets

    // receiving money, calculating usd (can appear later by Host Agent)
    if (this.daos[symbol]) {
      if (!this.daos[symbol].unitRevenue) {
        this.daos[symbol].unitRevenue = [];
      }
      if (!this.daos[symbol].unitRevenue[unitIndex]) {
        this.daos[symbol].unitRevenue[unitIndex] = {};
      }
      if (!this.daos[symbol].unitRevenue[unitIndex][asset]) {
        this.daos[symbol].unitRevenue[unitIndex][asset] = 0n;
      }
      this.daos[symbol].unitRevenue[unitIndex][asset] += amount;
    }
  }

  fund(symbol: string, amount: number) {
    // todo check settings.minFunding
    const dao = this.getDAO(symbol);
    if (dao.phase === LifecyclePhase.SEED) {
      const seedIndex = this.getFundingIndex(symbol, FundingType.SEED);
      const seed = dao.funding[seedIndex];
      if (seed.raised + amount >= seed.maxRaise) {
        throw new Error("RaiseMaxExceed");
      }

      // transfer amount of exchangeAsset to seedToken contract
      this.daos[symbol].funding[seedIndex].raised += amount;

      // mint seedToken to user

      return;
    }

    if (dao.phase === LifecyclePhase.TGE) {
      const tgeIndex = this.getFundingIndex(symbol, FundingType.TGE);
      const tge = dao.funding[tgeIndex];
      if (tge.raised + amount >= tge.maxRaise) {
        throw new Error("RaiseMaxExceed");
      }

      // transfer amount of exchangeAsset to tgeToken contract

      this.daos[symbol].funding[tgeIndex].raised += amount;

      // mint tgeToken to user

      return;
    }

    throw new Error("NotFundingPhase");
  }

  receiveVotingResults(proposalId: string, succeed: boolean) {
    const proposal = this.proposals[proposalId];
    if (!proposal) {
      throw new Error("IncorrectProposal");
    }
    if (proposal.status !== VotingStatus.VOTING) {
      throw new Error("AlreadyReceived");
    }
    this.proposals[proposalId].status = succeed
      ? VotingStatus.APPROVED
      : VotingStatus.REJECTED;

    if (succeed) {
      if (proposal.action === DAOAction.UPDATE_IMAGES) {
        this._updateImages(proposal.symbol, proposal.payload.images);
      }
      if (proposal.action === DAOAction.UPDATE_SOCIALS) {
        this._updateSocials(proposal.symbol, proposal.payload.socials);
      }
      if (proposal.action === DAOAction.UPDATE_UNITS) {
        this._updateUnits(
          proposal.symbol,
          proposal.payload.units,
          proposal.payload.unitsMetaData,
        );
      }
      if (proposal.action === DAOAction.UPDATE_FUNDING) {
        this._updateFunding(proposal.symbol, proposal.payload.funding);
      }
      if (proposal.action === DAOAction.UPDATE_VESTING) {
        this._updateVesting(proposal.symbol, proposal.payload.vestings);
      }
      // todo other actions
    }
  }

  /** OFF-CHAIN only **/
  /** @throws Error */
  roadmap(symbol: string): IRoadmapItem[] {
    const dao: IDAOData = this.getDAO(symbol);
    const r: IRoadmapItem[] = [];
    let tgeRun = 0;

    for (const funding of dao.funding) {
      if (funding.type === FundingType.SEED) {
        r.push({
          phase: LifecyclePhase.INCEPTION,
        });
        r.push({
          phase: LifecyclePhase.SEED,
          start: funding.start,
          end: funding.end,
        });
      }
      if (funding.type === FundingType.TGE) {
        // if SEED was done
        if (r.length > 0) {
          r.push({
            phase: LifecyclePhase.DEVELOPMENT,
            start: (r[0].end as number) + 1,
            end: funding.start - 1,
          });
        }

        tgeRun = funding.claim || funding.end;
        r.push({
          phase: LifecyclePhase.TGE,
          start: funding.start,
          end: tgeRun,
        });
      }
    }

    if (dao.vesting.length > 0) {
      let vestingStart = this.blockTimestamp;
      let vestingEnd = this.blockTimestamp;
      for (const vesting of dao.vesting) {
        if (vesting.start < vestingStart) {
          vestingStart = vesting.start;
        }
        if (vesting.end > vestingEnd) {
          vestingEnd = vesting.end;
        }
      }
      r.push({
        phase: LifecyclePhase.LIVE_CLIFF,
        start: tgeRun + 1,
        end: vestingStart - 1,
      });
      r.push({
        phase: LifecyclePhase.LIVE_VESTING,
        start: vestingStart,
        end: vestingEnd,
      });
      r.push({
        phase: LifecyclePhase.LIVE,
        start: vestingEnd + 1,
      });
    }

    return r;
  }

  /** @throws Error */
  tasks(symbol: string): ITask[] {
    const dao: IDAOData = this.getDAO(symbol);
    const r: ITask[] = [];

    if (dao.phase === LifecyclePhase.DRAFT) {
      // images
      if (!dao.images.seedToken || !dao.images.token) {
        r.push({
          name: "Need images of token and seedToken",
        });
      }

      // socials
      if (dao.socials.length < 2) {
        r.push({
          name: "Need at least 2 socials",
        });
      }

      // units projected
      if (dao.units.length === 0) {
        r.push({
          name: "Need at least 1 projected unit",
        });
      }
    } else if (dao.phase === LifecyclePhase.INCEPTION) {
      // only off-chain tasks, mean SEED will be started anyway
      // todo off-chain tasks like minimal socials users number, units emitted data, etc
    } else if (dao.phase === LifecyclePhase.SEED) {
      const seedIndex = this.getFundingIndex(symbol, FundingType.SEED);
      if (
        dao.funding[seedIndex].raised < dao.funding[seedIndex].minRaise &&
        dao.funding[seedIndex].end > this.blockTimestamp
      ) {
        r.push({
          name: "Need attract minimal seed funding",
        });
      }
    } else if (dao.phase === LifecyclePhase.DEVELOPMENT) {
      // check funding
      const tgeExist =
        dao.funding.filter((f) => f.type === FundingType.TGE).length === 1;
      if (!tgeExist) {
        r.push({
          name: "Need add pre-TGE funding",
        });
      }

      // images
      if (!dao.images.tgeToken || !dao.images.xToken || !dao.images.daoToken) {
        r.push({
          name: "Need images of all DAO tokens",
        });
      }

      // setup vesting allocations
      if (!dao.vesting?.length) {
        r.push({
          name: "Need vesting allocations",
        });
      }

      if (!this.hasRevenue(dao.symbol)) {
        r.push({
          name: "Start generate revenue",
        });
      }
    } else if (dao.phase === LifecyclePhase.TGE) {
      const tgeIndex = this.getFundingIndex(symbol, FundingType.TGE);
      if (
        dao.funding[tgeIndex].raised < dao.funding[tgeIndex].minRaise &&
        dao.funding[tgeIndex].end > this.blockTimestamp
      ) {
        r.push({
          name: "Need attract minimal TGE funding",
        });
      }
    } else if (dao.phase === LifecyclePhase.LIVE_CLIFF) {
      // establish and improve
      // build money markets
      // bridge to chains
    } else if (dao.phase === LifecyclePhase.LIVE_VESTING) {
      // distribute vesting funds to leverage token
    }

    /*if (dao.phase === LifecyclePhase.LIVE)*/
    // lifetime revenue generating for DAO holders (till ABSORBED proposed feature)

    return r;
  }

  /** Strict on-chain validation */
  /** @throws Error */
  validate(dao: IDAOData) {
    this.validateName(dao.name);
    this.validateSymbol(dao.symbol);
    if (
      dao.params.vePeriod < this.settings.minVePeriod ||
      dao.params.vePeriod > this.settings.maxVePeriod
    ) {
      throw new Error(`VePeriod(${dao.params.vePeriod})`);
    }
    this.validatePvpFee(dao.params.pvpFee);
    if (!dao.funding.length) {
      throw new Error("NeedFunding");
    }

    // check activity are correct
    this.validateActivity(dao.activity);

    // todo: check funding array has unique funding types
    // todo: check funding dates
    // todo: check funding raise goals
  }

  /** @throws Error */
  getDAO(symbol: string): IDAOData {
    if (this.daos[symbol]) {
      return this.daos[symbol];
    }
    throw new Error("DAONotFound");
  }

  getDaoOwner(symbol: string): string {
    const dao = this.getDAO(symbol);

    if (dao.phase === LifecyclePhase.DRAFT) {
      return dao.deployer;
    }

    if (
      [
        LifecyclePhase.SEED,
        LifecyclePhase.DEVELOPMENT,
        LifecyclePhase.TGE,
      ].includes(dao.phase)
    ) {
      return dao.deployments[getChainByName(dao.initialChain).chainId][
        ContractIndices.SEED_TOKEN_1
      ] as string;
    }

    return dao.deployments[this.chainId][ContractIndices.DAO_TOKEN_5] as string;
  }

  hasRevenue(symbol: string): boolean {
    const dao = this.getDAO(symbol);
    if (dao.unitRevenue) {
      for (const unitRevenue of dao.unitRevenue) {
        for (const asset of Object.keys(unitRevenue)) {
          if (unitRevenue[asset as `0x${string}`] > 0n) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getTgeData(dao: IDAOData): IFunding | undefined {
    const fundingExist =
      dao.funding.filter((f) => f.type === FundingType.TGE).length === 1;
    if (fundingExist) {
      const fundingIndex = this.getFundingIndex(dao.symbol, FundingType.TGE);
      return dao.funding[fundingIndex];
    }
  }

  getFundingIndex(symbol: string, type: FundingType) {
    const dao = this.getDAO(symbol);
    for (let i = 0; i < dao.funding.length; i++) {
      if (type === dao.funding[i].type) {
        return i;
      }
    }
    throw new Error("FundingNotFound");
  }

  warpDays(days: number = 7) {
    this.blockTimestamp += days * 86400;
  }

  /** @throws Error */
  private _onlyOwnerOf(symbol: string) {
    if (this.from != this.getDaoOwner(symbol)) {
      throw new Error(`YouAreNotOwnerOf(${symbol})`);
    }
  }

  private _emit(event: string) {
    this.events.push(event);
  }

  public validateName(name: string) {
    if (
      name.length < this.settings.minNameLength ||
      name.length > this.settings.maxNameLength
    ) {
      throw new Error(`NameLength(${name.length})`);
    }
  }

  public validateSymbol(symbol: string) {
    if (
      symbol.length < this.settings.minSymbolLength ||
      symbol.length > this.settings.maxSymbolLength
    ) {
      throw new Error(`SymbolLength(${symbol.length})`);
    }
    if (this.usedSymbols[symbol]) {
      throw new Error(`SymbolNotUnique(${symbol})`);
    }
  }

  public validatePvpFee(pvpFee: number) {
    if (pvpFee < this.settings.minPvPFee || pvpFee > this.settings.maxPvPFee) {
      throw new Error(`PvPFee(${pvpFee})`);
    }
  }

  public validateFunding(daoPhase: LifecyclePhase, fundings: IFunding[]) {
    Validation.validateFunding(daoPhase, fundings, this.settings);
  }

  public validateActivity(activity: Activity[]) {
    Validation.validateActivity(activity);
  }

  public validateVesting(
    daoPhase: LifecyclePhase,
    vestings: IVesting[],
    tge?: IFunding,
  ) {
    Validation.validateVesting(daoPhase, vestings, this.settings, tge);
  }

  private _sendCrossChainMessage(type: CROSS_CHAIN_MESSAGE, payload: any) {
    // todo some stub
  }

  private _proposeAction(
    symbol: string,
    action: DAOAction,
    payload: any,
  ): string {
    const dao = this.getDAO(symbol);

    // todo check for initial chain
    // todo get user power
    // todo check proposalThreshold
    // todo validate payload

    const proposalId = Math.round(Math.random() * Math.random()).toString();

    this.proposals[proposalId] = {
      id: proposalId,
      created: this.blockTimestamp,
      action,
      symbol,
      payload,
      status: VotingStatus.VOTING,
    };

    return proposalId;
  }

  private _updateImages(symbol: string, images: IDAOImages) {
    this.daos[symbol].images = images;
    this._emit(`Action ${DAOAction.UPDATE_IMAGES}`);
  }

  private _updateVesting(symbol: string, vestings: IVesting[]) {
    this.daos[symbol].vesting = vestings;
    this._emit(`Action ${DAOAction.UPDATE_VESTING}`);
  }
}

export enum DAOAction {
  UPDATE_IMAGES = 0,
  UPDATE_SOCIALS,
  UPDATE_NAMING,
  UPDATE_UNITS,
  UPDATE_FUNDING,
  UPDATE_VESTING,
}

enum VotingStatus {
  VOTING = 0,
  APPROVED,
  REJECTED,
}

enum CROSS_CHAIN_MESSAGE {
  NEW_DAO_SYMBOL = 0,
  DAO_RENAME_SYMBOL,
  DAO_BRIDGED,
}

interface ITask {
  name: string;
}

interface IProposal {
  id: string;
  created: number;
  symbol: string;
  action: DAOAction;
  payload: any;
  status: VotingStatus;
}

interface IRoadmapItem {
  phase: LifecyclePhase;
  start?: number;
  end?: number;
}

export function getUnit(daos: IDAOData[], unitId: string): IUnit | undefined {
  for (const dao of daos) {
    for (const unit of dao.units) {
      if (unit.unitId === unitId) {
        return unit;
      }
    }
  }
}

export function getDAOUnit(
  daos: IDAOData[],
  symbol: string,
  unitId: string,
): IUnit | undefined {
  for (const dao of daos) {
    if (dao.symbol.toLowerCase() === symbol.toLowerCase()) {
      for (const unit of dao.units) {
        if (unit.unitId === unitId) {
          return unit;
        }
      }
    }
  }
}

export function getDAOUnitEmitData(
  daos: IDAOData[],
  symbol: string,
  unitId: string,
): IUnitEmitData | undefined {
  for (const dao of daos) {
    if (dao.symbol.toLowerCase() === symbol.toLowerCase()) {
      for (let i = 0; i < dao.units.length; i++) {
        const unit = dao.units[i];
        if (unit.unitId === unitId) {
          return dao.unitEmitData[i];
        }
      }
    }
  }
}

export function getUnitEmitData(
  daos: IDAOData[],
  unitId: string,
): IUnitEmitData | undefined {
  for (const dao of daos) {
    for (let i = 0; i < dao.units.length; i++) {
      const unit = dao.units[i];
      if (unit.unitId === unitId) {
        return dao.unitEmitData[i];
      }
    }
  }
}

export interface IBridgingTokens {
  [chainId: string]: {
    tokenData: TokenData;
    bridge: `0x${string}`;
  }[];
}

export function getBridgeTokens(daos: IDAOData[]): IBridgingTokens {
  const r: IBridgingTokens = {};
  for (const dao of daos) {
    const deploymentChainIds = Object.keys(dao.deployments);
    if (deploymentChainIds.length > 1) {
      for (const chainId of deploymentChainIds) {
        const tokenAddress = dao.deployments[chainId][ContractIndices.TOKEN_3];
        const tokenBridge =
          dao.deployments[chainId][ContractIndices.TOKEN_BRIDGE_8];
        const xTokenAddress =
          dao.deployments[chainId][ContractIndices.X_TOKEN_4];
        const xTokenBridge =
          dao.deployments[chainId][ContractIndices.X_TOKEN_BRIDGE_9];

        if (tokenAddress && tokenBridge) {
          const tokenData = getTokenData(chainId, tokenAddress);
          if (tokenData) {
            if (!r[chainId]) {
              r[chainId] = [];
            }

            r[chainId].push({
              tokenData,
              bridge: tokenBridge,
            });
          }
        }

        if (xTokenAddress && xTokenBridge) {
          const tokenData = getTokenData(chainId, xTokenAddress);
          if (tokenData) {
            r[chainId].push({
              tokenData,
              bridge: xTokenBridge,
            });
          }
        }
      }
    }
  }
  return r;
}
