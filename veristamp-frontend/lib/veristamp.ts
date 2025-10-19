/* eslint-disable @typescript-eslint/no-unused-vars */
import { sepolia } from "wagmi/chains";
import VeriStampAbi from "./VeriStamp.json";
import { config } from "@/app/providers";

// 1. Your deployed contract address
export const contractAddress = "0x1dC7D6a5DC5d0c406d834912130a955C7E89B720";

// 2. Contract ABI
export const contractAbi = VeriStampAbi.abi;

// 3. Export config from providers so wagmi hooks & contract reads share the same context
export { config };
