// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const PofModule = buildModule("PofModule", (m) => {

  const pof = m.contract("ProofOfExistence");

  return { pof };
});

export default PofModule;
