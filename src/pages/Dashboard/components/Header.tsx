import { Hand } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.section
      className="rounded-sm relative p-6 md:p-8 flex items-start gap-4 w-full h-32 md:h-40  overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <img
          src="/images/header.jpg"
          alt="Background"
          className="w-full h-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Hand size={40} className="text-white animate-pulse" />
        </motion.div>

        <div>
          <motion.h1
            className="text-lg md:text-xl font-medium text-white drop-shadow-md"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Hello, Warrior
          </motion.h1>
          <motion.p
            className="text-sm md:text-base text-white/90 mt-1 drop-shadow-sm"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Today is{" "}
            {new Date().toLocaleDateString("en-US", { weekday: "long" })}.
            <span className="block mt-1">
              Remember to stay hydrated and take your medication.
            </span>
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
