import React, { useState } from "react";

const ProfileImagePreview = ({
  selectedImage,
  setSelectedImage,
  handleProfileImageChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleProfileChange = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    await handleProfileImageChange();
    setSelectedImage(null);
    setIsLoading(false);
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm "></div>
      <div
        className="fixed inset-0  z-10 grid place-items-center"
        onClick={() => !isLoading && setSelectedImage(null)}
      >
        <span className="flex justify-center items-center relative flex-col bg-white p-4 dark:bg-black">
          <span
            className="absolute top-2 right-2"
            onClick={() => !isLoading && setSelectedImage(null)}
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
          <span
            className="rounded-full overflow-hidden w-[15rem] h-[15rem] sm:w-[30rem] sm:h-[30rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={URL.createObjectURL(selectedImage)}
              className="object-cover w-full h-full"
            />
          </span>
          {isLoading ? (
            <button className="bg-purple-500 px-3 py-1 w-[4.5rem]  shadow-lg rounded-sm mt-5">
              <div className="animate-spin spinner-border h-6 w-6 border-b-2 rounded-full mx-auto"></div>
            </button>
          ) : (
            <button
              className="px-2 py-1 bg-purple-500 mt-2 rounded-sm"
              onClick={handleProfileChange}
            >
              Commit change
            </button>
          )}
        </span>
      </div>
    </>
  );
};

export default ProfileImagePreview;
