<template>
  <div class="w-full h-full">
    <div
      class="flex flex-col gap-3 items-start h-full overflow-hidden rounded-xl"
    >
      <div
        class="p-2 px-5 rounded-lg bg-neutral text-xl font-bold shadow-sm shadow-black/50 flex gap-4 items-center"
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
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <div>New Bot</div>
      </div>
      <div
        class="grow w-full grid place-items-center overflow-y-auto custom-scroll"
      >
        <div class="w-full">
          <div
            class="bg-base-300 rounded-xl shadow-lg shadow-black/50 grid grid-cols-12 gap-1.5 p-2"
          >
            <div class="col-span-12 flex justify-center items-center">
              <div
                class="px-4 py-0.5 flex items-center gap-2 bg-neutral rounded-full shadow shadow-black/50 font-bold text-lg"
              >
                Bot Form
              </div>
            </div>
            <div
              class="col-span-12 p-3 bg-neutral rounded-xl grid grid-cols-12 gap-3 shadow-lg shadow-black/50"
            >
              <div
                class="col-span-12 flex justify-start items-center gap-1 font-bold"
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
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                </svg>
                Tokens
              </div>
              <div class="col-span-full sm:col-span-6 flex justify-center">
                <div
                  class="font-bold rounded-full bg-base-100 w-full h-9 flex gap-1 items-center px-3 hover:bg-base-200 transition-all shadow-md shadow-black/50"
                >
                  <CryptoDropdown class="grow" v-model="selectedBase">
                    base
                  </CryptoDropdown>
                </div>
              </div>
              <div class="col-span-full sm:col-span-6 flex justify-center">
                <div
                  class="font-bold rounded-full bg-base-100 w-full h-9 flex gap-1 items-center px-3 hover:bg-base-200 transition-all shadow-lg shadow-black/50"
                >
                  <CryptoDropdown class="grow" v-model="selectedQuote">
                    quote
                  </CryptoDropdown>
                </div>
              </div>
            </div>
            <div
              class="col-span-12 xl:col-span-6 2xl:col-span-12 p-3 bg-neutral rounded-xl grid grid-cols-12 gap-3 shadow-lg shadow-black/50"
            >
              <div
                class="col-span-12 flex justify-between items-center font-bold"
              >
                <div class="flex gap-1 items-center">
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
                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                    />
                  </svg>

                  Price Range
                </div>
                <div
                  v-if="selectedBase && selectedQuote"
                  class="relative grow flex justify-start items-center mx-3"
                >
                  <transition appear name="fadeNav">
                    <input
                      :key="selectedBase + selectedQuote"
                      v-model.number="priceValue"
                      type="number"
                      class="appearance-none p-0.5 px-2 sm:max-w-none max-w-[7rem] text-center outline-none rounded-full text-sm placeholder:text-white/20 placeholder:font-normal font-sans font-bold bg-base-200 shadow-md shadow-black/50"
                      placeholder="starting price"
                    />
                  </transition>
                </div>
              </div>
              <div class="col-span-12 flex justify-center">
                <CryptoRange
                  class="grow"
                  :trackedValue="lowerBoundValue"
                  :active="!!priceValue"
                  :visible="!!selectedQuote"
                  name="lowerBound"
                  :rangeClass="
                    selectedQuote && selectedQuote in cryptoTicker
                      ? cryptoRange[selectedQuote]
                      : ''
                  "
                  logoClass="fill-secondary"
                  :multiplier="priceValue || 0"
                  :logo="
                    selectedQuote && selectedQuote in cryptoTicker
                    ? h('img', { src: String(cryptoLogo[selectedQuote!]) })
                    : unknownTokenLogo
                  "
                  @update="(v: any) => {lowerBoundValue = v}"
                  @updateText="(v: any) => {lowerBoundValue = v}"
                ></CryptoRange>
              </div>
              <div class="col-span-12 flex justify-center">
                <CryptoRange
                  class="grow"
                  :trackedValue="upperBoundValue"
                  :active="!!priceValue"
                  :visible="!!selectedBase"
                  name="upperBound"
                  :rangeClass="
                    selectedBase && selectedBase in cryptoTicker
                      ? cryptoRange[selectedBase]
                      : ''
                  "
                  logoClass="fill-secondary"
                  :multiplier="0"
                  :display="displayUpperBound"
                  :logo="
                    selectedBase && selectedBase in cryptoTicker
                    ? h('img', { src: String(cryptoLogo[selectedBase!]) })
                    : unknownTokenLogo
                  "
                  @update="(v: any) => {upperBoundValue = v; displayUpperBound = priceValue! + (priceValue! * upperBoundValue!) / 100;}"
                  @updateText="(v: any) => {displayUpperBound = round(v/100); upperBoundValue = Math.max(((v/100) - priceValue!)*100/priceValue!, 0)}"
                ></CryptoRange>
              </div>
            </div>
            <div
              class="col-span-12 xl:col-span-6 2xl:col-span-12 p-3 bg-neutral shadow-lg shadow-black/50 rounded-xl grid grid-cols-12 gap-3 xl:gap-2 2xl:gap-3"
            >
              <div
                class="col-span-12 flex justify-between items-center font-bold"
              >
                <div class="flex gap-1 items-center">
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
                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                    />
                  </svg>

                  Step & Fees
                </div>
                <div class="relative grow flex justify-end items-center">
                  <transition name="fadeNav" appear>
                    <div
                      v-if="lowerBoundValue && upperBoundValue && priceValue"
                      class="py-0.5 px-4 text-[11px] sm:text-sm rounded-full min-w-max badge border border-warning/70 bg-transparent font-sans font-bold text-warning/70"
                    >
                      adviced fees: 2.5%
                    </div>
                  </transition>
                </div>
              </div>
              <div class="col-span-12 flex justify-center">
                <CryptoRange
                  class="grow"
                  :trackedValue="selectedStep"
                  :active="
                    !!lowerBoundValue && !!upperBoundValue && !!priceValue
                  "
                  :visible="
                    !!lowerBoundValue && !!upperBoundValue && !!priceValue
                  "
                  name="step"
                  :percent="true"
                  rangeClass="range-gray-700"
                  logoClass="fill-current"
                  :multiplier="4"
                  :logo="
                    h(
                      'svg',
                      {
                        version: '1.1',
                        id: 'Capa_1',
                        xmlns: 'http://www.w3.org/2000/svg',
                        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                        width: '800px',
                        height: '800px',
                        viewBox: '0 0 515.458 515.458',
                        'xml:space': 'preserve',
                      },
                      h(
                        'g',
                        {},
                        h('path', {
                          d: 'M298.794,386.711c27.805,9.522,52.357,15.587,87.633,26.427C372.875,584.374,210.952,516.371,298.794,386.711zM443.366,229.409c-1.826-51.415-10.882-118.86-83.017-108.292c-33.815,8.825-58.8,45.962-70.551,110.035c-6.454,35.229-2.701,84.678,4.912,114.32c6.951,20.889,4.587,19.605,12.058,23.572c28.916,6.514,57.542,13.725,86.693,21.078C423.075,369.209,447.397,258.182,443.366,229.409z M220.752,225.463c7.607-29.646,11.36-79.095,4.909-114.32C213.919,47.067,188.931,9.924,155.11,1.105C82.975-9.463,73.919,57.981,72.093,109.399c-4.031,28.768,20.294,139.802,49.911,160.711c29.149-7.353,57.771-14.558,86.696-21.078C216.162,245.069,213.798,246.352,220.752,225.463z M129.029,293.132c13.547,171.234,175.47,103.231,87.63-26.427C188.854,276.228,164.304,282.292,129.029,293.132z',
                        })
                      )
                    )
                  "
                  @update="(v: any) => {selectedStep = v}"
                  @updateText="(v: any) => {selectedStep = v}"
                ></CryptoRange>
              </div>
              <div class="col-span-12 flex justify-center">
                <CryptoRange
                  class="grow"
                  :trackedValue="selectedFees"
                  :active="
                    !!lowerBoundValue && !!upperBoundValue && !!priceValue
                  "
                  :visible="
                    !!lowerBoundValue && !!upperBoundValue && !!priceValue
                  "
                  name="fees"
                  :percent="true"
                  rangeClass="range-amber-400"
                  logoClass=""
                  :multiplier="10"
                  :logo="h('img', { src: moneyBag })"
                  @update="(v: any) => {selectedFees = v}"
                  @updateText="(v: any) => {selectedFees = v}"
                ></CryptoRange>
              </div>
              <div class="col-span-12 flex justify-center">
                <CryptoRange
                  class="grow"
                  :trackedValue="selectedAmount"
                  :active="
                    !!lowerBoundValue && !!upperBoundValue && !!priceValue
                  "
                  :visible="
                    !!lowerBoundValue && !!upperBoundValue && !!priceValue
                  "
                  name="amount"
                  :percent="false"
                  rangeClass="range-lime-300"
                  logoClass=""
                  :multiplier="100"
                  :logo="h('img', { src: dollars })"
                  @update="(v: any) => {selectedAmount = v}"
                  @updateText="(v: any) => {selectedAmount = v}"
                ></CryptoRange>
              </div>
            </div>
            <div
              class="col-span-12 p-3 bg-neutral shadow-lg shadow-black/50 rounded-xl grid grid-cols-12 gap-3"
            >
              <div
                class="col-span-12 flex justify-start items-center gap-1 font-bold"
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
                    d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
                  />
                </svg>

                Balance Needed
              </div>
              <div
                class="col-span-full sm:col-span-6 flex justify-center relative"
              >
                <transition name="fadeNav" appear>
                  <div
                    v-if="selectedBase"
                    class="absolute -top-[30%] text-[10px] text-neutral-content/50"
                  >
                    {{ selectedBase }} needed
                  </div>
                </transition>
                <div
                  class="font-bold rounded-full bg-base-100 shadow-md shadow-black/50 w-full h-9 flex justify-center gap-1 items-center"
                >
                  <transition name="fadeNav">
                    <div
                      v-if="!selectedBase"
                      class="grow text-center p-2 text-neutral-content/50"
                    >
                      base needed
                    </div>
                    <div
                      v-else-if="selectedBase && !selectedStep"
                      class="w-full h-full flex justify-evenly uppercase gap-1 items-center p-1"
                    >
                      <div
                        class="w-5/12 h-full flex justify-center items-center"
                      >
                        <transition name="fadeNav">
                          <unknownTokenLogo
                            v-if="!(selectedBase in cryptoTicker)"
                            :key="unknownToken"
                            class="w-7 h-7 fill-primary"
                          ></unknownTokenLogo>
                          <img
                            v-else
                            :key="selectedBase"
                            :src="cryptoLogo[selectedBase]"
                            class="w-7 h-7"
                          />
                        </transition>
                      </div>
                      <div class="w-7/12"></div>
                    </div>
                    <div
                      v-else
                      class="w-full flex justify-evenly uppercase gap-1 items-center p-1"
                      :key="selectedBase"
                    >
                      <div class="w-5/12 flex justify-center items-center">
                        <unknownTokenLogo
                          v-if="!(selectedBase in cryptoTicker)"
                          :key="unknownToken"
                          class="w-7 h-7 fill-primary"
                        ></unknownTokenLogo>
                        <img
                          v-else
                          :key="selectedBase"
                          :src="cryptoLogo[selectedBase]"
                          class="w-7 h-7"
                        />
                      </div>
                      <div class="w-7/12 text-center font-sans">
                        {{ baseNeeded }}
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
              <div
                class="col-span-full sm:col-span-6 flex justify-center relative"
              >
                <transition name="fadeNav" appear>
                  <div
                    v-if="selectedQuote"
                    class="absolute -top-[30%] text-[10px] text-neutral-content/50"
                  >
                    {{ selectedQuote }} needed
                  </div>
                </transition>
                <div
                  class="font-bold rounded-full bg-base-100 shadow-md shadow-black/50 w-full h-9 flex justify-center gap-1 items-center"
                >
                  <transition name="fadeNav">
                    <div
                      v-if="!selectedQuote"
                      class="grow text-center p-2 text-neutral-content/50"
                    >
                      quote needed
                    </div>
                    <div
                      v-else-if="selectedQuote && !selectedStep"
                      class="w-full flex justify-evenly uppercase gap-1 items-center p-1"
                    >
                      <div class="w-5/12 flex justify-center items-center">
                        <transition name="fadeNav">
                          <unknownTokenLogo
                            v-if="!(selectedQuote in cryptoTicker)"
                            :key="unknownToken"
                            class="w-7 h-7 fill-secondary"
                          ></unknownTokenLogo>
                          <img
                            v-else
                            :key="selectedQuote"
                            :src="cryptoLogo[selectedQuote]"
                            class="w-7 h-7"
                          />
                        </transition>
                      </div>
                      <div class="w-7/12"></div>
                    </div>
                    <div
                      v-else
                      class="w-full flex justify-evenly uppercase gap-1 items-center p-1"
                      :key="selectedQuote"
                    >
                      <div class="w-5/12 flex justify-center items-center">
                        <svg
                          v-if="!(selectedQuote in cryptoTicker)"
                          :key="unknownToken"
                          class="w-7 h-7 fill-secondary"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 1000 1000"
                        >
                          <path
                            id="path"
                            style="opacity: 1; fill-opacity: 1"
                            d="M 500 0C 224 0 0 224 0 500C 0 776 224 1000 500 1000C 776 1000 1000 776 1000 500C 1000 224 776 0 500 0C 500 0 500 0 500 0 M 501 191C 626 191 690 275 690 375C 690 475 639 483 595 513C 573 525 558 553 559 575C 559 591 554 602 541 601C 541 601 460 601 460 601C 446 601 436 581 436 570C 436 503 441 488 476 454C 512 421 566 408 567 373C 566 344 549 308 495 306C 463 303 445 314 411 361C 400 373 384 382 372 373C 372 373 318 333 318 333C 309 323 303 307 312 293C 362 218 401 191 501 191C 501 191 501 191 501 191M 500 625C 541 625 575 659 575 700C 576 742 540 776 500 775C 457 775 426 739 425 700C 425 659 459 625 500 625C 500 625 500 625 500 625"
                            transform=""
                          ></path>
                        </svg>
                        <img
                          v-else
                          :key="selectedQuote"
                          :src="cryptoLogo[selectedQuote]"
                          class="w-7 h-7"
                        />
                      </div>
                      <div class="w-7/12 text-center font-sans">
                        {{ quoteNeeded }}
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
            <div
              class="col-span-12 p-3 xl:p-0 2xl:p-3 flex flex-col sm:flex-row justify-center items-center gap-3"
            >
              <div class="btn relative btn-wide">
                <Transition name="fadeNav">
                  <button
                    v-if="
                      baseAllowance == 'loading' || quoteAllowance == 'loading'
                    "
                    class="btn btn-primary btn-wide shadow-md shadow-black/50"
                    @click="createBot"
                  >
                    <span class="loading loading-infinity"></span>
                  </button>
                  <button
                    v-else-if="
                      (baseAllowance == undefined && selectedBase) ||
                      (quoteAllowance == undefined && selectedQuote)
                    "
                    class="btn btn-primary btn-wide shadow-md shadow-black/50"
                    @click="createBot"
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
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                      />
                    </svg>

                    Approval error
                  </button>
                  <button
                    v-else-if="baseAllowance! < Number(baseNeeded)"
                    class="btn btn-primary btn-wide shadow-md shadow-black/50"
                    @click="_addRefAllowance('base')"
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
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Approve Base
                  </button>
                  <button
                    v-else-if="quoteAllowance! < Number(quoteNeeded)"
                    class="btn btn-primary btn-wide shadow-md shadow-black/50"
                    @click="_addRefAllowance('quote')"
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
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Approve Quote
                  </button>
                  <button
                    v-else
                    class="btn btn-primary btn-wide shadow-md shadow-black/50"
                    @click="createBot"
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
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Create
                  </button>
                </Transition>
              </div>
              <button
                class="btn btn-ghost btn-wide hover:shadow-sm shadow-black/50"
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
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                Get Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Values } from "../../../types/cryptoSpecs";
import {
  cryptoLogo,
  cryptoRange,
  cryptoTicker,
  unknownToken,
} from "../../../types/cryptoSpecs";
import {
  unknownTokenLogo,
  moneyBag,
  dollars,
} from "../../../asset/images/images";
import CryptoDropdown from "./CryptoDropdown.vue";
import CryptoRange from "./CryptoRange.vue";
import { computed, ref, watch } from "vue";
import {
  encodeBot,
  loadAllowance,
  loadBalances,
  multiplicator,
  nameToToken,
  round,
  addRefAllowance,
} from "../../../utils";
import { Client } from "../../../api";
import BigNumber from "bignumber.js";
import { notify } from "@kyvg/vue3-notification";
import { h } from "vue";
import { ethers } from "ethers";

