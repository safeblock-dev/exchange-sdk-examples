import { JsonRpcSigner, Network } from "ethers"
import getNetworkData from "~/utils/get-network-data.ts"

export default async function requestNetworkChange(network: Network, signer: JsonRpcSigner) {
  const networkData = getNetworkData(network.name)

  const _id = network.chainId.toString()

  const ethereum = signer.provider

  if (!ethereum) return false
  const requestChange = async () => ethereum.send(
    "wallet_switchEthereumChain",
    [{ chainId: `0x${ parseInt(_id).toString(16) }` }]
  ) as Promise<unknown>

  const requestInsert = async () => ethereum.send("wallet_addEthereumChain", [{
    chainId: `0x${ parseInt(_id).toString(16) }`,
    chainName: networkData.name,
    nativeCurrency: {
      name: networkData.symbol,
      symbol: networkData.symbol,
      decimals: 18
    },
    rpcUrls: [networkData.rpcUrl],
    blockExplorerUrls: [networkData.scannerUrl]
  }]) as Promise<unknown>

  return !!(await requestChange().catch(async error => {
    console.log(error?.code)
    if (error?.code !== 4902 && error?.code !== -32603 && error?.code !== "UNKNOWN_ERROR") return false

    if (!(await requestInsert().catch(() => false))) return false

    return !!(await requestChange().catch(() => false))
  }))
}
