import React, { useState } from 'react'
import AuthPages from './AuthPages'

function LoginPages() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState({})

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const submitForm = (e) => {
  e.preventDefault();

  let newErrors = {};

  if (!formData.email) {
    newErrors.email = "Email is required";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters long";
  }

  setError(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return;
  }

  console.log(formData);

  setFormData({
    email: "",
    password: "",
  });

  setError({});
};
  return (
    <div className='bg-white flex items-center justify-center min-h-screen min-w-screen'>
      <div className='pr-4 py-7  items-center justify-center flex flex-col '>
        <AuthPages />
        <form action="" className='' onSubmit={submitForm} className='bg-white px-5 py-4 ml-4 border border-gray-300 rounded-2xl shadow-lg w-100 max-h-2h max-lg:w-90 max-sm:w-70'>

          <h1 className='font-bold text-2xl text-black/70 py-1'>Login</h1>
          <p className='text-black/50'>
            Kindly provide the Email and password used during SMIT registration.
          </p>

          <div>
            <label htmlFor="" className='block text-gray-700 text-md font-bold mt-3'>Email</label>
            <input type="email" name='email' value={formData.email} onChange={handleChange} className='border  border-gray-300  w-full p-1.5 rounded mt-1' />
            {error.email && <p className='text-red-500'>{error.email}</p>}
          </div>

          <div>
            <label htmlFor="" className='block text-gray-700 text-md font-bold mt-3'>Password</label>
            <input type="password" name='password' value={formData.password} onChange={handleChange} className='border  border-gray-300  w-full p-1.5 shadow-sm rounded mt-1' />
            {error.password && <p className='text-red-500'>{error.password}</p>}
          </div>

          <button type='submit' className='bg-blue-500 cursor-pointer text-white py-2 px-4 rounded font-bold mt-4 w-full hover:bg-blue-600'>Submit</button>
        </form>

      </div>


    </div>
  )
}

export default LoginPages