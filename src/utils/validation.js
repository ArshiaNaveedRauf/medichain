import { ethers } from "ethers";

export function isValidAddress(address) {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

export function isZeroAddress(address) {
  return address === "0x0000000000000000000000000000000000000000";
}

export function parseContractError(error) {
  // ethers v6: error.reason or nested in error.info
  if (error?.reason) return error.reason;
  if (error?.info?.error?.message) {
    const msg = error.info.error.message;
    const match = msg.match(/execution reverted: (.+)/);
    if (match) return match[1];
    return msg;
  }
  if (error?.data?.message) {
    const match = error.data.message.match(/execution reverted: (.+)/);
    if (match) return match[1];
    return error.data.message;
  }
  if (error?.message) {
    if (error.message.includes("user rejected")) return "Transaction rejected by user.";
    if (error.message.includes("insufficient funds")) return "Insufficient ETH for gas.";
    const match = error.message.match(/execution reverted: (.+?)(?:"|$)/);
    if (match) return match[1];
  }
  return "Transaction failed. Please try again.";
}
