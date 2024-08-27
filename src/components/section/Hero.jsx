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
                    const response = await fetch('http://52.66.154.15:5000/api/users/create-user', {
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
        <div className="bg-black text-white">
            {/* Hero Section */}
            <section className="text-white">
                <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex h-screen lg:items-center">
                    <motion.div
                        className="mx-auto max-w-3xl text-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.h1
                            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 1 }}
                        >
                            Welcome to CareerCraft
                            <span className="sm:block py-2"> Forge Your Path to Success </span>
                        </motion.h1>

                        <motion.p
                            className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed text-gray-300"
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
                                    <SignInButton
                                        redirectUrl="/dashboard"
                                        className="block w-full rounded border border-blue-500 bg-blue-500 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-blue-500 focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                                    >
                                        Get Started
                                    </SignInButton>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Link
                                        className="block w-full rounded border border-blue-500 px-12 py-3 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring active:bg-blue-600 sm:w-auto"
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
                                    You are signed in! <Link to="/dashboard" className="underline text-white">Go to the dashboard</Link> to explore job posts.
                                </motion.p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Job Types Section */}
            <section className="py-16 -mt-16 bg-gray-900 text-white">
                <div className="max-w-screen-xl mx-auto px-4">
                    <motion.h2
                        className="text-3xl font-bold text-center mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Explore Job Categories
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['Full-Stack Developer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'UI/UX Designer', 'Data Scientist'].map((jobType, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-800 rounded-lg shadow-lg p-6"
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                            >
                                <h3 className="text-xl font-semibold text-white mb-4">{jobType}</h3>
                                <p className="text-gray-400">Find the latest {jobType} positions that match your skills and passion.</p>
                                <Link to="/dashboard" className="block mt-4 text-blue-400 underline">
                                    View Jobs
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-black text-white">
                <div className="max-w-screen-xl mx-auto px-4">
                    <motion.h2
                        className="text-3xl font-bold text-center mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        What Our Users Say
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['John Doe', 'Jane Smith', 'Alice Johnson'].map((user, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-800 rounded-lg shadow-lg p-6"
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                            >
                                <p className="text-gray-300 mb-4">CareerCraft helped me land my dream job. The process was smooth and the team was incredibly supportive</p>
                                <h3 className="text-xl font-semibold text-white">{user}</h3>
                                <p className="text-gray-500">Software Engineer</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="py-16 bg-gray-900 text-white">
                <div className="max-w-screen-xl mx-auto px-4">
                    <motion.h2
                        className="text-3xl font-bold text-center mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        About CareerCraft
                    </motion.h2>
                    <motion.div
                        className="max-w-3xl mx-auto text-center text-gray-400"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-lg leading-relaxed">
                            CareerCraft is dedicated to connecting talented developers with opportunities that shape their careers. Whether you are a seasoned professional or just starting out, we provide the tools and resources you need to succeed in the tech industry.
                        </p>
                        <p className="text-lg leading-relaxed mt-4">
                            Join us in shaping the future of technology by forging your own path with the help of CareerCraft. Your journey towards success begins here.
                        </p>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
