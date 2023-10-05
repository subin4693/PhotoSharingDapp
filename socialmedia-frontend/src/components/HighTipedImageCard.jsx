import React from "react";
import { ethers } from "ethers";

const HighTipedImageCard = ({ highlyTipedImage, setSelectedPost }) => {
  return (
    <div
      className="sm:fixed sm:top-0 sm:right-0 sm:w-1/3 overflow-hidden  bottom-0  flex flex-col justify-center items-center mx-4 sm:mr-4 "
      onClick={() => setSelectedPost(highlyTipedImage)}
    >
      <h1 className="font-bold py-2">Highly tiped image</h1>
      <div className="grid place-items-center bg-black">
        <span className="  overflow-hidden grid place-items-center ">
          <img
            src={highlyTipedImage.imageUrl}
            className="object-cover scale-150 hover:scale-100 duration-200"
          />
        </span>
        <div className="text-white py-2">
          <>{ethers.utils.formatEther(highlyTipedImage.tipedAmount)} eth</>
        </div>
      </div>
    </div>
  );
};

export default HighTipedImageCard;
