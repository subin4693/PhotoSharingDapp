import React, { useState } from "react";
import { useNavBarContext } from "../context/NavBarContext";
import { useUserContext } from "../context/UserContext";
import { useContractContext } from "../context/ContractContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { contractAddress, abi } from "../constants/constant";

import logo from "../asserts/logo.png";

import { Link } from "react-router-dom";
import ProfileImage from "../asserts/fireimage.jpg";

const NavBar = ({ theme }) => {
  let tempContract;
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const { isSignin, isConnected, setIsConnected, isSkiped, setIsSignin } =
    useNavBarContext();
  const { userDetail, setUserDetail } = useUserContext();
  const { socialmediaContract, setSocialmediaContract } = useContractContext();

  const navigate = useNavigate();

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

  async function searchUserName() {
    if (!isConnected) {
      connectWallet();
    }
    if (!socialmediaContract) {
      connectSmartContract();
    }
    try {
      const txResponse = await socialmediaContract.checkUserNameIsExist(
        userName
      );
      if (txResponse) {
        navigate(`/profile/${userName}`);
      } else {
        toast.warn("Username is not exist", {
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
      toast.error("Transaction faild", {
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
  }

  async function handleConnect() {
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
      toast.error(error.message, {
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
  }

  function handleLogout() {
    localStorage.removeItem("UserName");
    setUserDetail({
      userId: 0,
      userName: null,
      profileImageUrl: null,
    });
    setIsSignin(false);
    setSocialmediaContract(null);
    setIsConnected(false);
  }

  return (
    <>
      <nav className="z-30 fixed bg-gray-100 left-0 right-0 top-0 flex border border-black border-b-purple-500  justify-between items-center sm:px-20 dark:bg-black py-3">
        <Link to="/home">
          {/*<span className="font-bold text-lg sm:text-xl ">Media3</span>*/}
          <div className="w-[6rem] sm:w-[8rem]   overflow-hidden">
            {" "}
            <img src={logo} className="w-full h-full object-cover" />
          </div>
        </Link>

        <div className="flex justify-center items-center">
          {(isSignin || isSkiped) && (
            <>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={`${
                  isInputOpen ? "w-[10rem] px-2 " : " w-0 "
                } text-black duration-300 border-[1px] outline-none border-purple-500 py-1 rounded-sm`}
              />

              <span
                onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  if (isInputOpen) {
                    searchUserName();
                    setIsInputOpen(false);
                  } else {
                    setIsInputOpen(true);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className=":w-6 h-6 cursor-pointer hover:text-purple-500 mr-4 sm:mr-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </span>
            </>
          )}

          {isSignin ? (
            <div className="flex justify-center items-center">
              {!isSkiped && (
                <>
                  <Link
                    to={`/profile/${userDetail.userName}`}
                    className="flex justify-cetenr items-center"
                  >
                    <img
                      src={userDetail.profileImageUrl}
                      className="object-cover w-[2.5rem] h-[2.5rem] sm:w-[3rem] sm:h-[3rem] rounded-full mr-1 sm:mr-2"
                    />
                    <p className="font-semibold sm:font-bold">
                      {userDetail.userName}
                    </p>
                  </Link>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 ml-2 hover:text-purple-500"
                    onClick={handleLogout}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                </>
              )}
            </div>
          ) : (
            <>
              {isConnected ? (
                <button className="bg-purple-500 px-2 py-1 rounded-sm ">
                  Connected{" "}
                </button>
              ) : (
                <button
                  className="bg-purple-500 px-2 py-1 rounded-sm "
                  onClick={handleConnect}
                >
                  Connect{" "}
                </button>
              )}
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
