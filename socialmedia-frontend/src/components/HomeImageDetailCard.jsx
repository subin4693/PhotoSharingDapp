import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavBarContext } from "../context/NavBarContext";
import { useContractContext } from "../context/ContractContext";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { contractAddress, abi } from "../constants/constant";

const HomeImageDetailCard = ({ selectedPost, setSelectedPost, theme }) => {
  let tempContract;
  const { isSignin, isConnected, setIsConnected } = useNavBarContext();
  const { socialmediaContract, setSocialmediaContract } = useContractContext();

  const { userDetail } = useUserContext();

  const [showNames, setShowNames] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [eth, setEth] = useState(0.1);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleTip = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    if (eth <= 0) throw new error("Socialmedia__notEnoughEthSended");

    if (!isConnected) {
      connectWallet();
    }
    if (!socialmediaContract) {
      connectSmartContract();
    }

    try {
      // function tipPost(uint256 userId,uint256 postId, uint256 postOwnerId)
      const txResponse = await socialmediaContract.tipPost(
        userDetail.userId,
        selectedPost.id,
        selectedPost.userId,
        { value: ethers.utils.parseUnits(eth.toString(), "ether") }
      );
      await txResponse.wait();
    } catch (error) {
      console.log(error);
      if (error.toString().includes("Socialmedia__notEnoughEthSended")) {
        tostify("Not enough eth sended");
      } else if (error.toString().includes("Socialmedia__thisPostIsNotExist")) {
        tostify("This post is no longer exists");
      } else if (error.toString().includes("Socialmedia__notAnOwner")) {
        tostify("You can't access this wallet");
      } else if (
        error.toString().includes("Socialmedia__postOwnerCannotTiptheirPosts")
      ) {
        tostify("Owner can't tip there own post");
      } else if (error.toString().includes("Socialmedia__userNameIsNotExist")) {
        tostify("Username is not exist");
      } else {
        tostify("Tip failed");
      }
    }
    setIsLoading(false);
  };

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
      className="fixed  z-20 inset-0 grid place-items-center mx-2 border border-purple-500"
      onClick={() => setSelectedPost(null)}
    >
      <div className="fixed inset-0 backdrop-blur-sm"></div>
      <div
        className="text-center z-30  bg-black text-white border border-purpule-500 relative group"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="absolute right-5 top-5 hidden group-hover:flex "
          onClick={() => setSelectedPost(null)}
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
        <div
          className="max-w-screen   sm:max-w-[50rem]"
          onClick={() => setShowNames(null)}
        >
          <img src={selectedPost.imageUrl} className="object-cover" />
        </div>
        <div className="flex justify-between items-center px-3 py-1">
          <span className="flex items-center justify-center">
            <span
              className="flex  items-center justify-center mx-2"
              onClick={() => setShowNames("tipedUsers")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mx-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
              {ethers.utils.formatEther(selectedPost.tipedAmount)} eth
            </span>
            <span
              className="flex items-center justify-center mx-2"
              onClick={() => setShowNames("owners")}
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mx-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
              {selectedPost.owners.length}
            </span>
            {isSignin && selectedPost.userId != userDetail.userId && (
              <span
                className="flex items-center justify-center mx-2"
                onClick={() => setShowInput(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 mx-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                  />
                </svg>
                <input
                  type="number"
                  value={eth}
                  onChange={(e) => setEth(e.target.value)}
                  className={`${
                    showInput ? "w-[3rem] " : " w-0 "
                  }text-black duration-300`}
                />
                {isLoading ? (
                  <span>processing...</span>
                ) : showInput ? (
                  <span onClick={handleTip} className="mx-1">
                    Tip
                  </span>
                ) : (
                  <span>Tip</span>
                )}
              </span>
            )}
          </span>
          <Link to={`/profile/${selectedPost.userName}`}>
            {selectedPost.userName}
          </Link>
        </div>
        <div className=" m-3">
          <h1 className="font-bold text-lg capitalize ">{showNames} </h1>
          {selectedPost[showNames] &&
            selectedPost[showNames].map((postValues, index) => {
              return (
                <Link
                  to={`/profile/${postValues}`}
                  key={index}
                  className="hover:text-purple-500 ml-5 "
                >
                  {postValues}
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default HomeImageDetailCard;
