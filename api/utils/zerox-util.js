let { ContractWrappers } = require("@0x/contract-wrappers");
let constants = require("../../config/constants");
let { Web3Wrapper } = require("@0x/web3-wrapper");
let utils = require("../utils/helper");

const contractWrappers = new ContractWrappers(utils.providerEngine(), {
  chainId: parseInt(constants.MATIC_CHAIN_ID),
});
const web3Wrapper = new Web3Wrapper(utils.providerEngine());
const [
  from1,
  from2,
  from3,
  from4,
  from5,
] = await web3Wrapper.getAvailableAddressesAsync();

async function execute(signedOrder, takerSign) {
  

  let tx = await contractWrappers.exchange
    .executeTransaction(takerSign, takerSign.signature)
    .awaitTransactionSuccessAsync({
      from: from4,
      gas: 8000000,
      gasPrice: 10000000000,
      value: utils.calculateProtocolFee([signedOrder]),
    });
  utils.providerEngine().stop();
  return tx.transactionHash;
}

async function executeSwap(signedOrder) {

  tx = await contractWrappers.exchange
    .fillOrder(signedOrder, signedOrder.takerAssetAmount, signedOrder.signature)
    .awaitTransactionSuccessAsync({
      from: from3,
      gas: 8000000,
      gasPrice: 10000000000,
      value: utils.calculateProtocolFee([signedOrder]),
    });
  utils.providerEngine().stop();
  return tx;
}

module.exports = {
  execute,
};
