import { useNavigate } from "react-router-dom"

export default function AdminNav({
  userName,
  isDonors,
  isAgents,
  filterType,
  totalSum,
  selfTotal,
  agentTotal
}: {
  userName: string | null
  isDonors: boolean
  isAgents: boolean
  filterType: string
  totalSum: number
  selfTotal: number
  agentTotal: number
}) {
  const navigate = useNavigate()

  const signOut = () => {
    window.localStorage.clear()
    navigate('/')
  }
  return (
    <div className="relative flex h-[180px] w-full flex-col justify-start bg-gradient-to-b from-[#00512E] to-[#0A6D42] px-4 py-4 md:justify-around md:px-10">
      {/* Sign out and info */}
      <div className="mb-4 flex w-full flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
        <button
          onClick={signOut}
          className="flex flex-row items-center space-x-2 text-white"
        >
          <img src="/tag-cross.svg" />
          <p>Sign Out</p>
        </button>
        <div className="flex flex-row items-center space-x-0 text-white md:space-x-2">
          <img src="/warning-2.svg" />
        </div>
      </div>

      {/* Profile image and summary */}
      <div className="flex w-full flex-row justify-between">
        <div className="flex flex-row items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-transparent md:h-16 md:w-16">
            <img className="h-auto w-full rounded-full" src="/logo.png" />
          </div>
          <div>
            <h3 className="text-2xl capitalize leading-tight text-white">
              {userName}
            </h3>
          </div>
        </div>
        <div className="hidden md:flex md:space-x-3">
          <div className="flex h-[91px] w-auto flex-col items-start justify-center bg-transparent px-4">
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-xs font-semibold uppercase leading-tight tracking-tight text-white/90">
                Total Amount Raised to Date:
              </h3>
              <h3 className="text-3xl font-bold text-white">
                {/* #{donorList ? donorList.length : 0} */}
                {isDonors && filterType === 'donors' ? (
                  <span>GHS {totalSum.toFixed(2)}</span>
                ) : isDonors && filterType === 'self' ? (
                  <span>GHS {selfTotal.toFixed(2)}</span>
                ) : (
                  ''
                )}
                {isAgents ? <span>GHS {agentTotal.toFixed(2)}</span> : ''}
                {/* {type === 'self' && <span>GHS {selfTotal.toFixed(2)}</span>} */}
              </h3>
            </div>
          </div>
        </div>
        <div className="flex h-[40px] w-[40px] items-center rounded-full bg-white p-2">
          <img className="h-auto w-full" src="/logo.png" />
        </div>
      </div>
      {/* custom summary area */}
      <div className="absolute -bottom-14 left-4 right-4 flex flex-row items-center md:hidden">
        <div className="flex h-[91px] w-full flex-col items-start rounded-lg bg-gradient-to-b from-[#FFFFFF] to-[#D4D4D8] p-4 shadow-lg">
          <h3 className="text-sm font-bold uppercase leading-tight tracking-tight">
            Total Amount Raised to Date:
          </h3>
          <h3 className="text-3xl font-bold text-red-600 sm:text-4xl">
            {isDonors && filterType === 'donors' ? (
              <span>GHS {totalSum.toFixed(2)}</span>
            ) : isDonors && filterType === 'self' ? (
              <span>GHS {selfTotal.toFixed(2)}</span>
            ) : (
              ''
            )}
            {isAgents && <span>GHS {agentTotal.toFixed(2)}</span>}
            {/* {type === 'self' && <span>GHS {selfTotal.toFixed(2)}</span>} */}
          </h3>
        </div>
      </div>
    </div>
  )
}