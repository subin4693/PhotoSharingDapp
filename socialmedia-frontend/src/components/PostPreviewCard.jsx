import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { useNavBarContext } from "../context/NavBarContext";
import { useContractContext } from "../context/ContractContext";
import { toast } from "react-toastify";

const PostPreviewCard = ({ image, setImage, theme, userDetails, setPosts }) => {
  let tempContract;
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, setIsConnected } = useNavBarContext();
  const { socialmediaContract, setSocialmediaContract } = useContractContext();

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setIsConnected(true);
      } else {
        toast.warn("Install metamask!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme === "dark" ? "dark" : "colored",
        });
      }
    } catch (error) {
      console.log(error);

      tostify(error.message);
    }
  };

  const connectSmartContract = async () => {
    if (!isConnected) {
      await connectWallet();
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    tempContract = new ethers.Contract(contractAddress, abi, signer);
    await setSocialmediaContract(tempContract);
  };

  function splitUsersArray(usersArray) {
    let tempUsersArray = [];
    for (let i = 0; i < usersArray.length; i++) {
      tempUsersArray.push(
        ethers.utils.toUtf8String(usersArray[3].replace(/0+$/, ""))
      );
    }
    return tempUsersArray;
  }

  async function getLastPost(userId, imageIndex) {
    try {
      const post = await socialmediaContract.getPostByIndex(userId, imageIndex);
      const tempPost = {
        id: post[0].toString(),
        index: post[1].toString(),
        userId: post[2].toString(),
        userName: ethers.utils.toUtf8String(post[3].replace(/0+$/, "")),
        imageUrl: "https://ipfs.io/ipfs/" + ethers.utils.toUtf8String(post[4]),
        tipedAmount: post[5].toString(),
        tipedUsers: splitUsersArray(post[6]),
        owners: splitUsersArray(post[7]),
      };
      setPosts((prev) => {
        return [tempPost, ...prev];
      });
    } catch (error) {
      if (error.toString().includes("Socialmedia__userNameIsNotExist")) {
        tostify("Username is not exist");
      } else {
        tostify("Transaction failed");
      }
    }
  }

  async function addNewPost() {
    setIsLoading(true);
    if (!isConnected) {
      connectWallet();
    }
    if (!socialmediaContract) {
      connectSmartContract();
    }
    try {
      const formData = new FormData();

      formData.append("file", image);
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRECT_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      });
      const imageHash = resFile.data.IpfsHash; //QmSfN5iweLvs8jbyURHy5rSQm2i8Kt9eD9bmKeVyeW7oAm
      //Qmf8ASksxHkiL2kaqX1EXg1NDbtFoW3TaNWknDvUYvUpCq
      // const imageHash = "QmSfN5iweLvs8jbyURHy5rSQm2i8Kt9eD9bmKeVyeW7oAm";
      const txResponse = await socialmediaContract.addNewPost(
        userDetails.id,
        imageHash
      );
      txResponse.wait();
      socialmediaContract.removeAllListeners("newPostAdded");

      socialmediaContract.on(
        "newPostAdded",
        (userId, postImageUrl, imageIndex) => {
          getLastPost(userId.toString(), imageIndex.toString());
        }
      );
      toast.success("Successfully posted", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "colored",
      });
    } catch (error) {
      if (error.toString().includes("Socialmedia__notAnOwner")) {
        tostify("Only owner can add posts");
      } else if (error.toString().includes("checkTheUserNameIsExists")) {
        tostify("User name is not exist");
      } else if (
        error
          .toString()
          .includes("Socialmedia__imageCdnLengthMustBeGreatherThanZero")
      ) {
        tostify("Image not supported");
      } else tostify("Failed adding new post");

      setIsLoading(false);
    }
    setIsLoading(false);
    setImage(null);
  }
  const tostify = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme === "dark" ? "dark" : "colored",
    });
  };

  return (
    <div
      className="fixed  z-20 inset-0 grid place-items-center"
      onClick={() => !isLoading && setImage(null)}
    >
      <div className="fixed inset-0 backdrop-blur-sm"></div>
      <div
        className="text-center z-30  bg-black border border-purpule-500 relative group"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="absolute right-5 top-5 hidden group-hover:flex "
          onClick={() => !isLoading && setImage(null)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
        <div className="max-w-screen   sm:max-w-[50rem] ">
          <img src={URL.createObjectURL(image)} className="object-cover" />
        </div>
        {isLoading ? (
          <button className="bg-purple-500 px-3 py-1 w-[4.5rem]  shadow-lg rounded-sm my-1 sm:my-2">
            <div className="animate-spin spinner-border h-6 w-6 border-b-2 rounded-full mx-auto"></div>
          </button>
        ) : (
          <button
            className="bg-purple-500 py-0 px-4 my-1 sm:px-8 sm:py-1 sm:my-2 rounded-sm"
            onClick={addNewPost}
          >
            Post
          </button>
        )}
      </div>
    </div>
  );
};

export default PostPreviewCard;
