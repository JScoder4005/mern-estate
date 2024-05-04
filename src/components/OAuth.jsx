import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import {
    signInSuccess,
    signInStart,
    signInFailure,
} from '../Features/user/userSlice'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            // Getting (app) from FIREBASE URL
            const auth = getAuth(app);
    
            const result = await signInWithPopup(auth, provider);
            console.log(result, 'result');
    
            // Construct and execute the fetch request
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
    
            if (!res.ok) {
                throw new Error('Failed to sign in with Google');
            }
    
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log('could not sign in with Google', error);
        }
    };
    

    return (
        <button
            onClick={handleGoogleClick}
            type="button"
            className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
            Continue with google
        </button>
    )
}
