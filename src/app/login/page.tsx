'use client'

import { useMutation } from '@apollo/client';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { LOGIN_ADMIN, REGISTER_DIRECTOR } from '@/graphql/admin';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const router = useRouter();

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
      document.cookie = `token=${resultData.login.data.token};`;
      document.cookie = `user=${JSON.stringify(resultData.login.data.user)};`;
      router.push('/');
    } else {
      document.cookie = `token=;`;
      document.cookie = `user=;`;
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

      <main className='flex flex-col w-full justify-center items-center' style={{minHeight: '80vh'}} >
        <h1 className="text-3xl text-center font-bold p-2">Login</h1>
        {/* <p>(Director) email: predrag@gmail.com password: Test1234</p> */}
        <div className="p-4 w-full">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email Address"
            className="w-full p-2 border bg-gray-700 text-gray-100 rounded outline-none"
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
            className="w-full p-2 border bg-gray-700 text-gray-100 rounded outline-none"
            value={password}
            onKeyDown={onKeyPress}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className=" p-1 text-center">
          <button
            className="rounded p-2 px-8 outline-none bg-slate-500 hover:bg-slate-500 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-white mt-4 font-bold transform transition duration-300 hover:scale-110"
            onClick={() => handleLogin()}
            type="button"
          >
            Login
          </button>
        </div>
      </main>
    </>
  );
}


export default LoginPage;