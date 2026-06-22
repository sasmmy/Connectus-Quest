import { stringToHex, type Hex } from "viem";
import { celo, celoSepolia } from "viem/chains";

export const celoMainnet = celo;
export const celoTestnet = celoSepolia;
export const lastCeloRecordTxStorageKey = "connectus_last_celo_record_tx";
export const celoRecordStorageEvent = "connectus-celo-record-change";

export function shortenAddress(address: string) {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getCeloExplorerAddressUrl(address: string) {
  return `https://celoscan.io/address/${address}`;
}

export function getCeloExplorerTxUrl(txHash: string) {
  return `${celoTestnet.blockExplorers.default.url.replace(/\/$/, "")}/tx/${txHash}`;
}

export function encodeImpactRecord(metadata: string): Hex {
  return stringToHex(metadata);
}

export function saveLastCeloRecordTx(txHash: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(lastCeloRecordTxStorageKey, txHash);
  window.dispatchEvent(new Event(celoRecordStorageEvent));
}

export function getLastCeloRecordTx() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(lastCeloRecordTxStorageKey) ?? "";
}
