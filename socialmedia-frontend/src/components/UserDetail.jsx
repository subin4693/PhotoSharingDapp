import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavBarContext } from "../context/NavBarContext";
import { useContractContext } from "../context/ContractContext";
import { ProfileImagePreview } from "../components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ethers } from "ethers";

const UserDetail = ({
  userDetails,
  theme,
  isOwner,
  setTheme,
  setSelectedImage,
}) => {
  const { id, name, profileUrl, balanceEth } = userDetails;
  const { userDetail } = useUserContext();
  const { isConnected, setIsConnected } = useNavBarContext();
  const { socialmediaContract } = useContractContext();

  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event) => {
    if (event.target.files.length != 0 && !isLoading) {
      const imageFile = event.target.files[0];
      setSelectedImage(imageFile);
    }
  };

  async function handleWithdraw() {
    setIsLoading(true);
    try {
      const txResponse = await socialmediaContract.withdraw(id);
      await txResponse.wait();
    } catch (error) {
      console.log(error);
      if (error.toString().includes("Socialmedia__ThereIsNoEthBalance")) {
        tostify("Not enough ETH");
      } else {
        tostify("Withdraw failed");
      }
    }
    setIsLoading(false);
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
    <div className="pt-20 relative">
      {isOwner && (
        <div className="absolute right-2 flex text-sm items-center sm:right-10 ">
          <label htmlFor="profileImage">
            <span className="flex justify-center items-center mr-2 hover:text-purple-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>

              <p className="hidden sm:flex"> Change profile</p>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </span>
          </label>
          <span
            className="mt-1"
            onClick={() =>
              setTheme((prev) => {
                return prev == "dark" ? "" : "dark";
              })
            }
          >
            {theme === "dark" ? (
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
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            ) : (
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
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            )}
          </span>
        </div>
      )}
      <div className="w-[12rem] h-[12rem] overflow-hidden rounded-full mx-auto mt-3 sm:w-[16rem] sm:h-[16rem]">
        <img src={profileUrl} className="w-full h-full object-cover" />
      </div>
      <div className=" mt-4  text-center sm:text-lg">
        <span className="font-bold leading-8">Id</span> : #{id} <br />
        <span className="font-bold leading-8">Username</span> : {name} <br />
        <span className="font-bold leading-8">Balance eth</span>: {balanceEth}{" "}
        ETH <br />
        {userDetail.userId == id && isLoading ? (
          <button className="bg-purple-500 px-3 py-1 w-[5.2rem]  shadow-lg rounded-sm  mt-3">
            <div className="animate-spin spinner-border h-6 w-6 border-b-2 rounded-full mx-auto"></div>
          </button>
        ) : (
          <div>
            {isOwner && (
              <button
                className=" px-2 py-1 bg-purple-500 mt-3 rounded-sm shadow-lg sm:text-sm "
                onClick={handleWithdraw}
              >
                Withdraw
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
