import { Address } from "@safeblock/blockchain-utils"
import { Network } from "ethers"

export interface IToken {
  network: Network
  address: Address
  name: string
  symbol: string
  decimals: number
  icon: string
}