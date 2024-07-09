<template>
  <div
    v-if="!Client.botStore.$state.loaded || !loaded"
    class="w-full h-full relative"
  >
    <div
      class="absolute backdrop-blur-md top-0 bottom-0 left-0 right-0 z-40 flex items-center justify-center"
    >
      <button class="btn btn-primary">
        <span class="loading loading-infinity"></span>
        Loading
      </button>
    </div>
  </div>
  <div
    v-else
    class="w-full h-full grid grid-cols-12 gap-3 grid-rows-[min-content_1fr_min-content]"
  >
    <div
      class="stats stats-vertical lg:stats-horizontal divide-solid col-span-full sm:col-span-5 lg:col-span-full shadow-lg bg-base-300 shadow-black/50"
    >
      <div class="stat place-items-center">
        <div class="stat-figure">
          <img
            v-if="baseLogo"
            :src="baseLogo"
            alt="baseTokenLogo"
            class="w-10 h-10"
          />
          <component
            v-else
            class="!w-10 !h-10"
            :is="cryptoLogo[<keyof typeof cryptoTicker>baseTokenName]"
          />
        </div>
        <div class="stat-title">Base Balance</div>
        <div
          class="stat-value"
          :class="cryptoGraph[<keyof typeof cryptoTicker>baseTokenName].text"
        >
          {{ displayNumber(selectedBot!.baseTokenAmount) }}
        </div>
        <div class="stat-desc">
          {{ Number(baseBalanceDiff) >= 0 ? "+" : "-"
          }}{{ Math.abs(Number(baseBalanceDiff)) }}% since launch
        </div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-figure">
          <img v-if="quoteLogo" :src="quoteLogo" alt="usdc" class="w-10 h-10" />
          <component
            v-else
            class="!w-10 !h-10"
            :is="cryptoLogo[<keyof typeof cryptoTicker>quoteTokenName]"
          />
        </div>
        <div class="stat-title">Quote Balance</div>
        <div
          class="stat-value"
          :class="cryptoGraph[<keyof typeof cryptoTicker>quoteTokenName].text"
        >
          {{ displayNumber(selectedBot!.quoteTokenAmount) }}
        </div>
        <div class="stat-desc">
          {{ Number(quoteBalanceDiff) >= 0 ? "+" : "-"
          }}{{ Math.abs(Number(quoteBalanceDiff)) }}% since launch
        </div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-figure text-secondary">
          <div class="flex shrink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-16 h-16"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div class="relative w-full">
          <transition name="fadeNav">
            <div
              v-if="USDValue && startUSDValue"
              class="absolute w-full text-center"
            >
              <div class="stat-value">
                {{ usdPerformance > 0 ? "+" : "" }}{{ usdPerformance }}%
              </div>
              <div class="stat-title">USD value</div>
              <div class="stat-desc text-secondary">
                {{ USDValue - startUSDValue > 0 ? "+" : ""
                }}{{ displayNumber(USDValue - startUSDValue) }}
                USD raw
              </div>
            </div>
            <div v-else class="absolute w-full text-center">
              <div class="stat-value">+??%</div>
              <div class="stat-title">USD value</div>
              <div class="stat-desc text-secondary">+??? USD raw</div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="col-span-full sm:col-span-7 lg:col-span-5 xl:row-span-2">
      <div
        class="card bg-base-300 h-full text-neutral-content w-full shadow-lg shadow-black/50 overflow-y-auto custom-scroll"
      >
        <div
          class="card-body items-center text-center p-5 pb-2 justify-between max-h-full"
        >
          <h2
            class="xl:hidden 2xl:block card-title text-primary-content bg-neutral shadow shadow-black/50 rounded-full px-4"
          >
            Bot &#35;{{ Number(($route.params.index as string) + 1) }} Details
          </h2>
          <div
            class="grow flex flex-col w-full justify-evenly bg-neutral max-h-28 shadow-lg shadow-black/50 rounded-xl p-3 font-bold pb-4"
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                Fees
              </div>
              <div
                class="badge border border-success/70 bg-transparent font-sans font-bold px-2 text-success/70"
              >
                bot fees: {{ selectedBot?.makerFees }}%
              </div>
            </div>
            <div class="grow flex items-center">
              <div class="flex flex-wrap gap-4 justify-evenly w-full">
                <div
                  class="flex grow justify-center px-3 py-0.5 gap-1 bg-base-300 rounded-full shadow-md shadow-black/50 relative"
                >
                  <div class="absolute text-[9px] -bottom-3 font-light">
                    collected
                  </div>
                  <div class="flex gap-3 items-center">
                    {{ selectedBot!.feesEarned.toFixed(4) }}
                    <img
                      v-if="quoteLogo"
                      :src="quoteLogo"
                      alt="usdc"
                      class="w-6 h-6"
                    />
                    <component
                      v-else
                      class="!w-6 !h-6"
                      :is="cryptoLogo[<keyof typeof cryptoTicker>quoteTokenName]"
                    />
                  </div>
                </div>
                <div
                  class="flex grow justify-center px-3 py-0.5 gap-1 bg-base-300 rounded-full shadow-md shadow-black/50 relative"
                >
                  <div class="absolute text-[9px] -bottom-3 font-light">
                    volume
                  </div>
                  <div class="flex items-center gap-3">
                    {{
                      (
                        selectedBot!.feesEarned /
                        (selectedBot!.makerFees / 100)
                      ).toFixed(4)
                    }}
                    <img
                      v-if="quoteLogo"
                      :src="quoteLogo"
                      alt="quoteLogo"
                      class="w-6 h-6"
                    />
                    <component
                      v-else
                      class="!w-6 !h-6"
                      :is="cryptoLogo[<keyof typeof cryptoTicker>quoteTokenName]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="justify-around flex flex-col grow w-full bg-neutral max-h-28 shadow-lg shadow-black/50 rounded-xl p-3 font-bold pb-4"
          >
            <div class="flex gap-3 items-center justify-between w-full">
              <div class="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>

                Performance
              </div>
              <div
                class="badge border bg-transparent font-sans font-bold px-2 transition-all w-20"
                :class="
                  usdPerformance >= 0
                    ? 'border-success/70 text-success/70'
                    : 'border-error/70 text-error/70'
                "
              >
                {{ usdPerformance > 0 ? "+" : ""
                }}{{ USDValue && startUSDValue ? usdPerformance : "??" }}%
              </div>
            </div>
            <div class="grow flex items-center">
              <div class="flex flex-wrap gap-4 justify-evenly w-full">
                <div
                  class="flex grow basis-5/12 justify-center px-3 py-0.5 gap-1 bg-base-300 rounded-full shadow-md shadow-black/50 relative"
                >
                  <div
                    class="absolute text-[9px] -bottom-3 font-light text-secondary"
                  >
                    start USD value
                  </div>
                  <transition name="fadeNav">
                    <div v-if="startUSDValue" class="flex items-center gap-3">
                      {{ displayNumber(startUSDValue, 2) }}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 stroke-secondary"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div v-else class="flex items-center gap-3">
                      ???
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 stroke-secondary"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </transition>
                </div>
                <div
                  class="flex grow basis-5/12 justify-center px-3 py-0.5 gap-1 bg-base-300 rounded-full shadow-md shadow-black/50 relative"
                >
                  <div
                    class="absolute text-[9px] -bottom-3 font-light text-secondary"
                  >
                    USD value
                  </div>
                  <transition name="fadeNav">
                    <div v-if="USDValue" class="flex items-center gap-3">
                      {{ displayNumber(USDValue, 2) }}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 stroke-secondary"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div v-else class="flex items-center gap-3">
                      ???
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 stroke-secondary"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
          <div
            class="justify-around grow flex flex-col w-full bg-neutral xl:max-h-32 shadow-lg shadow-black/50 rounded-xl p-3 font-bold"
          >
            <div class="flex gap-3 items-center justify-between w-full">
              <div class="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>

                Range
              </div>
              <div
                class="badge border border-warning/70 bg-transparent font-sans font-bold px-2 text-warning/70"
              >
                price: {{ displayNumber(selectedBot!.price, 5) }}
              </div>
            </div>
            <div class="grow flex items-center justify-between">
              <div class="flex flex-wrap gap-4 justify-evenly w-full">
                <div
                  class="flex shrink justify-center gap-8 items-center rounded-full bg-base-300 px-4 py-0.5 shadow-md shadow-black/50"
                >
                  <div class="relative">
                    {{ selectedBot?.lowerBound }}
                    <div
                      class="absolute text-[9px] -bottom-4 font-light whitespace-nowrap -translate-x-2"
                    >
                      lower bound
                    </div>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                  </div>

                  <div class="relative">
                    {{ selectedBot?.upperBound }}
                    <div
                      class="absolute text-[9px] -bottom-4 font-light whitespace-nowrap -translate-x-3"
                    >
                      upper bound
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex grow justify-around items-center mt-3">
              <div
                class="flex relative shrink items-center rounded-full bg-base-300 px-4 py-0.5 gap-x-4 shadow-md shadow-black/50"
              >
                <div
                  class="absolute text-[9px] font-light -bottom-2.5 left-1/2 -translate-x-1/2"
                >
                  step
                </div>
                <svg
                  class="w-6 h-6 fill-current rounded-full bg-neutral shadow-md shadow-black/50 p-1"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="800px"
                  height="800px"
                  viewBox="0 0 515.458 515.458"
                  xml:space="preserve"
                >
                  <g>
                    <path
                      d="M298.794,386.711c27.805,9.522,52.357,15.587,87.633,26.427C372.875,584.374,210.952,516.371,298.794,386.711z
           M443.366,229.409c-1.826-51.415-10.882-118.86-83.017-108.292c-33.815,8.825-58.8,45.962-70.551,110.035
          c-6.454,35.229-2.701,84.678,4.912,114.32c6.951,20.889,4.587,19.605,12.058,23.572c28.916,6.514,57.542,13.725,86.693,21.078
          C423.075,369.209,447.397,258.182,443.366,229.409z M220.752,225.463c7.607-29.646,11.36-79.095,4.909-114.32
          C213.919,47.067,188.931,9.924,155.11,1.105C82.975-9.463,73.919,57.981,72.093,109.399
          c-4.031,28.768,20.294,139.802,49.911,160.711c29.149-7.353,57.771-14.558,86.696-21.078
          C216.162,245.069,213.798,246.352,220.752,225.463z M129.029,293.132c13.547,171.234,175.47,103.231,87.63-26.427
          C188.854,276.228,164.304,282.292,129.029,293.132z"
                    />
                  </g>
                </svg>
                <div class="text-sm font-bold">{{ selectedBot!.step }}</div>
              </div>
              <div
                class="flex relative shrink items-center rounded-full bg-base-300 px-4 py-0.5 gap-x-4 shadow-md shadow-black/50"
              >
                <div
                  class="absolute text-[9px] font-light -bottom-2.5 left-1/2 -translate-x-1/2"
                >
                  amount/order
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 fill-current rounded-full bg-neutral shadow-md shadow-black/50 p-1"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>

                <div class="text-sm font-bold">{{ selectedBot!.amount }}</div>
              </div>
            </div>
          </div>
          <div class="card-actions justify-center 2xl:pb-3 p-0.5">
            <SpinnerButton
              :fn="deleteBot"
              class="btn btn-neutral shadow-lg shadow-black/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Delete
            </SpinnerButton>
          </div>
        </div>
      </div>
    </div>
    <div
      class="col-span-full sm:col-span-7 sm:row-start-auto row-start-4 h-80 lg:h-full"
    >
      <div
        class="h-full w-full rounded-xl bg-base-300 shadow-lg shadow-black/50 flex flex-col p-3"
      >
        <div class="flex px-2 py-1 justify-start items-center">
          <div
            class="text-primary-content flex items-center gap-2 text-lg py-1 bg-neutral shadow shadow-black/50 rounded-full px-4 font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
              />
            </svg>
            Balance Repartition
          </div>
        </div>
        <div class="h-full w-full" :id="`botgraph${$route.params.index}`"></div>
      </div>
    </div>
    <div
      class="stats xl:grid xl:grid-cols-2 2xl:grid-cols-3 xl:grid-rows-[1fr_min-content] stats-vertical lg:stats-horizontal sm:col-span-5 col-span-full lg:col-span-full xl:col-span-7 shadow-lg bg-base-300 shadow-black/50 relative !overflow-visible"
    >
      <span
        v-if="baseTokenName!.toLowerCase() == 'avax'"
        class="absolute w-3 h-3 rounded-full bg-red-500 top-0 right-0"
      ></span>
      <span
        v-if="baseTokenName!.toLowerCase() == 'avax'"
        class="absolute w-3 h-3 rounded-full bg-red-500 top-0 right-0 border-red-500 animate-ping"
      ></span>
      <div
        class="stat place-items-center grid-cols-[1fr_max-content] 2xl:gap-1"
      >
        <div class="stat-figure">
          <img v-if="baseLogo" :src="baseLogo" alt="usdc" class="w-7 h-7" />
          <component
            v-else
            class="!w-7 !h-7 !shrink-0"
            :is="cryptoLogo[<keyof typeof cryptoTicker>baseTokenName]"
          />
        </div>
        <div class="stat-title">Wallet Base</div>
        <div
          class="stat-value"
          :class="cryptoGraph[<keyof typeof cryptoTicker>baseTokenName].text"
        >
          {{ nFormatter(baseBalance!, 1) }}
        </div>
        <div
          class="stat-desc relative"
          v-if="baseBalance && selectedBot && selectedBot.baseTokenAmount"
        >
          {{ baseBalance > selectedBot!.baseTokenAmount ? "+" : ""
          }}{{
            (
              ((baseBalance! - selectedBot!.baseTokenAmount) * 100) /
              selectedBot!.baseTokenAmount
            ).toFixed(2)
          }}%
          {{ baseBalance > selectedBot!.baseTokenAmount ? "above" : "below" }}
          needs
          <svg
            v-if="baseBalance < selectedBot.baseTokenAmount"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="stroke-error w-5 h-5 absolute top-0 -right-1 translate-x-full -translate-y-0.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="stroke-success w-5 h-5 absolute top-0 -right-1 translate-x-full -translate-y-0.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <div
        class="stat place-items-center xl:row-start-1 grid-cols-[1fr_max-content] 2xl:gap-1"
      >
        <div class="stat-figure">
          <img v-if="quoteLogo" :src="quoteLogo" alt="usdc" class="w-7 h-7" />
          <component
            v-else
            class="!w-7 !h-7"
            :is="cryptoLogo[<keyof typeof cryptoTicker>quoteTokenName]"
          />
        </div>
        <div class="stat-title">Wallet Quote</div>
        <div
          class="stat-value"
          :class="cryptoGraph[<keyof typeof cryptoTicker>quoteTokenName].text"
        >
          {{ nFormatter(quoteBalance!, 1) }}
        </div>
        <div
          class="stat-desc relative"
          v-if="quoteBalance && selectedBot && selectedBot.quoteTokenAmount"
        >
          {{ quoteBalance > selectedBot!.quoteTokenAmount ? "+" : ""
          }}{{
            (
              ((quoteBalance! - selectedBot!.quoteTokenAmount) * 100) /
              selectedBot!.quoteTokenAmount
            ).toFixed(2)
          }}%
          {{ quoteBalance > selectedBot!.quoteTokenAmount ? "above" : "below" }}
          needs
          <svg
            v-if="quoteBalance < selectedBot.quoteTokenAmount"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="stroke-error w-5 h-5 absolute top-0 -right-1 translate-x-full -translate-y-0.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="stroke-success w-5 h-5 absolute top-0 -right-1 translate-x-full -translate-y-0.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <div
        v-if="!quoteBalance || !selectedBot"
        class="stat xl:row-start-2 2xl:row-start-1 2xl:col-start-3 2xl:col-span-1 xl:col-start-1 xl:col-span-2 place-items-center xl:!border-t-[1px] xl:!border-solid grid-cols-[1fr_max-content] xl:grid-cols-2 2xl:grid-cols-[1fr_max-content]"
      >
        <div class="stat-figure text-secondary xl:justify-self-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              class="stroke-yellow-600 w-10 h-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </div>
        </div>
        <div class="stat-title row-span-2 whitespace-normal">
          Failed to load Balances
        </div>
      </div>
      <div
        v-else-if="quoteBalance && selectedBot && quoteBalance < selectedBot!.quoteTokenAmount"
        class="stat xl:row-start-2 2xl:row-start-1 2xl:col-start-3 2xl:col-span-1 xl:col-start-1 xl:col-span-2 place-items-center xl:!border-t-[1px] xl:!border-solid grid-cols-[1fr_max-content] xl:grid-cols-2 2xl:grid-cols-[1fr_max-content]"
      >
        <div class="stat-figure text-secondary xl:justify-self-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              class="stroke-error w-10 h-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>
        <div class="stat-title row-span-2 whitespace-normal">
          Rebalance Needed
        </div>
        <div class="stat-desc text-error whitespace-normal">
          Click for details
        </div>
      </div>
      <div
        v-else
        class="stat xl:row-start-2 2xl:row-start-1 2xl:col-start-3 xl:col-start-1 xl:col-span-2 2xl:col-span-1 place-items-center xl:!border-t-[1px] xl:!border-solid xl:grid-cols-2"
      >
        <div class="stat-figure text-secondary xl:justify-self-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              class="stroke-success w-10 h-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div class="stat-title row-span-3 whitespace-normal">
          Everything is ok
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  watch,
  computed,
  Ref,
  ComputedRef,
  onBeforeMount,
  onMounted,
  onUpdated,
} from "vue";
import {
  cryptoTicker,
  cryptoGraph,
  cryptoLogo,
} from "../../../types/cryptoSpecs";
import { useRouter, useRoute } from "vue-router";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { setGraph } from "../../../asset/scripts/utils";
import { Client } from "../../../api";
import { BotActions } from "../../../types/bot";
import {
  tokenToName,
  displayAddress,
  nFormatter,
  displayNumber,
  getUsdValue,
  loadBalances,
  unBigNumberify,
  multiplicator,
} from "../../../utils";
import SpinnerButton from "../../buttons/SpinnerButton.vue";
import { useNotification } from "@kyvg/vue3-notification";
import { RouteNames } from "../../../router";
import BigNumber from "bignumber.js";

const botLoaded = computed(() => Client.botStore.$state.loaded);
const { notify } = useNotification();
const router = useRouter();

let loaded = ref<boolean>(false);
let usdValueLoaded = ref<boolean>(false);
let route = useRoute();
let selectedBot = ref<(typeof Client.botStore.$state.bots)[0]>();
let baseTokenName = ref<keyof typeof cryptoTicker | string>();
let quoteTokenName = ref<keyof typeof cryptoTicker | string>();
let baseLogo = ref<string>();
let quoteLogo = ref<string>();

let initialBaseUSD = ref<number>();
let initialQuoteUSD = ref<number>();

let baseBalance = ref<number | undefined>(undefined);
let quoteBalance = ref<number | undefined>(undefined);

watch(selectedBot, async (newValue) => {
  if (newValue) {
    const balances = await loadBalances([
      selectedBot.value?.baseToken!,
      selectedBot.value?.quoteToken!,
    ]);

    if (balances[selectedBot.value?.baseToken!])
      baseBalance.value = unBigNumberify(
        balances[selectedBot.value?.baseToken!]
      );
    if (balances[selectedBot.value?.quoteToken!])
      quoteBalance.value = unBigNumberify(
        balances[selectedBot.value?.quoteToken!]
      );
  }
});

const initialBaseToken = computed<number>(() => {
  if (
    !selectedBot.value ||
    selectedBot.value.upperBound <
      selectedBot.value.price + selectedBot.value.step
  )
    return 0;
  const numOrders = Math.ceil(
    (selectedBot.value.upperBound +
      1 -
      (selectedBot.value.price + selectedBot.value.step)) /
      selectedBot.value.step
  );
  return numOrders * selectedBot.value.amount;
});

