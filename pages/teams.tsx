import { SetStateAction, useEffect, useRef, useState } from 'react';
import Layout, { LayoutPages } from '@/components/layout';
import { Modal } from '@/components/model';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { TD, TDR, TH, THR } from '@/components/table';
import { v4 as uuidv4 } from 'uuid';
import { ITeam } from '@/types/team';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { LoginService } from '@/utils/login';
import { Menu, MenuHandler, MenuList, MenuItem, Button } from '@material-tailwind/react';
import { GET_TEAMS } from '@/graphql/teams';
import { GET_LEAGUES, GET_LEAGUE_DROPDOWN, ADD_UPDATE_LEAGUE_FT } from '@/graphql/league';
import { COACH_DROPDOWN } from '@/graphql/coach';


export default function TeamsPage() {
  const [isOpen, setIsOpen] = useState('');
  const [addUpdateTeam, setAddUpdateTeam] = useState(false);
  const [addInOtherLeague, setAddInOtherLeague] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [isOpenAction, setIsOpenAction] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
  const [allTeamData, setAllTeamData] = useState<any[]>([]);
  const [updateTeam, setUpdateTeam] = useState<any>(null);
  // const { data, error, loading, refetch } = useQuery(TEAMS);
  const router = useRouter();
  const [userID, setUserID] = useState('');
  const [userRole, setUserRole] = useState('');

  const [getTeamsData, { data, error, loading, refetch }] = useLazyQuery(GET_TEAMS, {
    variables: { userId: userRole !== 'admin' && userRole !== 'player' ? userID : null },
  });

  const [getLeaguesData, { data: leaguesData }] = useLazyQuery(GET_LEAGUES, {
    variables: { userId: userRole !== 'admin' && userRole !== 'player' ? userID : null },
  });

  const getDatafromLocalStorage = async () => {
    const localStorageData = await LoginService.getUser();
    setUserRole(localStorageData?.role);
    setUserID(localStorageData?._id);
  };

  useEffect(() => {
    getDatafromLocalStorage();
  }, []);

  useEffect(() => {
    getTeamsData();
    getLeaguesData();
  }, [userID]);

  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const checkIfClickedOutside = (e: { target: any }) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpenAction?.length > 0 && ref.current && !ref.current.contains(e.target)) {
        setIsOpenAction('');
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [isOpenAction]);

  useEffect(() => {
    setAllTeamData(data?.getTeams?.data ?? []);
  }, [data]);

  useEffect(() => {
    setFilteredTeams(filteredData(searchKey));
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
    setAddInOtherLeague(false);
  };

  const filteredData = (key: string) => {
    const filteredTeam = allTeamData.filter((team: any) => {
      const teamName = `${team.name}`.toLocaleLowerCase();
      return teamName.includes(key.toLocaleLowerCase());
    });
    return filteredTeam;
  };

  const onKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      setSearchKey(event.target.value);
      setFilteredTeams(filteredData(event.target.value));
    }
  };

  const getTeamsForDisplay = () => {
    if (searchKey !== '') {
      return filteredTeams;
    }
    return allTeamData;
  };

  const toggleMenu = (teamId: SetStateAction<string>) => {
    if (isOpenAction?.length > 0) {
      setIsOpenAction('');
    } else {
      setIsOpenAction(teamId);
    }
  };

  const toggleTeam = (teamId: SetStateAction<string>) => {
    [];
    window.location.href = `/players?teamId=${teamId}`;
  };

  const displayTeams = getTeamsForDisplay()?.filter((current) => (router?.query?.leagueId ? current?.league?._id === router?.query?.leagueId?.toString() : true));
  const teamsTableData: any[] = [];
  const mappingData = data?.getTeams?.teamWithLeagues;
  displayTeams?.forEach((current) => {
    const teamLeagues = mappingData?.find((cur: { teamId: any }) => cur?.teamId === current?._id)?.leagueIds;
    let teamLeaguesData = [];
    if (teamLeagues?.length > 0) {
      teamLeaguesData = teamLeagues?.map((teamCurrent: any) => {
        const findLeague = leaguesData?.getLeagues?.data?.find((leagueCurrent: { _id: any }) => leagueCurrent?._id === teamCurrent);
        return findLeague;
      });
      const find = teamLeaguesData?.find((curleague: { _id: any }) => curleague?._id === current?.league?._id);
      if (!find) {
        teamLeaguesData.push(current?.league);
      }
    } else {
      teamLeaguesData.push(current?.league);
    }
    teamsTableData.push({ ...current, teamLeaguesData });
  });

  const updatedTeamsTableData: any[] = [];
  teamsTableData?.forEach((cur) => {
    const filterMapping = cur?.teamLeaguesData?.find((curdata: { _id: string }) =>
      router?.query?.leagueId
        ? curdata?._id === router?.query?.leagueId?.toString()
        : leagueId?.length > 0 && leagueId !== 'Select a league'
          ? curdata?._id === leagueId
          : true,
    );

    if (filterMapping) {
      updatedTeamsTableData.push({
        ...cur,
      });
    }
  });

  return (
    <Layout title="Teams" page={LayoutPages.teams}>
      <>
        <div className="w-[calc((w-screen)-(w-1/5)) overflow-hidden flex justify-between pb-4 pt-2">
          <div className="relative w-1/2">
            <div className="flex relative m-2">
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:placeholder-gray-400 sm:text-sm"
                placeholder="Search"
                onKeyDown={onKeyPress}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <img width="35" src="/icons/search.svg" alt="search" />
              </div>
              <div className="ml-4">
                <div className="flex align-self-right">
                  <div
                    className="border border-gray-30 w-[160px]"
                    style={{
                      borderRadius: '8px',
                      height: '42px',
                      color: 'grey',
                    }}
                  >
                    <select
                      className="w-[158px]"
                      name="leagueId"
                      id="leagueId"
                      value={leagueId}
                      onChange={(e) => setLeagueId(e.target.value)}
                      style={{
                        borderRadius: '8px',
                        padding: '8px',
                      }}
                    >
                      <option>Select a league</option>
                      <option>UnAssigned</option>
                      {leaguesData?.getLeagues?.code === 200 &&
                        leaguesData?.getLeagues?.data?.map((league: any) => (
                          <option key={league?._id} value={league?._id}>
                            {league?.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {userRole == 'admin' && (
            <button
              type="button"
              className="transform hover:bg-slate-800 transition duration-300 hover:scale-105 text-white bg-slate-700 dark:divide-gray-700 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-md px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
              onClick={() => setAddUpdateTeam(true)}
            >
              <img src='/icons/plus.svg' width="35" alt='plus' />
              Add a Team
            </button>
          )}
        </div>

        <div
          style={{
            maxHeight: 'calc(100vh - 200px)',
          }}
          className="w-[calc((w-screen)-(w-1/5)) overflow-scroll"
        >
          <table className="app-table w-full">
            <thead className="w-full sticky top-0 z-20">
              <THR>
                <>
                  <TH />
                  <TH>Name</TH>
                  <TH>League</TH>
                  <TH>Coach</TH>
                  <TH>Active</TH>
                  <TH>Actions</TH>
                </>
              </THR>
            </thead>

            <tbody className="w-full">
              {updatedTeamsTableData.map((team: any, index: number) => (
                <>
                  <TDR key={`${team?._id}-${team?.teamLeaguesData && team?.teamLeaguesData[0]?._id}-${index}-${index}`}>
                    <>
                      <TD>
                        {team?.teamLeaguesData?.length > 1 ? (
                          <button
                            className="text-white px-4 py-2 rounded"
                            onClick={() => setIsOpen(isOpen?.length ? '' : `collapsible-${team?._id}-${team?.teamLeaguesData && team?.teamLeaguesData[0]?._id}-${index}`)}
                          >
                            {isOpen === `collapsible-${team?._id}-${team?.teamLeaguesData && team?.teamLeaguesData[0]?._id}-${index}` ? (
                              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                <path d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                              </svg>
                            )}
                          </button>
                        ) : (
                          <></>
                        )}
                      </TD>
                      <TD>{team?.name}</TD>
                      <TD>{team?.teamLeaguesData && team?.teamLeaguesData[0]?.name}</TD>
                      <TD>
                        <>
                          {team?.coach?.firstName}&nbsp;{team?.coach?.lastName}
                        </>
                      </TD>
                      <TD>{team?.active ? 'Yes' : 'No'}</TD>
                      <TD>
                        {userRole === 'admin' ? (
                          <div className="flex item-center justify-center">
                            <div className="relative">
                              <Menu>
                                <MenuHandler>
                                  <Button
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    variant="gradient"
                                  >
                                    <img width="35" src="/icons/dots-verticals.svg" alt="dots" />
                                  </Button>
                                </MenuHandler>
                                <MenuList>
                                  <MenuItem
                                    onClick={() => {
                                      setUpdateTeam({ ...team, league: team?.teamLeaguesData && team?.teamLeaguesData[0] });
                                      setAddUpdateTeam(true);
                                      setIsOpenAction('');
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setUpdateTeam({ ...team, league: team?.teamLeaguesData && team?.teamLeaguesData[0] });
                                      setAddUpdateTeam(true);
                                      setIsOpenAction('');
                                      setAddInOtherLeague(true);
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                  >
                                    Add in other league
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      toggleTeam(team?._id);
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                  >
                                    View Players
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </div>
                          </div>
                        ) : (
                          <div className="flex item-center justify-center">
                            <div className="relative">
                              <button
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => toggleTeam(team?._id)}
                              >
                                <img width="35" src="/icons/sports-man.svg" alt="Sports man" />
                              </button>
                            </div>
                          </div>
                        )}
                      </TD>
                    </>
                  </TDR>
                  {isOpen === `collapsible-${team?._id}-${team?.teamLeaguesData && team?.teamLeaguesData[0]?._id}-${index}` && team?.teamLeaguesData?.length > 1 && team?.teamLeaguesData?.map(
                    (current: any, index: number) =>
                      index > 0 && (
                        <TDR key={`${team?._id}-${current?._id}`}>
                          <>
                            <TD>
                              <></>
                            </TD>
                            <TD />
                            <TD>{current?.name}</TD>
                            <TD>
                              <>
                                {team?.coach?.firstName}&nbsp;{team?.coach?.lastName}
                              </>
                            </TD>
                            <TD>{team?.active ? 'Yes' : 'No'}</TD>
                            <TD>
                              {userRole === 'admin' ? (
                                <div className="flex item-center justify-center">
                                  <div className="relative">
                                    <Menu>
                                      <MenuHandler>
                                        <Button
                                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                          variant="gradient"
                                        >
                                          <img width="35" src="/icons/dots-vertical.svg" alt="dots" />
                                        </Button>
                                      </MenuHandler>
                                      <MenuList>
                                        <MenuItem
                                          onClick={() => {
                                            setUpdateTeam({ ...team, league: team?.teamLeaguesData && team?.teamLeaguesData[0] });
                                            setAddUpdateTeam(true);
                                            setIsOpenAction('');
                                          }}
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                        >
                                          Edit
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            setUpdateTeam({ ...team, league: team?.teamLeaguesData && team?.teamLeaguesData[0] });
                                            setAddUpdateTeam(true);
                                            setIsOpenAction('');
                                            setAddInOtherLeague(true);
                                          }}
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                        >
                                          Add in other league
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            toggleTeam(team?._id);
                                          }}
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                        >
                                          View Players
                                        </MenuItem>
                                      </MenuList>
                                    </Menu>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex item-center justify-center">
                                  <div className="relative">
                                    <button
                                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                      onClick={() => toggleTeam(team?._id)}
                                    >
                                      <img width="35" src="/icons/sports-man.svg" alt="" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </TD>
                          </>
                        </TDR>
                      ),
                  )}
                </>
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
          />
        )}
      </>
    </Layout>
  );
}



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
  addInOtherLeague?: boolean;
}

function AddUpdateTeam(props: AddUpdateTeamProps) {
  const leaguesQuery = useQuery(GET_LEAGUE_DROPDOWN);
  const coachesQuery = useQuery(COACH_DROPDOWN);
  const [name, setName] = useState(props.team?.name || '');
  const [leagueId, setLeagueId] = useState(props.team?.league?._id || '');
  const [coachId, setCoachId] = useState(props.team?.coach?._id || '');
  const [active, setActive] = useState(props?.team ? `${props?.team?.active}` : 'true');

  const [addUpdateTeam, { data, error, loading }] = useMutation(ADD_UPDATE_LEAGUE_FT, {
    variables: {
      name,
      leagueId,
      coachId,
      active: active === 'true',
      changeLeague: props.addInOtherLeague ? false : props?.team?.league?._id !== leagueId || props?.team?.coach?._id !== coachId,
      reamoveCoachId: props?.team?.coach?._id !== coachId ? props?.team?.coach?._id : '',
      reamoveLeagueId: props?.team?.league?._id !== leagueId ? props?.team?.league?._id : '',
      id: props?.team?._id,
    },
  });

  useEffect(() => {
    if (data?.createOrUpdateTeam?.code === 200) {
      props?.onSuccess && props.onSuccess(data?.createOrUpdateTeam?.data?._id);
    }
  }, [data, error]);

  let updatedLeagues: { _id: any }[] = [];
  if (props?.addInOtherLeague) {
    leaguesQuery?.data?.getLeagues?.data?.map((current: { _id: any }) => {
      const find = props?.team?.teamLeaguesData?.find((curTeam: { _id: any }) => curTeam?._id === current?._id);
      if (!find) {
        updatedLeagues.push(current);
      }
    });
  } else {
    updatedLeagues = leaguesQuery?.data?.getLeagues?.data;
  }

  return (
    <>
      <Modal showModal onClose={() => props.onClose && props.onClose()}>
        <form className="form w-100">
          <div className="flex flex-row flex-wrap">
            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="name" className="font-bold">
                Name
              </label>

              <div>
                <input type="text" name="name" id="name" placeholder="Team Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="leagueId" className="font-bold">
                League
              </label>

              <div>
                <select name="leagueId" id="leagueId" value={leagueId} onChange={(e) => setLeagueId(e.target.value)}>
                  <option>Select a league</option>
                  {updatedLeagues?.map((league: any) => (
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
                <select name="coachId" id="coachId" value={coachId} onChange={(e) => setCoachId(e.target.value)}>
                  <option>Select a coach</option>
                  {coachesQuery?.data?.getCoaches?.code === 200 &&
                    coachesQuery?.data?.getCoaches?.data?.map((coach: any) => (
                      <option key={coach?._id} value={coach?._id}>
                        {coach?.firstName}&nbsp;{coach?.lastName}
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
                  <select name="active" id="active" value={active} onChange={(e) => setActive(e.target.value)}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
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
                  props?.data?.forEach((current: { league: any; name: string; coach: { _id: string } }) => {
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
                        isSameCoachError = true;
                      }
                    }
                  });

                  if (isNameError) {
                    toast('Team name is already registred in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else if (isSameCoachError) {
                    toast('This coach is already assign to another team in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else if (props?.addInOtherLeague) {
                    if (alreadyRegister) {
                      toast('This team already register for same league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                    } else {
                      addUpdateTeam();
                    }
                  } else if (coachId?.length === 0) {
                    toast('Please select the league & coach.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else {
                    addUpdateTeam();
                  }
                }}
              >
                {props?.addInOtherLeague ? 'Add In Another League' : 'Update Team'}
              </button>
            ) : (
              <button
                className="transform hover:bg-slate-800 transition duration-300 hover:scale-105 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
                type="button"
                onClick={() => {
                  let isNameError = false;
                  let isSameCoachError = false;
                  props?.data?.forEach((current: { _id: string; league: any; name: string; coach: { _id: string } }) => {
                    if (current?.league?._id === leagueId) {
                      if (current?.name === name && !isNameError) {
                        isNameError = true;
                      }
                      if (!isSameCoachError && current?.coach?._id === coachId) {
                        isSameCoachError = true;
                      }
                    }
                  });
                  if (isNameError) {
                    toast('Team name is already registred in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else if (isSameCoachError) {
                    toast('This coach is already assign to another team in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else if (coachId?.length === 0) {
                    toast('Please select the league & coach.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else {
                    addUpdateTeam();
                  }
                }}
              >
                Add Team
              </button>
            )}

            <button
              onClick={props.onClose}
              className="transform hover:bg-red-600 transition duration-300 hover:scale-105 text-white bg-red-500 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center mr-2 mb-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer />
    </>
  );
}
