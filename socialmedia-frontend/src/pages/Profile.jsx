import React, { useEffect, useState } from "react";
import {
  UserDetail,
  ProfileImageCard,
  ProfilePageShadow,
  PostPreviewCard,
  PostDetails,
  ProfileImagePreview,
} from "../components";
import { useUserContext } from "../context/UserContext";
import { useContractContext } from "../context/ContractContext";
import { useNavBarContext } from "../context/NavBarContext";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { contractAddress, abi } from "../constants/constant";

const Profile = ({ theme, setTheme }) => {
  let tempContract;
  //State
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState();
  const [userDetails, setUserDetails] = useState({
    id: "",
    name: "",
    profileUrl: "",
    balanceEth: "",
  });
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  //Route
  const { userName } = useParams();

  //Context
  const { userDetail, setUserDetail } = useUserContext();
  const { socialmediaContract, setSocialmediaContract } = useContractContext();
  const { isConnected, setIsConnected, setIsSignin } = useNavBarContext();

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
        ethers.utils.toUtf8String(usersArray[i].replace(/0+$/, ""))
      );
    }
    return tempUsersArray;
  }
  function splitPostArray(tempPost) {
    let tempPostArray = [];

    for (let i = 0; i < tempPost.length; i++) {
      tempPostArray.push({
        id: tempPost[i][0].toString(),
        index: tempPost[i][1].toString(),
        userId: tempPost[i][2].toString(),
        userName: ethers.utils.toUtf8String(tempPost[i][3].replace(/0+$/, "")),
        imageUrl:
          "https://ipfs.io/ipfs/" + ethers.utils.toUtf8String(tempPost[i][4]),
        tipedAmount: tempPost[i][5].toString(),
        tipedUsers: splitUsersArray(tempPost[i][7]),
        owners: splitUsersArray(tempPost[i][8]),
      });
    }

    return tempPostArray;
  }

  function handleImageChange(e) {
    setImage(e.target.files[0]);
  }

  async function handleProfileImageChange() {
    if (!isConnected) {
      connectWallet();
    }
    if (!socialmediaContract) {
      connectSmartContract();
    }
    try {
      if (isConnected) {
        const formData = new FormData();
        formData.append("file", selectedImage);
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
        // const imageHash =
        //     "Qmf8ASksxHkiL2kaqX1EXg1NDbtFoW3TaNWknDvUYvUpCq";

        const txResponse = await socialmediaContract.changeProfileImage(
          userDetail.userId,
          imageHash
        );
        await txResponse.wait();
      }
    } catch (error) {
      if (error.toString().includes("Socialmedia__notAnOwner")) {
        tostify("Only owner change the profile image");
      } else if (
        error
          .toString()
          .includes("Socialmedia__imageCdnLengthMustBeGreatherThanZero")
      ) {
        tostify("Image cdn is not supported");
      } else if (error.toString().includes("Socialmedia__userNameIsNotExist")) {
        tostify("Username is not exists");
      } else tostify("Changin profile image failed");
    }
  }

  async function getPosts() {
    let startIndex = posts[posts.length - 1].index - 1;

    if (startIndex < 1) {
      setHasMore(false);
      console.log("returned");
      return;
    }
    if (!isConnected) {
      connectWallet();
    }
    if (!socialmediaContract) {
      connectSmartContract();
    }

    try {
      const txResponse = await socialmediaContract.getPosts(
        userDetail.userId,
        startIndex
      );
      let splitedPost = splitPostArray(txResponse);

      setPosts((prev) => [...prev, ...splitedPost]);
    } catch (error) {
      tostify("Getting posts faild");
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

  useEffect(() => {
    const getUsersDetail = async () => {
      setIsLoading(true);
      if (!isConnected) {
        connectWallet();
      }
      if (!socialmediaContract) {
        connectSmartContract();
      }
      try {
        const txResponse = await socialmediaContract.singleUser(
          userDetail.userId,
          userName
        );

        setUserDetails({
          id: txResponse[0][0].toString(),
          name: ethers.utils.toUtf8String(txResponse[0][1].replace(/0+$/, "")),
          profileUrl:
            "https://ipfs.io/ipfs/" +
            ethers.utils.toUtf8String(txResponse[0][3]),
          balanceEth: txResponse[0][4].toString(),
        });
        let splitedPost = splitPostArray(txResponse[1]);

        setIsOwner(txResponse[2]);
        setPosts(splitedPost);

        setIsLoading(false);
      } catch (error) {
        if (
          error
            .toString()
            .includes("Socialmedia__userNameLenghtMustBeGreatherThanZero")
        ) {
          tostify("User naem is not valid");
        } else {
          tostify("Getting user failed");
        }
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    getUsersDetail();
  }, [userName]);

  return (
    <div className="pb-10">
      {isLoading ? (
        <ProfilePageShadow />
      ) : (
        <>
          <div>
            <UserDetail
              userDetails={userDetails}
              theme={theme}
              isOwner={isOwner}
              setTheme={setTheme}
              setSelectedImage={setSelectedImage}
            />
          </div>

          <div>
            {posts.length > 0 ? (
              <>
                {isOwner && (
                  <div className="text-right px-10">
                    <label htmlFor="image">
                      <span className="cursor-pointer hover:text-purple-500 ">
                        Add post +{" "}
                      </span>
                    </label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                )}

                <div>
                  <InfiniteScroll
                    dataLength={posts.length}
                    next={getPosts}
                    hasMore={hasMore} // Replace with a condition based on your data source
                    loader={<p>Loading...</p>}
                    className="grid grid grid-cols-1 gap-3 mx-5 mt-10 sm:grid-cols-2 md:grid-cols-3 "
                  >
                    {posts.map((post) => {
                      return (
                        <ProfileImageCard
                          post={post}
                          key={post.index}
                          setSelectedPost={setSelectedPost}
                        />
                      );
                    })}
                  </InfiniteScroll>
                </div>
              </>
            ) : (
              <div className="px-auto text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-[5rem] h-[5rem] mt-10 mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>

                {isOwner ? (
                  <>
                    <label htmlFor="image">
                      <span className="cursor-pointer  hover:text-purple-500 ">
                        Add post +{" "}
                      </span>
                    </label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </>
                ) : (
                  <h3 className="text-2xl">No post posted</h3>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {image && (
        <PostPreviewCard
          image={image}
          setImage={setImage}
          theme={theme}
          userDetails={userDetails}
          setPosts={setPosts}
        />
      )}
      {selectedPost && (
        <PostDetails
          post={selectedPost}
          setSelectdPost={setSelectedPost}
          isOwner={isOwner}
          theme={theme}
        />
      )}
      {selectedImage && (
        <ProfileImagePreview
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handleProfileImageChange={handleProfileImageChange}
        />
      )}
    </div>
  );
};

export default Profile;