const initialQuoteToken = computed<number>(() => {
  if (!selectedBot.value) return 0;
  let counter = 0;
  let price = selectedBot.value.price;
  let amountNeeded = 0;

  while (counter < 5000 && price >= selectedBot.value.lowerBound) {
    amountNeeded += Number((selectedBot.value.amount * price).toFixed(10));
    price -= selectedBot.value.step;
    ++counter;
  }
  return amountNeeded;
});

const baseBalanceDiff = computed<string>(() => {
  if (!initialBaseToken) return "0";
  const percent = initialBaseToken.value
    ? ((selectedBot.value!.baseTokenAmount - initialBaseToken.value) /
        initialBaseToken.value) *
      100
    : 0;
  return percent.toFixed(1);
});

const quoteBalanceDiff = computed<string>(() => {
  if (!initialQuoteToken) return "0";
  const percent =
    ((selectedBot.value!.quoteTokenAmount - initialQuoteToken.value) /
      initialQuoteToken.value) *
    100;
  return percent.toFixed(1);
});

const USDValue = computed<number>(() => {
  if (selectedBot.value?.baseUSD && selectedBot.value?.quoteUSD) {
    return selectedBot.value.baseUSD + selectedBot.value?.quoteUSD;
  } else {
    return 0;
  }
});

