
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface StudentDetailsModalProps {
    isOpen: boolean;
    paymentId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ isOpen, paymentId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        city: '',
        state: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.name || !formData.mobile || !formData.city || !formData.state) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        // Format mobile number to E.164 (prepend +91 if not present)
        let formattedMobile = formData.mobile.trim();
        if (!formattedMobile.startsWith('+')) {
            formattedMobile = `+91${formattedMobile}`;
        }

        try {
            // Use relative URL to leverage Vite proxy in development (avoids CORS)
            const response = await fetch('/api/internal/update-student-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'HDB@020205'
                },
                body: JSON.stringify({
                    ...formData,
                    mobile: formattedMobile
                })
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                throw new Error("Proxy error: Received HTML instead of JSON. Please restart your dev server (Ctrl+C then npm run dev) to apply proxy settings.");
            }

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                onSuccess();
            } else {
                setError(data.message || 'Submission failed. Please try again.');
            }
        } catch (err: any) {
            console.error(err);
            // Show the actual error message to help debugging (e.g., "Failed to fetch" usually means Network/CORS)
            setError(err.message || 'Something went wrong. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-t-3xl rounded-b-3xl w-full max-w-sm overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300 font-sans">

                {/* Header */}
                <div className="bg-[#004e8c] pt-8 pb-6 px-4 text-center relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                    <h3 className="text-white font-bold text-lg mb-2">Payment successful <span className="font-normal text-sm opacity-90">(ref id:</span></h3>
                    <div className="inline-block bg-[#003865] rounded-md px-3 py-1 border border-white/20">
                        <span className="text-white font-mono text-sm tracking-wide">{paymentId || "PAY_ID_12345"}</span>
                        <span className="text-white font-normal text-sm opacity-90"> )</span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-[#C02626] font-bold text-2xl mb-2 tracking-wide">FINAL STEP</h2>
                        <p className="text-slate-500 text-xs font-medium">To confirm your Subscription, please fill the details below</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-2 rounded-lg text-xs mb-4 text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:border-[#ffb129] focus:ring-1 focus:ring-[#ffb129] outline-none transition-all text-sm"
                            placeholder="Name"
                        />

                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:border-[#ffb129] focus:ring-1 focus:ring-[#ffb129] outline-none transition-all text-sm"
                            placeholder="Mobile Number"
                        />

                        {/* Using text inputs for City/State as we don't have a list, but styled to match the look */}
                        <div className="relative">
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:border-[#ffb129] focus:ring-1 focus:ring-[#ffb129] outline-none transition-all text-sm bg-white"
                                placeholder="State"
                            />
                            {/* Chevron down icon fake */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:border-[#ffb129] focus:ring-1 focus:ring-[#ffb129] outline-none transition-all text-sm bg-white"
                                placeholder="City"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#fdb03d] hover:bg-[#faa010] text-black py-3 rounded-full font-bold shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center text-sm uppercase tracking-wide"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <span>SUBMIT</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsModal;
