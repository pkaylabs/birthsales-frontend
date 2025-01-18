import React from 'react'

const Login = () => {
  return (
      <div className="flex justify-between min-h-screen mr-20 overflow-hidden">
          <div className="">
            <img
              className="w-full object-cover"
              src={
                "https://s3-alpha-sig.figma.com/img/75f3/94c0/a1c7dc5b68a42239311e510f54d8cd59?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nV9ZtiMyfHw~oGBA2bAdQQhJRoDiX3SjhvUS31oEqYzU4hUmZ9VLGWmHEjtU18F4kBu4fSoZJ7OP3ubaKPbOzuTlzhcS8bpuf8hGgzxmBh4lS5m2PtGUF4MqEoNNrQKh6KUoIv0-nSDr~oVp4N-0JtdrFGM6j7AKZ7Hvl~shXPQUojth3jrO9GIhqqTiGfjUz4-QBk3F45leNpdREHtUkyl7UM8ogCjXT~e740kL9TA~MCAumyy~IpVMp-zSFTrdIAoSY-sFcrDORYmvOKXjErqJsu0PxRS8eeF~oHOq2HBnn679xsX~ZOIYC3VyePfI-bDy5OaygWONaM-F1xywaQ__"
              }
              alt="sign up image"
            />
          </div>
          <div className="w-[45%] ">
            <div className="mt-20 ml-10 flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <h1 className="font-bold text-3xl">Log in to Exclusive</h1>
                <p>Enter your details below</p>
              </div>
              <form className="flex flex-col gap-5">
                <input
                  type="text"
                  className="p-2 border-b border-gray-500 w-full outline-none"
                  placeholder="Email or Phone Number"
                />
                <input
                  type="text"
                  className="p-2 border-b border-gray-500 w-full outline-none"
                  placeholder="Password"
                />
                <button className="bg-[#DB4444] p-2 rounded-md">
                  Login
                </button>
              </form>
              <p className="flex items-center justify-center">
               Forgot password?
              </p>
            </div>
          </div>
        </div>
  )
}

export default Login
