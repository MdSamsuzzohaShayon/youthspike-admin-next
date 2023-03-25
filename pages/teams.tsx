import { SetStateAction, useEffect, useRef, useState } from "react";
import Layout, { LayoutPages } from "@/components/layout";
import { Modal } from "@/components/model";
import { gql, useMutation, useQuery } from "@apollo/client";
import { TD, TDR, TH, THR } from "@/components/table";
import { v4 as uuidv4 } from 'uuid';
import { ITeam } from "@/types/team";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useRouter } from "next/router";

const TEAMS = gql`
  query GetTeams {
    getTeams {
      code
      success
      data {
        _id
        name
        active
        coach {
          _id
          firstName
          lastName
          login {
            email
          }
        }
        league {
          _id
          name
        }
      }
    }
  }
`;

export default function TeamsPage() {
  const [addUpdateTeam, setAddUpdateTeam] = useState(false);
  const [addInOtherLeague, setAddInOtherLeague] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [isOpenAction, setIsOpenAction] = useState('');
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
  const [allTeamData, setAllTeamData] = useState<any[]>([]);
  const [updateTeam, setUpdateTeam] = useState<any>(null);
  const { data, error, loading, refetch } = useQuery(TEAMS);
  const router = useRouter();

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
    refetch();
  }, [router.asPath]);


  useEffect(() => {
    setAllTeamData(data?.getTeams?.data ?? []);
  }, [data]);

  useEffect(() => {
    setFilteredTeams(filteredData(searchKey))
  }, [allTeamData]);


  const onAddUpdateTeam = () => {
    setUpdateTeam(null);
    setAddUpdateTeam(false);
    setAddInOtherLeague(false);
    refetch();
  };

  const onAddUpdateTeamClose = () => {
    setUpdateTeam(null);
    setAddUpdateTeam(false);
  };

  const filteredData = (key: string) => {
    const filteredTeam = allTeamData.filter((team: any) => {
      const teamName = `${team.name}`.toLocaleLowerCase();
      return teamName.includes(key.toLocaleLowerCase());
    });
    return filteredTeam;
  }

  const onKeyPress = (event: any) => {
    if (event.key === "Enter") {
      setSearchKey(event.target.value)
      setFilteredTeams(filteredData(event.target.value));
    }
  }

  const getTeamsForDisplay = () => {
    if (searchKey !== "") {
      return filteredTeams;
    } else {
      return allTeamData;
    }
  }


  const toggleMenu = (teamId: SetStateAction<string>) => {
    if (isOpenAction?.length > 0) {
      setIsOpenAction('');
    } else {
      setIsOpenAction(teamId);
    }
  };

  return (
    <Layout title="Teams" page={LayoutPages.teams}>
      <>
        <div className="w-[calc((w-screen)-(w-1/5)) overflow-hidden flex justify-between pb-4 pt-2">
          <div className="relative w-1/2">
            <div className="relative m-2">
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
          <button type="button" className="transform hover:bg-slate-800 transition duration-300 hover:scale-105 text-white bg-slate-700 dark:divide-gray-700 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-md px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
            onClick={() => setAddUpdateTeam(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="ionicon w-7 h-7 mr-2" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" /><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160M336 256H176" /></svg>
            Add a Team
          </button>
        </div>

        <div style={{
          maxHeight: 'calc(100vh - 200px)'
        }} className="w-[calc((w-screen)-(w-1/5)) overflow-scroll ">
          <table className="app-table w-full">
            <thead className="w-full sticky top-0 z-20">
              <THR>
                <>
                  <TH>Name</TH>
                  <TH>League</TH>
                  <TH>Coach</TH>
                  <TH>Active</TH>
                  <TH>Actions</TH>
                </>
              </THR>
            </thead>

            <tbody className="w-full">
              {getTeamsForDisplay().map((team: any) => (
                <TDR key={team?._id}>
                  <>
                    <TD>{team?.name}</TD>
                    <TD>{team?.league?.name}</TD>
                    <TD>
                      <>
                        {team?.coach?.firstName}&nbsp;{team?.coach?.lastName}
                      </>
                    </TD>
                    <TD>{team?.active ? "Yes" : "No"}</TD>
                    <TD>
                      <div className="flex item-center justify-center">
                        <div className="relative">
                          <button
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => toggleMenu(team?._id)}
                          >
                            <svg className="w-6 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                          </button>
                          {(isOpenAction === team?._id) && (
                            <div ref={ref} className="z-20 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <a onClick={() => {
                                  setUpdateTeam(team);
                                  setAddUpdateTeam(true);
                                  setIsOpenAction('');
                                }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" role="menuitem">Edit</a>
                                <a onClick={() => {
                                  setUpdateTeam(team);
                                  setAddUpdateTeam(true);
                                  setIsOpenAction('');
                                  setAddInOtherLeague(true);
                                }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" role="menuitem">Add in other league</a>
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

        {addUpdateTeam && (
          <AddUpdateTeam
            key={uuidv4()}
            onClose={onAddUpdateTeamClose}
            onSuccess={onAddUpdateTeam}
            team={updateTeam}
            data={data?.getTeams?.data}
            addInOtherLeague={addInOtherLeague}
          ></AddUpdateTeam>
        )}
      </>
    </Layout>
  );
}

const LEAGUE_DROPDOWN = gql`
  query GetLeagues {
    getLeagues {
      code
      success
      message
      data {
        _id
        name
      }
    }
  }
`;

const COACH_DROPDOWN = gql`
  query GetCoaches {
    getCoaches {
      code
      success
      message
      data {
        _id
        firstName
        lastName
      }
    }
  }
`;

const ADD_UPDATE_LEAGUE = gql`
  mutation CreateOrUpdateTeam(
    $name: String!
    $active: Boolean!
    $coachId: String!
    $leagueId: String!
    $id: String
  ) {
    createOrUpdateTeam(
      name: $name
      active: $active
      coachId: $coachId
      leagueId: $leagueId
      id: $id
    ) {
      code
      success
      message
      data {
        _id
      }
    }
  }
`;

interface AddUpdateTeamOnSuccess {
  (id: string): void;
}

interface AddUpdateTeamOnClose {
  (): void;
}

interface AddUpdateTeamProps {
  team?: ITeam;
  onSuccess?: AddUpdateTeamOnSuccess;
  onClose?: AddUpdateTeamOnClose;
  data?: any;
  addInOtherLeague?: Boolean;
}

function AddUpdateTeam(props: AddUpdateTeamProps) {
  const leaguesQuery = useQuery(LEAGUE_DROPDOWN);
  const coachesQuery = useQuery(COACH_DROPDOWN);
  const [name, setName] = useState(props.team?.name || "");
  const [leagueId, setLeagueId] = useState(props.team?.league?._id || "");
  const [coachId, setCoachId] = useState(props.team?.coach?._id || "");
  const [active, setActive] = useState(
    props?.team ? props?.team?.active + "" : "true"
  );

  const [addUpdateTeam, { data, error, loading }] = useMutation(
    ADD_UPDATE_LEAGUE,
    {
      variables: {
        name,
        leagueId,
        coachId,
        active: active === "true" ? true : false,
        id: props.addInOtherLeague ? null : props?.team?._id,
      },
    }
  );

  useEffect(() => {

    if (data?.createOrUpdateTeam?.code === 200) {
      props?.onSuccess && props.onSuccess(data?.createOrUpdateTeam?.data?._id);
    }
  }, [data, error]);

  return (
    <>
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
                  placeholder="Team Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="leagueId" className="font-bold">
                League
              </label>

              <div>
                <select
                  name="leagueId"
                  id="leagueId"
                  value={leagueId}
                  onChange={(e) => setLeagueId(e.target.value)}
                >
                  <option>Select a league</option>
                  {leaguesQuery?.data?.getLeagues?.code === 200 &&
                    leaguesQuery?.data?.getLeagues?.data?.map((league: any) => (
                      <option key={league?._id} value={league?._id}>
                        {league?.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="coachId" className="font-bold">
                Coach
              </label>

              <div>
                <select
                  name="coachId"
                  id="coachId"
                  value={coachId}
                  onChange={(e) => setCoachId(e.target.value)}
                >
                  <option>Select a coach</option>
                  {coachesQuery?.data?.getCoaches?.code === 200 &&
                    coachesQuery?.data?.getCoaches?.data?.map((coach: any) => (
                      <option key={coach?._id} value={coach?._id}>
                        <>
                          {coach?.firstName}&nbsp;{coach?.lastName}
                        </>
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {props?.team && (
              <div className="w-full md:w-1/2 lg:w-1/3 my-2">
                <label htmlFor="active" className="font-bold">
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
            {props?.team ? (
              <button
                className="transform hover:bg-slate-800 transition duration-300 hover:scale-105 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
                type="button"
                onClick={() => {
                  let isNameError = false;
                  let isSameCoachError = false;
                  let alreadyRegister = false;
                  props?.data?.forEach((current: {
                    league: any; name: string; coach: { _id: string; };
                  }) => {
                    if (props?.addInOtherLeague) {
                      if (!alreadyRegister && current?.league?._id === leagueId && current?.name === props?.team?.name) {
                        alreadyRegister = true;
                      }
                    }
                    if (current?.league?._id === leagueId) {
                      if (name !== props?.team?.name && current?.name === name && !isNameError) {
                        isNameError = true;
                      }
                      if (coachId !== props?.team?.coach?._id && !isSameCoachError && current?.coach?._id === coachId) {
                        isSameCoachError = true
                      }
                    }
                  });

                  if (isNameError) {
                    toast('Team name is already registred in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else if (isSameCoachError) {
                    toast('This coach is already assign to another team in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else {
                    if (props?.addInOtherLeague) {
                      if (alreadyRegister) {
                        toast('This team already register for same league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                      } else {
                        addUpdateTeam();
                      }
                    } else {
                      addUpdateTeam();
                    }
                  }
                }}
              >
                Update Team
              </button>
            ) : (
              <button
                className="transform hover:bg-slate-800 transition duration-300 hover:scale-105 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
                type="button"
                onClick={() => {
                  let isNameError = false;
                  let isSameCoachError = false;
                  props?.data?.forEach((current: {
                    _id: string; league: any; name: string; coach: { _id: string; };
                  }) => {
                    if (current?.league?._id === leagueId) {

                      if (current?.name === name && !isNameError) {
                        isNameError = true;
                      }
                      if (!isSameCoachError && current?.coach?._id === coachId) {
                        isSameCoachError = true
                      }
                    }
                  })
                  if (isNameError) {
                    toast('Team name is already registred in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else if (isSameCoachError) {
                    toast('This coach is already assign to another team in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else {
                    addUpdateTeam();
                  }
                }}
              >
                Add Team
              </button>
            )}

            <button className="transform hover:bg-red-600 transition duration-300 hover:scale-105 text-white bg-red-500 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center mr-2 mb-2">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer />
    </>
  );
}
