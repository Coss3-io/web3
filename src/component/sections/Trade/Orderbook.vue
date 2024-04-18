<template>
  <div
    class="grid relative grid-rows-[min-content_1fr_min-content_1fr] w-full h-full overflow-hidden p-1 px-2 bg-base-300 rounded-lg shadow-lg shadow-black/50"
  >
    <Transition name="fadeNav">
      <div
        v-if="
          (props.loading || !Client.orderStore.$state.makersLoaded[pair]) &&
          base &&
          quote
        "
        class="absolute backdrop-blur-md top-0 bottom-0 left-0 right-0 z-30 flex items-center justify-center"
      >
        <div class="btn btn-primary no-animation cursor-default w-38">
          <span class="loading loading-infinity"></span>
        </div>
      </div>
    </Transition>
    <div
      class="grid grid-cols-3 justify-items-center text-[10px] text-neutral-content/70 py-1"
    >
      <div>price</div>
      <div>amount</div>
      <div>total</div>
    </div>
    <div
      ref="sellContainer"
      class="h-full relative flex flex-col-reverse overflow-y-auto overflow-x-hidden custom-scroll gap-0.5 rounded-xl"
    >
      <TransitionGroup name="listSell" tag="div">
        <div
          v-for="n in (sellOrders.length * 24 < sellContainer?.clientHeight! ? Math.floor((sellContainer?.clientHeight! - sellOrders.length * 24 )/16): 0)"
          :key="'sell' + String(n)"
          class="flex text-center text-[11px] font-bold h-4 -z-10"
        >
          <div class="w-1/3">-</div>
          <div class="w-1/3">-</div>
          <div class="w-1/3">-</div>
        </div>
        <div
          v-for="entry in sellOrders"
          :key="entry.price"
          class="relative w-full min-h-6 z-10 group"
        >
          <div
            class="flex w-full font-sans-inherit absolute transition-all duration-500 hover:duration-150 hover:!bg-red-700/30 group-even:bg-red-900/10 group-odd:bg-red-700/10 text-center text-[11px] font-bold rounded-md py-1"
          >
            <div class="w-1/3">{{ entry.price.toFixed(5) }}</div>
            <div class="w-1/3">{{ entry.total.toFixed(5) }}</div>
            <div class="w-1/3">
              {{ (entry.price * entry.total).toFixed(8) }}
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <div
      class="h-7 w-full grid grid-cols-3 justify-items-center items-center font-bold"
      :class="
        lastTrade.price
          ? lastTrade.isBuyer
            ? 'text-emerald-500'
            : 'text-red-500'
          : ''
      "
    >
      <div class="font-sans">{{ lastTrade.price?.toFixed(5) ?? "-" }}</div>
      <div class="font-sans">{{ lastTrade.amount?.toFixed(5) ?? "-" }}</div>
      <div class="font-sans">
        {{
          lastTrade.amount && lastTrade.price
            ? (lastTrade.amount * lastTrade.price).toFixed(5)
            : "-"
        }}
      </div>
    </div>
    <div
      ref="buyContainer"
      class="h-full flex relative flex-col overflow-y-auto overflow-x-hidden custom-scroll gap-0.5 rounded-xl rounded-t-md"
    >
      <TransitionGroup name="listBuy" tag="div">
        <div
          v-for="(entry, index) in buyOrders"
          :key="entry.price"
          class="relative w-full min-h-6 z-10 group"
        >
          <div
            class="flex w-full font-sans-inherit absolute transition-all duration-500 hover:duration-150 hover:!bg-green-700/30 group-even:bg-green-900/10 group-odd:bg-green-600/10 text-center text-[11px] font-bold rounded-md py-1"
          >
            <div class="w-1/3">{{ entry.price.toFixed(5) }}</div>
            <div class="w-1/3">{{ entry.total.toFixed(5) }}</div>
            <div class="w-1/3">
              {{ (entry.price * entry.total).toFixed(8) }}
            </div>
          </div>
        </div>
        <div
          v-for="n in (buyOrders.length * 24 < buyContainer?.clientHeight! ? Math.floor((buyContainer?.clientHeight! - buyOrders.length * 24 )/16): 0)"
          :key="'buy' + String(n)"
          class="flex text-center text-[11px] font-bold h-4 -z-10"
        >
          <div class="w-1/3">-</div>
          <div class="w-1/3">-</div>
          <div class="w-1/3">-</div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { Values, cryptoTicker } from "../../../types/cryptoSpecs";
