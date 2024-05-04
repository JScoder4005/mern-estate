import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from '../Features/user/userSlice'
import OAuth from '../components/OAuth'

const SignIn = () => {
    const [formData, setFormData] = useState({})
    const { loading, error } = useSelector((state) => state.user)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }
    // console.log(formData)

    const handleSubmit = async (event) => {
        event.preventDefault()

        dispatch(signInStart())
        const res = await fetch('/api/auth/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        try {
            const data = await res.json()
            if (data.success === false) {
                dispatch(signInFailure(data.message))
                return
            }
            dispatch(signInSuccess(data))
            navigate('/')
            console.log(data)
        } catch (err) {
            dispatch(signInFailure(error.message))
        }
    }

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
            <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="email"
                    className="border p-3 rounded-lg "
                    id="email"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="password"
                    className="border p-3 rounded-lg "
                    id="password"
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:bg-opacity-80"
                >
                    {loading ? 'Loading..' : 'Sign In'}
                </button>
                <OAuth />
            </form>
            <div className="flex gap-2 mt-5">
                <p>Dont have an account?</p>
                <Link to={'/sign-up'}>
                    <span className="text-blue-800">Sign up</span>
                </Link>
            </div>
            {/* {error && <p className="text-red-600 mt-5">{error}</p>} */}
        </div>
    )
}

export default SignIn
