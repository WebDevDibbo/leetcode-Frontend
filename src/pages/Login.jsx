import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {useDispatch, useSelector} from 'react-redux';
import { loginUser } from '../authSlice';
import { NavLink } from 'react-router';
import { LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';


const LoginSchema = z.object({
    emailId : z.string().email('Invalid email'),
    password : z.string().min(8,'password should contain at least 8 characters')
})

function Login(){


  const {loading,error,user} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const {register,handleSubmit,formState: { errors },} = useForm({resolver : zodResolver(LoginSchema)});
  const [loginLoading,setLoginLoading] = useState(false);
  
  

    const onSubmit = (data) => {
        
        dispatch(loginUser(data));
    }
    
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-900"> {/* Added bg for contrast */}
      <div  className="card  w-96 bg-[#131213] shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl mb-6">Sign In</h2> {/* Added mb-6 */}

          
          <form  onSubmit={handleSubmit(onSubmit)}>
            
            <div className="form-control"> {/* Removed mt-4 from first form-control for tighter spacing to title or global error */}
              <label className="label mb-3"> {/* Removed mb-1, default spacing should be fine */}
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input bg-neutral-800 border-0 w-full ${errors.emailId ? 'input-error' : ''}`} 
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label mb-3">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`input bg-neutral-800 border-0 w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                <button 
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  
                  
                >
                  
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            <div className="form-control  mt-8 flex justify-center">
              <button
                type="submit"
                className={`btn w-full border-0  bg-linear-to-r/srgb from-indigo-500 to-teal-400 ${loading ? 'loading loading-ring text-success loading-md' : ''}`} // Added btn-disabled for better UX with loading
               
              > 
              {!loginLoading && <LogIn className='mr-2' size={18} />}
                {loginLoading ? ( <span className="loading loading-spinner"></span>) 
                : 
                ("Let's Go")}
                
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <span className="text-sm">
              Don't have an account? {' '} {/* Adjusted text slightly */}
              <NavLink to="/signup" className="link link-primary">
                 Join the Community
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Login;