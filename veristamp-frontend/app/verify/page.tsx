"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { getPublicClient } from "@wagmi/core";
import { keccak256, toHex, Hex } from "viem";
import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { contractAddress, contractAbi } from "../../lib/veristamp";
import { config } from "../../app/providers";

type VerificationResult =
  | {
      owner: Hex;
      timestamp: bigint;
    }
  | "not_found"
  | null;

const formatTimestamp = (timestamp: bigint): string => {
  return new Date(Number(timestamp) * 1000).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default function VerifyPage() {
  const { isConnected } = useAccount();

  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<Hex | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setVerificationResult(null);
    setFile(selectedFile);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const hash = keccak256(toHex(new Uint8Array(buffer)));
      setFileHash(hash);
    } catch (error) {
      toast.error("Could not read or hash the file.");
      console.error(error);
    }
  };

  const handleVerify = async () => {
    if (!fileHash) return toast.error("Please select a file first.");

    setIsLoading(true);
    setVerificationResult(null);
    const publicClient = getPublicClient(config);

    if (!publicClient) {
      toast.error("Could not connect to the blockchain.");
      setIsLoading(false);
      return;
    }

    try {
      const result = (await publicClient.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "certificates",
        args: [fileHash],
      })) as [Hex, bigint];

      const [owner, timestamp] = result;
      if (timestamp > 0n) {
        setVerificationResult({ owner, timestamp });
      } else {
        setVerificationResult("not_found");
      }
    } catch (err) {
      console.error("Verification failed:", err);
      toast.error("An error occurred while checking the blockchain.");
      setVerificationResult("not_found");
    } finally {
      setIsLoading(false);
    }
  };

  const ResultDisplay = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center mt-6 p-6 bg-gray-800/50 rounded-lg animate-pulse">
          <MagnifyingGlassIcon className="h-8 w-8 text-blue-400 mb-2" />
          <p className="font-semibold text-white">
            Searching the Blockchain...
          </p>
        </div>
      );
    }

    if (verificationResult === "not_found") {
      return (
        <div className="mt-6 p-6 bg-red-900/30 border border-red-500/50 rounded-lg text-white transition-all duration-300">
          <div className="flex items-center gap-3">
            <XCircleIcon className="h-8 w-8 text-red-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-red-400">Not Found</h2>
              <p className="mt-1 text-gray-300">
                No certificate was found for this file&apos;s hash.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (verificationResult && typeof verificationResult === "object") {
      return (
        <div className="mt-6 p-6 bg-green-900/30 border border-green-500/50 rounded-lg text-white transition-all duration-300">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-8 w-8 text-green-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-green-400">
                Successfully Verified!
              </h2>
              <p className="mt-1 text-gray-300">
                A permanent record for this file was found on the blockchain.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-500/30 space-y-2 text-sm">
            <p>
              <strong className="font-semibold text-gray-200">
                Certified By:
              </strong>{" "}
              <span className="font-mono break-all text-gray-300">
                {verificationResult.owner}
              </span>
            </p>
            <p>
              <strong className="font-semibold text-gray-200">
                Timestamp:
              </strong>{" "}
              <span className="text-gray-300">
                {formatTimestamp(verificationResult.timestamp)}
              </span>
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="relative w-full max-w-2xl mx-auto bg-gray-900/50 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-lg overflow-hidden">
        <div className="absolute top-0 left-0 -ml-16 -mt-16 w-80 h-80 bg-green-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-center text-white">
            Verify a Document
          </h1>
          <p className="text-center text-gray-400 mt-2 mb-8">
            Check the blockchain to see if a certificate of existence exists for
            any file.
          </p>
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
              <h3 className="font-bold text-lg text-white">
                Select a File to Verify
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                Your file is never uploaded. We calculate its hash locally for
                privacy.
              </p>
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 bg-gray-800 border border-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>{file ? "Change File" : "Select File"}</span>
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm text-gray-300 mt-2">
                  Selected:{" "}
                  <span className="font-medium text-white">{file.name}</span>
                </p>
              )}
            </div>
          </div>
          {fileHash && (
            <div className="flex items-start gap-4">
              {/* --- THIS IS THE FIX --- */}
              <div
                className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full border-2 transition-colors ${
                  verificationResult && typeof verificationResult === "object"
                    ? "bg-green-500/20 border-green-500 text-green-400"
                    : "border-gray-600 text-gray-400"
                }`}
              >
                {verificationResult &&
                typeof verificationResult === "object" ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  "2"
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  Check the Blockchain
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  This will query our smart contract to find a record matching
                  your file&apos;s hash.
                </p>
                <button
                  onClick={handleVerify}
                  disabled={isLoading || !isConnected}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Verifying..."
                    : isConnected
                    ? "Verify File"
                    : "Please Connect Wallet"}
                </button>
              </div>
            </div>
          )}
          <ResultDisplay />
        </div>
      </div>
    </main>
  );
}
