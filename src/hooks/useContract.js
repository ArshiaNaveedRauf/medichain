import { useCallback } from "react";
import { useWeb3 } from "../context/Web3Context";
import { parseContractError } from "../utils/validation";
import toast from "react-hot-toast";

export function useContract() {
  const { contract, setLoading } = useWeb3();

  const call = useCallback(async (fn, successMsg) => {
    if (!contract) {
      toast.error("Contract not loaded. Check your configuration.");
      return { success: false };
    }
    setLoading(true);
    const toastId = toast.loading("Sending transaction...");
    try {
      const tx = await fn(contract);
      toast.loading("Waiting for confirmation...", { id: toastId });
      await tx.wait();
      toast.success(successMsg || "Transaction confirmed!", { id: toastId });
      return { success: true, tx };
    } catch (err) {
      const msg = parseContractError(err);
      toast.error(msg, { id: toastId });
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [contract, setLoading]);

  const read = useCallback(async (fn) => {
    if (!contract) return null;
    try {
      return await fn(contract);
    } catch (err) {
      const msg = parseContractError(err);
      toast.error(msg);
      return null;
    }
  }, [contract]);

  return { call, read };
}
