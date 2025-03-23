import { Link, Route, Routes } from "react-router-dom"
import ExampleCard from "~/app/ExampleCard.tsx"
import SimpleExchangeExample from "~/simple-exchange-example"

export default function App() {
  return (
    <div className="grid place-items-center w-[100%] h-[100%]">
      <div className="flex flex-col items-start max-w-lg">
        <Routes>
          <Route path="/" element={ (
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-4">
                <h2 className="m-0 p-0 font-bold text-xl">
                  Available examples
                </h2>

                <div className="flex flex-col gap-4 items-start max-w-lg">
                  <ExampleCard to="simple-exchange-example">
                    A simple example of building an exchange route and performing the exchange itself.
                    Uses a minimum number of elements and dependencies.
                  </ExampleCard>

                  <ExampleCard to="tokens-search-example" disabled>
                    Example of using the token extension to search, retrieve a list of tokens and
                    querying user account balances
                  </ExampleCard>

                  <ExampleCard to="transfer-dedicated-token-example" disabled>
                    Example of a form for transferring a specific token on a specific network with automatic
                    exchange of user-friendly assets
                  </ExampleCard>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="m-0 p-0 font-bold text-xl">
                  Relative links
                </h2>

                <div className="flex flex-col gap-4 items-start max-w-lg">
                  <a
                    href="https://github.com/safeblock-dev/exchange-sdk"
                    className="text-base text-sky-600 hover:text-sky-800 transition duration-200 ease-in-out underline"
                  >
                    Exchange SDK GitHub Repository
                  </a>
                </div>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <img src="/logo.svg" alt="logo" className="w-10 h-10" />
                <div className="flex flex-col">
              <span className="text-base leading-none">
                SafeBlock
              </span>
                  <span className="text-sm text-gray-600">
                Documentation & Examples
              </span>
                </div>
              </div>
            </div>
          ) } />

          <Route path="/simple-exchange-example" element={ <SimpleExchangeExample /> } />
          <Route path="*" element={(
            <div className="flex flex-col gap-2 items-center">
              <h2 className="m-0 p-0 font-bold text-xl">
                This page doesn't exist
              </h2>
              <Link to="/" className="underline text-base text-sky-600 hover:text-sky-800 transition duration-200 ease-in-out">
                Go to home page
              </Link>
            </div>
          )} />
        </Routes>
      </div>
    </div>
  )
}