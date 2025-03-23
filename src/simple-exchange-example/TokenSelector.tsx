import { Select } from "@headlessui/react"
import { ChevronUpDownIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { IToken } from "~/utils/types.ts"

interface Props {
  tokensList: IToken[]

  token: IToken

  onChange(token: IToken): void

  title: string
}

export default function TokenSelector(props: Props) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-sm text-gray-400">
        { props.title }
      </span>

      <div className="flex flex-row relative w-full">
        <Select
          name="status"
          aria-label="Project status"
          value={ props.token.address.toString() + props.token.network.name }
          onChange={ event => {
            const address = event.target.value.slice(0, 42)
            const network = event.target.value.slice(42)

            const token = props.tokensList
              .find(t => t.address.equalTo(address) && t.network.name === network)

            if (token) props.onChange(token)
          } }
          className={ clsx(
            "bg-gray-100 p-3 rounded-md w-full appearance-none cursor-pointer"
          ) }
        >
          { props.tokensList.map(token => (
            <option
              key={ token.address.toString() + token.network.name }
              value={ token.address.toString() + token.network.name }
            >
              { token.symbol } on { token.network.name }
            </option>
          )) }
        </Select>
        <ChevronUpDownIcon className="absolute w-6 h-6 right-1 top-2.5 text-gray-600" />
      </div>
    </div>
  )
}