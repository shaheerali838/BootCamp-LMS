import React, { useState } from 'react'
import AuthPages from './AuthPages'
import { NavLink, useNavigate } from 'react-router-dom'

function SignUpPages() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username :'',
    email: '',
    create_date : '',
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
      username :'',
      email: '',
      password: '',
      create_date : ''
    });
    navigate('/login')
    setError({});
  };
  return (
    <div className='bg-white flex items-center justify-center'>
      
      <div className='pr-4 py-7  items-center justify-center flex flex-col '>
        <AuthPages />
        <form action="" className='' onSubmit={submitForm} className='bg-white px-5 py-4 ml-4 border border-gray-300 rounded-2xl shadow-lg w-100 max-h-2h max-lg:w-90 max-sm:w-70'>
          <h1 className='font-bold text-2xl text-black/70 py-1'>Login</h1>
          <p className='text-black/50'>
            Kindly provide the username, email, date, and password used during SMIT registration.
          </p>
          <div>
            <label htmlFor="" className='block text-gray-700 text-md font-bold mt-3'>Username</label>
            <input type="text" name='username' value={formData.username} required onChange={handleChange} className='border  border-gray-300  w-full p-1.5 rounded mt-1' />
            {error.username && (<p className='text-black/60'>{error.username}</p>)}
          </div>
          <div>
            <label htmlFor="" className='block text-gray-700 text-md font-bold mt-3'>Email</label>
            <input type="email" name='email' value={formData.email} required onChange={handleChange} className='border  border-gray-300  w-full p-1.5 rounded mt-1' />
            {error.email && (<p className='text-black/60'>{error.email}</p>)}
          </div>
         <div>
           <label htmlFor="" className='block text-gray-700 text-md font-bold mt-3'>Create Date</label>
           <input type="date" name='create_date' value={formData.create_date} required onChange={handleChange} className='border  border-gray-300  w-full p-1.5 rounded mt-1' />
           {error.create_date && (<p className='text-black'>{error.create_date}</p>)}
         </div>
          <div>
            <label htmlFor="" className='block text-gray-700 text-md font-bold mt-3'>Password</label>
            <input type="password" name='password' value={formData.password} required onChange={handleChange} className='border  border-gray-300  w-full p-1.5 shadow-sm rounded mt-1' />
            {error.password && (<p className='text-black/60'>{error.password}</p>)}
          </div>
          <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full font-bold hover:bg-blue-600'>Submit</button>

        </form>

      </div>


    </div>
  )
}

export default SignUpPages