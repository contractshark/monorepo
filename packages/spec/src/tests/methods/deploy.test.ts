import test from "ava";
import Web3 from "web3";
import { Sandbox } from "@contractshark/sandbox";
import { deploy } from "../../methods/deploy";

const web3 = new Web3(Sandbox.createProvider({ port: 8545 }));

test("deploys contract from contractshark file", async (t) => {
  const contact = await deploy({
    web3,
    from: await web3.eth.getAccounts().then((a) => a[0]),
    gas: 6000000,
    gasPrice: 1,
    src: "./src/tests/assets/scaffold-b.json",
    contract: "Main",
  });
  const res = await contact.instance.methods.test().call();
  t.is(res, "100");
});

test("deploys contract from truffle file", async (t) => {
  const contact = await deploy({
    web3,
    from: await web3.eth.getAccounts().then((a) => a[0]),
    gas: 6000000,
    gasPrice: 1,
    src: "./src/tests/assets/scaffold-a.json",
  });
  const res = await contact.instance.methods.test().call();
  t.is(res, "123457");
});

test("deploys contract from node_modules", async (t) => {
  try {
    await deploy({
      web3,
      from: await web3.eth.getAccounts().then((a) => a[0]),
      gas: 6000000,
      gasPrice: 1,
      src: "@0xcert/ethereum-utils-contracts/build/ownable.json",
      contract: "Ownable",
    });
    t.pass();
  } catch (e) {
    t.fail();
  }
});
