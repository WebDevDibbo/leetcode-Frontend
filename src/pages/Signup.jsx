import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {useDispatch, useSelector} from 'react-redux';
import { NavLink, useNavigate } from "react-router";
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { registerUser } from '../authSlice';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const singupSchema = z.object({
    firstName : z.string().min(3,'name should contain at least 3 characters'),
    emailId : z.string().email("Invalid email"),
    password : z.string().min(8,'password should contain at least 8 characters').regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
})

function Signup(){


    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {isAuthenticated,loading} = useSelector((state)=> state.auth);


    const {register,handleSubmit,formState: { errors },} = useForm({resolver : zodResolver(singupSchema)});


    useEffect(()=>{

      if(isAuthenticated)
        navigate('/');

    },[isAuthenticated,navigate])


    const onSubmit = (data) => {
        dispatch(registerUser(data));
    }

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4"> {/* Centering container */}
      <div className="card w-96 bg-[#131213] shadow-xl"> {/* Existing card styling */}
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl">Join Now</h2> {/* Centered title */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Existing form fields */}
            <div className="form-control">
              <label className="label mb-3">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className={`input border-0 bg-neutral-800 w-full ${errors.firstName && 'input-error'}`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-error">{errors.firstName.message}</span>
              )}
            </div>

            <div className="form-control  mt-4">
              <label className="label mb-3">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input border-0 bg-neutral-800 w-full ${errors.emailId && 'input-error'}`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error">{errors.emailId.message}</span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label mb-3">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  // Added pr-10 (padding-right) to make space for the button
                  className={`input border-0 bg-neutral-800 w-full  pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute cursor-pointer top-1/2 right-3 transform -translate-y-1/2 text-gray-500 " // Added transform for better centering, styling
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
                >
                  <div>{showPassword ? <FaEye className='text-lg '/> : <FaEyeSlash className='text-lg'/>}</div>
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            <div className="form-control mt-6 flex justify-center">
              <button
                type="submit"
                className={`btn border-0 ${loading ? 'loading' : ""} w-full bg-linear-to-r/hsl from-indigo-500 to-teal-400`}
              >
                {loading ? "Signing up..." : "Open an Account"}
              </button>
            </div>
          </form>
          <div className="text-center mt-6"> {/* Increased mt for spacing */}
            <span className="text-sm">
              Already have an account?{' '}
              <NavLink to="/login" className="link link-primary">
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Signup;