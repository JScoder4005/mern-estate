import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'



const SignIn = () => {
  const [formData, setFormData]=useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange =(e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value
      }
    )
  };
 // console.log(formData)
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    const res = await fetch('/api/auth/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    try {
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null)
      navigate('/');
      console.log(data)
    } catch (err) { 
      setLoading(false);
      setError(err.message);
      console.log(err)
    }
  }

  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>
        
        <input type="email" placeholder='email' className='border p-3 rounded-lg ' id='email'onChange={handleChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg ' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:bg-opacity-80'>{loading ? 'Loading..' : 'Sign In'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-800'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-600 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn