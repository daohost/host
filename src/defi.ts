export interface IDeFiOrganization {
  name: string;
  img: string;
  website: string;
  protocols: { [protocolId: string]: IDeFiProtocol };
  defiLlama?: string;
  github?: string;
}

export interface IDeFiProtocol {
  name: string;
  category: DefiCategory;
  engine: DexEngine | LendingEngine | OracleEngine;
  deployed?: string | number; // date string or UNIX timestamp
  deployments?: {
    [chainId: string]: IDefiProtocolDeployments;
  };
  subgraph?: {
    [chainId: string]: `https://${string}`;
  };
  moreSubgraphs?: {
    [chainId: string]: {
      [subgraphName: string]: `https://${string}`;
    };
  };
  img?: string; // separate img for protocol, org image used by default
}

export interface IDefiProtocolDeployments {
  [contractName: string]: `0x${string}`;
}

export enum DefiCategory {
  ORACLE = "Oracle",
  AMM = "AMM",
  LENDING = "Lending",
  ALM = "ALM",
  DEX_AGG = "DeX agg",
  YIELD_AGG = "Yield agg",
  VE_AGG = "VE-agg",
  REWARDING = "Rewarding",
  ERC4626 = "ERC-4626",
  LSP = "LSP",
  INTERCHAIN = "Interchain",
  CDP = "CDP",
}

export const enum LendingEngine {
  AAVE_2 = "Aave v2",
  AAVE_3_0_2 = "Aave v3.0.2",
  AAVE_3_0_2_CUSTOM = "Aave v3.0.2 custom",
  AAVE_3_5 = "Aave v3.5",
  AAVE_4 = "Aave v4",
  COMPOUND_2 = "Compound v2",
  COMPOUND_3 = "Compound v3",
  MORPHO_BLUE = "Morpho Blue",
  SPARK = "Spark",
}

export enum DexEngine {
  UNISWAP_V2 = "Uniswap V2",
  UNISWAP_V3 = "Uniswap V3",
  UNISWAP_V4 = "Uniswap V4",
  CURVE = "Curve",
}

export enum OracleEngine {
  CHAINLONK = "ChainLonk",
}

