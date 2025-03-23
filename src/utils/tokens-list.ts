import { Address, bnb, matic } from "@safeblock/blockchain-utils"

export const tokensList = [
  {
    network: bnb,
    address: Address.from(Address.zeroAddress),
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
    icon: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c/logo.png"
  },
  {
    network: bnb,
    address: Address.from("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"),
    name: "Wrapped BNB",
    symbol: "WBNB",
    decimals: 18,
    icon: "%address/logo.png"
  },
  {
    network: bnb,
    address: Address.from("0x55d398326f99059fF775485246999027B3197955"),
    name: "Tether USD",
    symbol: "USDT",
    decimals: 18,
    icon: "%address/logo.png"
  },
  {
    network: bnb,
    address: Address.from("0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"),
    name: "USD Coin",
    symbol: "USDC",
    decimals: 18,
    icon: "%address/logo.png"
  },
  {
    network: matic,
    address: Address.from(Address.zeroAddress),
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
    icon: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270/logo.png"
  },
  {
    network: matic,
    address: Address.from("0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"),
    name: "Wrapped MATIC",
    symbol: "WMATIC",
    decimals: 18,
    icon: "%address/logo.png"
  },
  {
    network: matic,
    address: Address.from("0xc2132D05D31c914a87C6611C10748AEb04B58e8F"),
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    icon: "%address/logo.png"
  },
  {
    network: matic,
    address: Address.from("0x3c499c542cef5e3811e1192ce70d8cc03d5c3359"),
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    icon: "%address/logo.png"
  }
]