const startUSDValue = computed<number>(() => {
  if (initialBaseUSD.value && initialQuoteUSD.value) {
    return initialBaseUSD.value + initialQuoteUSD.value;
  } else {
    return 0;
  }
});

const usdPerformance = computed<number>(() => {
  if (USDValue.value && startUSDValue.value) {
    return Number(
      (
        ((USDValue.value - startUSDValue.value) * 100) /
        startUSDValue.value
      ).toFixed(2)
    );
  } else {
    return 0;
  }
});

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

let option = {
  animationDelay: 300,
  color: [
    "#925ef2",
    "#7cffb2",
    "#fddd60",
    "#ff6e76",
    "#58d9f9",
    "#05c091",
    "#ff8a45",
    "#8d48e3",
    "#dd79ff",
  ],
  backgroundColor: "rgb(255,255,255, 0)",
  tooltip: {
    trigger: "item",
  },
  legend: {
    align: "left",
    orient: "vertical",
    top: "5%",
    left: "left",
    textStyle: { fontWeight: "bold" },
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 5,
        borderColor: "#fff",
        borderWidth: 0,
      },
      label: {
        show: false,
        position: "center",
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
    },
  ],
};

function mountData() {
  if (typeof route.params.index == "string") {
    selectedBot.value =
      Client.botStore.$state.bots[parseInt(route.params.index)];
  }
  baseTokenName.value = tokenToName(
    selectedBot.value!.baseToken,
    selectedBot.value!.chainId
  );
  quoteTokenName.value = tokenToName(
    selectedBot.value!.quoteToken,
    selectedBot.value!.chainId
  );

  if (baseTokenName.value in cryptoTicker) {
    baseLogo.value = cryptoLogo[<keyof typeof cryptoTicker>baseTokenName.value];
  } else {
    baseTokenName.value = cryptoTicker.primaryUnknown;
  }

  if (quoteTokenName.value in cryptoTicker) {
    quoteLogo.value =
      cryptoLogo[<keyof typeof cryptoTicker>quoteTokenName.value];
  } else {
    quoteTokenName.value = cryptoTicker.secondaryUnknown;
  }

  option.color = [
    baseTokenName.value in cryptoTicker
      ? cryptoGraph[<keyof typeof cryptoTicker>baseTokenName.value].color
      : Number(route.params.id) % 2 == 0
      ? cryptoGraph[cryptoTicker.primaryUnknown].color
      : cryptoGraph[cryptoTicker.secondaryUnknown].color,
    quoteTokenName.value in cryptoTicker
      ? cryptoGraph[<keyof typeof cryptoTicker>quoteTokenName.value].color
      : Number(route.params.id) % 2 == 0
      ? cryptoGraph[cryptoTicker.primaryUnknown].color
      : cryptoGraph[cryptoTicker.secondaryUnknown].color,
  ];
  option.series[0].data = [
    {
      value:
        selectedBot.value!.baseUSD && selectedBot.value!.quoteUSD
          ? selectedBot.value!.baseUSD
          : selectedBot.value!.baseTokenAmount * selectedBot.value!.price,
      name: displayAddress(
        tokenToName(selectedBot.value!.baseToken, selectedBot.value!.chainId)
      ),
    },
    {
      value:
        selectedBot.value!.baseUSD && selectedBot.value!.quoteUSD
          ? selectedBot.value!.quoteUSD
          : selectedBot.value!.quoteTokenAmount,
      name: displayAddress(
        tokenToName(selectedBot.value!.quoteToken, selectedBot.value!.chainId)
      ),
    },
  ];
  loaded.value = true;
  loadUSDValue();
}

