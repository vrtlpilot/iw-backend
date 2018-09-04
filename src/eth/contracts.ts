import fs = require('fs');
import web3, {ethUrl} from './util';
import { notNull, sleep } from '../util/common';

// Defintion of 'from' address.
const accountAddr = process.env.ETH_FROM_ACCOUNT || web3.eth.coinbase;
// Default price.
const priceGas = process.env.ETH_DEPLOY_PRICE || 300000;
// Default wait for block timeout.
const blocksTimeout = process.env.ETH_WAIT_TIMEOUT || 30000;
// Private key or password.
const privateKey = process.env.ETH_PRIVATE_KEY || "";

// Read the compiled contract code
const source = fs.readFileSync("contracts.json", 'utf8');
const contracts = JSON.parse(source)["contracts"];

/**
 * Get contract by name.
 * @param name 
 */
function getContract(name: string) {
    // Get source
    const src = contracts[name].src;

    // Get ABI description
    const abi = contracts[name].abi;

    // Smart contract EVM bytecode as hex
    const bin = '0x' + contracts[name].bin;

    // Create Contract proxy class
    const proxy = web3.eth.contract(abi);
    return {
        factory: proxy,
        code: bin,
        source: src
    }
}

/**
 * Wait for blocks to be mined. 
 * @param contract 
 * @param timeout 
 */
async function waitForBlocks(contract, timeout) {
    let address = undefined;
    while (true) {
        let receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
        if (receipt && receipt.contractAddress) {
            console.log(`Contract has been deployed with address: ${receipt.contractAddress}`);
            address = receipt.contractAddress;
            break;
        }
        console.log(`Waiting... currently in block: ${web3.eth.blockNumber}`);
        await sleep(timeout);
    }
    return address;
}

/**
 * Deploy a contract with given name.
 * @param name
 * @param args 
 */
export async function deployContract(name: string, ...args) {
    notNull(name, 'Contract name');
    web3.personal.unlockAccount(accountAddr, privateKey, 60000);
    console.log("Unlocked the account...");
    // Create contract instance.
    const { factory, code, source } = getContract(name);

    console.log("Deploying the contract...");
    // Deploy the contract.
    const contract = factory.new(args, {from: accountAddr, gas: priceGas, data: code});
    // Transaction has entered to memory pool
    console.log(`Contract is being deployed in transaction at ${ethUrl}, hash: ${contract.transactionHash}`);
    const encAbi = factory.new.getData(args, {data: code});

    const _address = await waitForBlocks(contract, blocksTimeout);
    return {
        name: name,
        src: source,
        abi: encAbi,
        address: _address,
    }
}

