"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { getPublicClient } from "@wagmi/core";
import { keccak256, toHex, Hex } from "viem";
import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { contractAddress, contractAbi } from "../../lib/veristamp";
import { config } from "../../app/providers";

// ---------------- Main Page ----------------
export default function CertifyPage() {
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<Hex | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // ---------------- FILE HASH CALCULATION ----------------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsComplete(false);
    const toastId = toast.loading("Calculating file hash...");
    setIsLoading(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const hash = keccak256(toHex(new Uint8Array(buffer)));
      setFile(selectedFile);
      setFileHash(hash);
      toast.success("File hash calculated!", { id: toastId });
    } catch (err) {
      toast.error("Failed to read file.", { id: toastId });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- CERTIFY ON BLOCKCHAIN ----------------
  const handleCertify = async () => {
    if (!fileHash) return toast.error("Please select a file first.");
    setIsLoading(true);
    const toastId = toast.loading("Waiting for wallet confirmation...");

    try {
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi: contractAbi,
        functionName: "certify",
        args: [fileHash],
      });

      toast.loading("Transaction sent. Waiting for confirmation...", {
        id: toastId,
      });

      const publicClient = getPublicClient(config);
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: txHash });
      }

      toast.success("Transaction confirmed successfully!", { id: toastId });
      setIsComplete(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.message?.includes("rejected")) {
        toast.error("Transaction rejected.", { id: toastId });
      } else if (err?.message?.includes("already stamped")) {
        toast.error("This document is already certified.", { id: toastId });
      } else {
        toast.error("Transaction failed.", { id: toastId });
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileHash(null);
    setIsComplete(false);
  };

  // ---------------- UI ----------------
  if (!isConnected) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-400 text-lg">
          Please connect your wallet to certify a document.
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Upload Section */}
      <div className="relative w-full max-w-2xl mx-auto bg-gray-900/50 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-lg overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-center text-white">
            Certify Your Document
          </h1>
          <p className="text-center text-gray-400 mt-2 mb-8">
            Upload your file to generate a unique hash and certify it on the
            blockchain.
          </p>

          {/* Step 1 */}
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full border-2 ${
                file
                  ? "bg-green-500/20 border-green-500 text-green-400"
                  : "border-gray-600 text-gray-400"
              }`}
            >
              {file ? <CheckCircleIcon className="h-6 w-6" /> : "1"}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Upload Your File</h3>
              <p className="text-gray-400 text-sm mb-3">
                The file is never uploaded — hash is calculated locally for
                privacy.
              </p>
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 bg-gray-800 border border-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>
                  {file && !isComplete ? "Change File" : "Select File"}
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {file && (
                <p className="text-sm text-gray-300 mt-2">
                  Selected:{" "}
                  <span className="font-medium text-white">{file.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* Step 2 */}
          {fileHash && (
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full border-2 transition-colors ${
                  isComplete
                    ? "bg-green-500/20 border-green-500 text-green-400"
                    : "border-gray-600 text-gray-400"
                }`}
              >
                {isComplete ? <CheckCircleIcon className="h-6 w-6" /> : "2"}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  Certify on Blockchain
                </h3>
                {!isComplete ? (
                  <>
                    <p className="text-gray-400 text-sm mb-4">
                      This prompts your wallet to confirm a transaction and
                      store the proof.
                    </p>
                    <div className="bg-black/30 p-3 rounded-lg mb-4">
                      <p className="text-xs text-gray-400">
                        File Hash (keccak256):
                      </p>
                      <p className="text-green-400 break-all font-mono text-sm">
                        {fileHash}
                      </p>
                    </div>
                    <button
                      onClick={handleCertify}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Processing..." : "Certify on Blockchain"}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-green-400 text-sm mb-4">
                      Your document has been successfully certified on the
                      blockchain!
                    </p>
                    <button
                      onClick={handleReset}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                      Certify Another File
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
