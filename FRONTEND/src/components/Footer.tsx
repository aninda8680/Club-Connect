// components/Footer.tsx
import { Mail, Phone, MapPin, Instagram, Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gray-950 text-gray-300 py-12 mt-0 overflow-hidden relative bottom-0 border-t border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {/* Column 1: Logo + About */}
        <div className="flex flex-col space-y-4">
          <motion.img
            src="/logo.png"
            alt="Club Logo"
            className="w-28"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <p className="text-sm leading-relaxed text-gray-400">
            We are a community of passionate learners, creators, and innovators —
            empowering students through collaboration, knowledge, and creativity.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-white text-xl font-semibold mb-5">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-white transition duration-300">
                Events
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition duration-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition duration-300">
                Contact
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Column 3: Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-white text-xl font-semibold mb-5">Get in Touch</h2>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2 hover:text-white transition duration-300">
              <Mail size={18} /> club@college.edu
            </li>
            <li className="flex items-center gap-2 hover:text-white transition duration-300">
              <Phone size={18} /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2 hover:text-white transition duration-300">
              <MapPin size={18} /> College Campus, City
            </li>
          </ul>

          {/* Social icons */}
          <div className="flex gap-4 mt-5">
            <a href="#" className="hover:text-white transition-transform duration-300 hover:scale-110">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-white transition-transform duration-300 hover:scale-110">
              <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-white transition-transform duration-300 hover:scale-110">
              <Github size={20} />
            </a>
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
          © {new Date().getFullYear()} <span className="text-gray-400 font-medium">Club</span>. All rights reserved.
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
    </motion.footer>
  );
}
