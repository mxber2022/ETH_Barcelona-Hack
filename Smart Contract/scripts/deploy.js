const hre = require("hardhat");

async function main() {

  const hackathon_memories = await hre.ethers.getContractFactory("HackathonMemories");
  const contract = await hackathon_memories.deploy();
  console.log(contract.target);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

