import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NoContact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Emergency SOS
        </h1>
        <motion.div
          className="text-6xl text-center mb-6"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
            ease: "easeInOut",
          }}
        >
          😢
        </motion.div>

        <p className="text-lg text-center text-gray-600 mb-8 max-w-md mx-auto">
          You haven't set up any emergency contacts yet.
          <span className="block mt-2">
            Please configure them in settings for your safety.
          </span>
        </p>
        <div className="flex justify-center items-center w-full">
          <Link
            className="curor-pointer bg-gradient-to-r from-primary to-primary/70  hover:bg-secondary/40 rounded-full p-2.5 px-20 text-white m-auto"
            to="/settings"
          >
            Settings
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
