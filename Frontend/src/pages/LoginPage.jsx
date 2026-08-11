import React, { useState } from 'react'
// import AuthPages from './AuthPages'
import { NavLink, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from "lucide-react";


function LoginPages() {
  const navigte = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
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
    e.preventDefault()

    let newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    setError(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    if (
      formData.email === "admin@example.com" &&
      formData.password === "123456"
    ) {
      localStorage.setItem("isLoggedIn", "true")
      navigte("/dashboard")
    } else {
      setError({
        general: "Invalid email or password"
      })
      return
    }

    console.log(formData)

    setFormData({
      email: "",
      password: ""
    })

    setError({})
  }

  return (
    <div className="bg-[#faf9f6] min-h-screen flex items-center justify-center">

      <div className="pr-4 py-7 items-center justify-center flex flex-col w-full max-w-md">
        {/* <AuthPages /> */}
        <form
          onSubmit={submitForm}
          className="bg-white px-7 py-7 ml-4 border border-gray-200 rounded-2xl shadow-sm w-full">
          {error.general && (
            <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm mb-4">
              {error.general}
            </p>
          )}
          <h1 className="font-bold text-3xl text-[#111528] py-1">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm leading-6 mt-1">
            Kindly provide the Email and password used during SMIT
            registration.
          </p>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-semibold mt-5">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@school.edu"
              className={`border w-full p-2.5 rounded-lg mt-1 outline-none transition ${error.email
                ? "border-red-400"
                : "border-gray-300 focus:border-[#111528]"
                }`} />
            {error.email && (
              <p className="text-red-500 text-xs mt-1">
                {error.email}
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mt-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-semibold">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`border w-full p-2.5 pr-16 rounded-lg mt-1 outline-none transition ${error.password
                  ? "border-red-400"
                  : "border-gray-300 focus:border-[#111528]"
                  }`} />
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
              <p className="text-red-500 text-xs mt-1">
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
              <label htmlFor="remember" className="text-gray-500 text-sm ml-2">
                Remember me
              </label>
            </div>
            <NavLink to="/forget-password" className="text-black/60 hover:border-b p-0.5 hover:text-blue-400 hover:border-b-black">
              Forget Password?
            </NavLink>
          </div>
          <button
            type="submit"
            className="bg-[#111528] cursor-pointer text-white py-2.5 px-4 rounded-lg font-semibold mt-5 w-full hover:bg-[#202640] transition">
            Log in
          </button>
          {/* <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-[10px] text-gray-400">
              OR CONTINUE WITH
            </span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div> */}
          {/* <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50">
              Google
            </button>
            <button
              type="button"
              className="border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50">
              Microsoft
            </button>
          </div> */}

        </form>

      </div>

    </div>
  )
}

export default LoginPages