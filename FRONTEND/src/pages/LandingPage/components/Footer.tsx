import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Linkedin, Github } from "lucide-react";
import { FiArrowRight, FiStar } from "react-icons/fi";

interface TestimonialsProps {
  testimonials: { id: number; name: string; role: string; text: string }[];
  activeTestimonial: number;
  setActiveTestimonial: (index: number) => void;
  handleLoginClick: () => void;
}

const FooterCombined: React.FC<TestimonialsProps> = ({
  testimonials,
  activeTestimonial,
  setActiveTestimonial,
  handleLoginClick,
}) => {
  return (
    <>
      {/* ========================= CTA SECTION ========================= */}
      <section id="cta-section" className="py-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="bg-gradient-to-r from-black to-gray-900 rounded-2xl p-8 md:p-12 border border-gray-800 shadow-2xl overflow-hidden relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-900/20 blur-3xl" />

            <div className="relative z-10 text-center">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: 40, opacity: 0 } }}
              >
                Want to <span className="text-blue-500">Start</span> Your Own Club?
              </motion.h2>

              <motion.p
                className="text-gray-400 mb-8 max-w-2xl mx-auto"
                variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
              >
                Turn your passion into a movement! Submit your idea and we’ll help you
                set up your own club on <span className="text-blue-400 font-semibold">Club-Connect</span>.
              </motion.p>

              <motion.div
                variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
                className="flex flex-col sm:flex-row justify-center items-center gap-4"
              >
                <motion.button
                  className="px-8 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-500 hover:to-purple-700 transition flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginClick}
                >
                  Create My Club <FiArrowRight />
                </motion.button>

                <motion.button
                  className="px-8 py-3 rounded-full text-lg font-semibold bg-gray-800 hover:bg-gray-700 transition flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginClick}
                >
                  Join Existing Clubs
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================= TESTIMONIALS SECTION ========================= */}
      <section id="testimonials-section" className="py-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            className="text-center text-3xl font-bold mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            What <span className="text-blue-500">Members</span> Say
          </motion.h2>

          {/* Testimonials Slider */}
          <div className="max-w-4xl mx-auto relative h-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[activeTestimonial].id}
                className="bg-black border border-gray-800 rounded-xl p-8 absolute inset-0 backdrop-blur-sm flex flex-col justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-blue-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="inline mr-1" />
                  ))}
                </div>

                <p className="text-lg italic mb-6 line-clamp-3">
                  "{testimonials[activeTestimonial].text}"
                </p>

                <div>
                  <p className="font-bold">{testimonials[activeTestimonial].name}</p>
                  <p className="text-gray-400 text-sm">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition ${
                  activeTestimonial === index ? "bg-blue-500" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================= FOOTER ========================= */}
      <section
        id="footer-section"
        className="bg-gradient-to-br from-gray-900 via-blue-950 to-black text-gray-300 py-16 mt-0 overflow-hidden relative border-t border-blue-800/30"
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div className="flex flex-col space-y-6">
            <motion.img
              src="/logo.png"
              alt="Club Logo"
              className="w-32"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />

            <p className="text-sm leading-relaxed text-gray-400 border-l-2 border-blue-500 pl-4">
              Empowering students through collaboration, innovation, and
              hands-on learning.
            </p>
          </div>

          {/* Column 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center md:items-start"
          >
            <h2 className="text-white text-lg font-semibold mb-6 pb-2 border-b border-blue-800/30 w-full text-center md:text-left">
              Quick Links
            </h2>

            <ul className="space-y-3 text-sm w-full">
              {[
                { label: "Home", id: "hero-section" },
                { label: "Clubs", id: "clubs-section" },
                { label: "Events", id: "events-section" },
                { label: "Contact", id: "footer-section" },
              ].map(({ label, id }) => (
                <li key={id} className="group">
                  <span
                    onClick={() => {
                      const el = document.getElementById(id);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="cursor-pointer text-gray-400 group-hover:text-white transition-all duration-300 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center md:items-start"
          >
            <h2 className="text-white text-lg font-semibold mb-6 pb-2 border-b border-blue-800/30 w-full text-center md:text-left">
              Contact Us
            </h2>

            <ul className="space-y-4 text-sm text-gray-400 w-full">
              <li className="flex items-center gap-3 hover:text-white transition-all duration-300 group">
                <div className="p-2 bg-blue-900/30 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                  <Mail size={16} className="text-blue-400 group-hover:text-white" />
                </div>
                anindadebta8680@gmail.com
              </li>

              <li className="flex items-center gap-3 hover:text-white transition-all duration-300 group">
                <div className="p-2 bg-blue-900/30 rounded-lg group-hover:bg-green-600 transition-colors duration-300">
                  <Phone size={16} className="text-green-400 group-hover:text-white" />
                </div>
                +91 82828 87603
              </li>

              <li className="flex items-center gap-3 hover:text-white transition-all duration-300 group">
                <div className="p-2 bg-blue-900/30 rounded-lg group-hover:bg-red-600 transition-colors duration-300">
                  <MapPin size={16} className="text-red-400 group-hover:text-white" />
                </div>
                Adamas University, Barasat
              </li>
            </ul>

            <div className="flex gap-3 mt-6 pt-4 border-t border-blue-800/30 w-full justify-center md:justify-start">
              {[
                { icon: Instagram, href: "#", color: "hover:text-pink-400" },
                { icon: Linkedin, href: "#", color: "hover:text-blue-400" },
                { icon: Github, href: "#", color: "hover:text-gray-100" },
              ].map(({ icon: Icon, href, color }) => (
                <a
                  key={href}
                  href={href}
                  className={`p-3 bg-blue-900/30 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-110 ${color}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500 space-y-2"
        >
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-400 font-medium">Club</span>. All rights
            reserved.
          </p>

          <p className="text-gray-500">
            Developed by{" "}
            <a
              href="https://aninda-hi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
            >
              Aninda Debta
            </a>
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default FooterCombined;
