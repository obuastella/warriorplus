import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../components/firebase";
export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      email: email,
      password: password,
    };
    try {
      console.log("Payload:", payload);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in succesfully!");
      setIsLoading(false);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message, {
        position: "top-right",
      });
      setIsLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="floating_email"
            id="floating_email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer"
            placeholder=" "
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type={passwordVisible ? "text" : "password"}
            name="floating_password"
            id="floating_password"
            className="block py-2.5 px-0 pr-10 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer"
            placeholder=" "
            required
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
          <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer pr-2"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
        </div>
        <button
          type="submit"
          className="mt-8 m-auto cursor-pointer w-full text-white bg-secondary/80 hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  py-2.5 text-center"
        >
          {isLoading ? (
            <Loader size={24} className="mx-auto animate-spin" />
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </>
  );
}
