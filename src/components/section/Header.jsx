import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const handleHover = (e) => {
    const underline = document.getElementById('underline');
    const link = e.currentTarget;

    const left = link.offsetLeft;
    const width = link.offsetWidth;

    underline.style.transform = `translateX(${left}px)`;
    underline.style.width = `${width}px`;
};

export default function Header() {
    return (
        <motion.header
            className="bg-gradient-to-r from-neutral-900 to-gray-800 px-12 py-2 fixed top-0 inset-x-0 flex items-center justify-between shadow-lg z-50"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Link to="/">
                    <motion.img
                        src="/logo.png"
                        alt="logo"
                        className="h-14 w-auto"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    />
                </Link>
            </motion.div>

            <div className="relative">
                <div className="sm:hidden">
                    <label htmlFor="Tab" className="sr-only">Navigation</label>
                    <select id="Tab" className="w-full rounded-md border-gray-300 bg-neutral-800 text-gray-200">
                        <option value="/">Home</option>
                        <option value="/dashboard">Explore</option>
                        <option value="/post">Post</option>
                        <option value="/profile">Profile</option>
                    </select>
                </div>

                <div className="hidden sm:block">
                    <nav className="flex gap-8 relative" aria-label="Navigation" id="nav">
                        {['/', '/dashboard', '/job-status', '/job-application'].map((path, index) => (
                            <motion.div
                                key={path}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to={path}
                                    className={`relative px-2 pb-4 text-lg font-medium transition ${window.location.pathname === path ? 'text-blue-500' : 'text-gray-300'
                                        } hover:text-blue-500`}
                                    onMouseEnter={(e) => handleHover(e)}
                                >
                                    {path === '/' ? 'Home' : path.charAt(1).toUpperCase() + path.slice(2)}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.span
                            id="underline"
                            className="absolute bottom-0 left-0 h-1 w-0 bg-blue-500 transition-all duration-300 ease-in-out"
                            style={{ transform: 'translateX(0)' }}
                            layoutId="underline"
                        />
                    </nav>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <SignedOut>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <SignInButton forceRedirectUrl="/dashboard" className="group flex items-center justify-between gap-4 rounded-lg border border-current px-4 py-2 text-teal-600 transition hover:bg-teal-600 focus:outline-none focus:ring active:bg-teal-500">
                            <span className="flex items-center gap-2">
                                <span className="font-medium transition-colors group-hover:text-white">Sign In</span>
                                <span className="shrink-0 rounded-full border border-teal-600 bg-white p-2 group-active:border-teal-500">
                                    <svg
                                        className="w-5 h-5 rtl:rotate-180"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </span>
                            </span>
                        </SignInButton>
                    </motion.div>
                </SignedOut>
                <SignedIn>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <UserButton />
                    </motion.div>
                </SignedIn>
            </div>
        </motion.header>
    );
}
