import { getInstanceByDom, init } from "echarts/core";

export function setGraph(
  htmlelement: HTMLElement | null,
  getInstance: typeof getInstanceByDom,
  einit: typeof init,
  option: any
): ReturnType<typeof einit> | undefined {
  if (!htmlelement) return;
  let myChart = getInstance(htmlelement);
  if (myChart) myChart.dispose();
  myChart = einit(htmlelement, "dark");
  option && myChart.setOption(option);
  return myChart
}
