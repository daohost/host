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
  deployments?: {
    [chainId: string]: {
      [contractName: string]: `0x${string}`;
    };
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
  creationDate?: number; // UNIX timestamp
}

export enum DefiCategory {
  ORACLE = "Oracle",
  AMM = "AMM",
  ALM = "ALM",
  LENDING = "Lending",
  DEX_AGG = "DeX agg",
  YIELD_AGG = "Yield agg",
  VE_AGG = "VE-agg",
  REWARDING = "Rewarding",
  ERC4626 = "ERC-4626",
  LSP = "LSP",
  INTERCHAIN = "Interchain",
  CDP = "CDP",
}

export const defi: { [org: string]: IDeFiOrganization } = {
  uniswap: {
    name: "Uniswap",
    img: "Uniswap.svg",
    website: "https://uniswap.org",
    defiLlama: "uniswap",
    github: "Uniswap",
    protocols: {
      uniswapV2: {
        name: "Uniswap V2",
        category: DefiCategory.AMM,
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
      uniswapV3: {
        name: "Uniswap V3",
        category: DefiCategory.AMM,
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
      uniswapV4: {
        name: "Uniswap V4",
        category: DefiCategory.AMM,
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
      pancakeswapV2: {
        name: "PancakeSwap V2",
        category: DefiCategory.AMM,
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
      pancakeswapV3: {
        name: "PancakeSwap V3",
        category: DefiCategory.AMM,
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
      sushiswapV2: {
        name: "SushiSwap V2",
        category: DefiCategory.AMM,
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
      sushiswapV3: {
        name: "SushiSwap V3",
        category: DefiCategory.AMM,
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
        deployments: {
          "1": {
            AuthorizedForwarder: "0x87B331d3bb9Cf70Dd85c3dc606B684a0bd61c772",
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
      aaveV2: {
        name: "Aave V2",
        category: DefiCategory.LENDING,
        deployments: {
          "1": {
            LendingPoolAddressesProvider:
              "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
          },
        },
        // https://github.com/aave/protocol-subgraphs?tab=readme-ov-file
        subgraph: {
          // https://thegraph.com/explorer/subgraphs/8wR23o1zkS4gpLqLNU4kG3JHYVucqGyopL5utGxP2q1N?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/8wR23o1zkS4gpLqLNU4kG3JHYVucqGyopL5utGxP2q1N",
        },
      },
      aaveV3: {
        name: "Aave V3",
        category: DefiCategory.LENDING,
        deployments: {
          "1": {
            PoolAddressesProvider: "0x2f39d218133afab8f2b819b1066c7e434ad94e9e",
          },
        },
        subgraph: {
          // https://thegraph.com/explorer/subgraphs/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g?view=Query&chain=arbitrum-one
          "1": "https://gateway.thegraph.com/api/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g",
        },
      },
    },
  },
};
