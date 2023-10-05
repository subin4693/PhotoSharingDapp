import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContractContext } from "../context/ContractContext";
import { useNavBarContext } from "../context/NavBarContext";

import { toast } from "react-toastify";
import { contractAddress, abi } from "../constants/constant";

const PostDetails = ({ setSelectdPost, post, isOwner, theme }) => {
  let tempContract;
  const [showNames, setShowNames] = useState("");
  const [openTextField, setOpenTextField] = useState(false);
  const [inputUserName, setInputUserName] = useState("");

  const [isSending, setIsSending] = useState(false);

  const { socialmediaContract, setSocialmediaContract } = useContractContext();
  const { isConnected, setIsConnected } = useNavBarContext();

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

  async function handleSendPost(e) {
    e.stopPropagation();
    if (!isConnected) {
      connectWallet();
    }
    if (!socialmediaContract) {
      connectSmartContract();
    }
    try {
      setIsSending(true);
      if (inputUserName.trim().length > 0) {
        const txResponse = await socialmediaContract.sendPostToOtherUser(
          post.userId,
          post.id,
          post.index,
          inputUserName
        );
        txResponse.wait();
      }
    } catch (error) {
      if (error.toString().includes("Socialmedia__userDontHaveThePost")) {
        tostify("This post is no longer exists");
      } else if (error.toString().includes("Socialmedia__userNameIsNotExist")) {
        tostify("Reciver username is not exists");
      } else if (
        error
          .toString()
          .includes("Socialmedia__userCannotSendPostToTheSameAccount")
      ) {
        tostify("User cannot send post to the same account");
      } else if (error.toString().includes("Socialmedia__notAnOwner")) {
        tostify("Only owner can send this post");
      } else if (
        error
          .toString()
          .includes("Socialmedia__userNameLenghtMustBeGreatherThanZero")
      ) {
        tostify("Username is not exists");
      } else {
        tostify("Send failed");
      }
      console.log(error);
      setIsSending(false);
    }
    setIsSending(false);
    setSelectdPost(null);
  }

  async function deletePost() {
    try {
      const txResponse = await socialmediaContract.deletePost(
        post.userId,
        post.id,
        post.index
      );
      await txResponse.wait();
      setSelectdPost(null);
    } catch (error) {
      console.log(error);
    }
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
    <>
      <div className="fixed inset-0 backdrop-blur-sm z-10 "></div>
      <div
        className="fixed z-20 inset-0 flex justify-center items-center"
        onClick={() => setSelectdPost(false)}
      >
        <span
          className="border-[1px] border-purple-500 bg-white dark:bg-black w-[50rem] pb-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-h-[30rem] overflow-hidden relative group ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 absolute top-3 right-4 hidden group-hover:flex cursor-pointer"
              onClick={() => setSelectdPost(false)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

            <img
              src={post.imageUrl}
              className="object-cover"
              onClick={() => setShowNames(false)}
            />
          </div>
          <div className="flex justify-end pr-1 sm:px-10 mt-2">
            {isOwner && (
              <span
                className="flex justify-center items-center hover:text-purple-500 cursor-pointer mr-1 sm:mr-10 text-sm"
                onClick={deletePost}
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
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="hidden sm:flex">Delete</p>
              </span>
            )}
            <span
              className="flex justify-center items-center hover:text-purple-500 cursor-pointer mr-1 sm:mr-10 text-sm"
              onClick={() => setShowNames("tipedUsers")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
              <b className="mx-1"> {post.tipedUsers.length}</b>{" "}
              <span className="hidden sm:flex">tiped users</span>
            </span>

            <span
              className="flex justify-center items-center hover:text-purple-500 cursor-pointer mr-1 sm:mr-10"
              onClick={() => setShowNames("owners")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
              <b className="mx-1">{post.owners.length}</b>{" "}
              <span className="hidden sm:flex">owners</span>
            </span>
            {isOwner && (
              <span
                className="flex justify-center items-center cursor-pointer"
                onClick={() => setOpenTextField(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 sm:w-6 sm:h-6  hover:text-purple-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                </svg>

                <input
                  type="text"
                  autoFocus
                  value={inputUserName}
                  onChange={(e) => {
                    setInputUserName(e.target.value);
                  }}
                  onBlur={() => setOpenTextField(false)}
                  className={`${
                    openTextField
                      ? "w-[6rem] sm:w-[10rem] border-[1px] border-purple-500 px-1 "
                      : " w-0 "
                  } text-black duration-200`}
                />

                <span
                  className={`${openTextField && "font-bold ml-2"}`}
                  onClick={handleSendPost}
                >
                  {isSending ? "sending..." : "send"}
                </span>
              </span>
            )}
          </div>

          <div className="pl-10   sm:mt-3">
            <h1 className="font-bold text-lg capitalize ">{showNames} </h1>
            {post[showNames] &&
              post[showNames].map((postValues, index) => {
                return (
                  <Link
                    to={`/profile/${postValues}`}
                    key={index}
                    onClick={() => setSelectdPost(null)}
                    className="hover:text-purple-500 ml-5 "
                  >
                    {postValues}
                  </Link>
                );
              })}
          </div>
        </span>
      </div>
    </>
  );
};

export default PostDetails;
