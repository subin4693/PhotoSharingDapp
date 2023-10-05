const contractAddress = "0x356DBE5d1098dA6CeB733b9Cfd6895B86A6c30f0";
const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "Socialmedia__PostisNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__ThereIsNoEthBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__TransactionFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__imageCdnLengthMustBeGreatherThanZero",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__notAnOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__notEnoughEthSended",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__postOwnerCannotTiptheirPosts",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__thisPostIsNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__userCannotSendPostToTheSameAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__userDontHaveThePost",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__userNameIsAlreadyExist",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__userNameIsNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "Socialmedia__userNameLenghtMustBeGreatherThanZero",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "LogIterationIndex",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
    ],
    name: "PostDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "string",
        name: "postImageUr",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "imageIndex",
        type: "uint256",
      },
    ],
    name: "newPostAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "string",
        name: "userName",
        type: "string",
      },
      {
        indexed: true,
        internalType: "string",
        name: "profileImage",
        type: "string",
      },
    ],
    name: "newUserSignup",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "postReciverId",
        type: "uint256",
      },
    ],
    name: "postSended",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "postOwnerId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tipedAmount",
        type: "uint256",
      },
    ],
    name: "postTiped",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "string",
        name: "newProfileImageUrl",
        type: "string",
      },
    ],
    name: "profileImageChanged",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "postImageUrl",
        type: "string",
      },
    ],
    name: "addNewPost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "newProfileImageUrl",
        type: "string",
      },
    ],
    name: "changeProfileImage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "userName",
        type: "string",
      },
    ],
    name: "checkUserNameIsExist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "postIndex",
        type: "uint256",
      },
    ],
    name: "deletePost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isFirstCall",
        type: "bool",
      },
    ],
    name: "getAllPosts",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "postId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "postIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "userId",
            type: "uint256",
          },
          {
            internalType: "bytes20",
            name: "userName",
            type: "bytes20",
          },
          {
            internalType: "bytes",
            name: "postImageUrl",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "tipedAmount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "bytes20[]",
            name: "tipedUsers",
            type: "bytes20[]",
          },
          {
            internalType: "bytes20[]",
            name: "owners",
            type: "bytes20[]",
          },
        ],
        internalType: "struct Socialmedia.Post[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMostTipedImage",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "postId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "postIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "userId",
            type: "uint256",
          },
          {
            internalType: "bytes20",
            name: "userName",
            type: "bytes20",
          },
          {
            internalType: "bytes",
            name: "postImageUrl",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "tipedAmount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "bytes20[]",
            name: "tipedUsers",
            type: "bytes20[]",
          },
          {
            internalType: "bytes20[]",
            name: "owners",
            type: "bytes20[]",
          },
        ],
        internalType: "struct Socialmedia.Post",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getPostByIndex",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "postId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "postIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "userId",
            type: "uint256",
          },
          {
            internalType: "bytes20",
            name: "userName",
            type: "bytes20",
          },
          {
            internalType: "bytes",
            name: "postImageUrl",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "tipedAmount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "bytes20[]",
            name: "tipedUsers",
            type: "bytes20[]",
          },
          {
            internalType: "bytes20[]",
            name: "owners",
            type: "bytes20[]",
          },
        ],
        internalType: "struct Socialmedia.Post",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startIndex",
        type: "uint256",
      },
    ],
    name: "getPosts",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "postId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "postIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "userId",
            type: "uint256",
          },
          {
            internalType: "bytes20",
            name: "userName",
            type: "bytes20",
          },
          {
            internalType: "bytes",
            name: "postImageUrl",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "tipedAmount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "bytes20[]",
            name: "tipedUsers",
            type: "bytes20[]",
          },
          {
            internalType: "bytes20[]",
            name: "owners",
            type: "bytes20[]",
          },
        ],
        internalType: "struct Socialmedia.Post[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "s_allPosts",
    outputs: [
      {
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "postIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        internalType: "bytes20",
        name: "userName",
        type: "bytes20",
      },
      {
        internalType: "bytes",
        name: "postImageUrl",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "tipedAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "s_highlyTipedImageIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "s_totalUsers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes20",
        name: "",
        type: "bytes20",
      },
    ],
    name: "s_userNameToUserIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "s_users",
    outputs: [
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        internalType: "bytes20",
        name: "userName",
        type: "bytes20",
      },
      {
        internalType: "address",
        name: "ownerAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "profileImageUrl",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "balanceEth",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalPosts",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "postIndex",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "postReciverName",
        type: "string",
      },
    ],
    name: "sendPostToOtherUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "userName",
        type: "string",
      },
    ],
    name: "signIn",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "userId",
            type: "uint256",
          },
          {
            internalType: "bytes20",
            name: "userName",
            type: "bytes20",
          },
          {
            internalType: "address",
            name: "ownerAddress",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "profileImageUrl",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "balanceEth",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "posts",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "totalPosts",
            type: "uint256",
          },
        ],
        internalType: "struct Socialmedia.User",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "userName",
        type: "string",
      },
      {
        internalType: "string",
        name: "profileImageUrl",
        type: "string",
      },
    ],
    name: "signUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestUserId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "userName",
        type: "string",
      },
    ],
    name: "singleUser",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "userId",
            type: "uint256",
          },
          {
            internalType: "bytes20",
            name: "userName",
            type: "bytes20",
          },
          {
            internalType: "address",
            name: "ownerAddress",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "profileImageUrl",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "balanceEth",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "posts",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "totalPosts",
            type: "uint256",
          },
        ],
        internalType: "struct Socialmedia.User",
        name: "",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "postId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "postIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "userId",
            type: "uint256",
          },
          {
            internalType: "bytes20",
            name: "userName",
            type: "bytes20",
          },
          {
            internalType: "bytes",
            name: "postImageUrl",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "tipedAmount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "bytes20[]",
            name: "tipedUsers",
            type: "bytes20[]",
          },
          {
            internalType: "bytes20[]",
            name: "owners",
            type: "bytes20[]",
          },
        ],
        internalType: "struct Socialmedia.Post[]",
        name: "",
        type: "tuple[]",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "postId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "postOwnerId",
        type: "uint256",
      },
    ],
    name: "tipPost",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];
export { abi, contractAddress };
