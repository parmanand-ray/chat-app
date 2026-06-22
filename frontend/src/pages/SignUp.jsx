import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
    } catch (error) {}
  };

  return (
    <div className="w-full min-h-screen bg-slate-300 flex items-center justify-center px-4">
      <div className="w-full max-w-[500px] bg-white rounded-xl shadow-lg shadow-gray-400 overflow-hidden">
        <div className="w-full min-h-[200px] bg-[#292b2a] rounded-b-[50%] shadow-lg shadow-gray-400 flex items-center justify-center px-6">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-200">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Talko
              </span>
            </h1>

            <p className="max-w-sm mx-auto text-sm md:text-base font-medium text-gray-400 leading-relaxed">
              Connect instantly, chat smoothly, and stay close in real time.
            </p>
          </div>
        </div>

        <form className="w-full flex flex-col items-center gap-5 px-5 py-8">
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700"
              >
                Username
              </label>
              <input
                className="w-full h-[50px] outline-none border-2 border-[#8edfd1] focus:border-[#00dcb8] px-5 py-2 bg-white rounded-lg shadow-md shadow-gray-200 text-gray-800 placeholder:text-gray-400"
                type="text"
                name="username"
                id="username"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email address"
                className="w-full h-[50px] outline-none border-2 border-[#8edfd1] focus:border-[#00dcb8] px-5 py-2 bg-white rounded-lg shadow-md shadow-gray-200 text-gray-800 placeholder:text-gray-400"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Create a strong password"
                  className="w-full h-[50px] outline-none border-2 border-[#8edfd1] focus:border-[#00dcb8] pl-5 pr-12 py-2 bg-white rounded-lg shadow-md shadow-gray-200 text-gray-800 placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00bfa5] transition-all"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Hide Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.585 10.587a2 2 0 0 0 2.828 2.826" />
                      <path d="M16.681 16.673A10.88 10.88 0 0 1 12 18c-5 0-9-6-9-6a17.4 17.4 0 0 1 3.333-3.947" />
                      <path d="M9.88 4.24A10.84 10.84 0 0 1 12 4c5 0 9 6 9 6a17.78 17.78 0 0 1-2.18 2.944" />
                      <path d="M3 3l18 18" />
                    </svg>
                  ) : (
                    // Show Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.938 7.148a1 1 0 0 1 0 .704C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.938-7.152" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-[50px] bg-[#00dcb8] hover:bg-[#00c4a4] text-white font-bold rounded-lg shadow-md transition-all"
          >
            Create Account
          </button>

          <p className="text-sm font-medium text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#00bfa5] hover:text-[#009f8a] transition-all"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
