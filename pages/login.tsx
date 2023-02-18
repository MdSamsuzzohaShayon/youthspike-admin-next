import { LoginService } from "@/utils/login";
import { gql, useMutation } from "@apollo/client";
import Head from "next/head";
import { useEffect, useState } from "react";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      code
      success
      message
      data {
        token
        user {
          _id
          firstName
          lastName
          role
          login {
            email
          }
          active
        }
      }
    }
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginFunction, { data, error, loading }] = useMutation(LOGIN, {
    variables: {
      email,
      password,
    },
  });

  useEffect(() => {
    LoginService.deleteToken();
    LoginService.deleteUser();

    if (data?.login?.code == 200) {
      const loginData = data?.login?.data;
      LoginService.saveUser({ ...loginData.user, timeStamp: new Date() });
      LoginService.saveToken(loginData.token);
      window.location.href = "/";
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Login | Spikeball Game</title>
      </Head>

      <main
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <div className="container w-full md:w-1/3 border rounded my-6 mx-auto p-4">
          <h1 className="text-3xl text-center font-bold p-2">Login</h1>
          <div className="p-1 w-full">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="p-1 w-full">
            <input
              type="password"
              name="email"
              id="email"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="p-1">
            <button
              className="rounded p-2 bg-blue-900 text-white"
              onClick={() => loginFunction()}
            >
              Login
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
