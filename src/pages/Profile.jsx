import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../firebase'
import {
    updateUserSuccess,
    updateUserFailure,
    updateUserStart,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutStart,
    signOutFailure,
    signOutSuccess,
} from '../Features/user/userSlice'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Profile = () => {
    const [file, setFile] = useState(undefined)
    const [filePerc, setFilePerc] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [showListingError, setShowListingError] = useState(false)
    const [userListings, setUserListings] = useState([])

    const { currentUser, loading, error } = useSelector((state) => state.user)
    const fileRef = useRef(null)
    const dispatch = useDispatch()

    console.log(formData, 'form')

    console.log(file)
    console.log(filePerc)
    console.log(fileUploadError)

    //firebase storage
    // allow read
    // allow write: if
    // request.resource.size <div 2 * 1024 *1024 &&
    // request.resource.contentType.matches('image/.*')

    useEffect(() => {
        if (file) {
            handleFileUpload(file)
        }
    }, [file])

    //File Uploading
    const handleFileUpload = (file) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setFilePerc(Math.round(progress))
            },
            (error) => {
                setFileUploadError(true)
                console.log(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                )
            }
        )
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     try {
    //         dispatch(updateUserStart())
    //         const res = await fetch(`/api/user/update/${currentUser._id}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(formData),
    //         })
    //         const data = await res.json()
    //         if (data.success === false) {
    //             dispatch(updateUserFailure(data.message))
    //             return
    //         }

    //         dispatch(updateUserSuccess(data))
    //         setUpdateSuccess(true)
    //     } catch (error) {
    //         dispatch(updateUserFailure(error.message))
    //     }
    // }

    //Form Submission Handler
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(updateUserStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(updateUserFailure(data.message))
                setUpdateSuccess(false) // Reset updateSuccess if update fails
                return
            }

            dispatch(updateUserSuccess(data))
            setUpdateSuccess(true)
        } catch (error) {
            dispatch(updateUserFailure(error.message))
            setUpdateSuccess(false) // Reset updateSuccess if update fails
        }
    }

    //Account Deletion
    const handleDelete = async () => {
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message))
                return
            }
            dispatch(deleteUserSuccess(data))
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    //Sign out handler
    const handleSignOut = async () => {
        try {
            dispatch(signOutStart())
            const res = await fetch('/api/auth/signOut')
            const data = res.json
            if (data.success === false) {
                dispatch(signOutFailure(data.message))
                return
            }
            dispatch(signOutSuccess(data))
        } catch (error) {
            dispatch(signOutFailure(error.message))
        }
    }

    //to show all the listings
    const handleShowListings = async () => {
        try {
            setShowListingError(false)
            setUpdateSuccess(false)
            const res = await fetch(`/api/user/listings/${currentUser._id}`)
            const data = await res.json()
            if (data.success === true) {
                setShowListingError(true)
                return
            }
            setUserListings(data)
        } catch (error) {
            setShowListingError(true)
        }
    }

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                />
                <img
                    onClick={() => fileRef.current.click()}
                    src={currentUser.avatar}
                    alt="profile"
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                />
                <p className="text-sm self-center">
                    {fileUploadError ? (
                        <span className="text-red-700">
                            Error Image upload (image must be less than 2 mb)
                        </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                        <span className="text-green-700">
                            Image successfully uploaded!
                        </span>
                    ) : (
                        ''
                    )}
                </p>
                <input
                    type="text"
                    placeholder="username"
                    defaultValue={currentUser.username}
                    id="username"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="email"
                    defaultChecked={currentUser.email}
                    id="email"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="password"
                    id="password"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity95 disabled:placeholder-opacity-80"
                >
                    {loading ? 'Loading...' : 'update'}
                </button>
                <Link
                    className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                    to={'/create-listing'}
                >
                    Create Listing
                </Link>
            </form>

            <div className="flex justify-between mt-5">
                <span
                    onClick={handleDelete}
                    className="text-red-700 cursor-pointer"
                >
                    Delete Account
                </span>
                <span
                    onClick={handleSignOut}
                    className="text-red-700 cursor-pointer"
                >
                    Sign Out
                </span>
            </div>
            <p className="text-red-700 mt-5">{error ? error : ''}</p>
            <p className="text-green-700 mt-5">
                {updateSuccess ? 'User is updated Successfully' : ''}
            </p>

            <button
                className="text-green-700 w-full"
                onClick={handleShowListings}
            >
                Show Listings
            </button>
            <p className="text-red-700 mt-5">
                {showListingError ? 'Error showing listings' : ''}
            </p>
            {userListings && userListings.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h1 className="text-center mt-7 text-2xl font-semibold">
                        Your Listings
                    </h1>
                    {userListings.map((listing) => (
                        <div
                            key={userListings._id}
                            className="border rounded-lg p-3 flex justify-between items-center gap-4"
                        >
                            <Link to={`/listing/${listing._id}`}>
                                <img
                                    src={listing.imageUrls[0]}
                                    alt="listing cover"
                                    className="h-16 w-16 object-contain "
                                />
                            </Link>

                            <Link
                                to={`/listings/${listing._id}`}
                                className=" flex-1 text-slate-700 font-semibold hover:underline trunc"
                            >
                                <p>{listing.name}</p>
                            </Link>
                            <div className="flex flex-col items-center">
                                <button className="text-red-700 uppercase">
                                    Delete
                                </button>
                                <button className="text-green-700 uppercase">
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Profile