let selectedBase = ref<Values<typeof cryptoTicker>>();
let selectedQuote = ref<Values<typeof cryptoTicker>>();
let baseAllowance = ref<undefined | "loading" | number>(undefined);
let quoteAllowance = ref<undefined | "loading" | number>(undefined);

let lowerBoundValue = ref<number>(0);
let upperBoundValue = ref<number>(0);
let displayUpperBound = ref<number>(0);
let priceValue = ref<number | undefined>();

watch(selectedBase, async (newValue) => {
  if (!newValue) return;
  const base = nameToToken(
    newValue?.toLowerCase(),
    Client.accountStore.networkId!
  );

  try {
    const baseAddress = ethers.getAddress(base);
    baseAllowance.value = "loading";
    const allowance = await loadAllowance([baseAddress]);
    baseAllowance.value = new BigNumber(allowance[baseAddress])
      .dividedBy(multiplicator)
      .toNumber();
  } catch (e: any) {
    console.log(e);
    baseAllowance.value = undefined;
    return false;
  }
});

watch(selectedQuote, async (newValue) => {
  if (!newValue) return;
  const quote = nameToToken(
    newValue?.toLowerCase(),
    Client.accountStore.networkId!
  );

  try {
    const quoteAddress = ethers.getAddress(quote);
    quoteAllowance.value = "loading";
    const allowance = await loadAllowance([quoteAddress]);
    quoteAllowance.value = new BigNumber(allowance[quoteAddress])
      .dividedBy(multiplicator)
      .toNumber();
  } catch (e: any) {
    quoteAllowance.value = undefined;
    return false;
  }
});

