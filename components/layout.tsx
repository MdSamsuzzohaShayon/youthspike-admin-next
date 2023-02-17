import Head from "next/head";
import { useContext, useEffect } from "react";
import { UserContext } from "@/config/auth";
import Link from "next/link";
import { LoginService } from "@/utils/login";


export enum LayoutPages {
  "leagues" = "leagues",
  "teams" = "teams",
  "coaches" = "coaches",
  "players" = "players",
  "matches" = "matches",
}

export interface LayoutProps {
  title?: string;
  page?: LayoutPages;
  children?: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  let user: any = useContext(UserContext);

  useEffect(() => {
    try {
      user = LoginService.getUser();
      const timeStamp = new Date(user?.timeStamp).getTime();
      const currentTime = new Date().getTime();
      const dateDiffInMinutes = (currentTime - timeStamp) / (60 * 1000);
      if (!user || dateDiffInMinutes > 720) {
        window.location.href = "/login";
      }
    } catch (err) {
      if (!user) window.location.href = "/login";
    }
  });


  return (
    <>
      <Head>
        {props.title ? (
          <title>{`${props.title} | Admin | Spikeball Game`}</title>
        ) : (
          <title>Admin | Spikeball Game</title>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <div
          className="flex flex-row overflow-hidden bg-blue-200 p-2 items-center justify-between"
          style={{ height: "10%" }}
        >
          <h1 className="text-3xl text-center font-bold p-2">
            Spikeball Admin
          </h1>

          {user && (
            <div>
              <b>
                Admin
                {/* {user?.firstName}&nbsp;{user?.lastName} */}
              </b>
            </div>
          )}
        </div>

        <div className="flex flex-row overflow-auto" style={{ height: "90%" }}>
          <div className="w-1/5 bg-blue-100">
            <Link href="/leagues">
              <button
                className={`text-xl text-left p-2 bg-blue-900 hover:bg-blue-800 text-white w-full font-bold ${props?.page == LayoutPages.leagues ? "bg-blue-700" : ""
                  }`}
              >
                Leagues
              </button>
            </Link>

            <Link href="/teams">
              <button
                className={`text-xl text-left p-2 bg-blue-900 hover:bg-blue-800 text-white w-full font-bold ${props?.page == LayoutPages.teams ? "bg-blue-700" : ""
                  }`}
              >
                Teams
              </button>
            </Link>

            <Link href="/coaches">
              <button
                className={`text-xl text-left p-2 bg-blue-900 hover:bg-blue-800 text-white w-full font-bold ${props?.page == LayoutPages.coaches ? "bg-blue-700" : ""
                  }`}
              >
                Coaches
              </button>
            </Link>

            <Link href="/players">
              <button
                className={`text-xl text-left p-2 bg-blue-900 hover:bg-blue-800 text-white w-full font-bold ${props?.page == LayoutPages.players ? "bg-blue-700" : ""
                  }`}
              >
                Players
              </button>
            </Link>

            <Link href={"/matches"}>
              <button
                className={`text-xl text-left p-2 bg-blue-900 hover:bg-blue-800 text-white w-full font-bold ${props?.page == LayoutPages.matches ? "bg-blue-700" : ""
                  }`}
              >
                Matches
              </button>
            </Link>
          </div>

          <div className="w-4/5">
            <div
              className="w-full p-2 overflow-auto"
              style={{ height: "100%" }}
            >
              {props.children}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
