export const connectUSImpactRegistryAddress =
  process.env.NEXT_PUBLIC_CONNECTUS_IMPACT_REGISTRY_ADDRESS ?? "";

export const connectUSImpactRegistryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "recordId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "missionTitle",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "xpReward",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "userLevel",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ImpactRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "missionTitle",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "xpReward",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "userLevel",
        type: "uint256",
      },
    ],
    name: "registerImpact",
    outputs: [
      {
        internalType: "uint256",
        name: "recordId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "recordId",
        type: "uint256",
      },
    ],
    name: "getRecord",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "string",
            name: "missionTitle",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "xpReward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "userLevel",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct ConnectUSImpactRegistry.ImpactRecord",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
