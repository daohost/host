export interface IHostDeployment {
  proxyFactory: `0x${string}`;
  proxyInitCode: string;
  host?: `0x${string}`;
  dataReader?: `0x${string}`;
  authority?: `0x${string}`;
  codec?: `0x${string}`;
}

export const hostDeployments: { [chainId: string]: IHostDeployment } = {
  ["1"]: {
    proxyFactory: "0xf2fb1E671d0c0D896e2faFB8c6f3ad5535bCfC57",
    proxyInitCode:
      "0x3d602d80600a3d3981f3363d3d373d3d3d363d73182cb8b926b4b946cff1e80d4edc7ce4621bff675af43d82803e903d91602b57fd5bf3",
    host: "0xaAAAAaaaaa0E3D26D4733570F4e4584D7872dDE2",
    dataReader: "0xddDDdDDDDd9cA61A2CA1D4997AAA79422AC7a3e9",
    authority: "0xEd56870529341277C579d6B056869b8B6BDc4065",
    codec: "0xccccccccccacbe27f2bbe1886dd47f11ea2ecfe7",
  },
  ["146"]: {
    proxyFactory: "0xaf4712B03a83466327aAC3aB45561Bf9765b0A9E",
    proxyInitCode:
      "0x3d602d80600a3d3981f3363d3d373d3d3d363d73e383e946c97034b1ba7b4d572418f8202e7495425af43d82803e903d91602b57fd5bf3",
  },
  ["9745"]: {
    proxyFactory: "0x0C82e8Cb352C8A92cE8c7e8440FB05B5A82070eA",
    proxyInitCode:
      "0x3d602d80600a3d3981f3363d3d373d3d3d363d739004546965dc71acdeeb55c1b15277545bf41d5c5af43d82803e903d91602b57fd5bf3",
  },
};
