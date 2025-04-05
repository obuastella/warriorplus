// import Lottie from "lottie-react";
// import peopleAnimation from "../../lotties/people.json";

import { Link } from "react-router-dom";
import LoginForm from "./Functions/LoginForm";

export default function Login() {
  return (
    <div className="border-2 w-full flex flex-col md:flex-row gap-x-20 justify-center md:justify-start px-2 md:px-10 items-center h-screen">
      <div className="hidden md:block md:w-[40%] border h-full"></div>
      {/* <Lottie
        animationData={peopleAnimation}
        loop
        className=" mt-52 hidden md:block w-[40%]"
      /> */}
      <div className="py-28 rounded-md md:ms-20 md:border shadow-md px-2 md:px-20 w-full md:w-[40%]">
        <section className="">
          <h2 className="text-4xl text-black font-semibold text-center">
            Log into your account
          </h2>
          <p className="text-center text-base">Lorem ipsum dolor suit</p>
          <LoginForm />
        </section>
        <div className="sm:text-sm mt-4 px-2 flex justify-between items-center">
          <Link className="text-sm " to="/register">
            Don't have an account?{" "}
            <span className="text-primary hover:underline">Sign Up</span>
          </Link>
          {/* <Link className="text-sm hover:underline" to="/forgot-password">
            forgot password?
          </Link> */}
        </div>
      </div>
    </div>
  );
}
