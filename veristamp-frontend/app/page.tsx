"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  LockClosedIcon,
  DocumentCheckIcon,
  CpuChipIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArchiveBoxIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { keccak256, toHex, Hex } from "viem";
import { injected } from "wagmi/connectors";
import toast from "react-hot-toast";

const FeatureCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/50 hover:border-blue-500/50">
    <div className="bg-gray-900 h-16 w-16 flex items-center justify-center rounded-full mb-6 border border-gray-700">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400">{children}</p>
  </div>
);

const HashingDemo = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileHash, setFileHash] = useState<Hex | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);
    setFileHash(null);

    try {
      const buffer = await file.arrayBuffer();
      const hash = keccak256(toHex(new Uint8Array(buffer)));
      setTimeout(() => {
        setFileHash(hash);
        setIsLoading(false);
      }, 500);
    } catch {
      toast.error("Could not process file.");
      setFileName(null);
      setIsLoading(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleDragEvents = (
    e: React.DragEvent<HTMLDivElement>,
    dragging: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  return (
    <div className="h-full bg-gray-800/50 border border-gray-700 rounded-2xl p-6 flex flex-col text-center">
      <h3 className="text-lg font-bold text-white mb-2">
        Experience the Technology
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Drop any file below to see its unique digital fingerprint generated in
        real-time.{" "}
        <strong className="text-gray-300">Your file is never uploaded.</strong>
      </p>

      <label htmlFor="demo-file-upload" className="flex-grow">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          className={`h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-900/20"
              : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/30"
          }`}
        >
          <CpuChipIcon className="h-10 w-10 text-gray-500 mb-2" />
          <p className="text-gray-400">Drag & Drop a File Here</p>
          <p className="text-xs text-gray-600">or click to select</p>
        </div>
      </label>
      <input
        id="demo-file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {(isLoading || fileHash) && (
        <div className="mt-4 text-left">
          {fileName && (
            <p className="text-sm text-gray-400 truncate">
              File: <span className="font-medium text-white">{fileName}</span>
            </p>
          )}
          <div className="mt-2 bg-black/30 p-3 rounded-lg">
            <p className="text-xs text-gray-400">
              Your File&apos;s Unique Hash (keccak256):
            </p>
            {isLoading ? (
              <div className="h-5 w-full bg-gray-700 rounded animate-pulse mt-1"></div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-green-400 break-all font-mono text-sm truncate">
                  {fileHash}
                </p>
                <button
                  onClick={() => {
                    toast.success("Hash copied!");
                    navigator.clipboard.writeText(fileHash!);
                  }}
                  className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white"
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {fileHash && !isLoading && (
        <Link
          href="/certify"
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 animate-fade-in"
        >
          <SparklesIcon className="h-5 w-5" />
          Now, Certify this Hash!
        </Link>
      )}
    </div>
  );
};

export default function HomePage() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="overflow-x-hidden">
      <section className="relative text-center py-20 md:py-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            The Unforgeable Digital Notary
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-10">
            VeriStamp provides an immutable, decentralized, and publicly
            verifiable proof of existence for any digital file. Secure your
            intellectual property on the blockchain, forever.
          </p>
          <div className="h-24 flex flex-col justify-center items-center">
            {!isConnected ? (
              <button
                onClick={() => connect({ connector: injected() })}
                disabled={isConnecting}
                className="bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet to Begin"}
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Link
                  href="/certify"
                  className="bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 flex items-center gap-2"
                >
                  <span>Certify a File Now</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
                <div className="text-center mt-2 p-2 bg-black/20 rounded-full">
                  <span className="text-sm text-gray-400">
                    {`Connected: ${address?.slice(0, 6)}...${address?.slice(
                      -4
                    )} `}
                    <button
                      onClick={() => disconnect()}
                      className="ml-2 text-xs text-red-400 hover:underline"
                    >
                      (Disconnect)
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Simple, Secure, and Transparent
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <FeatureCard
            icon={<CpuChipIcon className="h-8 w-8 text-blue-400" />}
            title="1. Generate Hash"
          >
            Your file is converted into a unique cryptographic hash directly in
            your browser. Your data never leaves your device, ensuring 100%
            privacy.
          </FeatureCard>
          <FeatureCard
            icon={<LockClosedIcon className="h-8 w-8 text-blue-400" />}
            title="2. Certify on Blockchain"
          >
            The file&apos;s hash is permanently recorded on the blockchain via a
            smart contract, linked to your wallet and an immutable timestamp.
          </FeatureCard>
          <FeatureCard
            icon={<DocumentCheckIcon className="h-8 w-8 text-blue-400" />}
            title="3. Verify Instantly"
          >
            Anyone, anywhere can upload the file to instantly verify its
            timestamp and authenticity. The blockchain provides undeniable,
            trustless proof.
          </FeatureCard>
        </div>
      </section>

      <section className="bg-gray-900/50 py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">The Power of Proof</h2>
            <p className="text-gray-400 text-lg mb-8">
              In a digital world filled with copies and edits, proving ownership
              and existence is critical. VeriStamp leverages the core strengths
              of blockchain technology to provide a new standard of trust.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <ShieldCheckIcon className="h-7 w-7 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white">Ultimate Security</h4>
                  <p className="text-gray-400">
                    Backed by the cryptographic security of the Ethereum
                    network, your proofs are immune to tampering and censorship.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <GlobeAltIcon className="h-7 w-7 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white">
                    Decentralized & Global
                  </h4>
                  <p className="text-gray-400">
                    No central authority, no single point of failure. Your proof
                    exists on a global network, accessible forever.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ArchiveBoxIcon className="h-7 w-7 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white">Permanent Record</h4>
                  <p className="text-gray-400">
                    Once a hash is stamped, it is part of the blockchain&apos;s
                    permanent history. It can never be altered or deleted.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="hidden md:block h-[500px]">
            <HashingDemo />
          </div>
        </div>
      </section>
    </div>
  );
}
