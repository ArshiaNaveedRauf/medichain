import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contract";
import { SEPOLIA_CHAIN_ID, SEPOLIA_CHAIN_ID_HEX, SEPOLIA_NETWORK } from "../config/network";

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [role, setRole] = useState(null); // "patient" | "doctor" | "unregistered"
  const [patientData, setPatientData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;
  const isContractConfigured = CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  const detectRole = useCallback(async (contractInstance, address) => {
    try {
      const [isPat, isDoc] = await Promise.all([
        contractInstance.isPatient(address),
        contractInstance.isDoctor(address),
      ]);
      if (isPat) {
        const data = await contractInstance.patients(address);
        setPatientData({ name: data.name, dateOfBirth: data.dateOfBirth });
        setRole("patient");
      } else if (isDoc) {
        const data = await contractInstance.doctors(address);
        setDoctorData({ name: data.name, specialization: data.specialization });
        setRole("doctor");
      } else {
        setRole("unregistered");
      }
    } catch (err) {
      console.error("Role detection failed:", err);
      setRole("unregistered");
    }
  }, []);

  const setupContract = useCallback((signerInstance) => {
    if (!isContractConfigured) return null;
    const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerInstance);
    setContract(c);
    return c;
  }, [isContractConfigured]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected. Please install it first.");
      return;
    }
    setConnecting(true);
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);
      const s = await browserProvider.getSigner();
      const addr = await s.getAddress();
      const network = await browserProvider.getNetwork();
      const cId = Number(network.chainId);

      setProvider(browserProvider);
      setSigner(s);
      setAccount(addr);
      setChainId(cId);

      if (cId === SEPOLIA_CHAIN_ID) {
        const c = setupContract(s);
        if (c) await detectRole(c, addr);
      }

      localStorage.setItem("mc_connected", "true");
    } catch (err) {
      if (err?.code === 4001 || err?.message?.includes("user rejected")) {
        toast.error("Connection rejected. Please approve in MetaMask.");
      } else {
        toast.error("Failed to connect wallet.");
        console.error(err);
      }
    } finally {
      setConnecting(false);
    }
  }, [setupContract, detectRole]);

  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setChainId(null);
    setRole(null);
    setPatientData(null);
    setDoctorData(null);
    localStorage.removeItem("mc_connected");
  }, []);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
    } catch (err) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [SEPOLIA_NETWORK],
          });
        } catch (addErr) {
          toast.error("Failed to add Sepolia network.");
          console.error(addErr);
        }
      } else {
        toast.error("Failed to switch network.");
        console.error(err);
      }
    }
  }, []);

  const refreshRole = useCallback(async () => {
    if (contract && account) {
      setPatientData(null);
      setDoctorData(null);
      await detectRole(contract, account);
    }
  }, [contract, account, detectRole]);

  // Auto-reconnect on mount
  useEffect(() => {
    const wasConnected = localStorage.getItem("mc_connected");
    if (wasConnected && window.ethereum) {
      connect();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        disconnect();
        setTimeout(() => connect(), 100);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [connect, disconnect]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        contract,
        account,
        chainId,
        role,
        patientData,
        doctorData,
        loading,
        setLoading,
        connecting,
        isCorrectNetwork,
        isContractConfigured,
        connect,
        disconnect,
        switchToSepolia,
        refreshRole,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used inside Web3Provider");
  return ctx;
}