import { Client } from "../../../api";
import { Maker } from "../../../types/order";
import { TakerEvent } from "../../../types/orderSpecs";
import { watch } from "vue";
import BigNumber from "bignumber.js";
import { notify } from "@kyvg/vue3-notification";
import { nameToToken } from "../../../utils";
import { erc20ABI } from "@wagmi/core";
import { ethers } from "ethers";
import axios from "axios";

const props = defineProps<{
  newOrder: TakerEvent | undefined;
  loading: boolean;
  pair: string;
  base: string | Values<typeof cryptoTicker>;
  quote: string | Values<typeof cryptoTicker>;
}>();

const emits = defineEmits<{
  (e: "updateBalance", base: number, quote: number): void;
}>();

let baseContract: ethers.Contract;
let quoteContract: ethers.Contract;

watch(
  () => props.newOrder,
  async (newOrder) => {
    if (!newOrder || !newOrder.amount) return;
    baseContract = new ethers.Contract(
      nameToToken(props.base, Client.accountStore.networkId!),
      erc20ABI,
      Client.provider
    );
    quoteContract = new ethers.Contract(
      nameToToken(props.quote, Client.accountStore.networkId!),
      erc20ABI,
      Client.provider
    );
    if (newOrder.isBuyer) {
      await takeSellOrders();
    } else {
      await takeBuyOrders();
    }
  }
);

let makerBalances: { [key in string]: BigNumber } = {};
let faultyMakers: { [key in string]: string } = {};
const lastTrade = computed<{
  price?: number;
  amount?: number;
  isBuyer?: boolean;
}>(() => {
  if (
    !Client.orderStore.$state.takers[props.pair] ||
    Client.orderStore.$state.takers[props.pair].length == 0
  )
    return {};
  const taker = Client.orderStore.$state.takers[props.pair][0];
  return {
    price: taker.price,
    amount: taker.amount,
    isBuyer: taker.is_buyer,
  };
});

const sellContainer = ref<HTMLDivElement | null>(null);
const buyContainer = ref<HTMLDivElement | null>(null);

const sellOrders = computed(() => {
  if (!Client.orderStore.$state.makersLoaded[props.pair]) {
    const string = "1234567";
    return [...string].map((v) => {
      return {
        total: Math.round(Math.random() * 10000),
        price: Math.round(Math.random() * 10000),
        makers: [],
      };
    });
  }
  const sells = Client.orderStore.$state.makers[props.pair].filter((maker) => {
    return !maker.is_buyer;
  });
  sells.sort((first, second) => {
    return Number(second.price) - Number(first.price);
  });
  const result: Array<{ price: number; total: number; makers: Array<Maker> }> =
    [];
  sells.forEach((maker) => {
    const index = result.length - 1;
    if (result.length && result[index].price == maker.price) {
      result[index]["total"] += Number(maker.amount) - maker.filled;
      result[index]["makers"].push(maker);
    } else {
      result.push({
        total: Number(maker.amount) - maker.filled,
        price: Number(maker.price),
        makers: [maker],
      });
    }
  });
  return result;
});

