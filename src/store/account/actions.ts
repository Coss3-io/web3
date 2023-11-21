import { useAccountStore } from ".";

/**
 * @notice Update the account blockchain connection status
 */
export function blockchainConnection(
  this: ReturnType<typeof useAccountStore>,
  connected: boolean
): void {
  this.$state.blockchainConnected = connected;
}

/**
 * @notice Update the account app connection status
 */
export function appConnection(
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
