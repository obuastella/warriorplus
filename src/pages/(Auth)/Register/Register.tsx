import Lottie from "lottie-react";
import communityAnimation from "../../../lotties/community.json";
import { Link } from "react-router-dom";
import RegisterForm from "./Functions/RegisterForm";

export default function Register() {
  return (
    <div className="w-full h-screen flex">
      {/* Left side animation */}
      <div className="hidden lg:flex justify-center items-center bg-primary/90 w-[45%] h-full">
        <Lottie animationData={communityAnimation} loop className="w-[80%]" />
      </div>

      <div className="relative flex-1 flex justify-center items-center bg-white">
        <div className="absolute top-4 right-10">
          <h2 className="text-right text-2xl font-bold text-primary">
            Warrior+
          </h2>
          <p className="text-xs font-light italic">
            Empowering Warriors one Step at a time
          </p>
        </div>

        <div className="py-16 px-4 md:px-20 rounded-md shadow-md w-full max-w-lg">
          <section>
            <h2 className="text-3xl text-black font-semibold text-center">
              Create an account
            </h2>
            <p className="my-1 text-center text-xs font-light italic">
              You’re not alone. We’ve got your back.
            </p>
            <RegisterForm />
          </section>
          <div className="sm:text-sm mt-4 px-2 flex justify-between items-center">
            <Link className="text-sm" to="/login">
              Already have an account?{" "}
              <span className="text-primary hover:underline">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
