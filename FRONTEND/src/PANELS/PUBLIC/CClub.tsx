import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

export default function CClub() {
  const [formData, setFormData] = useState({
    clubName: "",
    topic: "",
    motive: "",
    vision: "",
    contactEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      club_name: formData.clubName,
      topic: formData.topic,
      motive: formData.motive,
      vision: formData.vision,
      contact_email: formData.contactEmail,
      date: new Date().toLocaleString(),
    };

    emailjs
      .send(
        "service_ld8680",
        "template_twaix6e",
        templateParams,
        "CCw9tJ8un0WEPdImV"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setSuccess(true);
        },
        (err) => {
          console.error("FAILED...", err);
        }
      )
      .finally(() => setLoading(false));
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center px-4 py-20">
      <motion.div
        className="max-w-2xl w-full bg-gray-900/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-2xl text-center"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {!success ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center">
              Create Your <span className="text-blue-500">Club</span>
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Tell us about the club you’d like to create. Once submitted, your responses will be sent directly to our team.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-left text-gray-300 mb-2">Club Name</label>
                <input
                  type="text"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-left text-gray-300 mb-2">Club Topic / Domain</label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-left text-gray-300 mb-2">Motive / Purpose</label>
                <textarea
                  name="motive"
                  value={formData.motive}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-left text-gray-300 mb-2">Vision / Goals</label>
                <textarea
                  name="vision"
                  value={formData.vision}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-left text-gray-300 mb-2">Your Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 text-gray-200 border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-500 hover:to-purple-700 px-6 py-3 rounded-full font-semibold transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Submit Request"}
                {!loading && <FiSend />}
              </motion.button>
            </form>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-green-400 text-xl font-medium">
              ✅ Your club creation request has been sent successfully!  
              <br />
              You’ll receive an update soon.
            </div>
          </div>
        )}

        {/* Back button always visible */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-6 py-3 rounded-full font-semibold mt-6 mx-auto"
        >
          <FiArrowLeft /> Go Back
        </motion.button>
      </motion.div>
    </section>
  );
}
