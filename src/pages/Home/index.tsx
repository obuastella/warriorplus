import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-[#fdf4f4] min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-28">
        {/* Hero Section */}
        <section className="text-center py-20">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-[#a65553] mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Empowering Sickle Cell Warriors
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Empowering Warriors one Step at a time
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          >
            <button className="text-white bg-[#a65553] hover:bg-[#924846] px-6 py-3 text-lg rounded-xl shadow-lg transition">
              Get Started
            </button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="grid md:grid-cols-2 gap-10 py-16">
          {[
            {
              title: "Pain Crisis Journal",
              desc: "Log pain episodes with date, duration, and severity to track patterns over time.",
            },
            {
              title: "Medication & Hydration Reminders",
              desc: "Receive timely notifications to take medications and stay hydrated.",
            },
            {
              title: "Emergency SOS Button",
              desc: "Instantly alert your emergency contact during a pain crisis.",
            },
            {
              title: "Community Forum",
              desc: "Connect with other warriors, share stories, and exchange support.",
            },
            {
              title: "Blood Count Tracker",
              desc: "Easily log and view your blood test results from doctor visits.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <h3 className="text-xl font-semibold text-[#a65553] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Footer Section */}
        <footer
          id="contact"
          className="text-center py-10 text-gray-500 text-sm"
        >
          &copy; {new Date().getFullYear()} SickleCell Support. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
}
