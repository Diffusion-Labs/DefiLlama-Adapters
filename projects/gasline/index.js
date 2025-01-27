const { staking } = require("../helper/staking");
const { sumTokensExport } = require("../helper/unwrapLPs");

const config = {
  blast: { gasline: '0xD5400cAc1D76f29bBb8Daef9824317Aaf9d3C0a1', gas: '0x5d61c3f602579873Bb58d8DF53a9d82942de5267', weth: '0x4300000000000000000000000000000000000004', },
  bsc: { gasline: '0x35138Ddfa39e00C642a483d5761C340E7b954F94', gas: '0xd0245a9fe3D8366e8c019ce9CE4cAdFF0cEabB76', weth: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', },
}

Object.keys(config).forEach(chain => {
  const {gasline, gas, weth} = config[chain]
  module.exports[chain] = {
    tvl: sumTokensExport({ owner: gasline, tokens: [weth] }),
    staking: staking(gasline, gas, chain),
    borrowed: async (_, _b, _cb, { api, }) => {
      const supply = await api.call({  abi: 'erc20:totalSupply', target: gasline})
      api.addGasToken(supply)
    },
  }
})
