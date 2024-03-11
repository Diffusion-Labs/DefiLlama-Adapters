const { sumTokensExport } = require("../helper/unwrapLPs");
const { getLogs } = require('../helper/cache/getLogs');

const tokens = [
  "0xcda86a272531e8640cd7f1a92c01839911b90bb0", // mETH
  "0x5be26527e817998a7206475496fde1e68957c5a6", // USDY
  "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8", // USDC
];

const MethLabRegistry = "0x6Cc0c2D8F9533dFd2276337DdEaBBCEE9dd0747F";
const startBlock = 51252932;
const startTimestamp = 1706565876;

async function tvl (_, _1, _2, { api }) {
  const vaults = await getLogs({
    api,
    target: MethLabRegistry,
    topic: 'VaultAdded(address)',
    eventAbi: 'event VaultAdded(address indexed vault)',
    onlyArgs: true,
    fromBlock: startBlock
  });
  const loans  = await getLogs({
    api,
    target: MethLabRegistry,
    topic: 'LoanAdded(address,address)',
    eventAbi: 'event LoanAdded(address indexed vault, address indexed loan)',
    onlyArgs: true,
    fromBlock: startBlock,
    skipCache: true
  });
  const owners = [...vaults.map(v => v.vault), ...loans.map(l => l.loan)];
  return await sumTokensExport({ owners, tokens, })(_, _1, _2, { api });
};

module.exports = { 
  start: startTimestamp,
  mantle: { tvl }
};
