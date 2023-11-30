export function displayAddress(address: string): string {
  const length = address.length - 1;
  return `${address.slice(0, 6)}...${address.slice(length - 4)}`;
}
