import { SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";

export default function Hero() {
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        const createUser = async () => {
            if (isSignedIn && user) {
                try {
                    const response = await fetch('http://localhost:5000/api/users/create-user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: user.fullName,
                            email: user.primaryEmailAddress.emailAddress,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error creating user:', errorData.message);
                    } else {
                        console.log('User created successfully');
                    }
                } catch (error) {
                    console.error('Error creating user:', error);
                }
            }
        };

        createUser();
    }, [isSignedIn, user]);

    return (
        <section className="text-white">
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex h-screen lg:items-center">
                <motion.div
                    className="mx-auto max-w-3xl text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h1
                        className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1 }}
                    >
                        Welcome to CareerCraft
                        <span className="sm:block py-2"> Forge Your Path to Success </span>
                    </motion.h1>

                    <motion.p
                        className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 1 }}
                    >
                        Empowering Developers to Shape Their Careers—Connecting Talent with Opportunities for a Brighter Future.
                    </motion.p>

                    {!isSignedIn ? (
                        <motion.div
                            className="mt-8 flex flex-wrap justify-center gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 1 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <SignInButton mode="modal" forceRedirectUrl="/dashboard"
                                    className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                                >
                                    Get Started
                                </SignInButton>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Link
                                    className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                                    to="/dashboard"
                                >
                                    Explore More
                                </Link>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.p
                                className="text-lg font-semibold"
                                animate={{ rotate: [0, 1, -1, 0] }}
                                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                            >
                                You're signed in! <Link to="/dashboard" className="underline text-white">Go to the dashboard</Link> to explore job posts.
                            </motion.p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
