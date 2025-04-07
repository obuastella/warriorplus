import Lottie from "lottie-react";
import doctorAnimation from "../../../lotties/doctor.json";
import { Link } from "react-router-dom";
import LoginForm from "./Functions/LoginForm";

export default function Login() {
  return (
    <div className="w-full h-screen flex">
      {/* Left side animation */}
      <div className="hidden lg:flex justify-center items-center bg-primary/90 w-[45%] h-full">
        <Lottie animationData={doctorAnimation} loop className="w-[80%]" />
      </div>

      {/* Right side content */}
      <div className="relative flex-1 flex justify-center items-center bg-white">
        {/* Top-left branding */}
        <div className="absolute top-4 right-10">
          <h2 className="text-right text-2xl font-bold text-primary">
            Warrior+
          </h2>
          <p className="text-xs font-light italic">
            Empowering Warriors one Step at a time
          </p>
        </div>

        {/* Centered login box */}
        <div className="py-16 px-4 md:px-20 rounded-md shadow-md w-full max-w-lg">
          <section>
            <h2 className="text-3xl text-black font-semibold text-center">
              Login
            </h2>
            <p className="my-2 text-center text-xs font-light italic">
              Welcome back, warrior. Let’s keep fighting together.
            </p>
            <LoginForm />
          </section>
          <div className="sm:text-sm mt-4 px-2 flex justify-between items-center">
            <Link className="text-sm" to="/register">
              Don&apos;t have an account?{" "}
              <span className="text-primary hover:underline">Sign Up</span>
            </Link>
            <Link className="text-sm hover:underline" to="/forgot-password">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
