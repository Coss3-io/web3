import { useAccountStore } from ".";

/**
 * @notice Update the account blockchain connection status
 */
export function updateBlockchainConnection(
  this: ReturnType<typeof useAccountStore>,
  connected: boolean
): void {
  this.$state.blockchainConnected = connected;
}

/**
 * @notice Update the account app connection status
 */
export function updateAppConnection(
  this: ReturnType<typeof useAccountStore>,
  connected: boolean
): void {
  this.$state.appConnected = connected;
}

/**
 * @notice Update the account app connection status
 */
export function updateAddress(
  this: ReturnType<typeof useAccountStore>,
  address: string | undefined
): void {
  this.$state.address = address;
}

/**
 * @notice Update the account loading status
 */
export function updateLoaded(
  this: ReturnType<typeof useAccountStore>,
  loaded: boolean
): void {
  this.$state.loaded = loaded;
}

/**
 * @notice Update the account networkId
 */
export function updateNetworkId(
  this: ReturnType<typeof useAccountStore>,
  networkId: number | undefined
): void {
  this.$state.networkId = networkId;
}

/**
 * @notice Update the account networkName
 */
export function updateNetworkName(
  this: ReturnType<typeof useAccountStore>,
  networkName: string | undefined
): void {
  this.$state.networkName = networkName;
}

/**
 * @notice - Used to reset de stacking store
 * @param this - The stacking store
 */
export function reset(this: ReturnType<typeof useAccountStore>): void {
  this.$state.loaded = false;
  this.$state.blockchainConnected = false;
  this.$state.appConnected = false;
  this.$state.address = undefined;
  this.$state.networkId = undefined;
  this.$state.networkName = undefined;
}
