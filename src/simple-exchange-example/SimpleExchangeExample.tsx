import { Button, Input } from "@headlessui/react"
import { Address, Amount } from "@safeblock/blockchain-utils"
import { ExchangeQuota, SafeBlock, SdkException } from "@safeblock/exchange-sdk"
import BigNumber from "bignumber.js"
import clsx from "clsx"
import { ethers, JsonRpcSigner } from "ethers"
import { ChangeEvent, useEffect, useState } from "react"
import TokenSelector from "~/simple-exchange-example/TokenSelector.tsx"
import requestNetworkChange from "~/utils/request-network-change.ts"
import { tokensList } from "~/utils/tokens-list.ts"

/*
* SDK initialization
*
* Normally, you should initialize the SDK once at the application level.
* Here it's done inside the component just for demonstration purposes.
*/
const sdk = new SafeBlock()

/*
 * Add initial tokens to the SDK
 */
tokensList.forEach(token => {
  sdk.tokensList.add(token)
})

export default function SimpleExchangeExample() {
  // This state stores the amount that will be used for the exchange
  const [amountIn, setAmountIn] = useState("")

  // Token state (input and output)
  const [tokenIn, setTokenIn] = useState(tokensList[0])
  const [tokenOut, setTokenOut] = useState(tokensList[2])

  // Stores the connected user's wallet and address
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [address, setAddress] = useState<Address | null>(null)

  // The computed exchange quota will be stored here
  const [quota, setQuota] = useState<ExchangeQuota | null>(null)

  // Loading state and balance of the currently selected input token
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<Amount>(Amount.from(0, 18, true))

  // Automatically update the balance of the selected input token when it or the address changes
  useEffect(() => {
    if (address) handleUpdateBalance()
  }, [tokenIn, address])

  /**
   * Fetches the balance of the selected input token for the connected address.
   * Updates the balance state with the fetched amount.
   */
  const handleUpdateBalance = async () => {
    if (!address) return
    await sdk.tokensExtension.fetchBalances(address)
    setBalance(sdk.tokensExtension.balanceOf(address, tokenIn))
  }

  /**
   * Requests wallet connection and sets the signer and user address.
   * Uses the Ethereum provider injected in the browser (e.g., MetaMask).
   */
  const connectWallet = async () => {
    const eth = (window as any).ethereum
    const provider = new ethers.BrowserProvider(eth)

    await eth.enable()
    const accounts = await provider.listAccounts()

    if (!accounts.length) return
    setSigner(accounts[0])

    const _a = await accounts[0].getAddress()
    setAddress(Address.from(_a))
  }

  /**
   * Requests a quota (estimated exchange result) from the SDK based on selected tokens and input amount.
   * Must be called after wallet is connected.
   */
  const computeQuota = async () => {
    setQuota(null)

    if (!signer || !address) return

    setLoading(true)

    await sdk.priceStorage.forceRefetch()

    const task = sdk.updateTask()

    const quota = await sdk.createQuota(address, {
      exactInput: true,
      amountIn: Amount.from(amountIn, tokenIn.decimals, true),
      amountOut: Amount.from(0, tokenOut.decimals, true),
      tokenIn,
      tokenOut,
      slippageReadablePercent: 1,
      destinationAddress: address
    }, task)

    if (!sdk.verifyTask(task)) return

    setLoading(false)
    if (quota instanceof SdkException) {
      console.log(quota.message)
      return
    }

    setQuota(quota)
  }

  /**
   * Handles changes in the input field for the amount to be exchanged.
   * Validates the input and updates the amountIn state.
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuota(null)
    const value = event.target.value
    if (value.trim().length === 0) {
      setAmountIn("")
      return
    }

    const bn = new BigNumber(value)

    if (bn.isNaN() || bn.isNegative()) return

    setAmountIn(value.trimStart())
  }

  /**
   * If no signer is connected, connects the wallet.
   * Otherwise, sends all the transactions required to perform the exchange.
   */
  const handleClick = async () => {
    if (!signer) {
      await connectWallet()
      return
    }

    if (!quota || !signer) return
    setLoading(true)

    const net = await signer.provider._detectNetwork()

    if (net.chainId.toString() !== quota.tokenIn.network.chainId.toString()) {
      await requestNetworkChange(quota.tokenIn.network, signer).catch(() => null)
    }

    for await (const data of quota?.executorCallData) {
      const transaction = await sdk.prepareEthersTransaction(data, signer)

      if (transaction instanceof SdkException) {
        setLoading(false)
        return
      }

      const tx = await signer.sendTransaction(transaction).catch(() => null)

      if (!tx) {
        setLoading(false)
        return
      }
      await tx.wait(1)
    }

    setLoading(false)
    setQuota(null)
  }

  const isSameToken = tokenIn.address.equalTo(tokenOut.address) && tokenIn.network.name === tokenOut.network.name
  const isComputeDisabled = !amountIn || isSameToken || loading || !signer

  // The UI layout starts here
  return (
    <div className="flex flex-col items-start max-w-md gap-10 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="m-0 p-0 font-bold text-xl">
          @simple-exchange-example
        </h2>
        <p className="text-gray-500 p-0 m-0">
          A simple example of building an exchange route and performing the exchange itself.
          Uses a minimum number of elements and dependencies.
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        {/* Input field for the amount to be exchanged */ }
        <Input
          name="Amount in"
          type="text"
          onChange={ handleChange }
          value={ amountIn }
          className={ clsx(
            "rounded-md bg-gray-100 p-3 border-2 border-transparent focus:border-gray-300 transition duration-200",
            " ease-in-out placeholder-gray-400 w-full"
          ) }
          placeholder="Amount in"
        />

        { address && (
          <div className="flex flex-row gap-2 items-center">
            {/* Display the user's balance of the selected input token */ }
            <span className="text-sm text-gray-500">
              Balance: { balance.toReadable() }
            </span>
            {/* Button to update the balance of the selected input token */ }
            <Button
              className={ clsx(
                "rounded-xl p-px pl-2 pr-2 bg-sky-700 text-sky-100 cursor-pointer hover:bg-sky-800",
                "transition duration-200 ease-in-out"
              ) }
              onClick={ handleUpdateBalance }
            >
              <span className="text-xs">
                Update balance
              </span>
            </Button>
          </div>
        ) }

        <div className="flex flex-row gap-1 w-full">
          {/* Token selector for the input token */ }
          <TokenSelector tokensList={ tokensList } token={ tokenIn } onChange={ token => {
            setTokenIn(token)
            setQuota(null)
          } } title="Token in" />
          {/* Token selector for the output token */ }
          <TokenSelector tokensList={ tokensList } token={ tokenOut } onChange={ token => {
            setTokenOut(token)
            setQuota(null)
          } } title="Token out" />
        </div>

        {/* Button to compute the exchange quota */ }
        <Button
          className={ clsx(
            "rounded-md bg-sky-700 text-sky-100 w-full p-3 cursor-pointer hover:bg-sky-800 transition duration-200 ease-in-out",
            "active:transform active:scale-[98%]",
            "data-[disabled]:text-gray-100 data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:bg-gray-700"
          ) }
          disabled={ isComputeDisabled }
          onClick={ computeQuota }
          value=""
        >
          { signer ? (loading ? "Loading..." : "Compute") : "Connect wallet first" }
        </Button>

        <div className="flex flex-col gap-1 w-full">
          <span className="text-sm text-gray-400">
            You will receive
          </span>
          {/* Display the estimated amount to be received after the exchange */ }
          <Input
            name="Amount in"
            type="text"
            value={ quota?.amountOut.toReadable() ?? "" }
            className={ clsx(
              "rounded-md bg-gray-100 p-3 border-2 border-transparent cursor-not-allowed",
              "ease-in-out placeholder-gray-400 w-full"
            ) }
            placeholder="Amount out"
            readOnly
          />
        </div>

        {/* Button to perform the exchange */ }
        <Button
          className={ clsx(
            "rounded-md bg-sky-700 text-sky-100 w-full p-3 cursor-pointer hover:bg-sky-800 transition duration-200 ease-in-out",
            "active:transform active:scale-[98%] data-[disabled]:pointer-events-none data-[disabled]:bg-gray-700",
            "data-[disabled]:text-gray-100 data-[disabled]:opacity-50"
          ) }
          onClick={ handleClick }
          disabled={ (signer ? (!quota) : false) || loading }
        >
          { loading ? "Loading..." : (signer ? "Swap" : "Connect wallet") }
        </Button>
      </div>
    </div>
  )
}