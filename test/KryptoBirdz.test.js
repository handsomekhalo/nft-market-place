const { assert } = require("chai");
const KryptoBird = artifacts.require("./KryptoBird");

//check for chai

require("chai")
  .use(require("chai-as-promised"))
  .should();

//write contract than can focilltate tesr

contract("KryptoBird", (accounts) => {
  let contract;
  //run before hook  , to run asysnc pattern and telss test to run this first before anything

  before(async () => {
    //bring in contratc within testing unit
    contract = await KryptoBird.deployed();
  });
  let name;
  let symbol;

  //testing container-describe
  describe("deployment", async () => {
    //test samples with writing it
    it("deploys succesfully", async () => {
      const address = contract.address;

      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, undefined);
    });
    it("has name", async () => {
      const name = await contract.name();
      assert.equal(name, "KryptoBird");
    });
    it("correct symbol", async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, "KBIRDZ");
    });
  });

  //minting container
  describe("minting", async () => {
    it("crate a new token", async () => {
      const result = await contract.mint("https...1");
      const totalSupply = await contract.totalSupply();

      //success result
      assert.equal(totalSupply, 1);
      const event = result.logs[0].args;

      //test  to check address from is 0
      assert.equal(
        event._from,
        "0x0000000000000000000000000000000000000000",
        "from is the contract"
      );
      assert.equal(event._to, accounts[0], "to is the msg.sender");

      //in event mintinh fials

      await contract.mint("https...1").should.be.rejected;
    });
  });

  //test container for indexing
  describe("indexing", async () => {
    //loop through arry of our kbirds
    it("lists of KryptoBirdz", async () => {
      //mint three tokens
      await contract.mint("https...2");
      await contract.mint("https...3");
      await contract.mint("https...4");

      const totalSupply = await contract.totalSupply();
      //loop through list nad grab kbirdz from list
      let result = [];
      let KryptoBird;

      for (i = 1; i <= totalSupply; i++) {
        //set each bird to the ones in the contract
        KryptoBird = await contract.kryptoBirdz(i - 1);
        result.push(KryptoBird);
      }
      //assert that our new array result eqiuals expected tokens
      let expected = ["https...1", "https...2", "https...3", "https...4"];
      assert.equal(result.join(","), expected.join(","));
    });
  });
});
