import React, { useState } from "react";
import profile from "../asserts/profile.jpg";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signin = ({ theme, isLoading, setIsSignup, signIn }) => {
  const [userName, setUserName] = useState("");

  const handleSubmit = (event) => {
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
    } else {
      signIn(userName);
    }
  };
  return (
    <div className="w-[15rem] ml-20 sm:ml-0 sm:w-[20rem]">
      <h3 className="font-bold text-xl">Signin</h3>
      <div className=" flex justify-center items-center mb-5 ">
        <div className="shadow-xl h-[10rem] w-[10rem] sm:h-[13rem] sm:w-[13rem]  rounded-full overflow-hidden  ">
          <img src={profile} className="object-cover w-full h-full " />
        </div>
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
          <button
            type="submit"
            className=" bg-purple-500 px-3 py-1 shadow-lg rounded-sm mt-5"
          >
            SignIn
          </button>
        )}
      </form>
      <p>
        Don't have an account{" "}
        <span className="text-purple-500" onClick={() => setIsSignup(false)}>
          Signup
        </span>
      </p>
    </div>
  );
};

export default Signin;
