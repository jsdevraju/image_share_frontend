import React from 'react';
import GoogleLogin from 'react-google-login';
import video from '../asset/video.mp4';
import { FcGoogle } from 'react-icons/fc';
import logo from '../asset/logowhite.png';
import { client } from '../client';
import { useNavigate } from 'react-router-dom';
const Login = () => {

    // redirect user hooks
    const navigate = useNavigate();
    // handle login function
    const responseGoogle = (respons) =>{
       localStorage.setItem('user', JSON.stringify(respons.profileObj));
    //    destructure object
       const { name, googleId, imageUrl } = respons.profileObj;
    //  send data to server
       const doc = {
           _id: googleId,
           _type:'user',
           Username: name,
           image: imageUrl
       }
       client.createIfNotExists(doc)
       .then(() =>{
        navigate('/', {replace: true})
       })
    }

  return (
    <>
    <div className="flex justify-start items-center flex-col h-screen">
    {/* Video Element Start Here */}
        <div className="relative w-full h-full">
            <video
            src={video}
            type='video/mp4'
            loop
            controls={false}
            muted
            autoPlay
            className='w-full h-full object-cover'
            />

        <div className="absolute flex flex-col justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay">
            <div className="p-5">
               <img src={logo} width='130px' alt="This is logo" />
            </div>
            {/* Login */}
            <div className="shadow-2xl">
                <GoogleLogin 
                clientId={process.env.REACT_APP_CLIENT_ID}
                render = { (renderProps) => (
                    <button
                    type='button'
                    className='bg-mainColor flex justify-center items-center p-3 rounded cursor-pointer outline-none'
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    >
                    <FcGoogle className='mr-4' /> Sign in Google
                    </button>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy='single_host_origin'
                />
            </div>
        </div>

        </div>
    </div>
    </>
  )
}

export default Login