import { Link } from "react-router-dom"

interface Props {
  children: any
  to: string
  disabled?: boolean
}

export default function ExampleCard(props: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        { props.disabled && (
          <div className="bg-gray-700 pl-2 pr-2 rounded-xl items-center justify-center pb-0.5 transform translate-y-[1px]">
            <span className="text-xs text-white text-center leading-3">Soon</span>
          </div>
        ) }
        <Link
          to={ `/${ props.to }` }
          className={ props.disabled
            ? "text-base text-gray-700"
            : "text-base text-sky-600 hover:text-sky-800 transition duration-200 ease-in-out underline" }
          onClick={ event => {
            if (props.disabled) event.preventDefault()
          } }
        >
          @{ props.to }
        </Link>
      </div>
      <p className="text-gray-500 p-0 m-0">
        { props.children }
      </p>
    </div>
  )
}