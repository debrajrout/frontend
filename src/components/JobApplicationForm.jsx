import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AiFillCheckCircle } from 'react-icons/ai';


const JobApplicationFormDialog = ({ job, user, open, setOpen }) => {
    const [formData, setFormData] = useState({
        applicantName: user.fullName || '',
        education: {
            degree: '',
            institution: '',
            graduationYear: '',
        },
        skills: '',
        whyJoin: '',
        resumeFile: null,
        coverLetter: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'resumeFile') {
            setFormData({ ...formData, resumeFile: files[0] });
        } else if (name.startsWith('education.')) {
            const key = name.split('.')[1];
            setFormData({
                ...formData,
                education: {
                    ...formData.education,
                    [key]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formDataToSend = new FormData();
        formDataToSend.append('resumeFile', formData.resumeFile);
        formDataToSend.append('applicantName', formData.applicantName);
        formDataToSend.append('education[degree]', formData.education.degree);
        formDataToSend.append('education[institution]', formData.education.institution);
        formDataToSend.append('education[graduationYear]', formData.education.graduationYear);
        formDataToSend.append('skills', formData.skills);
        formDataToSend.append('whyJoin', formData.whyJoin);
        formDataToSend.append('coverLetter', formData.coverLetter);
        formDataToSend.append('email', user.primaryEmailAddress.emailAddress);

        try {
            const response = await fetch(`http://localhost:5000/api/apply/${job._id}/apply`, {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setOpen(false);
                    navigate('/job-status');
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to submit application.');
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] h-[90%] overflow-y-auto p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-800">Apply for {job.name}</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Complete the form below to submit your application for this position.
                    </DialogDescription>
                </DialogHeader>
                {submitted ? (
                    <div className="flex flex-col items-center justify-center text-center">
                        <AiFillCheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">Application Submitted!</h2>
                        <p className="text-gray-500">Redirecting you to your application status...</p>
                    </div>
                ) : (
                    <motion.form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Full Name</label>
                            <input
                                type='text'
                                name='applicantName'
                                value={formData.applicantName}
                                onChange={handleChange}
                                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Education</label>
                            <input
                                type='text'
                                name='education.degree'
                                placeholder='Degree (e.g., BSc Computer Science)'
                                value={formData.education.degree}
                                onChange={handleChange}
                                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                required
                            />
                            <input
                                type='text'
                                name='education.institution'
                                placeholder='Institution (e.g., MIT)'
                                value={formData.education.institution}
                                onChange={handleChange}
                                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                required
                            />
                            <input
                                type='number'
                                name='education.graduationYear'
                                placeholder='Graduation Year (e.g., 2022)'
                                value={formData.education.graduationYear}
                                onChange={handleChange}
                                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Skills</label>
                            <input
                                type='text'
                                name='skills'
                                placeholder='List your skills (e.g., JavaScript, React, Node.js)'
                                value={formData.skills}
                                onChange={handleChange}
                                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700'>
                                Why do you want to join us?
                            </label>
                            <textarea
                                name='whyJoin'
                                value={formData.whyJoin}
                                onChange={handleChange}
                                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                rows='4'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Resume File</label>
                            <input
                                type='file'
                                name='resumeFile'
                                onChange={handleChange}
                                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Cover Letter</label>
                            <textarea
                                name='coverLetter'
                                value={formData.coverLetter}
                                onChange={handleChange}
                                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                                rows='4'
                            />
                        </div>

                        {error && <p className='text-red-500 text-sm'>{error}</p>}

                        <div className='flex justify-end mt-6 space-x-3'>
                            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button variant="primary" type='submit' disabled={loading} className={`ml-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </div>
                    </motion.form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default JobApplicationFormDialog;
