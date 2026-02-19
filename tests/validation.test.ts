import { Activity, LifecyclePhase } from "../src";
import { Validation } from "../src/validation";
import { FundingType, IFunding, IVesting } from "../src/host";
import { IHostSettings } from "../src/host/types";

describe("testing DAO data validation", () => {
  const START_DAO = 1772323200; // Sunday, 1 March 2026
  const DAY = 24 * 60 * 60; // seconds in a day
  const settings = getIOSSettings();

  function makeFunding(opts: {
    type: FundingType;
    startOffsetDays?: number;
    durationDays?: number;
    minRaise?: number;
    maxRaise?: number;
    claim?: number;
  }): IFunding {
    const startOffsetDays = opts.startOffsetDays ?? 1;
    const durationDays = opts.durationDays ?? 10;
    const minRaise = opts.minRaise ?? 1e12;
    const maxRaise = opts.maxRaise ?? 1e15;

    const start = START_DAO + startOffsetDays * DAY;
    return {
      start: start,
      end: start + durationDays * DAY,
      minRaise,
      maxRaise,
      type: opts.type,
      claim: opts.claim,
    } as any;
  }

  function makeSingleVesting(opts: {
    name?: string;
    startOffsetDays?: number;
    durationDays?: number;
    allocation?: number;
  }): IVesting[] {
    const startOffsetDays = opts.startOffsetDays ?? 30;
    const durationDays = opts.durationDays ?? 20;
    return [
      {
        name: opts.name ?? "Vesting",
        allocation: opts.allocation ?? 90.0,
        start: START_DAO + startOffsetDays * DAY,
        end: START_DAO + (startOffsetDays + durationDays) * DAY,
      },
    ];
  }

  function getIOSSettings(): IHostSettings {
    return {
      priceDao: 1000,
      fundingFee: 1000,
      minNameLength: 1,
      maxNameLength: 20,
      minSymbolLength: 1,
      maxSymbolLength: 7,
      minVePeriod: 14,
      maxVePeriod: 365 * 4,
      minPvPFee: 10,
      maxPvPFee: 100,
      minFunding: 100e8,
      minFundingDuration: 86400,
      maxFundingDuration: 180 * 86400,
      minFundingRaise: 1e11,
      maxFundingRaise: 1e19,
      minVestingNameLen: 1,
      maxVestingNameLen: 20,
      minVestingDuration: 10 * 86400,
      maxVestingDuration: 365 * 4 * 86400,
      minCliff: 15 * 86400,
    };
  }

  function getTge(opt?: { claim?: number }): IFunding {
    return makeFunding({
      type: FundingType.TGE,
      claim: opt ? opt.claim : START_DAO + 10 * DAY,
    });
  }

  describe("Activity", () => {
    test("validate activity no exceptions", () => {
      Validation.validateActivity([Activity.DEFI, Activity.MEV]);
      Validation.validateActivity([Activity.DEFI]);
    });

    test("validate activity duplicate", () => {
      expect(() => {
        Validation.validateActivity([
          Activity.DEFI,
          Activity.MEV,
          Activity.MEV,
        ]);
      }).toThrow("InvalidActivityCombination");
      expect(() => {
        Validation.validateActivity([Activity.MEV, Activity.MEV]);
      }).toThrow("InvalidActivityCombination");
    });

    test("validate activities not zero array", () => {
      expect(() => {
        Validation.validateActivity([]);
      }).toThrow("ZeroActivityNotAllowed");
    });
  });

  describe("Funding", () => {
    test("Normal case: single and two funding entries", () => {
      const fundingTypes = [FundingType.TGE, FundingType.SEED];
      for (const ft of fundingTypes) {
        const f1 = makeFunding({ type: ft });
        expect(() =>
          Validation.validateFunding(LifecyclePhase.DRAFT, [f1], settings),
        ).not.toThrow();

        const f2 = makeFunding({
          type: ft === FundingType.SEED ? FundingType.TGE : FundingType.SEED,
        });
        expect(() =>
          Validation.validateFunding(LifecyclePhase.DRAFT, [f1, f2], settings),
        ).not.toThrow();
      }
    });

    test("testValidateSeedFundingPositive", () => {
      const funding = makeFunding({ type: FundingType.SEED });
      expect(() =>
        Validation.validateFunding(LifecyclePhase.DRAFT, [funding], settings),
      ).not.toThrow();
    });

    test("testValidateTgeFundingPositive", () => {
      const funding = makeFunding({ type: FundingType.TGE });
      expect(() =>
        Validation.validateFunding(
          LifecyclePhase.DEVELOPMENT,
          [funding],
          settings,
        ),
      ).not.toThrow();
    });

    test("Bad path: non\-unique funding types -> InvalidFundingArray", () => {
      const fundingTypes = [FundingType.TGE, FundingType.SEED];
      for (const ft of fundingTypes) {
        const f0 = makeFunding({ type: ft });
        const f1 = makeFunding({ type: ft });
        expect(() =>
          Validation.validateFunding(LifecyclePhase.DRAFT, [f0, f1], settings),
        ).toThrow("InvalidFundingArray");
      }
    });

    test("Bad path: end < start => InvalidFundingPeriod", () => {
      const f = makeFunding({ type: FundingType.SEED });
      f.end = 0; // (!)
      expect(() =>
        Validation.validateFunding(LifecyclePhase.DRAFT, [f], settings),
      ).toThrow("InvalidFundingPeriod");
    });

    test("duration < minFundingDuration -> InvalidFundingPeriod", () => {
      const f1 = makeFunding({
        type: FundingType.SEED,
        durationDays: settings.minFundingDuration / 86400,
      });
      Validation.validateFunding(LifecyclePhase.DRAFT, [f1], settings);

      const f0 = makeFunding({
        type: FundingType.SEED,
        durationDays: settings.minFundingDuration - 1,
      });
      expect(() =>
        Validation.validateFunding(LifecyclePhase.DRAFT, [f0], settings),
      ).toThrow("InvalidFundingPeriod");
    });

    test("duration > maxFundingDuration -> InvalidFundingPeriod", () => {
      const f1 = makeFunding({
        type: FundingType.SEED,
        durationDays: settings.maxFundingDuration / 86400,
      });
      Validation.validateFunding(LifecyclePhase.DRAFT, [f1], settings);

      const f = makeFunding({
        type: FundingType.SEED,
        durationDays: settings.maxFundingDuration + 1,
      });
      expect(() =>
        Validation.validateFunding(LifecyclePhase.DRAFT, [f], settings),
      ).toThrow("InvalidFundingPeriod");
    });

    test("minRaise and maxRaise have bound values, ok", () => {
      const st = getIOSSettings();
      const fNormal = makeFunding({
        type: FundingType.SEED,
        minRaise: st.minFundingRaise,
        maxRaise: st.maxFundingRaise,
      });
      Validation.validateFunding(LifecyclePhase.DRAFT, [fNormal], st);
    });

    test("minRaise > maxRaise => InvalidFundingRaise", () => {
      const f = makeFunding({
        type: FundingType.SEED,
        minRaise: settings.minFundingRaise + 1,
        maxRaise: settings.minFundingRaise, // (!)
      });
      expect(() =>
        Validation.validateFunding(LifecyclePhase.DRAFT, [f], settings),
      ).toThrow("InvalidFundingRaise");
    });

    test("minRaise < minFundingRaise => InvalidFundingRaise", () => {
      const f = makeFunding({
        type: FundingType.SEED,
        minRaise: settings.maxFundingRaise - 1,
        maxRaise: settings.maxFundingRaise + 1,
      });
      expect(() =>
        Validation.validateFunding(LifecyclePhase.DRAFT, [f], settings),
      ).toThrow("InvalidFundingRaise");
    });

    test("maxRaise > maxFundingRaise => InvalidFundingRaise", () => {
      const f = makeFunding({
        type: FundingType.SEED,
        minRaise: settings.minFundingRaise,
        maxRaise: settings.maxFundingRaise + 100e5,
      });
      expect(() =>
        Validation.validateFunding(LifecyclePhase.DRAFT, [f], settings),
      ).toThrow("InvalidFundingRaise");
    });

    test("tableValidateFundingNegativeBadPhase -> TooLateToUpdateSuchFunding", () => {
      const fSeed = makeFunding({ type: FundingType.SEED });
      expect(() =>
        Validation.validateFunding(
          LifecyclePhase.DEVELOPMENT,
          [fSeed],
          settings,
        ),
      ).toThrow("TooLateToUpdateSuchFunding");

      const fTge = makeFunding({ type: FundingType.TGE });

      expect(() =>
        Validation.validateFunding(LifecyclePhase.LIVE, [fTge], settings),
      ).toThrow("TooLateToUpdateSuchFunding");
    });
  });

  describe("Vesting", () => {
    test("vesting name length", () => {
      const st: IHostSettings = {
        ...getIOSSettings(),
        minVestingNameLen: 5,
        maxVestingNameLen: 7,
      };

      Validation.validateVesting(
        LifecyclePhase.TGE,
        makeSingleVesting({ name: "12345" }),
        st,
        getTge(),
      );
      Validation.validateVesting(
        LifecyclePhase.TGE,
        makeSingleVesting({ name: "1234567" }),
        st,
        getTge(),
      );

      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          makeSingleVesting({ name: "1234" }),
          st,
          getTge(),
        ),
      ).toThrow("NameLength(4)");
      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          makeSingleVesting({ name: "12345678" }),
          st,
          getTge(),
        ),
      ).toThrow("NameLength(8)");
    });

    test("zero allocation is not allowed", () => {
      const normal = [
        ...makeSingleVesting({ name: "1", allocation: 99 }),
        ...makeSingleVesting({ name: "1", allocation: 0 }), // (!)
      ];
      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          normal,
          settings,
          getTge(),
        ),
      ).toThrow("ZeroValueNotAllowed");
    });

    test("total sum of allocations must be less than 100%", () => {
      const normal = [
        ...makeSingleVesting({ name: "1", allocation: 99 }),
        ...makeSingleVesting({ name: "1", allocation: 0.99 }),
      ];
      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          normal,
          settings,
          getTge(),
        ),
      ).not.toThrow();

      const oneHundred = [
        ...makeSingleVesting({ name: "1", allocation: 99 }),
        ...makeSingleVesting({ name: "1", allocation: 1 }),
      ];
      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          oneHundred,
          settings,
          getTge(),
        ),
      ).toThrow("TotalAllocationTooHigh");

      const exceedHundred = [
        ...makeSingleVesting({ name: "1", allocation: 50 }),
        ...makeSingleVesting({ name: "1", allocation: 51 }),
      ];
      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          exceedHundred,
          settings,
          getTge(),
        ),
      ).toThrow("TotalAllocationTooHigh");
    });

    test("throw if vesting duration is out of range", () => {
      const st: IHostSettings = {
        ...settings,
        minVestingDuration: 10,
        maxVestingDuration: 20,
      };
      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          makeSingleVesting({
            name: "1",
            allocation: 90,
            startOffsetDays: 30,
            durationDays: 9,
          }),
          st,
          getTge({ claim: START_DAO + 15 * DAY }),
        ),
      ).toThrow("InvalidVestingPeriod");

      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          makeSingleVesting({
            name: "1",
            allocation: 90,
            startOffsetDays: 30,
            durationDays: 21,
          }),
          st,
          getTge({ claim: START_DAO + 15 * DAY }),
        ),
      ).toThrow("InvalidVestingPeriod");
    });

    test("no tge => vesting is not allowed", () => {
      const normal = [
        ...makeSingleVesting({ name: "1", allocation: 99 }),
        ...makeSingleVesting({ name: "1", allocation: 0.99 }),
      ];

      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          normal,
          settings,
          undefined,
        ),
      ).toThrow("VestingNotAllowed");

      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          normal,
          settings,
          getTge({ claim: undefined }),
        ),
      ).toThrow("VestingNotAllowed");

      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          [], // no vesting entries
          settings,
          undefined,
        ),
      ).not.toThrow();
    });

    test("vesting.start > tge.claim + min cliff, ok", () => {
      const st: IHostSettings = { ...settings, minCliff: 5 };
      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          makeSingleVesting({ name: "1", allocation: 90, startOffsetDays: 20 }),
          st,
          getTge({ claim: START_DAO + 15 * DAY }),
        ),
      ).not.toThrow();
    });

    test("vesting.start < tge.claim + min cliff => IncorrectVestingStart", () => {
      const st: IHostSettings = { ...settings, minCliff: 5 * 86400 };
      expect(() =>
        Validation.validateVesting(
          LifecyclePhase.TGE,
          makeSingleVesting({ name: "1", allocation: 90, startOffsetDays: 20 }),
          st,
          getTge({ claim: START_DAO + 16 * DAY }),
        ),
      ).toThrow("IncorrectVestingStart");
    });
  });
});
