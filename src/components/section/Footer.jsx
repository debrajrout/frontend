import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const handleHover = (e) => {
    const underline = document.getElementById('footer-underline');
    const link = e.currentTarget;

    const left = link.offsetLeft;
    const width = link.offsetWidth;

    underline.style.transform = `translateX(${left}px)`;
    underline.style.width = `${width}px`;
};

export default function Footer() {
    return (
        <motion.footer
            className="bg-gradient-to-r from-neutral-800 to-gray-700   px-8 shadow-inner"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="relative mx-auto max-w-screen-xl lg:pt-12">
                <div className="absolute end-4 top-4 sm:end-6 sm:top-6 lg:end-8 lg:top-8">
                    <Link
                        to="#MainContent"
                        className="inline-block rounded-full bg-teal-600 p-2 text-white shadow transition hover:bg-teal-500 sm:p-3 lg:p-4"
                    >
                        <span className="sr-only">Back to top</span>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Link>
                </div>

                <div className="lg:flex lg:items-end lg:justify-between">
                    <div>
                        <div className="flex justify-center items-center gap-3 text-teal-600 lg:justify-start">
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
                            <span className="text-2xl font-bold text-blue-600">CareerCraft</span>
                        </div>

                        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-300 lg:text-left">
                            Empowering developers and recruiters to connect and grow. At CareerCraft, we streamline your job search and internship applications for a seamless career journey.
                        </p>
                    </div>

                    <nav className="flex gap-6 relative mt-6 lg:mt-0" aria-label="Footer Navigation">
                        {['/dashboard', '/job-status', '/job-application'].map((path, index) => (
                            <motion.div
                                key={path}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to={path}
                                    className="relative px-1 pb-4 text-sm font-medium text-gray-300 transition hover:text-blue-500"
                                    onMouseEnter={(e) => handleHover(e)}
                                >
                                    {path.charAt(1).toUpperCase() + path.slice(2)}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.span
                            id="footer-underline"
                            className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500 transition-all duration-300"
                            style={{ transform: 'translateX(0)' }}
                            layoutId="underline"
                        />
                    </nav>
                </div>

                <p className="mt-12 text-center text-sm text-gray-400 lg:text-right">
                    Copyright &copy; 2024. All rights reserved.
                </p>
            </div>
        </motion.footer>
    )
}