const buyOrders = computed(() => {
  if (!Client.orderStore.$state.makersLoaded[props.pair]) {
    const string = "1234567";
    return [...string].map((v) => {
      return {
        total: Math.round(Math.random() * 10000),
        price: Math.round(Math.random() * 10000),
        makers: [],
      };
    });
  }
  const buys = Client.orderStore.$state.makers[props.pair].filter((maker) => {
    return maker.is_buyer;
  });
  buys.sort((first, second) => {
    return Number(second.price) - Number(first.price);
  });
  const result: Array<{ price: number; total: number; makers: Array<Maker> }> =
    [];
  buys.forEach((maker) => {
    const index = result.length - 1;
    if (result.length && result[index].price == maker.price) {
      result[index]["total"] += Number(maker.amount) - maker.filled;
      result[index]["makers"].push(maker);
    } else {
      result.push({
        total: Number(maker.amount) - maker.filled,
        price: Number(maker.price),
        makers: [maker],
      });
    }
  });
  return result;
});

async function takeSellOrders(): Promise<void> {
  const takers: any[] = [];
  let takerAmount = new BigNumber(props.newOrder!.amount);

  await sellOrders.value.every(
    async (entry: { price: number; total: number; makers: Array<Maker> }) => {
      if (entry.price > props.newOrder!.price) {
        return false;
      }
      await entry.makers.every(async (maker) => {
        const remainingAmount = new BigNumber(maker.amount).minus(maker.filled);
        const tradeAmount = remainingAmount.gte(takerAmount)
          ? takerAmount
          : remainingAmount;

        if (await checkOrder(baseContract, maker.address, tradeAmount)) {
          if (maker.bot) {
            takers.push(
              takeBotOrder(
                tradeAmount,
                new BigNumber(props.newOrder!.price),
                maker
              )
            );
          } else {
            takers.push(takeOrder(tradeAmount, maker));
          }

          if (tradeAmount.isEqualTo(takerAmount)) return false;
          takerAmount = takerAmount.minus(tradeAmount);
          return true;
        } else {
          return true;
        }
      });
      return true;
    }
  );

  try {
    const tx = await Client.dexContract.trade(takers, {
      baseToken: nameToToken(props.base, Client.accountStore.networkId!),
      quoteToken: nameToToken(props.quote, Client.accountStore.networkId!),
      side: 1,
      baseFees: props.newOrder?.baseFees,
    });
    await tx.wait(3);
    await axios.post("", {
      orders: Object.entries(faultyMakers).map((entry) => {
        return { address: entry[0], amount: entry[1] };
      }),
      token: await baseContract.getAddress(),
      chainId: Client.accountStore.networkId!,
    });
  } catch (e: any) {
    console.log(e);
    notify({
      type: "warn",
      text: "An error occured during the order transmition",
    });
  } finally {
    makerBalances = {};
    faultyMakers = {};
  }
}

async function takeBuyOrders(): Promise<void> {
  const takers: any[] = [];
  let takerAmount = new BigNumber(props.newOrder!.amount);

  await buyOrders.value.every(
    async (entry: { price: number; total: number; makers: Array<Maker> }) => {
      if (entry.price < props.newOrder!.price || !takerAmount.toNumber()) {
        return false;
      }
      await entry.makers.every(async (maker) => {
        const remainingAmount = new BigNumber(maker.amount).minus(maker.filled);
        const tradeAmount = remainingAmount.gte(takerAmount)
          ? takerAmount
          : remainingAmount;

        if (
          await checkOrder(
            quoteContract,
            maker.address,
            new BigNumber(maker.price)
              .multipliedBy(tradeAmount)
              .dividedBy("10e18")
          )
        ) {
          if (maker.bot) {
            takers.push(
              takeBotOrder(
                tradeAmount,
                new BigNumber(props.newOrder!.price),
                maker
              )
            );
          } else {
            console.log("push");
            takers.push(takeOrder(tradeAmount, maker));
          }

          if (tradeAmount.isEqualTo(takerAmount)) {
            takerAmount = new BigNumber("0");
            return false;
          } else {
            takerAmount = takerAmount.minus(tradeAmount);
            return true;
          }
        } else {
          return true;
        }
      });
      return true;
    }
  );

  try {
    const tx = await Client.dexContract.trade(takers, {
      baseToken: nameToToken(props.base, Client.accountStore.networkId!),
      quoteToken: nameToToken(props.quote, Client.accountStore.networkId!),
      side: 0,
      baseFees: props.newOrder?.baseFees,
    });
    await tx.wait(3);
    await axios.post(Client.watchTowerURL, {
      orders: Object.entries(faultyMakers).map((entry) => {
        return { address: entry[0], amount: entry[1] };
      }),
      token: await quoteContract.getAddress(),
      chainId: Client.accountStore.networkId!,
    });
  } catch (e: any) {
    console.log(e);
    notify({
      type: "warn",
      text: "An error occured during the order transmition",
    });
  } finally {
    makerBalances = {};
    faultyMakers = {};
  }
}

