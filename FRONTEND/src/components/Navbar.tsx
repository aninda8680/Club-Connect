import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Crown, Shield, User, Globe, LogOut, User as ProfileIcon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

interface NavLinkButtonProps {
  to: string;
  label: string;
  isActive: boolean;
  index: number;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavLinkButton = ({ to, label, isActive, index, onClick }: NavLinkButtonProps) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0, y: -10 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ 
      type: "spring", 
      stiffness: 200, 
      damping: 25, 
      delay: index * 0.05 
    }}
    whileHover={{ 
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    }}
    whileTap={{ scale: 0.95 }}
    className="relative group h-full"
  >
    <Link
      to={to}
      onClick={onClick}
      className={`relative h-full px-4 py-2 flex items-center justify-center text-sm font-medium rounded-full transition-all duration-300 ease-out z-10
        ${isActive
          // Black and White Active State: White background, Black text, subtle gray shadow
          ? "text-black bg-white shadow-lg shadow-gray-700/50" 
          : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
        }
      `}
    >
      {label}
      {!isActive && (
        <motion.div 
          // Black and White Hover Underline: Solid white
          className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white rounded-full"
          whileHover={{ 
            width: "80%", 
            left: "10%",
            transition: { duration: 0.3 }
          }}
        />
      )}
    </Link>
  </motion.div>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [clubId, setClubId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Scroll animation logic
  useMotionValueEvent(scrollY, "change", (y) => {
    const scrollingDown = y > lastScrollY;
    
    if (y > 100) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    if (scrollingDown && y > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    setLastScrollY(y);
  });

  // Load user from localStorage (Mock user data for demonstration)
  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "GuestUser"; 
    const storedRole = localStorage.getItem("role") || "member"; 
    const storedClubId = localStorage.getItem("clubId") || "club-alpha";

    setUsername(storedUsername);
    setRole(storedRole);
    setClubId(storedClubId);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Define all possible navigation links based on roles
  const baseLinks = [
    // ADMIN
    { to: "/adminpanel", label: "Dashboard", roles: ["admin"] },
    { to: "/createclub", label: "Clubs", roles: ["admin"] },
    { to: "/adminevent", label: "Events", roles: ["admin"] },
    { to: "/manageroles", label: "Manage", roles: ["admin"] },
    { to: "/feed", label: "Feed", roles: ["admin"] },

    // COORDINATOR
    { to: "/coordinatorpanel", label: "Dashboard", roles: ["coordinator"] },
    { to: "/eventcreate", label: "Events", roles: ["coordinator"] },
    { to: `/requests/${clubId}`, label: "Requests", roles: ["coordinator"] },
    { to: "/coordinator/members", label: "Members", roles: ["coordinator"] },

    // VISITOR & MEMBER
    { to: "/memberpanel", label: "Dashboard", roles: ["member"] },
    { to: "/events", label: "Events", roles: ["member"] },
    { to: "/publicpanel", label: "Dashboard", roles: ["visitor"] },
    { to: "/create-post", label: "Post", roles: ["member", "visitor"] },
    { to: "/feed", label: "Feed", roles: ["member", "visitor"] },
    { to: "/notifications", label: "Notification", roles: ["member"] },
  ];

  // Filter links based on current user role
  const navLinks = baseLinks.filter(link => role && link.roles.includes(role));

  const getRoleIcon = () => {
    // Monochromatic role differentiation (Admin is brightest)
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-white" />;
      case "coordinator":
        return <Shield className="w-4 h-4 text-gray-300" />;
      case "leader":
        return <User className="w-4 h-4 text-gray-400" />;
      case "member":
        return <User className="w-4 h-4 text-gray-500" />;
      default:
        return <Globe className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("clubId");
    navigate("/");
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Navbar with scroll animations */}
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
        className={`fixed top-0 left-0 right-0 w-full z-50 px-4 py-3 transition-all duration-500 `}
      >
        <div className="relative mx-auto max-w-15xl flex justify-between items-center h-12">

          {/* Logo with scaling animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10"
          >
            <button
              onClick={() => window.location.reload()}
              className="text-2xl font-black tracking-widest flex items-center"
            >
              {/* Logo text is pure white */}
              <span className="text-white">
                Club Connect
              </span>
            </button>
          </motion.div>


          {/* Center Navigation - Floating Pill */}
          <div className="absolute inset-0 hidden md:flex justify-center items-center pointer-events-none">
            <motion.div
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 1000,
                delay: 0.01
              }}
              className={`flex items-center space-x-1 p-1 h-full rounded-2xl backdrop-blur-xl border shadow-2xl pointer-events-auto transition-all duration-500 ${
                // Keep dark, slightly transparent background
                isScrolled
                  ? "bg-black/80 border-white/20 shadow-black/50"
                  : "bg-black/60 border-white/10 shadow-black/30"
              }`}
            >
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.to;
                return (
                  <NavLinkButton
                    key={link.to}
                    to={link.to}
                    label={link.label}
                    isActive={isActive}
                    index={index}
                    onClick={() => setIsMenuOpen(false)}
                  />
                );
              })}
            </motion.div>
          </div>

          {/* Right Section - User Info & Controls */}
          <motion.div 
            className="flex items-center space-x-3 z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {username && (
              <>
                {/* Desktop User Info */}
                <motion.div 
                  className="hidden lg:flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 backdrop-blur-sm"
                  whileHover={{ 
                    backgroundColor: "rgba(255,255,255,0.2)",
                    transition: { duration: 0.3 }
                  }}
                >
                  {getRoleIcon()}
                  <span className="text-sm font-medium text-white">{username}</span>
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </motion.div>

                {/* Profile Link (Monochromatic) */}
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Link
                    to="/profile"
                    // Profile button uses a solid gray/black for its background
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
                  >
                    <ProfileIcon className="w-5 h-5" />
                  </Link>
                </motion.div>

                {/* Logout Button (Monochromatic) */}
                <motion.button
                  onClick={handleLogout}
                  // Logout button uses a slightly different dark tone to stand out
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-white text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </motion.button>
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="relative p-2 text-3xl focus:outline-none text-gray-400 hover:text-white md:hidden"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-2xl border-l border-white/10 p-6 z-50 flex flex-col shadow-2xl md:hidden"
          >
            {/* Menu Header */}
            <motion.div 
              className="flex justify-between items-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Title uses a white/gray gradient for high contrast */}
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Navigation
              </span>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex-1 space-y-2">
              {navLinks.map((link, index) => {
                if (role && link.roles.includes(role)) {
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                          location.pathname === link.to
                            // Mobile Active Link: White background, Black text
                            ? "bg-white text-black shadow-lg"
                            : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                        }`}
                        onClick={toggleMenu}
                      >
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                }
                return null;
              })}
            </div>

            {/* User Section */}
            <motion.div 
              className="mt-8 pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {username ? (
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-3 text-white mb-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                    onClick={toggleMenu}
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <ProfileIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold">{username}</div>
                      <div className="text-sm text-gray-400 flex items-center space-x-1">
                        {getRoleIcon()}
                        <span className="capitalize">{role}</span>
                      </div>
                    </div>
                  </Link>
                  <motion.button
                    onClick={() => { handleLogout(); toggleMenu(); }}
                    // Mobile Logout button uses a dark gray background
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg"
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </motion.button>
                </>
              ) : (
                <Link
                  to="/"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white hover:bg-gray-200 rounded-xl text-black font-semibold transition-all duration-300 shadow-lg"
                  onClick={toggleMenu}
                >
                  <span>Login / Signup</span>
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