onUpdated(() => {
  setGraph(
    document.getElementById(`botgraph${route.params.index}`),
    echarts.getInstanceByDom,
    echarts.init,
    option
  );
});

onMounted(() => {
  if (Client.botStore.$state.loaded) {
    mountData();
  } else {
    watch(botLoaded, (newValue) => {
      if (newValue) mountData();
    });
  }
});

onBeforeMount(() => {
  if (Client.botStore.$state.loaded && typeof route.params.index == "string") {
    selectedBot.value =
      Client.botStore.$state.bots[parseInt(route.params.index)];
  }
});

/**
 * @notice - Used to load the token balances USD value
 */
async function loadUSDValue() {
  if (!selectedBot.value) {
    usdValueLoaded.value = true;
    return;
  } else {
    await Promise.all([
      getPriceUpdatePromise(
        baseTokenName.value!,
        selectedBot.value,
        initialBaseToken,
        initialBaseUSD
      ),
      getPriceUpdatePromise(
        quoteTokenName.value!,
        selectedBot.value,
        initialQuoteToken,
        initialQuoteUSD
      ),
    ]);
  }
}

/**
 * @notice - Use to get promise for USD price update for parallelization
 */
async function getPriceUpdatePromise(
  token: string,
  bot: (typeof Client.botStore.$state.bots)[0],
  initialBalanceRef: ComputedRef<number>,
  inititalUSDValueRef: Ref<number | undefined>
): Promise<void> {
  if (token == cryptoTicker.USDT) {
    inititalUSDValueRef.value = initialBalanceRef.value;
  } else {
    const initial = await getUsdValue(token, bot.timestamp * 1000);
    inititalUSDValueRef.value = initial * initialBalanceRef.value;
  }
}

