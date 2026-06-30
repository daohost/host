import { version } from "../package.json";
import { assets, chains, daos, defi, tokenlist } from "../src";

console.log(`## 🍀 Host Library v${version}\n`);

console.log(`* 🏛️ DAOs: ${daos.length}`);
console.log(`* ⛓️ Chains: ${Object.keys(chains).length}`);
console.log(
  `* 🪙 Assets: ${assets.length}. Tokenlist ${tokenlist.version.major}.${tokenlist.version.minor}.${tokenlist.version.patch}: ${tokenlist.tokens.length} tokens for ${tokenlist.tokens.map((t) => t.chainId).filter((value, index, array) => array.indexOf(value) === index).length} chains.`,
);

let protocolsTotal = 0;
for (const defiOrgCode of Object.keys(defi)) {
  protocolsTotal += Object.keys(defi[defiOrgCode].protocols).length;
}

console.log(
  `* 🧩 DeFi organizations: ${Object.keys(defi).length}. Protocols: ${protocolsTotal}`,
);

console.log(``);
