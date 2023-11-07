import { LoginService } from '@/utils/login';
import { useMutation } from '@apollo/client';
import Router from 'next/router';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { LOGIN_ADMIN } from '@/graphql/admin';

export default function LoginPage() {
  // const cookieStore = cookies();
  // const token = cookieStore.get('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFunction, { data, error, loading }] = useMutation(LOGIN_ADMIN);

  const handleLogin = async () => {
    const { data: resultData } = await loginFunction({
      variables: {
        email,
        password,
      },
    });
    if (resultData?.login?.code === 200) {
      // console.log(resultData.login.data.user);
      document.cookie = `token=${resultData.login.data.token};`;
      document.cookie = `user=${JSON.stringify(resultData.login.data.user)};`;
    } else {
      document.cookie = `token=;`;
      document.cookie = `user=;`;
      toast('Email or Password is Invalid.', { toastId: 'blockuser', hideProgressBar: false, autoClose: 7000, type: 'error' });
    }
  };

  useEffect(() => {
    /**
     * @reset before login
     * @save user and token to local storage
     * @redirect to /leagues page
     */
    /*
    LoginService.deleteToken();
    LoginService.deleteUser();
    if (data?.login?.code === 200) {
      const loginData = data?.login?.data;
      LoginService.saveUser({ ...loginData.user, timeStamp: new Date() });
      LoginService.saveToken(loginData.token);
      toast('Login Sucessfully.', { toastId: 'blockuser', hideProgressBar: false, autoClose: 7000, type: 'success' });
      // window.location.href = '/leagues';
      Router.push('/leagues');
    } else if (data?.login?.code === 404) {
      toast('Email or Password is Invalid.', { toastId: 'blockuser', hideProgressBar: false, autoClose: 7000, type: 'error' });
    }
    */
  }, [data]);

  const onKeyPress = (event: React.KeyboardEvent) => {
    if (event?.key === 'Enter') {
      handleLogin();
    }
  };
  return (
    <>
      <Head>
        <title>Login | Spikeball Game</title>
      </Head>

      <main
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <div className="flex flex-col h-screen justify-center items-center">
          <div className="w-1/3 border rounded p-4 shadow-xl bg-[#F6F8FA]">
            <h1 className="text-3xl text-center font-bold p-2">Login</h1>
            <div className="p-4 w-full">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={onKeyPress}
              />
            </div>

            <div className="px-4 py-2 w-full">
              <input
                type="password"
                name="email"
                id="email"
                placeholder="Password"
                className="w-full p-2 border rounded"
                value={password}
                onKeyDown={onKeyPress}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className=" p-1 text-center">
              <button
                className="w-1/3 rounded p-2 bg-slate-500 hover:bg-slate-500 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-white mt-4 font-bold transform transition duration-300 hover:scale-110"
                onClick={() => handleLogin()}
                type="button"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </main>

      <ToastContainer />
    </>
  );
}