async function deleteBot() {
  try {
    const tx = await Client.dexContract.cancelOrders([
      {
        owner: selectedBot.value!.address,
        amount: new BigNumber(selectedBot.value!.amount)
          .multipliedBy(multiplicator)
          .toFixed(),
        price: new BigNumber(selectedBot.value!.price)
          .multipliedBy(multiplicator)
          .toFixed(),
        step: new BigNumber(selectedBot.value!.step)
          .multipliedBy(multiplicator)
          .toFixed(),
        takerAmount: "0",
        mult: "0",
        makerFees: selectedBot.value!.makerFees * 10,
        upperBound: new BigNumber(selectedBot.value!.upperBound)
          .multipliedBy(multiplicator)
          .toFixed(),
        signature: selectedBot.value!.botHash,
        lowerBound: new BigNumber(selectedBot.value!.lowerBound)
          .multipliedBy(multiplicator)
          .toFixed(),
        baseToken: selectedBot.value!.baseToken,
        quoteToken: selectedBot.value!.quoteToken,
        expiry: selectedBot.value!.expiry.toFixed(),
        chainId: selectedBot.value!.chainId,
        side: 1,
        replaceOrder: true,
      },
    ]);
    const receipt = await tx.wait(1);
    Client.botStore[BotActions.DeleteBot](
      selectedBot.value!.botHash,
      `${selectedBot.value!.baseToken.toLowerCase()}${selectedBot.value!.quoteToken.toLowerCase()}`
    );
    router.push({ name: RouteNames.NewBot });
    notify({
      type: "success",
      text: "Bot deleted successfully",
    });
  } catch (e: any) {
    notify({
      type: "warn",
      text: "An error occured during the bot deletion process check console",
    });
    console.log(e);
  }
}
</script>
