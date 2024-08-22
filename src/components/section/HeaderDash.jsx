import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeaderD() {
    const navigate = useNavigate();

    const goToApplicationStatus = () => {
        navigate('/job-status');
    };

    const goToPostStatus = () => {
        navigate('/job-application');
    };

    const postAjob = () => {
        navigate('/job-post');
    }

    return (
        <motion.header
            className="bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-4 fixed top-0 inset-x-0 z-50 flex items-center justify-between shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <motion.div
                whileHover={{ scale: 1.05 }}
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

            <div className="relative hidden sm:block">
                <nav className="flex gap-8 relative" aria-label="Navigation" id="nav">
                    <motion.div
                        whileHover={{ scale: 1.2, rotate: 3 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group"
                    >
                        <Link
                            to="/"
                            className="relative inline-block px-4 py-2 text-lg font-semibold text-gray-300 transition-colors duration-300 transform rounded-lg bg-gray-900 hover:text-white group-hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                        >
                            Back to Home
                        </Link>
                        <span className="absolute inset-x-0 bottom-0 h-1 transform scale-x-0 bg-gray-600 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </motion.div>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <SignedOut>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <SignInButton forceRedirectUrl="/dashboard" mode="modal" className="group flex items-center justify-between gap-4 rounded-lg border border-gray-500 px-4 py-2 text-white bg-gray-800 transition-colors hover:bg-gray-700 focus:outline-none focus:ring active:bg-gray-600">
                            <span className="flex items-center gap-2">
                                <span className="font-medium transition-colors group-hover:text-white">Sign In</span>
                                <span className="shrink-0 rounded-full border border-gray-500 bg-white p-2 group-active:border-gray-400">
                                    <svg
                                        className="w-5 h-5"
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
                    <motion.button
                        className="shadow-md text-gray-300 px-6 py-2 rounded-lg tracking-wide uppercase font-bold bg-gray-800 hover:bg-gray-700 transition duration-200"
                        onClick={goToApplicationStatus}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Application Status
                    </motion.button>
                    <motion.button
                        className="shadow-md text-gray-300 px-6 py-2 rounded-lg tracking-wide uppercase font-bold bg-gray-800 hover:bg-gray-700 transition duration-200"
                        onClick={goToPostStatus}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Your Post Status
                    </motion.button>
                    <motion.button
                        className="shadow-md text-gray-300 px-6 py-2 rounded-lg tracking-wide uppercase font-bold bg-gray-800 hover:bg-gray-700 transition duration-200"
                        onClick={postAjob}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Post a Job
                    </motion.button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <UserButton />
                    </motion.div>
                </SignedIn>
            </div>
        </motion.header>
    );
}
