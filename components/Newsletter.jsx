"use client";
import React, { useState } from "react";
import Title from "./Title";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [mail, setMail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mail.trim() === "")
      throw new Error("Please enter a valid email address.");
    await new Promise((res) => setTimeout(res, 1000)); // simulate async
    return "Subscribed Successfully!";
  };
  return (
    <div className="flex flex-col items-center mx-4 my-36">
      <Title
        title="Join Newsletter"
        description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week."
        visibleButton={false}
      />
      <form
        onSubmit={(e) =>
          toast.promise(handleSubmit(e), {
            loading: "Subscribing...",
            success: "Subscribed Successfully!",
            error: (err) => err.message,
          })
        }
        className="w-full max-w-xl"
        action=""
      >
        <div className="flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200">
          <input
            className="flex-1 pl-5 outline-none"
            type="text"
            placeholder="Enter your email address"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
          <button className="font-medium bg-green-500 text-white px-7 py-3 rounded-full hover:scale-103 active:scale-95 transition">
            Get Updates
          </button>
        </div>{" "}
      </form>
    </div>
  );
};

export default Newsletter;
