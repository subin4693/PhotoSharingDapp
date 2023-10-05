import React, { useState } from "react";
import profile from "../asserts/profile.jpg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useNavBarContext } from "../context/NavBarContext";

const Signup = ({ signUp, theme, isLoading, setIsSignup }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { setIsSkiped } = useNavBarContext();

  const handleImageChange = (event) => {
    if (event.target.files.length != 0 && !isLoading) {
      const imageFile = event.target.files[0];
      setSelectedImage(imageFile);
    }
  };

  const handleSubmit = (e) => {
    event.preventDefault();
    if (userName.trim().length <= 0) {
      toast.warn("Enter a valid username", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "colored",
      });
    } else if (!selectedImage) {
      toast.warn("Select a profile image", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "colored",
      });
    } else {
      signUp(userName, selectedImage);
    }
  };

  const handleSkip = (e) => {
    setIsSkiped(true);
    navigate("/home");
  };

  return (
    <div className="  w-[15rem] sm:w-[20rem]">
      <h3 className="font-bold text-xl">Signup</h3>
      <div className=" flex justify-center items-center mb-5  ]">
        <div className="shadow-xl h-[10rem] w-[10rem] sm:h-[13rem] sm:w-[13rem]  rounded-full overflow-hidden  ">
          {selectedImage ? (
            <label
              htmlFor="image"
              className="w-full h-full relative cursor-pointer"
            >
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="w-full h-full object-cover"
              />
            </label>
          ) : (
            <label
              htmlFor="image"
              className="cursor-pointer  relative group transition duration-300 ease-in"
            >
              <span className=" absolute justify-center items-center text-black text-lg w-full h-full group-hover:bg-gray-100 hidden group-hover:flex  group-hover:bg-opacity-50 ">
                +Add profile
              </span>

              <img src={profile} className="object-cover w-full h-full " />
            </label>
          )}
        </div>
        <input
          type="file"
          id="image"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      <form className="text-right sm:p-2 mb-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User name"
          className="mt-5 shadow-sm outline-0 p-2 w-full rounded-sm text-black border border-purple-500"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        {isLoading ? (
          <button className="bg-purple-500 px-3 py-1 w-[4.5rem]  shadow-lg rounded-sm mt-5">
            <div className="animate-spin spinner-border h-6 w-6 border-b-2 rounded-full mx-auto"></div>
          </button>
        ) : (
          <>
            <span
              onClick={handleSkip}
              className="cursor-pointer bg-purple-500 px-3 py-1 shadow-lg rounded-sm mt-5 mr-5"
            >
              Skip
            </span>

            <button
              type="submit"
              className=" bg-purple-500 px-3 py-1 shadow-lg rounded-sm mt-5"
            >
              Signup
            </button>
          </>
        )}
      </form>
      <p>
        Already have an account{" "}
        <span className="text-purple-500" onClick={() => setIsSignup(true)}>
          Signin
        </span>
      </p>
    </div>
  );
};

export default Signup;