export const defi: { [org: string]: IDeFiOrganization } = {
  uniswap: {
    name: "Uniswap",
    img: "Uniswap.svg",
    website: "https://uniswap.org",
    defiLlama: "uniswap",
    github: "Uniswap",
    protocols: {
      v2: {
        name: "Uniswap V2",
        category: DefiCategory.AMM,
        engine: DexEngine.UNISWAP_V2,
        deployments: {
          "1": {
            UniswapV2Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
            UniswapV2Router02: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
          },
        },
        // https://docs.uniswap.org/api/subgraph/overview
        subgraph: {
          // 0.0.3
          // https://thegraph.com/explorer/subgraphs/A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum",
        },
      },
      v3: {
        name: "Uniswap V3",
        category: DefiCategory.AMM,
        engine: DexEngine.UNISWAP_V3,
        deployments: {
          "1": {
            UniswapV3Factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
            SwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
            SwapRouter02: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
          },
        },
        subgraph: {
          // 0.0.3
          // https://thegraph.com/explorer/subgraphs/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV",
        },
      },
      v4: {
        name: "Uniswap V4",
        category: DefiCategory.AMM,
        engine: DexEngine.UNISWAP_V4,
        deployments: {
          "1": {
            PoolManager: "0x000000000004444c5dc75cB358380D2e3dE08A90",
            UniversalRouter: "0x66a9893cC07D91D95644AEDD05D03f95e1dBA8Af",
          },
        },
        subgraph: {
          // 0.0.1
          // https://thegraph.com/explorer/subgraphs/DiYPVdygkfjDWhbxGSqAQxwBKmfKnkWQojqeM2rkLb3G?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/DiYPVdygkfjDWhbxGSqAQxwBKmfKnkWQojqeM2rkLb3G",
        },
      },
    },
  },
  pancakeswap: {
    name: "PancakeSwap",
    img: "pancakeswap.svg",
    website: "https://pancakeswap.finance/",
    defiLlama: "pancakeswap",
    github: "pancakeswap",
    protocols: {
      v2: {
        name: "PancakeSwap V2",
        category: DefiCategory.AMM,
        engine: DexEngine.UNISWAP_V2,
        deployments: {
          "1": {
            PancakeFactory: "0x1097053Fd2ea711dad45caCcc45EfF7548fCB362",
          },
        },
        // https://developer.pancakeswap.finance/apis/subgraph
        subgraph: {
          // 0.0.1
          // https://thegraph.com/explorer/subgraphs/9opY17WnEPD4REcC43yHycQthSeUMQE26wyoeMjZTLEx?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/9opY17WnEPD4REcC43yHycQthSeUMQE26wyoeMjZTLEx",
        },
      },
      v3: {
        name: "PancakeSwap V3",
        category: DefiCategory.AMM,
        engine: DexEngine.UNISWAP_V3,
        deployments: {
          "1": {
            PancakeV3Factory: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
          },
        },
        // https://developer.pancakeswap.finance/apis/subgraph
        subgraph: {
          // 0.0.1
          // https://thegraph.com/explorer/subgraphs/CJYGNhb7RvnhfBDjqpRnD3oxgyhibzc7fkAMa38YV3oS?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/CJYGNhb7RvnhfBDjqpRnD3oxgyhibzc7fkAMa38YV3oS",
        },
      },
    },
  },
  sushi: {
    name: "Sushi",
    img: "sushi.svg",
    website: "https://www.sushi.com/",
    defiLlama: "sushi",
    github: "sushi-labs",
    protocols: {
      v2: {
        name: "SushiSwap V2",
        category: DefiCategory.AMM,
        engine: DexEngine.UNISWAP_V2,
        deployments: {
          "1": {
            UniswapV2Factory: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
          },
        },
        // https://docs.sushi.com/subgraphs/cpamm + search
        subgraph: {
          // 1.0.2
          // https://thegraph.com/explorer/subgraphs/GyZ9MgVQkTWuXGMSd3LXESvpevE8S8aD3uktJh7kbVmc?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/GyZ9MgVQkTWuXGMSd3LXESvpevE8S8aD3uktJh7kbVmc",
        },
      },
      v3: {
        name: "SushiSwap V3",
        category: DefiCategory.AMM,
        engine: DexEngine.UNISWAP_V3,
        deployments: {
          "1": {
            UniswapV3Factory: "0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F",
          },
        },
        // https://docs.sushi.com/subgraphs/clamm
        subgraph: {
          // 1.0.2
          // https://thegraph.com/explorer/subgraphs/5nnoU1nUFeWqtXgbpC54L9PWdpgo7Y9HYinR3uTMsfzs?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/5nnoU1nUFeWqtXgbpC54L9PWdpgo7Y9HYinR3uTMsfzs",
        },
      },
    },
  },
  curve: {
    name: "Curve",
    img: "Curve.svg",
    website: "https://curve.fi",
    defiLlama: "curve-finance",
    github: "curvefi",
    protocols: {
      // all Curve pool types
      curve: {
        name: "Curve",
        category: DefiCategory.AMM,
        engine: DexEngine.CURVE,
        deployments: {
          "1": {
            CurveRouterV12: "0x45312ea0eFf7E09C83CBE249fa1d7598c4C8cd4e",
          },
        },
        subgraph: {
          // https://thegraph.com/explorer/subgraphs/F2xRBFnFHZiAWKdHe3brsHDUSQfLP9bYD17ABiaiBmq5?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/F2xRBFnFHZiAWKdHe3brsHDUSQfLP9bYD17ABiaiBmq5",
        },
      },
    },
  },
  chainlink: {
    name: "ChainLink",
    img: "Chainlink.svg",
    website: "https://chain.link",
    defiLlama: "chainlink",
    github: "smartcontractkit",
    protocols: {
      chainlink: {
        name: "Data Feeds",
        category: DefiCategory.ORACLE,
        engine: OracleEngine.CHAINLONK,
        deployments: {
          "1": {
            AuthorizedForwarder: "0x87B331d3bb9Cf70Dd85c3dc606B684a0bd61c772",
            feed_ETH_USD: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
          },
        },
      },
    },
  },
  aave: {
    name: "Aave",
    img: "Aave.png",
    website: "https://aave.com",
    defiLlama: "aave",
    github: "aave",
    protocols: {
      v2: {
        name: "Aave V2",
        category: DefiCategory.LENDING,
        engine: LendingEngine.AAVE_2,
        deployed: "Nov 30, 2020",
        deployments: {
          "1": {
            LendingPoolAddressesProvider:
              "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
            LendingPool: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9",
          },
        },
        // https://github.com/aave/protocol-subgraphs?tab=readme-ov-file
        subgraph: {
          // https://thegraph.com/explorer/subgraphs/8wR23o1zkS4gpLqLNU4kG3JHYVucqGyopL5utGxP2q1N?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/8wR23o1zkS4gpLqLNU4kG3JHYVucqGyopL5utGxP2q1N",
        },
      },
      v3: {
        name: "Aave V3",
        category: DefiCategory.LENDING,
        engine: LendingEngine.AAVE_3_5,
        deployed: "Dec 29, 2022",
        deployments: {
          "1": {
            PoolAddressesProvider: "0x2f39d218133afab8f2b819b1066c7e434ad94e9e",
            PoolInstance: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
            UIPoolDataProvider: "0x3f78bbd206e4d3c504eb854232eda7e47e9fd8fc",
          },
        },
        subgraph: {
          // https://thegraph.com/explorer/subgraphs/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g",
        },
      },
      v4: {
        name: "Aave V4",
        category: DefiCategory.LENDING,
        engine: LendingEngine.AAVE_4,
        deployed: "Mar 23, 2026",
        deployments: {
          "1": {
            // HubInstance (Hubs)
            Core: "0xCca852Bc40e560adC3b1Cc58CA5b55638ce826c9",
            Prime: "0x943827DCA022D0F354a8a8c332dA1e5Eb9f9F931",
            Plus: "0x06002e9c4412CB7814a791eA3666D905871E536A",
            // SpokeInstance
            MainSpoke: "0x94e7A5dCbE816e498b89aB752661904E2F56c485",
            BluechipSpoke: "0x973a023A77420ba610f06b3858aD991Df6d85A08",
            GoldSpoke: "0x65407b940966954b23dfA3caA5C0702bB42984DC",
            EtherfiESpoke: "0xbF10BDfE177dE0336aFD7fcCF80A904E15386219",
            ForexSpoke: "0xD8B93635b8C6d0fF98CbE90b5988E3F2d1Cd9da1",
          },
        },
        subgraph: {
          // 0.1.1
          // https://thegraph.com/explorer/subgraphs/2Gu5HCAnWrNk2pXidscdhNEQhrwLgMKmssuCe9JhZhAe?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/2Gu5HCAnWrNk2pXidscdhNEQhrwLgMKmssuCe9JhZhAe",
        },
      },
    },
  },
  compound: {
    name: "Compound",
    img: "Compound.png",
    website: "https://compound.finance",
    protocols: {
      compoundV2: {
        name: "Compound V2",
        category: DefiCategory.LENDING,
        engine: LendingEngine.COMPOUND_2,
        deployments: {
          "1": {
            Comptroller: "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
          },
        },
        subgraph: {
          // 2.0.1_1.9.0
          // https://thegraph.com/explorer/subgraphs/4TbqVA8p2DoBd5qDbPMwmDZv3CsJjWtxo8nVSqF2tA9a?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/4TbqVA8p2DoBd5qDbPMwmDZv3CsJjWtxo8nVSqF2tA9a",
        },
      },
      compoundV3: {
        name: "Compound V3",
        category: DefiCategory.LENDING,
        engine: LendingEngine.COMPOUND_3,
        deployments: {
          "1": {
            cUSDCv3: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
            cUSDSv3: "0x5D409e56D886231aDAf00c8775665AD0f9897b56",
            cUSDTv3: "0x3Afdc9BCA9213A35503b077a6072F3D0d5AB0840",
            cWBTCv3: "0xe85Dc543813B8c2CFEaAc371517b925a166a9293",
            cWETHv3: "0xA17581A9E3356d9A858b789D68B4d866e593aE94",
            cWstETHv3: "0x3D0bb1ccaB520A66e607822fC55BC921738fAFE3",
          },
        },
        subgraph: {
          // 3.1.0_2.3.0
          // https://thegraph.com/explorer/subgraphs/AwoxEZbiWLvv6e3QdvdMZw4WDURdGbvPfHmZRc8Dpfz9?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/AwoxEZbiWLvv6e3QdvdMZw4WDURdGbvPfHmZRc8Dpfz9",
        },
      },
    },
    defiLlama: "compound-finance",
    github: "compound-finance",
  },
};
