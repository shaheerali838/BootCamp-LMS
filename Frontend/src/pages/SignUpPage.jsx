import React, { useState } from 'react'
import AuthPages from './AuthPages'
import { NavLink, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from "lucide-react";


function SignUpPages() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    create_date: '',
    password: '',
  })
  const [error, setError] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const submitForm = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.create_date) {
      newErrors.create_date = "Date is required"
    }

    setError(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    console.log(formData);

    setFormData({
      username: '',
      email: '',
      password: '',
      create_date: ''
    });

    navigate('/login')
    setError({});
  };

  return (
    <div className='bg-gray-50 flex items-center justify-center min-h-screen'>

      <div className='pr-4 py-7 items-center justify-center flex flex-col w-full max-w-md'>

        <AuthPages />

        <form
          action=""
          onSubmit={submitForm}
          className='bg-white px-6 py-6 ml-4 border border-gray-200 rounded-2xl shadow-md w-full'
        >

          <h1 className='font-bold text-3xl text-black/80 py-1'>
            Create your account
          </h1>

          <p className='text-black/50 text-sm leading-6'>
            Create your SMIT account and start your learning journey.
          </p>

          <div>
            <label
              htmlFor=""
              className='block text-gray-700 text-sm font-bold mt-4'
            >
              Username
            </label>

            <input
              type="text"
              name='username'
              value={formData.username}
              required
              onChange={handleChange}
              placeholder='Enter your username'
              className='border border-gray-300 w-full p-2.5 rounded-lg mt-1 outline-none focus:border-black'
            />

            {error.username && (
              <p className='text-red-500 text-xs mt-1'>
                {error.username}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor=""
              className='block text-gray-700 text-sm font-bold mt-4'
            >
              Email
            </label>

            <input
              type="email"
              name='email'
              value={formData.email}
              required
              onChange={handleChange}
              placeholder='you@school.edu'
              className='border border-gray-300 w-full p-2.5 rounded-lg mt-1 outline-none focus:border-black'
            />

            {error.email && (
              <p className='text-red-500 text-xs mt-1'>
                {error.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor=""
              className='block text-gray-700 text-sm font-bold mt-4'
            >
              Create Date
            </label>

            <input
              type="date"
              name='create_date'
              value={formData.create_date}
              required
              onChange={handleChange}
              className='border border-gray-300 w-full p-2.5 rounded-lg mt-1 outline-none focus:border-black'
            />

            {error.create_date && (
              <p className='text-red-500 text-xs mt-1'>
                {error.create_date}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor=""
              className='block text-gray-700 text-sm font-bold mt-4'
            >
              Password
            </label>

            <div className='relative'>

              <input
                type={showPassword ? "text" : "password"}
                name='password'
                value={formData.password}
                required
                onChange={handleChange}
                placeholder='Create a password'
                className='border border-gray-300 w-full p-2.5 pr-16 rounded-lg mt-1 outline-none focus:border-black'
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600">
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {error.password && (
              <p className='text-red-500 text-xs mt-1'>
                {error.password}
              </p>
            )}
          </div>
          <div className='flex p-2 items-center justify-between'>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="accent-[#111528]" />
              <label htmlFor="remember" className="text-gray-500 text-sm ml-2 w-35">
                I agree to the Terms and Conditions.
              </label>
            </div>
            <NavLink to="/forget-password" className="text-black/60 hover:border-b p-0.5 hover:text-blue-400 hover:border-b-black">
              Forget Password?
            </NavLink>
          </div>
          <button
            type='submit'
            className='bg-[#111528] text-white py-2.5 px-4 rounded-lg mt-5 w-full font-bold hover:bg-[#202640] transition'>
            Create Account
          </button>

          {/* <div className='flex items-center gap-3 my-5'>

            <div className='h-px bg-gray-200 flex-1'></div>

            <span className='text-xs text-gray-400'>
              OR CONTINUE WITH
            </span>

            <div className='h-px bg-gray-200 flex-1'></div>

          </div> */}

          {/* <div className='grid grid-cols-2 gap-3'>

            <button
              type='button'
              className='border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50'>
              Google
            </button>

            <button
              type='button'
              className='border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50'>
              Microsoft
            </button>

          </div> */}

        </form>

      </div>

    </div>
  )
}

export default SignUpPages