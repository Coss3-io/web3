import { ethers } from "hardhat";

async function main() {
  const Dummy = await ethers.deployContract("DummyERC20", ["Dummy", "DMN"]);
  const Coss = await ethers.deployContract("Coss");
  const Stacking = await ethers.deployContract("Stacking", [
    await Coss.getAddress(),
  ]);
  const Dex = await ethers.deployContract("Dex", [await Stacking.getAddress()]);

  console.log("Deployed Stacking contract : ", Stacking.target);
  console.log("Deployed Coss contract : ", Coss.target);
  console.log("Deployed Dummy contract : ", Dummy.target);
  console.log("Deployed Dex contract : ", Dex.target);

  await Promise.all([
    Dummy.waitForDeployment(),
    Coss.waitForDeployment(),
    Stacking.waitForDeployment(),
    Dex.waitForDeployment(),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
