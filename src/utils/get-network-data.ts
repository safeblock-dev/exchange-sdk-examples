import { arbitrum, avalanche, bnb, mainnet, matic, optimism, ton } from "@safeblock/blockchain-utils"
import { base } from "@safeblock/blockchain-utils/dist/networks"

interface NetworkData {
  name: string
  symbol: string
  rpcUrl: string
  scannerUrl: string
  icon: string
}

export const NetworksData: { [key: string]: NetworkData } = {
  [bnb.name]: {
    name: "BSC",
    icon: "chains/bnb",
    symbol: "BNB",
    rpcUrl: "https://bsc-dataseed1.bnbchain.org",
    scannerUrl: "https://bscscan.com/"
  },
  [mainnet.name]: {
    name: "Ethereum",
    icon: "chains/ethereum",
    symbol: "ETH",
    rpcUrl: "https://ethereum-rpc.publicnode.com",
    scannerUrl: "https://etherscan.io/"
  },
  [arbitrum.name]: {
    name: "Arbitrum",
    icon: "chains/arbitrum",
    symbol: "ETH",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    scannerUrl: "https://arbiscan.io/"
  },
  [avalanche.name]: {
    name: "Avalanche",
    icon: "chains/avax",
    symbol: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    scannerUrl: "https://snowtrace.io/"
  },
  [matic.name]: {
    name: "Polygon",
    icon: "chains/polygon",
    symbol: "MATIC",
    rpcUrl: "https://polygon-rpc.com",
    scannerUrl: "https://polygonscan.com/"
  },
  [optimism.name]: {
    name: "Optimism",
    icon: "chains/optimism",
    symbol: "ETH",
    rpcUrl: "https://mainnet.optimism.io",
    scannerUrl: "https://optimistic.etherscan.io/"
  },
  [base.name]: {
    name: "Base",
    icon: "chains/base",
    symbol: "ETH",
    rpcUrl: "https://mainnet.base.org",
    scannerUrl: "https://basescan.org/"
  },
  [ton.name]: {
    name: "TON",
    icon: "chains/open-network",
    symbol: "TON",
    rpcUrl: "https://tonscan.org",
    scannerUrl: "https://tonscan.org/"
  }
}

export const UnknownNetwork: NetworkData = {
  name: "Unknown",
  icon: "",
  symbol: "Unknown",
  rpcUrl: "",
  scannerUrl: ""
}

export default function getNetworkData(slug: string): NetworkData {
  return NetworksData[slug] ?? UnknownNetwork
}
