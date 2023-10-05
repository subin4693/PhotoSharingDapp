import React, { useEffect, useState } from "react";
import { useContractContext } from "../context/ContractContext";
import { useNavBarContext } from "../context/NavBarContext";
import { ethers } from "ethers";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  HomeImageCard,
  HighTipedImageCard,
  HomeImageDetailCard,
  HomeImageCardShadow,
} from "../components";
import { contractAddress, abi } from "../constants/constant";

const Home = ({ theme }) => {
  //State
  let postId, tempContract;
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [highlyTipedImage, setHightlyTipedImage] = useState({
    id: 0,
    index: 0,
    userId: 0,
    userName: "",
    imageUrl: "",
    tipedAmount: 0,
    tipedUsers: 0,
    owners: 0,
  });
  const [hasMore, setHasMore] = useState(true);

  //Context

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

  async function getPosts() {
    if (!isConnected) {
      connectWallet();
    }
    if (!socialmediaContract) {
      connectSmartContract();
    }
    try {
      if (posts.length <= 0) {
        postId = 0;
      } else {
        postId = posts[posts.length - 1].id - 1;
      }
      if (posts.length > 0 && posts[posts.length - 1].id <= 0) {
        setHasMore(false);
      }
      const txResponse = await socialmediaContract.getAllPosts(postId, isFirst);

      const splitedPost = splitPostArray(txResponse);

      setPosts((prev) => [...prev, ...splitedPost]);
      setIsFirst(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function getHighlyTipedImage() {
    if (!isConnected) {
      connectWallet();
    }
    if (!socialmediaContract) {
      connectSmartContract();
    }
    try {
      const txRes = await socialmediaContract.getMostTipedImage();
      setHightlyTipedImage({
        id: txRes[0].toString(),
        index: txRes[1].toString(),
        userId: txRes[2].toString(),
        userName: ethers.utils.toUtf8String(txRes[3].replace(/0+$/, "")),
        imageUrl: "https://ipfs.io/ipfs/" + ethers.utils.toUtf8String(txRes[4]),
        tipedAmount: txRes[5].toString(),
        tipedUsers: splitUsersArray(txRes[7]),
        owners: splitUsersArray(txRes[8]),
      });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    setIsFetching(true);
    const getItems = async () => {
      await getHighlyTipedImage();
      await getPosts();
    };
    getItems();
    setIsFetching(false);
  }, []);

  return (
    <div className="flex py-20  flex-col-reverse sm:flex-row">
      <div className="min-h-screen sm:w-2/3 px-3">
        {isFetching ? (
          <HomeImageCardShadow />
        ) : (
          <>
            <InfiniteScroll
              dataLength={posts.length}
              next={getPosts}
              hasMore={hasMore} // Replace with a condition based on your data source
            >
              {posts.map((post) => {
                return (
                  <HomeImageCard
                    post={post}
                    key={post.id}
                    setSelectedPost={setSelectedPost}
                  />
                );
              })}
            </InfiniteScroll>
          </>
        )}
      </div>
      <HighTipedImageCard
        highlyTipedImage={highlyTipedImage}
        setSelectedPost={setSelectedPost}
      />
      {selectedPost && (
        <HomeImageDetailCard
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          theme={theme}
        />
      )}

      <div className="h-screen">{postId}</div>
    </div>
  );
};

export default Home;
