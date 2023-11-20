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
                  <div class="dropdown grow group">
                    <label
                      tabindex="0"
                      class="grid grid-cols-[min-content_1fr] grow gap-1 items-center cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 transition-all focusRotation"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                      <div
                        class="group-focus-within:opacity-100 group-focus-within:flex hidden opacity-0 transition-all"
                      >
                        <input
                          v-model="selectedBase"
                          type="text"
                          placeholder="type address"
                          class="text-center p-2 appearance-none outline-0 w-full bg-transparent placeholder:text-neutral-content/50"
                        />
                      </div>
                      <div
                        class="relative w-full h-full flex justify-center items-center opacity-100 group-focus-within:absolute group-focus-within:opacity-0 transition-all"
                      >
                        <transition name="fadeFast">
                          <div
                            v-if="!selectedBase"
                            class="grow text-center p-2 group-focus-within:opacity-0 opacity-100 transition-all duration-500"
                          >
                            base
                          </div>
                          <div
                            :key="selectedBase"
                            v-else-if="selectedBase in cryptoDetails"
                            class="w-full flex justify-evenly uppercase gap-1 items-center p-1"
                          >
                            {{ selectedBase }}
                            <img
                              :src="cryptoDetails[selectedBase].logo"
                              class="w-7 h-7"
                            />
                          </div>
                          <div
                            v-else
                            :key="unknownToken"
                            class="w-full flex justify-evenly uppercase gap-1 items-center p-1 group-focus-within:opacity-0 opacity-100 transition-all duration-500"
                          >
                            {{ selectedBase }}
                            <unknownTokenLogo
                              class="w-7 h-7 fill-primary"
                            ></unknownTokenLogo>
                          </div>
                        </transition>
                      </div>
                    </label>
                    <ul
                      ref="focusBaseLabel"
                      tabindex="0"
                      class="dropdown-content z-20 menu p-2 shadow bg-base-100 rounded-box w-52 flex max-h-52 flex-nowrap overflow-auto custom-scroll"
                    >
                      <li
                        v-for="name of cryptoNames"
                        @click="() => {selectedBase = <keyof typeof cryptoNames>name; focusBaseLabel!.blur()}"
                      >
                        <a class="flex gap-1 items-center uppercase">
                          <img
                            :src="cryptoDetails[name].logo"
                            class="w-7 h-7"
                          />
                          <div class="grow text-center">
                            {{ name }}
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-span-full sm:col-span-6 flex justify-center">
                <div
                  class="font-bold rounded-full bg-base-100 w-full h-9 flex gap-1 items-center px-3 hover:bg-base-200 transition-all shadow-lg shadow-black/50"
                >
                  <div class="dropdown grow group">
                    <label
                      tabindex="0"
                      class="grid grid-cols-[min-content_1fr] grow gap-1 items-center cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 transition-all focusRotation"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                      <div
                        class="group-focus-within:opacity-100 group-focus-within:flex hidden opacity-0 transition-all"
                      >
                        <input
                          v-model="selectedQuote"
                          type="text"
                          placeholder="type address"
                          class="text-center p-2 appearance-none outline-0 w-full bg-transparent placeholder:text-neutral-content/50"
                        />
                      </div>
                      <div
                        class="relative w-full h-full flex justify-center items-center opacity-100 group-focus-within:absolute group-focus-within:opacity-0 transition-all"
                      >
                        <transition name="fadeFast">
                          <div
                            v-if="!selectedQuote"
                            class="grow text-center p-2 group-focus-within:opacity-0 opacity-100 transition-all duration-500"
                          >
                            quote
                          </div>
                          <div
                            :key="selectedQuote"
                            v-else-if="selectedQuote in cryptoDetails"
                            class="w-full flex justify-evenly uppercase gap-1 items-center p-1"
                          >
                            {{ selectedQuote }}
                            <img
                              :src="cryptoDetails[selectedQuote].logo"
                              class="w-7 h-7"
                            />
                          </div>
                          <div
                            v-else
                            :key="unknownToken"
                            class="w-full flex justify-evenly uppercase gap-1 items-center p-1 group-focus-within:opacity-0 opacity-100 transition-all duration-500"
                          >
                            {{ selectedQuote }}
                            <svg
                              class="w-7 h-7 fill-secondary"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 1000 1000"
                            >
                              <path
                                id="path"
                                style="
                                  opacity: 1;
                                  vector-effect: none;
                                  fill-opacity: 1;
                                "
                                d="M 500 0C 224 0 0 224 0 500C 0 776 224 1000 500 1000C 776 1000 1000 776 1000 500C 1000 224 776 0 500 0C 500 0 500 0 500 0 M 501 191C 626 191 690 275 690 375C 690 475 639 483 595 513C 573 525 558 553 559 575C 559 591 554 602 541 601C 541 601 460 601 460 601C 446 601 436 581 436 570C 436 503 441 488 476 454C 512 421 566 408 567 373C 566 344 549 308 495 306C 463 303 445 314 411 361C 400 373 384 382 372 373C 372 373 318 333 318 333C 309 323 303 307 312 293C 362 218 401 191 501 191C 501 191 501 191 501 191M 500 625C 541 625 575 659 575 700C 576 742 540 776 500 775C 457 775 426 739 425 700C 425 659 459 625 500 625C 500 625 500 625 500 625"
                                transform=""
                              ></path>
                            </svg>
                          </div>
                        </transition>
                      </div>
                    </label>
                    <ul
                      ref="focusQuoteLabel"
                      tabindex="0"
                      class="dropdown-content z-20 menu p-2 shadow bg-base-100 rounded-box w-52 flex max-h-52 flex-nowrap overflow-auto custom-scroll"
                    >
                      <li
                        v-for="name of cryptoNames"
                        @click="() => {selectedQuote = <keyof typeof cryptoNames>name; focusQuoteLabel!.blur()}"
                      >
                        <a class="flex gap-1 items-center uppercase">
                          <img
                            :src="cryptoDetails[name].logo"
                            class="w-7 h-7"
                          />
                          <div class="grow text-center">
                            {{ name }}
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
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
                  class="relative grow flex justify-end items-center"
                >
                  <transition appear name="fadeNav">
                    <div
                      :key="selectedBase + selectedQuote"
                      class="py-0.5 px-4 text-[11px] sm:text-sm rounded-full badge border border-warning/70 bg-transparent font-sans font-bold text-warning/70"
                    >
                      price: {{ selectedQuote }}
                    </div>
                  </transition>
                </div>
              </div>
              <div class="col-span-12 flex justify-center">
                <div class="grow">
                  <div
                    class="flex bg-base-300 rounded-full items-center grow p-1 shadow shadow-black/50"
                  >
                    <input
                      :disabled="selectedBase == undefined ? true : false"
                      :value="lowerBoundValue ? lowerBoundValue : ''"
                      @input="event => lowerBoundValue = parseFloat((<HTMLInputElement>event.target).value) ? parseFloat((<HTMLInputElement>event.target).value): 0"
                      type="text"
                      placeholder="lower bound"
                      class="text-center font-sans text-xs p-2 appearance-none outline-0 w-24 h-5 bg-transparent placeholder:text-neutral-content/50"
                    />
                    <div
                      class="flex bg-base-100 rounded-full items-center grow relative"
                    >
                      <div
                        class="pointer-events-none absolute h-full z-10 w-full flex items-center"
                      >
                        <div
                          class="h-full w-full flex items-center relative -translate-x-[0.12rem]"
                        >
                          <div
                            class="h-full"
                            :style="{
                              width: `${Math.min(100, lowerBoundValue)}%`,
                            }"
                          ></div>
                          <transition name="fadeNav" appear>
                            <unknownTokenLogo
                              v-if="
                                selectedBase && !(selectedBase in cryptoDetails)
                              "
                              :key="unknownToken"
                              class="w-7 h-7 fill-primary pointer-events-none absolute rounded-full p-0.5 bg-base-300 shadow-lg shadow-black/50"
                              :style="{
                                transform: `translateX(${String(
                                  -Math.min(100, lowerBoundValue) / 1.15
                                )}%)`,
                                left: `${Math.min(100, lowerBoundValue)}%`,
                              }"
                            ></unknownTokenLogo>
                            <img
                              v-else-if="
                                selectedBase && selectedBase in cryptoDetails
                              "
                              :key="selectedBase"
                              :src="cryptoDetails[selectedBase].logo"
                              class="w-7 h-7 pointer-events-none absolute rounded-full p-0.5 bg-base-300 shadow-lg shadow-black/50"
                              :style="{
                                transform: `translateX(${String(
                                  -Math.min(100, lowerBoundValue) / 1.15
                                )}%)`,
                                left: `${Math.min(100, lowerBoundValue)}%`,
                              }"
                            />
                          </transition>
                        </div>
                      </div>
                      <div class="relative w-full h-5">
                        <transition name="fadeNav" appear>
                          <input
                            v-if="selectedBase && selectedBase in cryptoDetails"
                            :key="selectedBase"
                            v-model="lowerBoundValue"
                            type="range"
                            min="0"
                            max="100"
                            class="range range-sm w-full absolute"
                            :class="cryptoRange[selectedBase]"
                          />
                          <input
                            v-else-if="
                              selectedBase && !(selectedBase in cryptoDetails)
                            "
                            :key="unknownToken"
                            v-model="lowerBoundValue"
                            type="range"
                            min="0"
                            max="100"
                            class="range range-sm w-full range-primary absolute"
                          />
                        </transition>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-span-12 flex justify-center">
                <div class="grow">
                  <div
                    class="flex bg-base-300 rounded-full items-center grow p-1 shadow shadow-black/50"
                  >
                    <input
                      :disabled="selectedQuote == undefined ? true : false"
                      :value="upperBoundValue ? upperBoundValue : ''"
                      @input="event => upperBoundValue = parseFloat((<HTMLInputElement>event.target).value) ? parseFloat((<HTMLInputElement>event.target).value): 0"
                      type="text"
                      placeholder="upper bound"
                      class="text-center font-sans text-xs p-2 appearance-none outline-0 w-24 h-5 bg-transparent placeholder:text-neutral-content/50"
                    />
                    <div
                      class="flex bg-base-100 rounded-full items-center grow relative"
                    >
                      <div
                        class="pointer-events-none absolute h-full z-10 w-full flex items-center"
                      >
                        <div
                          class="h-full w-full flex items-center relative -translate-x-[0.12rem]"
                        >
                          <div
                            class="h-full"
                            :style="{
                              width: `${Math.min(upperBoundValue, 100)}%`,
                            }"
                          ></div>
                          <transition name="fadeNav" appear>
                            <img
                              v-if="
                                selectedQuote && selectedQuote in cryptoDetails
                              "
                              :key="selectedQuote"
                              :src="cryptoDetails[selectedQuote].logo"
                              class="w-7 h-7 pointer-events-none absolute rounded-full p-0.5 bg-base-300 shadow-lg shadow-black/50"
                              :style="{
                                transform: `translateX(${String(
                                  -Math.min(100, upperBoundValue) / 1.15
                                )}%)`,
                                left: `${Math.min(100, upperBoundValue)}%`,
                              }"
                            />
                            <unknownTokenLogo
                              v-else-if="
                                selectedQuote &&
                                !(selectedQuote in cryptoDetails)
                              "
                              :key="unknownToken"
                              class="w-7 h-7 fill-secondary pointer-events-none absolute rounded-full p-0.5 bg-base-300 shadow-lg shadow-black/50"
                              :style="{
                                transform: `translateX(${String(
                                  -Math.min(100, upperBoundValue / 1.15)
                                )}%)`,
                                left: `${Math.min(100, upperBoundValue)}%`,
                              }"
                            ></unknownTokenLogo>
                          </transition>
                        </div>
                      </div>
                      <div class="relative w-full h-5">
                        <transition name="fadeNav" appear>
                          <input
                            v-if="
                              selectedQuote && selectedQuote in cryptoDetails
                            "
                            :key="selectedQuote"
                            v-model="upperBoundValue"
                            type="range"
                            min="0"
                            max="100"
                            class="range range-sm w-full absolute"
                            :class="cryptoRange[selectedQuote]"
                          />
                          <input
                            v-else-if="
                              selectedQuote && !(selectedQuote in cryptoDetails)
                            "
                            :key="unknownToken"
                            v-model="upperBoundValue"
                            type="range"
                            min="0"
                            max="100"
                            class="range range-sm range-secondary w-full absolute"
                          />
                        </transition>
                      </div>
                    </div>
                  </div>
                </div>
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
                      v-if="lowerBoundValue && upperBoundValue"
                      class="py-0.5 px-4 text-[11px] sm:text-sm rounded-full min-w-max badge border border-warning/70 bg-transparent font-sans font-bold text-warning/70"
                    >
                      adviced fees: 2.5%
                    </div>
                  </transition>
                </div>
              </div>
              <div class="col-span-12 flex justify-center">
                <div class="grow">
                  <div
                    class="flex bg-base-300 rounded-full items-center grow p-1 shadow shadow-black/50"
                  >
                    <input
                      :disabled="!(lowerBoundValue && upperBoundValue)"
                      :value="
                        selectedStep && lowerBoundValue && upperBoundValue
                          ? selectedStep
                          : ''
                      "
                      @input="event => selectedStep = parseFloat((<HTMLInputElement>event.target).value) ? parseFloat((<HTMLInputElement>event.target).value): 0"
                      type="text"
                      placeholder="step"
                      class="text-center font-sans text-xs p-2 appearance-none outline-0 w-24 h-5 bg-transparent placeholder:text-neutral-content/50"
                    />
                    <div
                      class="flex bg-base-100 rounded-full items-center grow relative"
                    >
                      <div
                        class="pointer-events-none absolute h-full z-10 w-full flex items-center"
                      >
                        <div
                          class="h-full w-full flex items-center relative -translate-x-[0.12rem]"
                        >
                          <div
                            class="h-full"
                            :style="{
                              width: `${Math.min(100, selectedStep)}%`,
                            }"
                          ></div>
                          <transition name="fadeNav" appear>
                            <svg
                              v-if="lowerBoundValue && upperBoundValue"
                              class="w-7 h-7 fill-current pointer-events-none absolute rounded-full p-1 bg-base-300 shadow-lg shadow-black/50"
                              :style="{
                                transform: `translateX(${String(
                                  -Math.min(100, selectedStep) / 1.15
                                )}%)`,
                                left: `${Math.min(100, selectedStep)}%`,
                              }"
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
                          </transition>
                        </div>
                      </div>
                      <div class="relative w-full h-5">
                        <transition name="fadeNav" appear>
                          <input
                            v-if="lowerBoundValue && upperBoundValue"
                            v-model="selectedStep"
                            type="range"
                            min="0"
                            max="100"
                            class="range range-sm w-full absolute range-gray-700"
                          />
                        </transition>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-span-12 flex justify-center">
                <div class="grow">
                  <div
                    class="flex bg-base-300 rounded-full items-center grow p-1 shadow shadow-black/50"
                  >
                    <input
                      :disabled="!(lowerBoundValue && upperBoundValue)"
                      :value="
                        selectedFees && lowerBoundValue && upperBoundValue
                          ? selectedFees
                          : ''
                      "
                      @input="event => selectedFees = parseFloat((<HTMLInputElement>event.target).value) ? parseFloat((<HTMLInputElement>event.target).value): 0"
                      type="text"
                      placeholder="fees"
                      class="text-center font-sans text-xs p-2 appearance-none outline-0 w-24 h-5 bg-transparent placeholder:text-neutral-content/50"
                    />
                    <div
                      class="flex bg-base-100 rounded-full items-center grow relative"
                    >
                      <div
                        class="pointer-events-none absolute h-full z-10 w-full flex items-center"
                      >
                        <div
                          class="h-full w-full flex items-center relative -translate-x-[0.12rem]"
                        >
                          <div
                            class="h-full"
                            :style="{
                              width: `${Math.min(100, selectedFees)}%`,
                            }"
                          ></div>
                          <transition name="fadeNav" appear>
                            <img
                              v-if="lowerBoundValue && upperBoundValue"
                              :src="moneyBag"
                              class="w-7 h-7 fill-current pointer-events-none absolute rounded-full p-1 bg-base-300 shadow-lg shadow-black/50"
                              :style="{
                                transform: `translateX(${String(
                                  -Math.min(100, selectedFees) / 1.15
                                )}%)`,
                                left: `${Math.min(100, selectedFees)}%`,
                              }"
                            />
                          </transition>
                        </div>
                      </div>
                      <div class="relative w-full h-5">
                        <transition name="fadeNav" appear>
                          <input
                            v-if="lowerBoundValue && upperBoundValue"
                            v-model="selectedFees"
                            type="range"
                            min="0"
                            max="100"
                            class="range range-sm w-full absolute range-amber-400"
                          />
                        </transition>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-span-12 flex justify-center">
                <div class="grow">
                  <div
                    class="flex bg-base-300 rounded-full items-center grow p-1 shadow shadow-black/50"
                  >
                    <input
                      :disabled="!(lowerBoundValue && upperBoundValue)"
                      :value="
                        selectedAmount && lowerBoundValue && upperBoundValue
                          ? selectedAmount
                          : ''
                      "
                      @input="event => selectedAmount = parseFloat((<HTMLInputElement>event.target).value) ? parseFloat((<HTMLInputElement>event.target).value): 0"
                      type="text"
                      placeholder="amount"
                      class="text-center font-sans text-xs p-2 appearance-none outline-0 w-24 h-5 bg-transparent placeholder:text-neutral-content/50"
                    />
                    <div
                      class="flex bg-base-100 rounded-full items-center grow relative"
                    >
                      <div
                        class="pointer-events-none absolute h-full z-10 w-full flex items-center"
                      >
                        <div
                          class="h-full w-full flex items-center relative -translate-x-[0.12rem]"
                        >
                          <div
                            class="h-full"
                            :style="{
                              width: `${Math.min(100, selectedAmount)}%`,
                            }"
                          ></div>
                          <transition name="fadeNav" appear>
                            <img
                              v-if="lowerBoundValue && upperBoundValue"
                              :src="dollars"
                              class="w-7 h-7 fill-current pointer-events-none absolute rounded-full p-1 bg-base-300 shadow-lg shadow-black/50"
                              :style="{
                                transform: `translateX(${String(
                                  -Math.min(100, selectedAmount) / 1.15
                                )}%)`,
                                left: `${Math.min(100, selectedAmount)}%`,
                              }"
                            />
                          </transition>
                        </div>
                      </div>
                      <div class="relative w-full h-5">
                        <transition name="fadeNav" appear>
                          <input
                            v-if="lowerBoundValue && upperBoundValue"
                            v-model="selectedAmount"
                            type="range"
                            min="0"
                            max="100"
                            class="range range-sm w-full absolute range-lime-300"
                          />
                        </transition>
                      </div>
                    </div>
                  </div>
                </div>
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
                            v-if="!(selectedBase in cryptoDetails)"
                            :key="unknownToken"
                            class="w-7 h-7 fill-primary"
                          ></unknownTokenLogo>
                          <img
                            v-else
                            :key="selectedBase"
                            :src="cryptoDetails[selectedBase].logo"
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
                          v-if="!(selectedBase in cryptoDetails)"
                          :key="unknownToken"
                          class="w-7 h-7 fill-primary"
                        ></unknownTokenLogo>
                        <img
                          v-else
                          :key="selectedBase"
                          :src="cryptoDetails[selectedBase].logo"
                          class="w-7 h-7"
                        />
                      </div>
                      <div class="w-7/12 text-center font-sans">
                        {{ lowerBoundValue }}
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
                            v-if="!(selectedQuote in cryptoDetails)"
                            :key="unknownToken"
                            class="w-7 h-7 fill-secondary"
                          ></unknownTokenLogo>
                          <img
                            v-else
                            :key="selectedQuote"
                            :src="cryptoDetails[selectedQuote].logo"
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
                          v-if="!(selectedQuote in cryptoDetails)"
                          :key="unknownToken"
                          class="w-7 h-7 fill-secondary"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 1000 1000"
                        >
                          <path
                            id="path"
                            style="
                              opacity: 1;
                              vector-effect: none;
                              fill-opacity: 1;
                            "
                            d="M 500 0C 224 0 0 224 0 500C 0 776 224 1000 500 1000C 776 1000 1000 776 1000 500C 1000 224 776 0 500 0C 500 0 500 0 500 0 M 501 191C 626 191 690 275 690 375C 690 475 639 483 595 513C 573 525 558 553 559 575C 559 591 554 602 541 601C 541 601 460 601 460 601C 446 601 436 581 436 570C 436 503 441 488 476 454C 512 421 566 408 567 373C 566 344 549 308 495 306C 463 303 445 314 411 361C 400 373 384 382 372 373C 372 373 318 333 318 333C 309 323 303 307 312 293C 362 218 401 191 501 191C 501 191 501 191 501 191M 500 625C 541 625 575 659 575 700C 576 742 540 776 500 775C 457 775 426 739 425 700C 425 659 459 625 500 625C 500 625 500 625 500 625"
                            transform=""
                          ></path>
                        </svg>
                        <img
                          v-else
                          :key="selectedQuote"
                          :src="cryptoDetails[selectedQuote].logo"
                          class="w-7 h-7"
                        />
                      </div>
                      <div class="w-7/12 text-center font-sans">
                        {{ upperBoundValue }}
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
            <div
              class="col-span-12 p-3 xl:p-0 2xl:p-3 flex flex-col sm:flex-row justify-center items-center gap-3"
            >
              <button class="btn btn-primary btn-wide shadow-md shadow-black/50">
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
              <button class="btn btn-ghost btn-wide hover:shadow-sm shadow-black/50">
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
import {
  cryptoRange,
  cryptoNames,
  unknownToken,
} from "../../../types/cryptoSpecs";
import {
  usdt,
  ether,
  logo,
  polygon,
  avax,
  bnb,
  usdc,
  aave,
  unknownTokenLogo,
  moneyBag,
  dollars,
} from "../../../asset/images/images";
import { ref } from "vue";

const cryptoDetails = {
  [cryptoNames.polygon]: { bg: "border border-purple-600", logo: polygon },
  [cryptoNames.avax]: { bg: "border border-red-600", logo: avax },
  [cryptoNames.bnb]: { bg: "border border-yellow-600", logo: bnb },
  [cryptoNames.usdc]: { bg: "border border-blue-600", logo: usdc },
  [cryptoNames.usdt]: { bg: "border border-emerald-600", logo: usdt },
  [cryptoNames.ether]: { bg: "border border-gray-600", logo: ether },
  [cryptoNames.coss]: { bg: "border border-blue-600", logo: logo },
  [cryptoNames.aave]: { bg: "border border-purple-500", logo: aave },
};

let focusBaseLabel = ref<HTMLInputElement | null>(null);
let focusQuoteLabel = ref<HTMLInputElement | null>(null);

let selectedBase = ref<keyof typeof cryptoNames>();
let selectedQuote = ref<keyof typeof cryptoNames>();

let lowerBoundValue = ref<number>(0);
let upperBoundValue = ref<number>(0);

let selectedStep = ref<number>(0);
let selectedFees = ref<number>(0);
let selectedAmount = ref<number>(0);
</script>