function takeOrder(amount: BigNumber, maker: Maker): Object {
  return {
    amount: new BigNumber(maker.amount).multipliedBy("10e18").toFixed(),
    takerAmount: new BigNumber(amount).multipliedBy("10e18").toFixed(),
    price: new BigNumber(maker.price).multipliedBy("10e18").toFixed(),
    step: new BigNumber(maker.price).multipliedBy("10e18").toFixed(),
    makerFees: "0",
    mult: "0",
    upperBound: "0",
    lowerBound: "0",
    signature: maker.signature,
    baseToken: maker.base_token,
    quoteToken: maker.quote_token,
    owner: maker.address,
    expiry: maker.expiry,
    chainId: maker.chain_id,
    side: !maker.is_buyer,
    replaceOrder: false,
  };
}

function takeBotOrder(
  amount: BigNumber,
  price: BigNumber,
  maker: Maker
): Object {
  if (!("makerFees" in maker.bot!) || !maker.initialPrice) return {};
  const lowerBound = new BigNumber(maker.bot!.lowerBound).multipliedBy("10e18");
  const step = new BigNumber(maker.bot!.step).multipliedBy("10e18");
  const mult = maker.initialPrice.minus(lowerBound).dividedBy(step);
  if (!mult.isInteger()) {
    console.log("An error occured during order calculation");
    console.log(maker);
    notify({
      type: "warn",
      text: "An error occured during the order calculation",
    });
    return {};
  }
  return {
    amount: new BigNumber(maker.amount).multipliedBy("10e18").toFixed(),
    takerAmount: new BigNumber(amount).multipliedBy("10e18").toFixed(),
    price: new BigNumber(maker.price).multipliedBy("10e18").toFixed(),
    step: step.toFixed(),
    makerFees: new BigNumber(maker.bot!.makerFees)
      .multipliedBy("10e18")
      .toFixed(),
    mult: mult,
    upperBound: new BigNumber(maker.bot!.upperBound)
      .multipliedBy("10e18")
      .toFixed(),
    lowerBound: lowerBound.toFixed(),
    signature: maker.signature,
    baseToken: maker.base_token,
    quoteToken: maker.quote_token,
    owner: maker.address,
    expiry: maker.expiry,
    chainId: maker.chain_id,
    side: !maker.is_buyer,
    replaceOrder: true,
  };
}

async function checkOrder(
  contract: typeof baseContract,
  address: string,
  amount: BigNumber
): Promise<boolean> {
  try {
    if (!makerBalances[address]) {
      makerBalances[address] = new BigNumber(await contract.balanceOf(address));
    }
    if (amount.gte(makerBalances[address])) {
      if (faultyMakers[address]) {
        if (new BigNumber(faultyMakers[address]).lt(amount)) {
          faultyMakers[address] = amount.toFixed();
        }
      } else {
        faultyMakers[address] = amount.toFixed();
      }
      return false;
    } else {
      makerBalances[address] = makerBalances[address].minus(amount);
      return true;
    }
  } catch (e: any) {
    console.log("An error occured during the address balances retrieval");
    return false;
  }
}
</script>
