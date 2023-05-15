import * as fs from "fs";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return function (
    deployer: Truffle.Deployer,
    network: string,
    accounts: Truffle.Accounts
  ) {
    if (network.includes("Mainnet") || network.includes("Testnet")) return;

    (deployer as any).then(async () => {
      const Stacking = artifacts.require("Stacking");
      const Coss = artifacts.require("Coss");
      const Dummy = artifacts.require("DummyERC20");
      const Dex = artifacts.require("Dex");

      await deployer.deploy(Dummy, "Dummy", "DMN");
      await deployer.deploy(Coss);
      await deployer.deploy(Stacking, Coss.address);
      await deployer.deploy(Dex, Stacking.address);
      console.log("Deployed Stacking contract : ", Stacking.address);
      console.log("Deployed Coss contract : ", Coss.address);
      console.log("Deployed Dummy contract : ", Dummy.address);

      const config = require("../dev.config.js");
      try {
        fs.writeFileSync(
          "./dev.config.js",
          `module.exports = ${JSON.stringify(config)}`
        );
      } catch (e: any) {
        console.log(e);
      }
    });
  };
};
