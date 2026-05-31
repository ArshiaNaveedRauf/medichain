# Medi-Chain

A decentralized medical records system built on Ethereum. Patients own their data and control who can access it.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Deploying the Smart Contract via Remix IDE

### 1. Open Remix
Go to [remix.ethereum.org](https://remix.ethereum.org)

### 2. Create the contract file
- In the File Explorer, create a new file: `MediChain.sol`
- Paste the contents of `contracts/MediChain.sol` from this repo

### 3. Compile
- Go to the **Solidity Compiler** tab
- Select compiler version **0.8.20**
- Click **Compile MediChain.sol**

### 4. Get Sepolia testnet ETH
You'll need test ETH to pay gas fees:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- [Chainlink Faucet](https://faucets.chain.link/sepolia)

### 5. Deploy
- Switch MetaMask to **Sepolia Testnet**
- Go to the **Deploy & Run Transactions** tab in Remix
- Set **Environment** to `Injected Provider - MetaMask`
- Make sure **Contract** is set to `MediChain`
- Click **Deploy** and confirm in MetaMask
- Wait for the transaction to confirm

### 6. Copy the contract address and ABI
- After deployment, copy the **contract address** from the Deployed Contracts section
- Go to the **Solidity Compiler** tab → **Compilation Details** → copy the full **ABI**

### 7. Update src/config/contract.js
Open `src/config/contract.js` and replace:

```js
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";

export const CONTRACT_ABI = [ /* paste the full JSON ABI array here */ ];
```

### 8. Restart the dev server
```bash
npm run dev
```

The yellow warning banner will disappear once the address is set correctly.

---

## Project Structure

```
medi-chain/
├── contracts/
│   └── MediChain.sol          Solidity smart contract
├── src/
│   ├── config/
│   │   ├── contract.js        Contract address + ABI (fill this in)
│   │   └── network.js         Sepolia network config
│   ├── context/
│   │   └── Web3Context.jsx    Wallet connection state
│   ├── hooks/
│   │   └── useContract.js     Transaction helper
│   ├── components/            Reusable UI components
│   ├── pages/                 Route-level pages
│   └── utils/                 Formatting + validation helpers
```

## Tech Stack
- **Smart Contract**: Solidity ^0.8.20
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Web3**: Ethers.js v6
- **Notifications**: react-hot-toast
- **Icons**: lucide-react
- **Routing**: React Router v7
