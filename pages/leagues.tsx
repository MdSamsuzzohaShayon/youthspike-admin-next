import { SetStateAction, useEffect, useRef, useState, } from "react";
import Layout, { LayoutPages } from "@/components/layout";
import { Modal } from "@/components/model";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { TD, TDR, TH, THR } from "@/components/table";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { LoginService } from "@/utils/login";

const LEAGUES = gql`
  query GetLeagues(
    $userId: String
  ) {
    getLeagues(
      userId: $userId
    ) {
      code
      success
      message
      data {
        _id
        name
        startDate
        endDate
        active
        playerLimit
      }
    }
  }
`;

export default function LeaguesPage() {
  const [addUpdateLeague, setAddUpdateLeague] = useState(false);
  const [updateLeague, setUpdateLeague] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [filteredLeagues, setFilteredLeagues] = useState<any[]>([]);
  const [allLeaguesData, setAllLeaguesData] = useState<any[]>([]);
  const [isOpenAction, setIsOpenAction] = useState('');
  const [userID, setUserData] = useState('');
  const [userRole, setUserRole] = useState('');


  const [getLeaguesData, { data, error, loading }] = useLazyQuery(LEAGUES,
    {
      variables: { userId: userRole !== 'admin' && userRole !== 'player' ? userID : null },
    }
  );

  const getDatafromLocalStorage = async () => {
    const localStorageData = await LoginService.getUser();
    setUserRole(localStorageData?.role);
    setUserData(localStorageData?._id);
  }

  useEffect(() => {
    getDatafromLocalStorage();
  }, []);

  useEffect(() => {
    getLeaguesData()
  }, [userID]);

  const router = useRouter();
  const onAddUpdateLeague = () => {
    setUpdateLeague(null);
    setAddUpdateLeague(false);
    getLeaguesData();
  };

  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const checkIfClickedOutside = (e: { target: any; }) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpenAction?.length > 0 && ref.current && !ref.current.contains(e.target)) {
        setIsOpenAction('')
      }
    }

    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [isOpenAction])
  useEffect(() => {
    getLeaguesData();
  }, [router.asPath])

  useEffect(() => {
    setAllLeaguesData(data?.getLeagues?.data ?? []);
  }, [data]);

  const onAddUpdateLeagueClose = () => {
    setUpdateLeague(null);
    setAddUpdateLeague(false);
  };


  const filteredData = (key: string) => {
    const filteredLeague = allLeaguesData.filter((league: any) => {
      const leagueName = `${league.name}`.toLocaleLowerCase();
      return leagueName.includes(key.toLocaleLowerCase());
    });
    return filteredLeague;
  }

  const onKeyPress = (event: any) => {
    if (event.key === "Enter") {
      setSearchKey(event.target.value)
      setFilteredLeagues(filteredData(event.target.value));
    }
  }

  const toggleMenu = (teamId: SetStateAction<string>) => {
    if (isOpenAction?.length > 0) {
      setIsOpenAction('');
    } else {
      setIsOpenAction(teamId);
    }
  };

  const getLeaguesForDisplay = () => {
    if (searchKey !== "") {
      return filteredLeagues;
    } else {
      return allLeaguesData;
    }
  }

  return (
    <Layout title="Leagues" page={LayoutPages.leagues}>
      <>
        <div className="w-[calc((w-screen)-(w-1/5)) overflow-hidden flex justify-between pb-4 pt-2">
          <div className="relative w-1/2">
            <div className="relative  m-2">
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:placeholder-gray-400 sm:text-sm"
                placeholder="Search"
                onKeyDown={onKeyPress}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse pl-4">
            <button type="button" className="transform hover:bg-slate-800 transition duration-300 hover:scale-110 text-white bg-slate-700 dark:divide-gray-700 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-md px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
              onClick={() => setAddUpdateLeague(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="ionicon w-7 h-7 mr-2" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" /><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160M336 256H176" /></svg>
              Add a League
            </button>
          </div>
        </div>

        <div style={{
          maxHeight: 'calc(100vh - 200px)'
        }} className="w-[calc((w-screen)-(w-1/5)) overflow-scroll">
          <table className="app-table w-full">
            <thead className="w-full sticky top-0 z-20">
              <THR>
                <>
                  <TH>Name</TH>
                  <TH>Start Date</TH>
                  <TH>End Date</TH>
                  <TH>Player Limit</TH>
                  <TH>Active</TH>
                  <TH>Actions</TH>
                </>
              </THR>
            </thead>

            <tbody className="w-full">
              {getLeaguesForDisplay().map((league: any) => (
                <TDR key={league?._id}>
                  <>
                    <TD>{league?.name}</TD>
                    <TD>{new Date(league?.startDate).toDateString()}</TD>
                    <TD>{new Date(league?.endDate).toDateString()}</TD>
                    <TD>{league?.playerLimit}</TD>
                    <TD>{league?.active ? "Yes" : "No"}</TD>
                    <TD>
                      <div className="flex item-center justify-center">
                        <div className="relative">
                          <button
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => toggleMenu(league?._id)}
                          >
                            <svg className="w-6 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                          </button>
                          {(isOpenAction === league?._id) && (
                            <div ref={ref} className="z-20 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <a onClick={() => {
                                  setUpdateLeague(league);
                                  setAddUpdateLeague(true);
                                  setIsOpenAction('');
                                }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" role="menuitem">Edit</a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TD>
                  </>
                </TDR>
              ))}
            </tbody>
          </table>
        </div>

        {addUpdateLeague && (
          <AddUpdateLeague
            onSuccess={onAddUpdateLeague}
            league={updateLeague}
            onClose={onAddUpdateLeagueClose}
          ></AddUpdateLeague>
        )}
      </>
    </Layout>
  );
}

const ADD_UPDATE_LEAGUE = gql`
  mutation CreateOrUpdateLeague(
    $name: String!
    $startDate: DateTime!
    $endDate: DateTime!
    $playerLimit: Int!
    $active: Boolean!
    $id: String
  ) {
    createOrUpdateLeague(
      name: $name
      startDate: $startDate
      endDate: $endDate
      playerLimit: $playerLimit
      active: $active
      id: $id
    ) {
      code
      success
      message
      data {
        _id
        name
        startDate
        endDate
        active
        playerLimit
      }
    }
  }
`;

interface AddUpdateLeagueOnSuccess {
  (id: string): void;
}

interface AddUpdateLeagueOnClose {
  (): void;
}

interface AddUpdateLeagueProps {
  league?: any;
  onSuccess?: AddUpdateLeagueOnSuccess;
  onClose?: AddUpdateLeagueOnClose;
}

function AddUpdateLeague(props: AddUpdateLeagueProps) {
  const date = format(new Date(), "yyy-MM-dd");
  const [name, setName] = useState(props?.league?.name || "");

  const [startDate, setStartDate] = useState(
    props?.league
      ? format(new Date(props?.league.startDate), "yyy-MM-dd")
      : date
  );

  const [endDate, setEndDate] = useState(
    props?.league ? format(new Date(props?.league.endDate), "yyy-MM-dd") : date
  );

  const [playerLimit, setPlayerLimit] = useState(
    props?.league ? props?.league?.playerLimit : 2
  );

  const [active, setActive] = useState(
    props?.league ? props?.league?.active + "" : "true"
  );

  const [addUpdateLeague, { data, error, loading }] = useMutation(
    ADD_UPDATE_LEAGUE,
    {
      variables: {
        name,
        startDate,
        endDate,
        playerLimit,
        active: active === "true" ? true : false,
        id: props?.league?._id,
      },
    }
  );

  useEffect(() => {

    if (data?.createOrUpdateLeague?.code === 200) {
      props?.onSuccess &&
        props.onSuccess(data?.createOrUpdateLeague?.data?._id);
    }
  }, [data, error]);

  return (
    <Modal showModal={true} onClose={() => props.onClose && props.onClose()}>
      <form className="form w-100">
        <div className="flex flex-row flex-wrap">
          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="name" className="font-bold">
              Name
            </label>

            <div>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="League Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="startDate" className="font-bold">
              Start Date
            </label>

            <div>
              <input
                type="date"
                name="startDate"
                id="startDate"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setEndDate(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="endDate" className="font-bold">
              End Date
            </label>

            <div>
              <input
                type="date"
                name="endDate"
                id="endDate"
                placeholder="End Date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="playerLimit" className="font-bold">
              Player Limit
            </label>

            <div>
              <input
                type="number"
                name="playerLimit"
                id="playerLimit"
                min={2}
                placeholder="Player Limit"
                value={playerLimit}
                onChange={(e) => setPlayerLimit(Number(e.target.value))}
              />
            </div>
          </div>

          {props?.league && (
            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="playerLimit" className="font-bold">
                Active
              </label>

              <div>
                <select
                  name="active"
                  id="active"
                  value={active}
                  onChange={(e) => setActive(e.target.value)}
                >
                  <option value={"true"}>Yes</option>
                  <option value={"false"}>No</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <hr />

        <div className="my-2">
          {props?.league ? (
            <button
              className="transform hover:bg-slate-800 transition duration-300 hover:scale-95 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
              type="button"
              onClick={() => addUpdateLeague()}
            >
              Update League
            </button>
          ) : (
            <button
              className="transform hover:bg-slate-800 transition duration-300 hover:scale-95 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
              type="button"
              onClick={() => addUpdateLeague()}
            >
              Add League
            </button>
          )}

          <button className="transform hover:bg-red-600 transition duration-300 hover:scale-95 text-white bg-red-500 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center mr-2 mb-2">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