watch(lowerBoundValue, (newValue) => {
  if (!priceValue.value && newValue) lowerBoundValue.value = 0;
});

watch(upperBoundValue, (newValue) => {
  if (!priceValue.value && newValue) upperBoundValue.value = 0;
});

let selectedStep = ref<number>(0);
let selectedFees = ref<number>(0);
let selectedAmount = ref<number>(0);

//TODO fix the floatting point error here
const upperBoundPrice = computed(() => {
  const price =
    priceValue.value! + (priceValue.value! * upperBoundValue.value!) / 100;
  return price ? price : 0;
});

const lowerBoundPrice = computed(() => {
  const price = (priceValue.value! * lowerBoundValue.value) / 100;
  return price ? price : 0;
});

const absoluteStep = computed(() => {
  return (priceValue.value! * selectedStep.value) / 25 / 100;
});

const numOrders = computed(() => {
  const range =
    upperBoundPrice.value + 0.001 - (priceValue.value! + absoluteStep.value);
  return range > 0 ? Math.ceil(range / absoluteStep.value) : 0;
});

const baseNeeded = computed(() => {
  if (numOrders) {
    return new BigNumber(numOrders.value)
      .multipliedBy(selectedAmount.value)
      .toNumber()
      .toFixed(10);
  } else {
    return "0.0000000000";
  }
});

