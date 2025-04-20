import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-[#faf0f0] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Hero Section */}
        <section className="flex flex-col  items-center justify-between py-12 md:py-20 gap-12">
          {/* Text Content - Left Side */}
          <div className=" space-y-6">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#a65553] leading-tight text-center "
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              Empowering <span className="text-[#7e3e3d]">Sickle Cell</span>{" "}
              Warriors
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-700 max-w-lg text-center m-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Comprehensive tools and support to help manage sickle cell disease
              with confidence and dignity.
            </motion.p>

            <motion.div
              className="flex justify-center items-center gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              <Link
                to="/register"
                className="text-white bg-[#a65553] hover:bg-[#924846] px-8 py-3 text-lg rounded-xl shadow-lg transition transform hover:-translate-y-1"
              >
                Get Started
              </Link>
              <button className="text-[#a65553] border-2 border-[#a65553] hover:bg-[#f8e8e8] px-8 py-3 text-lg rounded-xl transition transform hover:-translate-y-1">
                Learn More
              </button>
            </motion.div>
          </div>

          {/* Image - Right Side */}
          <motion.div
            className="lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/images/group.jpg"
                alt="Sickle cell support illustration"
                className="w-full rounded-2xl h-60 md:h-96"
              />
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-16 bg-primary text-white rounded-3xl shadow-sm mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Community Members" },
              { number: "24/7", label: "Support Available" },
              { number: "95%", label: "User Satisfaction" },
              { number: "50+", label: "Medical Partners" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="text-4xl font-bold text-white">{stat.number}</p>
                <p className="text-[#f5f5f5] mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#a65553] mb-4">
              Comprehensive Support Tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage sickle cell disease in one place
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Pain Crisis Journal",
                desc: "Log pain episodes with date, duration, and severity to track patterns over time.",
                icon: "📅",
              },
              {
                title: "Medication & Hydration",
                desc: "Customizable reminders for medications and hydration to maintain your health.",
                icon: "⏰",
              },
              {
                title: "Emergency SOS",
                desc: "Instant alert system to notify your emergency contacts during a crisis.",
                icon: "🆘",
              },
              {
                title: "Community Forum",
                desc: "Private, moderated space to connect with others facing similar challenges.",
                icon: "💬",
              },
              {
                title: "Blood Count Tracker",
                desc: "Visualize your blood test results and share them with your care team.",
                icon: "🩸",
              },
              {
                title: "Educational Resources",
                desc: "Curated medical information and lifestyle tips from trusted sources.",
                icon: "📚",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#a65553] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
        {/*  */}
        {/* How It Works - 3-Step Visual Process */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#a65553] mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to take control of your health journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Sign Up",
                desc: "Create your secure profile in minutes",
                img: "/images/sign-up.png", // Mockup of your app signup
              },
              {
                title: "Set Up Your Tools",
                desc: "Customize reminders and emergency contacts",
                img: "/images/dashboard-screenshot.png", // App configuration UI
              },
              {
                title: "Track & Connect",
                desc: "Start logging and join the community",
                img: "/images/record-screenshot.png", // Dashboard view
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="text-center"
              >
                <div className="relative h-48 mb-6 rounded-xl overflow-hidden shadow-md">
                  <img
                    src={step.img}
                    alt={step.title}
                    // layout="fill"
                    // objectFit="cover"
                    className="border border-primary"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#a65553] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
        {/* Testimonial Section */}
        <section className="py-16 bg-[#fdf4f4] rounded-3xl my-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-[#a65553] mb-12">
                What Our Community Says
              </h2>

              <div className="bg-white p-8 rounded-2xl shadow-md">
                <p className="text-lg italic text-gray-700 mb-6">
                  "This platform has transformed how I manage my sickle cell
                  disease. The pain journal helped me identify triggers I never
                  noticed before, and the community support is invaluable."
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#a65553] flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Aisha K.</p>
                    <p className="text-sm text-gray-500">
                      Community Member since 2025
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <motion.div
            className="bg-gradient-to-r from-[#a65553] to-[#7e3e3d] rounded-3xl p-12 text-white shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Take Control?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of warriors managing their sickle cell disease with
              confidence.
            </p>
            <Link
              to="/login"
              className="hidden md:inline cursor-pointer bg-white text-[#a65553] hover:bg-gray-100 px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg transition-transform hover:-translate-y-1 w-full sm:w-auto text-center"
            >
              Sign Up Now - It's Free
            </Link>
            <Link
              to="/login"
              className="visible md:hidden bg-white text-primary p-3 rounded-md shadow-lg"
            >
              Sign up
            </Link>
          </motion.div>
        </section>

        {/* Footer Section */}
        <footer id="contact" className="py-16 text-gray-600">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold text-[#a65553] mb-4">
                SickleCell Support
              </h3>
              <p className="mb-4">
                Empowering warriors with tools and community support.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-[#a65553]">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#a65553]">
                    Research
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#a65553]">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-[#a65553]">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#a65553]">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#a65553]">
                    Partners
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>support@warriorplus.com</li>
                <li>+234 81 403 9083</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} Warriorplus Support. All rights
            reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
