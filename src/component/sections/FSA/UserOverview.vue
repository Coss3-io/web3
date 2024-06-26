<template>
  <div
    class="stats overflow-hidden divide-x-2 shadow-md shadow-black/50 xl:px-2 stats-vertical bg-primary text-primary-content grid xl:grid-cols-[auto_auto_auto] lg:grid-cols-[auto_auto] md:grid-cols-[auto_auto_auto] sm:grid-cols-[auto_auto] rounded-2xl w-fit max-w-full lg:w-full"
  >
    <div
      class="stat place-items-center md:place-items-start lg:place-items-center xl:place-items-start"
    >
      <div class="stat-title">Your FSA</div>
      <div
        class="stat-value xl:text-[30px] 2xl:text-[36px] flex items-center w-full justify-center gap-3 p-3 xl:p-0"
      >
        <div
          class="font-sans grow text-center md:text-left lg:text-center xl:text-left"
        >
          ${{
            displayNumber(
              dollarsValue(Client.stackingStore[StackingGetters.UserGlobalFSA])
            ) || "1,520,230"
          }}
        </div>
        <div class="text-neutral-content justify-self-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-full max-h-11"
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
        </div>
      </div>
      <div class="stat-desc">
        ${{
          displayNumber(
            dollarsValue(Client.stackingStore[StackingGetters.UserLastRoundFSA])
          ) || "230"
        }}
        as of last round
      </div>
    </div>
    <div
      class="stat place-items-center md:place-items-start lg:place-items-center xl:place-items-start"
    >
      <div class="stat-title">Annualized Yield</div>
      <div
        class="stat-value xl:text-[30px] 2xl:text-[36px] flex items-center w-full justify-center gap-3 p-3 xl:p-0"
      >
        <div
          class="font-sans grow text-center md:text-left lg:text-center xl:text-left"
        >
          {{
            Math.round(
              (dollarsValue(
                Client.stackingStore[StackingGetters.UserLastRoundFSA]
              ) /
                dollarsValue({
                  [COSS_TOKEN]:
                    Client.stackingStore.user.stacks[
                      Client.stackingStore.user.stacks.length - 1
                    ]?.amount,
                })) *
                52 *
                100
            ) || 0
          }}%
        </div>
        <div class="text-neutral-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-full max-h-11"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
            />
          </svg>
        </div>
      </div>
      <div class="stat-desc">
        ~${{
          dollarsValue(Client.stackingStore[StackingGetters.UserLastRoundFSA]) *
          52
        }}
        earning projection
      </div>
    </div>
    <div
      class="stat xl:p-3 p-5 xl:col-span-1 lg:col-span-2 md:col-span-1 sm:col-span-2 place-items-center md:place-items-start lg:place-items-center xl:place-items-start"
    >
      <div class="stat-title">Deposited COSS</div>
      <div
        class="stat-value flex items-center gap-2 xl:text-[30px] 2xl:text-[36px]"
      >
        <img
          :src="logo"
          class="p-0.5 w-7 h-7 rounded-full bg-base-200/50 shadow-md shadow-black/30"
        />
        {{
          displayNumber(
            Client.stackingStore.user.stacks[
              Client.stackingStore.user.stacks.length - 1
            ]?.amount
          ) || "0"
        }}
      </div>
      <div class="stat-desc">
        ${{
          displayNumber(
            dollarsValue({
              [COSS_TOKEN]:
                Client.stackingStore.user.stacks[
                  Client.stackingStore.user.stacks.length - 1
                ]?.amount,
            })
          ) || "0"
        }}
        ({{
          (
            Client.stackingStore[StackingGetters.UserStackingShare] * 100
          ).toFixed(2) || 0
        }}% of total stacked)
      </div>
      <div class="stat-actions flex gap-3">
        <button
          class="btn btn-sm hover:scale-105"
          @click="
            depositModalDialog?.showModal();
            depositInput?.blur();
          "
        >
          Deposit
        </button>
        <button
          class="btn btn-sm hover:scale-105"
          @click="
            withdrawModalDialog?.showModal();
            withdrawInput?.blur();
          "
        >
          Withdraw
        </button>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <dialog
      class="modal"
      ref="depositModalDialog"
      @click="depositModalDialog?.close()"
    >
      <div class="modal-box shadow-lg shadow-black/50" @click.stop="">
        <h1 class="font-bold text-xl flex gap-2">
          Deposit
          <img
            :src="logo"
            class="p-0.5 w-7 h-7 rounded-full bg-base-300 shadow-lg shadow-black/50"
          />
        </h1>
        <p class="py-4">
          Deposited coss tokens will be taken in account for FSA at
          <b>the next slot start</b>
          , check
          <u>the docs</u>
          for more details
        </p>
        <div
          class="mt-3 w-full flex justify-between items-center rounded-md bg-base-300 shadow-lg shadow-black/50 relative"
        >
          <div
            class="flex justify-center text-primary-content px-2 bg-primary white-end text-sm font-bold rounded-md py-1 m-2 shadow-lg shadow-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <input
            v-model="depositAmount"
            ref="depositInput"
            type="text"
            class="appearance-none min-w-0 grow text-center font-bold outline-none rounded-md bg-transparent placeholder:opacity-25 sm:placeholder:text-base placeholder:text-xs"
            :placeholder="`max COSS deposable: ${Math.min(
              props.balance,
              props.allowance
            ).toFixed(5)}`"
          />
          <div
            class="btn btn-xs btn-primary m-2"
            @click="
              () => {
                depositAmount = Math.min(props.balance, props.allowance);
              }
            "
          >
            max
          </div>
        </div>
        <div class="modal-action justify-center">
          <form method="dialog">
            <button
              class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <SpinnerButton
            :fn="depositTokens"
            :class="
              !!Number(props.allowance)
                ? 'btn-primary white-end'
                : 'btn-disabled'
            "
            class="btn hover:scale-105 btn-wide shadow-lg shadow-black/50"
          >
            Deposit
          </SpinnerButton>
          <SpinnerButton
          v-if="props.allowance < props.balance"
            :fn="approveContract"
            class="btn btn-primary white-end hover:scale-105 btn-wide shadow-lg shadow-black/50"
          >
            Approve
          </SpinnerButton>
        </div>
      </div>
    </dialog>
  </Teleport>
  <Teleport to="body">
    <dialog
      class="modal"
      ref="withdrawModalDialog"
      @click="withdrawModalDialog?.close()"
    >
      <div class="modal-box shadow-lg shadow-black/50" @click.stop="">
        <h1 class="font-bold text-xl flex gap-2">
          Withdraw
          <img
            :src="logo"
            class="p-0.5 w-7 h-7 rounded-full bg-base-300 shadow-lg shadow-black/50"
          />
        </h1>
        <p class="py-4">
          Withdrawing coss tokens from the stacking contract is
          <u>immediate.</u>
          <br />
          <br />
          All unwithrawn FSA will be
          <b>lost</b>
          when withdrawing stack.
          <br />
          <br />
          You can only withdraw all your stack at once for now.
        </p>
        <!-- <div
          class="mt-3 w-full flex justify-between items-center rounded-md bg-base-300 shadow-lg shadow-black/50 relative"
        >
          <div
            class="flex justify-center text-primary-content px-2 bg-primary white-end text-sm font-bold rounded-md py-1 m-2 shadow-lg shadow-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </div>
          <input
            v-model="withdrawAmount"
            ref="withdrawInput"
            type="text"
            class="appearance-none min-w-0 grow text-center font-bold outline-none rounded-md bg-transparent placeholder:opacity-25 sm:placeholder:text-base placeholder:text-xs"
            :placeholder="`COSS available: ${3535435}`"
          />
          <div class="btn btn-xs btn-primary m-2">max</div>
        </div> -->
        <div class="modal-action justify-center">
          <form method="dialog">
            <button
              class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <SpinnerButton
            :fn="withdrawTokens"
            class="btn btn-primary white-end hover:scale-105 btn-wide shadow-lg shadow-black/50"
          >
            Withdraw
          </SpinnerButton>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { logo } from "../../../asset/images/images";
import { Client } from "../../../api";
import { COSS_TOKEN } from "../../../api/settings";
import { StackingGetters } from "../../../types/stacking";
import { displayNumber, dollarsValue } from "../../../utils";
import SpinnerButton from "../../buttons/SpinnerButton.vue";
import { useNotification } from "@kyvg/vue3-notification";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";

const { notify } = useNotification();

const props = defineProps<{
  balance: number;
  allowance: number;
}>();

const emits = defineEmits<{
  (e: "balanceUpdate", value: number): void;
  (e: "allowanceUpdate", value: number): void;
}>();

let depositAmount = ref<null | number>(null);
let depositInput = ref<HTMLInputElement | null>(null);
let depositModalDialog = ref<HTMLDialogElement | null>(null);

let withdrawAmount = ref<null | number>(null);
let withdrawInput = ref<HTMLInputElement | null>(null);
let withdrawModalDialog = ref<HTMLDialogElement | null>(null);

async function depositTokens() {
  if (!depositAmount.value) {
    notify({
      type: "warn",
      text: "Deposit amount can be empty",
    });
    return;
  }
  try {
    const tx = await Client.stackingContract.depositStack(
      new BigNumber(depositAmount.value).multipliedBy("1e18")
    );
    await tx.wait(3);
  } catch (e: any) {
    notify({
      type: "warn",
      text: "An error occured during deposit check console for details",
    });
    console.log(e);
  }
  emits(
    "balanceUpdate",
    new BigNumber(props.balance).minus(depositAmount.value).toNumber()
  );
  emits(
    "allowanceUpdate",
    new BigNumber(props.allowance).minus(depositAmount.value).toNumber()
  );
  depositAmount.value = null;
}

async function withdrawTokens() {
  try {
    const tx = await Client.stackingContract.withdrawStack();
    await tx.wait(3);
  } catch (e: any) {
    notify({
      type: "warn",
      text: "An error occured during deposit check console for details",
    });
    console.log(e);
  }
}

async function approveContract() {
  try {
    const stackingAddress = await Client.stackingContract.getAddress();
    const tx = await Client.cossContract.approve(stackingAddress, ethers.MaxUint256);
    await tx.wait(3);
    emits(
      "allowanceUpdate",
      new BigNumber(ethers.MaxUint256.toString()).toNumber()
    );
  } catch (e: any) {
    notify({
      type: "warn",
      text: "An error occured during token approval check console for details",
    });
    console.log(e);
  }
}
</script>
