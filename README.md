# VeriStamp: The Unforgeable Digital Notary

VeriStamp is a full-stack decentralized application (dApp) that provides an immutable, decentralized, and publicly verifiable proof of existence for any digital file. By recording a file's cryptographic hash on the blockchain, VeriStamp secures your intellectual property forever.

---

## ## Core Features

- **Client-Side Hashing:** Files are hashed directly in the browser using `keccak256`. Your data never leaves your computer, ensuring 100% privacy.
- **Blockchain Certification:** Send the file's unique hash to the Ethereum blockchain via a smart contract, creating a permanent, timestamped record linked to your wallet address.
- **Trustless Verification:** Anyone, anywhere can upload a file to instantly verify its timestamp and authenticity without relying on a central authority.
- **Modern Wallet Integration:** A sleek, user-friendly interface for connecting wallets using RainbowKit and wagmi.

---

## ## Tech Stack

| Backend (Smart Contract) | Frontend (Web App)   |
| ------------------------ | -------------------- |
| Solidity                 | Next.js (App Router) |
| Hardhat                  | React                |
| Ethers.js                | TypeScript           |
| OpenZeppelin             | wagmi & viem         |
| Chai & Mocha             | RainbowKit           |
|                          | Tailwind CSS         |
|                          | `react-hot-toast`    |

---

## ## Project Structure

This project is a monorepo containing two main packages:

- **/veristamp-stable**: The Hardhat backend project, which includes the Solidity smart contract, deployment scripts, and tests.
- **/veristamp-frontend**: The Next.js frontend application that users interact with.

---

## ## Getting Started

Follow these instructions to set up and run the project locally for development and testing.

### ### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MetaMask](https://metamask.io/) browser extension

### ### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ramanakumar2580/veristamp-dapp.git
    cd veristamp-dapp
    ```

2.  **Set up the Backend:**

    - Navigate to the backend folder:
      ```bash
      cd veristamp-stable
      ```
    - Create an environment file:
      ```bash
      touch .env
      ```
    - Open the `.env` file and add the following lines, replacing the placeholders with your own keys:
      ```env
      SEPOLIA_RPC_URL="YOUR_ALCHEMY_SEPOLIA_RPC_URL"
      PRIVATE_KEY="YOUR_METAMASK_PRIVATE_KEY"
      ```
    - Install dependencies:
      ```bash
      npm install
      ```

3.  **Set up the Frontend:**

    - Navigate to the frontend folder from the root directory:
      ```bash
      cd ../veristamp-frontend
      ```
    - Create a local environment file:
      ```bash
      touch .env.local
      ```
    - Open the `.env.local` file and add the following line, pasting your project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/):

      ```env
      NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="YOUR_WALLETCONNECT_PROJECT_ID"
      ```

    - Install dependencies:
      ```bash
      npm install
      ```

---

## ## Running the Application Locally

You will need **two separate terminal windows** to run the full application.

### ### Terminal 1: Start the Local Blockchain

```bash
# Navigate to the backend folder
cd veristamp-stable

# Start the local Hardhat node
npx hardhat node
```

### ### Terminal 2: Deploy Contract & Start Frontend

```bash
# 1. Navigate to the backend folder
    cd veristamp-stable

# 2. Deploy the contract to your local node.
#    This will print a contract address to the terminal.
    npx hardhat run scripts/deploy.ts --network localhost

# 3. CRITICAL STEP: Manually copy the contract address from the output above.
     Then, open the file 'veristamp-frontend/lib/veristamp.ts' in your code editor and paste the address as the value for the 'contractAddress' constant.

# 4. Navigate to the frontend folder
     cd ../veristamp-frontend

# 5. Start the frontend development server
    npm run dev
Your application should now be running at http://localhost:3000.
```