const quoteNeeded = computed(() => {
  if (
    !(
      priceValue.value &&
      selectedStep.value &&
      lowerBoundPrice.value &&
      selectedAmount.value
    )
  )
    return "0.0000000000";

  let counter = 0;
  let price = new BigNumber(priceValue.value!);
  let amountNeeded = new BigNumber(0);

  while (counter < 5000 && price.gte(lowerBoundPrice.value)) {
    amountNeeded = amountNeeded.plus(
      new BigNumber(selectedAmount.value).multipliedBy(price)
    );
    price = price.minus(absoluteStep.value);
    ++counter;
  }

  return amountNeeded
    .dividedBy(1 + selectedFees.value / 1000)
    .toNumber()
    .toFixed(10);
});

async function createBot() {
  if (numOrders.value > 5000) {
    notify({
      text: "Can't create more than 5000 at once, increase order amount",
      type: "warn",
    });
    return;
  }
  if (!selectedStep.value){
    notify({
      text: "Please enter a step",
      type: "warn",
    });
    return;
  }
  if (!selectedAmount.value){
    notify({
      text: "Please enter an amount",
      type: "warn",
    });
    return;
  }
  const base = nameToToken(selectedBase.value!, Client.accountStore.networkId!);
  const quote = nameToToken(
    selectedQuote.value!,
    Client.accountStore.networkId!
  );
  const multiplicator = new BigNumber("1e18");
  const balances = await loadBalances([base, quote]);
  let balanceOk = true;

  if (
    new BigNumber(quoteNeeded.value).gt(
      new BigNumber(balances[quote]).dividedBy("1e18")
    )
  ) {
    balanceOk = false;
    notify({
      text: `Need ${new BigNumber(quoteNeeded.value)
        .minus(new BigNumber(balances[quote]).dividedBy("1e18"))
        .toFixed()} additional quote tokens to create the bot`,
      type: "warn",
    });
  }
  if (
    new BigNumber(baseNeeded.value).gt(
      new BigNumber(balances[base]).dividedBy("1e18")
    )
  ) {
    balanceOk = false;
    notify({
      text: `Need ${new BigNumber(baseNeeded.value)
        .minus(new BigNumber(balances[base]).dividedBy("1e18"))
        .toFixed()} additional base tokens to create the bot`,
      type: "warn",
    });
  }
  if (!balanceOk) return false;

  const data = {
    address: Client.accountStore.$state.address,
    amount: new BigNumber(selectedAmount.value)
      .multipliedBy(multiplicator)
      .toFixed(),
    price: new BigNumber(priceValue.value!)
      .multipliedBy(multiplicator)
      .toFixed(),
    step: new BigNumber(absoluteStep.value)
      .multipliedBy(multiplicator)
      .toFixed(),
    maker_fees: String(Math.floor(selectedFees.value)),
    upper_bound: new BigNumber(upperBoundPrice.value)
      .multipliedBy(multiplicator)
      .toFixed(),
    chain_id: Client.accountStore.$state.networkId,
    lower_bound: new BigNumber(lowerBoundPrice.value)
      .multipliedBy(multiplicator)
      .toFixed(),
    base_token: nameToToken(
      selectedBase.value!,
      Client.accountStore.$state.networkId!
    ),
    quote_token: nameToToken(
      selectedQuote.value!,
      Client.accountStore.$state.networkId!
    ),
    expiry: String(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1000),
    is_buyer: false,
    replace_order: true,
  };
  console.log([
    data.address,
    data.amount,
    data.price,
    data.step,
    data.maker_fees,
    data.upper_bound,
    data.lower_bound,
    data.base_token,
    data.quote_token,
    data.expiry,
    Client.accountStore.$state.networkId,
    data.is_buyer ? 0 : 1,
    data.replace_order,
  ]);
  const encodedData = encodeBot(data);
  if (
    await Client.createUserBot(
      data,
      String(baseNeeded.value),
      String(quoteNeeded.value),
      encodedData
    )
  ) {
    notify({
      text: "Bot created successfully",
      type: "success",
    });
  }
}

function _addRefAllowance(type: "base" | "quote"): void {
  if (type == "base") addRefAllowance("base", selectedBase.value, baseAllowance)
  else addRefAllowance("quote", selectedQuote.value, quoteAllowance)
}
</script>
