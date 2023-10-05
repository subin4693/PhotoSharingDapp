import React, { useState, useEffect } from "react";
import { Signin, Signup } from "../components";
import { useNavBarContext } from "../context/NavBarContext";
import { useContractContext } from "../context/ContractContext";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { contractAddress, abi } from "../constants/constant";
import { ethers } from "ethers";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = ({ theme }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { isConnected, setIsConnected, setIsSignin } = useNavBarContext();
  const { socialmediaContract, setSocialmediaContract } = useContractContext();
  const { setUserDetail, userDetail } = useUserContext();

  const navigate = useNavigate();
  let tempContract;

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
    setSocialmediaContract(tempContract);
  };

  const saveToLocalStorage = (userName) => {
    localStorage.setItem("UserName", userName);
  };

  const signUp = async (userName, image) => {
    setIsLoading(true);
    try {
      if (!isConnected) {
        await connectWallet();
      }
      await connectSmartContract();
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

      // const imageHash = "QmSfN5iweLvs8jbyURHy5rSQm2i8Kt9eD9bmKeVyeW7oAm";
      const txResponse = await tempContract.signUp(userName, imageHash);
      await txResponse.wait();
      tempContract.on("newUserSignup", (userId, userName, profileImage) => {
        setUserDetail((prev) => ({
          ...prev,
          userId: userId.toString(),
        }));
      });
      setUserDetail((prev) => ({
        ...prev,
        userName: userName,
        profileImageUrl: "https://ipfs.io/ipfs/" + imageHash,
      }));
      saveToLocalStorage(userName);
      setIsSignin(true);
      navigate("/home");
    } catch (error) {
      console.log(error);

      setIsLoading(false);

      if (error.toString().includes("Socialmedia__userNameIsAlreadyExist")) {
        tostify("Username already exist");
      } else if (
        error
          .toString()
          .includes("Socialmedia__userNameLenghtMustBeGreatherThanZero")
      ) {
        tostify("Invalid username");
      } else {
        tostify("Signup failed");
      }
    }
    setIsLoading(false);
  };

  const signIn = async (userName) => {
    setIsLoading(true);
    try {
      if (!isConnected) {
        await connectWallet();
      }
      await connectSmartContract();
      const txResponse = await tempContract.signIn(userName);

      const bytes20Data = txResponse[1].replace(/0+$/, "");

      setUserDetail({
        userId: txResponse[0].toString(),
        // userName: ethers.utils.toUtf8String(txResponse[1]),
        userName: ethers.utils.toUtf8String(txResponse[1].replace(/0+$/, "")),
        profileImageUrl:
          "https://ipfs.io/ipfs/" + ethers.utils.toUtf8String(txResponse[3]),
      });
      saveToLocalStorage(userName);
      setIsSignin(true);
      navigate("/home");
    } catch (error) {
      console.log(error);
      if (error.toString().includes("Socialmedia__userNameIsNotExist"))
        tostify("User name is not exist");
      else if (error.toString().includes("Socialmedia__notAnOwner"))
        tostify("Only owner can login this account");
      else tostify("Signin failed");
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    connectSmartContract();
    const userName = localStorage.getItem("UserName");

    if (userName) signIn(userName);
  }, []);
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
    <div className="h-screen flex justify-center items-center overflow-hidden ">
      <div className="  border border-purple-500 rounded-sm  shadow-2xl w-[20rem] sm:w-[25rem] flex  overflow-hidden p-10 sm:mt-[3rem]">
        <div
          className={`${
            isSignup ? "translate-x-[-30rem] " : "mr-[30rem]"
          } duration-500`}
        >
          <Signup
            signUp={signUp}
            theme={theme}
            isLoading={isLoading}
            setIsSignup={setIsSignup}
          />
        </div>
        <div
          className={`${
            isSignup ? "translate-x-[-20rem]" : " "
          }   duration-500`}
        >
          <Signin
            theme={theme}
            signIn={signIn}
            isLoading={isLoading}
            setIsSignup={setIsSignup}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
