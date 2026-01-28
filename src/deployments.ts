export interface IHostDeployment {
  proxyFactory: `0x${string}`;
  initCodeHash: string;
  host?: `0x${string}`;
}

export const hostDeployments: { [chainId: string]: IHostDeployment } = {
  ["1"]: {
    proxyFactory: "0x8CB6E685B14eD9176EB98FA4240F1FC54bf32953",
    initCodeHash:
      "0xbfa868ffd76ce3f4cec7c8358e958221afc21ea923aaff7ba57279e071a285eb",
  },
  ["146"]: {
    proxyFactory: "0x046e7a007C331e0d4DafA66104744dB14a52bBBb",
    initCodeHash:
      "0xee56006017bf7ee8564162672c3f31da7be3ed5c3afc7e321070e3ff384ce42d",
  },
  ["9745"]: {
    proxyFactory: "0x7d6530aA46F5a72F4d1CA658d372A7eDe5De4Ce1",
    initCodeHash:
      "0xdf3aeaee70da7d0d1eecf8fdcd9cd051c74d50d897172f8771142f3c5f8b4e46",
  },
};
