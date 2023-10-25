import { SetStateAction, useEffect, useRef, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import _, { constant } from 'lodash';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Menu, MenuHandler, MenuList, MenuItem, Button } from '@material-tailwind/react';

import Layout, { LayoutPages } from '@/components/layout';
import { TD, TDR, TH, THR } from '@/components/table';
import AddUpdatePlayer from '@/components/players/add-update-player';
import AddPlayers from '@/components/players/add-players';
import { LoginService } from '@/utils/login';
import { GET_PLAYERS } from '@/graphql/players';
import { GET_TEAM_DROPDOWN } from '@/graphql/teams';
import { GET_LEAGUE_DROPDOWN, ADD_UPDATE_LEAGUE_FP } from '@/graphql/league';
import Image from 'next/image';

export default function PlayersPage() {
  const [isOpen, setIsOpen] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userID, setUserData] = useState('');
  const [getLeaguesData, { data: leaguesQuery }] = useLazyQuery(GET_LEAGUE_DROPDOWN, {
    variables: { userId: userRole !== 'admin' && userRole !== 'player' ? userID : null },
  });
  const [getTeamsData, { data: teamsQuery }] = useLazyQuery(GET_TEAM_DROPDOWN, {
    variables: { userId: userRole !== 'admin' && userRole !== 'player' ? userID : null },
  });
  const [teamId, setTeamId] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [isOpenAction, setIsOpenAction] = useState('');
  const [addUpdatePlayer, setAddUpdatePlayer] = useState(false);
  const [addPlayers, setAddPlayers] = useState(false);
  const [updatePlayer, setUpdatePlayer] = useState(null);
  const [updatedPlayers, setUpdatedPlayers] = useState<any[]>([]);
  const [addUpdatePlayerMutation, { data: updatedData }] = useMutation(ADD_UPDATE_LEAGUE_FP);
  const [rankUpdatePlayerMutation] = useMutation(ADD_UPDATE_LEAGUE_FP);
  const router = useRouter();
  const [refetchAfterRankUpdate, setRefetchAfterRankUpdate] = useState(false);
  const [addInAnotherLeague, setAddInAnotherLeague] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [getPlayersData, { data, error, loading, refetch }] = useLazyQuery(GET_PLAYERS, {
    variables: { userId: userRole !== 'admin' && userRole !== 'player' ? userID : null },
  });

  const getDatafromLocalStorage = async () => {
    const localStorageData = await LoginService.getUser();
    setUserRole(localStorageData?.role);
    setUserData(localStorageData?._id);
  };

  useEffect(() => {
    getDatafromLocalStorage();
  }, []);

  useEffect(() => {
    getPlayersData();
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
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [isOpenAction]);

  // useEffect(() => {
  //   refetch();
  // }, [router.asPath])

  useEffect(() => {
    if (refetchAfterRankUpdate) {
      refetch();
      setRefetchAfterRankUpdate(false);
    }
  }, [refetchAfterRankUpdate]);

  useEffect(() => {
    if (data?.getPlayers?.data) {
      getUpdatedPlayers();
      setShowLoader(false);
    }
  }, [data, teamId, getPlayersData, refetch, leagueId]);

  useEffect(() => {
    if (updatedData?.createOrUpdatePlayer?.code === 200) {
      refetch();
    }
  }, [updatedData]);

  const filteredData = () => {
    let updatedPlayers = data?.getPlayers?.data;
    if (teamId && teamId !== 'Select a team' && teamId?.length > 0) {
      updatedPlayers = data?.getPlayers?.data?.filter(
        (current: { player: { teamId: string; leagueId: string } }) =>
          current?.player?.teamId === teamId && (leagueId === 'Select a league' || leagueId?.length === 0 ? true : current?.player?.leagueId === leagueId),
      );
    } else if (leagueId && leagueId !== 'Select a league' && leagueId?.length > 0) {
      updatedPlayers = data?.getPlayers?.data?.filter(
        (current: { player: { teamId: string; leagueId: string } }) =>
          current?.player?.leagueId === leagueId && (teamId === 'Select a team' || teamId?.length === 0 ? true : current?.player?.teamId === teamId),
      );
    }

    return updatedPlayers;
  };

  const getUpdatedPlayers = () => {
    let updatedPlayers = data?.getPlayers?.data;
    if (teamId && teamId !== 'Select a team' && teamId?.length > 0) {
      updatedPlayers = data?.getPlayers?.data?.filter(
        (current: { player: { teamId: string; leagueId: string } }) =>
          current?.player?.teamId === teamId && (leagueId === 'Select a league' || leagueId?.length === 0 ? true : current?.player?.leagueId === leagueId),
      );
    } else if (leagueId && leagueId !== 'Select a league' && leagueId?.length > 0) {
      updatedPlayers = data?.getPlayers?.data?.filter(
        (current: { player: { teamId: string; leagueId: string } }) =>
          current?.player?.leagueId === leagueId && (teamId === 'Select a team' || teamId?.length === 0 ? true : current?.player?.teamId === teamId),
      );
    }

    updatedPlayers = _.orderBy(updatedPlayers, (item: any) => item.player.rank, ['asc']);
    setUpdatedPlayers(updatedPlayers);
  };

  const onAddUpdatePlayer = () => {
    setUpdatePlayer(null);
    setAddUpdatePlayer(false);
    setAddPlayers(false);
    setAddInAnotherLeague(false);
    refetch();
  };

  const onAddUpdatePlayerClose = () => {
    setUpdatePlayer(null);
    setAddUpdatePlayer(false);
  };

  const onKeyPress = (event: { key: string }) => {
    if (event.key === 'Enter') {
      if (searchKey?.trim()?.length === 0) {
        getUpdatedPlayers();
        return;
      }
      const filterData = filteredData();
      // Convert the query to lowercase for case-insensitive matching
      const query = searchKey.toLowerCase().replace(/\s+/g, '');
      // Filter the array to include only objects that match the query
      const filteredArray = filterData.filter((obj: { firstName: any; lastName: any }) =>
        (obj?.firstName + obj?.lastName).toString().toLowerCase().replace(/\s+/g, '').includes(query),
      );

      setUpdatedPlayers(filteredArray);
    }
  };

  const deletePlayerFunctionality = async (player: any) => {
    await addUpdatePlayerMutation({
      variables: {
        firstName: player?.firstName,
        lastName: player?.lastName,
        shirtNumber: player?.player?.shirtNumber,
        rank: player?.player?.rank,
        leagueId: player?.player?.league?._id || 'UnAssigned',
        teamId: player?.player?.team?._id || 'UnAssigned',
        active: player?.active,
        ondelete: true,
        id: player?._id,
      },
    });
  };

  const onDelete = (player: any) => {
    deletePlayerFunctionality(player);
  };

  const onSearch = (event: { target: { value: SetStateAction<string> } }) => {
    setSearchKey(event.target.value);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    let newPlayers: any[] = [...updatedPlayers];
    const selectedIds: string[] = ['', 'Select a team', 'UnAssigned'];
    const [reorderedRow]: any[] = newPlayers.splice(result.source.index, 1);
    newPlayers.splice(result.destination.index, 0, reorderedRow);
    if (selectedIds.indexOf(teamId) === -1) {
      newPlayers = newPlayers?.map((current: any, index: number) => ({
        ...current,
        player: {
          ...current?.player,
          rank: index + 1,
        },
      }));
      setUpdatedPlayers(newPlayers);
      updateRank(newPlayers);
    } else {
      setUpdatedPlayers(newPlayers);
    }
  };

  const updateRank = async (newPlayers: string | any[]) => {
    let updateNeeded = false;
    for (let i = 0; i < newPlayers?.length; i++) {
      updateNeeded = true;
      setShowLoader(true);
      await rankUpdatePlayerMutation({
        variables: {
          firstName: newPlayers[i]?.firstName,
          lastName: newPlayers[i]?.lastName,
          shirtNumber: newPlayers[i]?.player?.shirtNumber,
          rank: newPlayers[i]?.player?.rank,
          leagueId: newPlayers[i]?.player?.leagueId,
          teamId: newPlayers[i]?.player?.teamId,
          active: newPlayers[i]?.active,
          id: newPlayers[i]?._id,
        },
      });
    }
    if (updateNeeded) {
      setRefetchAfterRankUpdate(true);
    } else {
      setShowLoader(false);
    }
  };

  const selectedIds: string[] = ['', 'Select a team', 'UnAssigned'];

  const toggleMenu = (playerId: SetStateAction<string>) => {
    if (isOpenAction?.length > 0) {
      setIsOpenAction('');
    } else {
      setIsOpenAction(playerId);
    }
  };

  const displayPlayers = updatedPlayers?.filter((current) => (router?.query?.teamId ? current?.player?.teamId === router?.query?.teamId?.toString() : true));
  const updatedDisplayPlayers: any[] = [];
  const allMapping = data?.getPlayers?.playerMapings;
  displayPlayers?.map((currentPlayer) => {
    const findmap = allMapping?.find((curmap: { playerId: any }) => curmap?.playerId === currentPlayer?._id);
    if (findmap?.teamAndLeague?.length > 0) {
      const findPlayer = findmap?.teamAndLeague?.find(
        (curPlayer: { league: { id: any }; team: { id: any } }) =>
          curPlayer?.league?.id === currentPlayer?.player?.leagueId && curPlayer?.team?.id === currentPlayer?.player?.teamId,
      );
      const arrayData = findmap?.teamAndLeague ? [...findmap?.teamAndLeague] : [];
      if (!findPlayer) {
        arrayData.push({
          league: currentPlayer?.player?.league,
          team: currentPlayer?.player?.team,
        });
      }
      updatedDisplayPlayers.push({
        ...currentPlayer,
        mapPlayer: arrayData,
      });
    } else {
      updatedDisplayPlayers.push({
        ...currentPlayer,
        mapPlayer: [
          {
            league: currentPlayer?.player?.league,
            team: currentPlayer?.player?.team,
          },
        ],
      });
    }
  });
  return (
    <Layout title="Players" page={LayoutPages.players}>
      <>
        <div className="w-[calc((w-screen)-(w-1/5)) overflow-hidden flex flex-row-reverse justify-between pb-4 pt-2">
          <div className="flex flex-row-reverse pl-4">
            {userRole == 'admin' && (
              <button
                type="button"
                className="min-w-[188px] transform hover:bg-slate-800 transition duration-300 hover:scale-105 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-md px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
                onClick={() => setAddPlayers(true)}
              >
                <Image src="/icons/import.svg" height="35" width="35" alt="import" />
                Import Players
              </button>
            )}
            <button
              type="button"
              className="min-w-[188px] transform hover:bg-slate-800 transition duration-300 hover:scale-105 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-md px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
              onClick={() => setAddUpdatePlayer(true)}
            >
              <Image src="/icons/plus.svg" height="35" width="35" alt="plus" />
              Add a Player
            </button>
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="relative w-1/3">
            <div className="flex relative m-2 w-full">
              <input
                type="text"
                className=" w-full block py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:placeholder-gray-400 sm:text-sm"
                placeholder="Search"
                onChange={onSearch}
                value={searchKey}
                onKeyDown={onKeyPress}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Image src="/icons/search.svg" height="35" width="35" alt="search" />
              </div>
            </div>
          </div>
          <div className="flex self-center">
            <div
              className="border border-gray-30"
              style={{
                borderRadius: '8px',
                height: '42px',
                color: 'grey',
              }}
            >
              <select
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
                {leaguesQuery?.getLeagues?.code === 200 &&
                  leaguesQuery?.getLeagues?.data?.map((league: any) => (
                    <option key={league?._id} value={league?._id}>
                      {league?.name}
                    </option>
                  ))}
              </select>
            </div>
            <div
              className="border border-gray-30 ml-4"
              style={{
                borderRadius: '8px',
                height: '42px',
                color: 'grey',
              }}
            >
              <select
                name="teamId"
                id="teamId"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                style={{
                  borderRadius: '8px',
                  padding: '8px',
                }}
              >
                <option>Select a team</option>
                <option>UnAssigned</option>
                {teamsQuery?.getTeams?.code === 200 &&
                  teamsQuery?.getTeams?.data?.map((team: any) => {
                    if (team?.league?._id === leagueId) {
                      return (
                        <option key={team?._id} value={team?._id}>
                          {team?.name}
                        </option>
                      );
                    }
                  })}
              </select>
            </div>
          </div>
        </div>
        <div
          style={{
            maxHeight: 'calc(100vh - 270px)',
          }}
          className="w-[calc((w-screen)-(w-1/5)) overflow-scroll"
        >
          <table className="app-table w-full">
            <thead className="w-full sticky top-0 z-20">
              <THR>
                <>
                  <TH />
                  <TH>Name</TH>
                  <TH>Email</TH>
                  <TH>Shirt Number</TH>
                  <TH>Rank</TH>
                  <TH>Team</TH>
                  <TH>League</TH>
                  <TH>Active</TH>
                  <TH>Actions</TH>
                </>
              </THR>
            </thead>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <tbody className="w-full" ref={provided.innerRef} {...provided.droppableProps}>
                    {updatedDisplayPlayers?.map(
                      (player: any, prevIndex: number) =>
                        player?.mapPlayer?.map((current: any, index: number) => (
                          <>
                            {index === 0 && (
                              <Draggable key={player._id} draggableId={player._id} index={prevIndex} isDragDisabled={selectedIds.includes(teamId)}>
                                {(provided, snapshot) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={
                                      snapshot.isDragging
                                        ? 'dragging w-full bg-white odd:bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-100'
                                        : 'w-full bg-white odd:bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-100'
                                    }
                                  >
                                    <TD>
                                      <>
                                        {player?.mapPlayer?.length > 1 ? (
                                          <button className="text-white px-4 py-2 rounded" onClick={() => setIsOpen(isOpen?.length > 0 ? '' : player._id)}>
                                            {isOpen === player._id ? (
                                               <Image src="/icons/checked.svg" height="35" width="35" alt="checked" />
                                            ) : (
                                              <Image src="/icons/right-arrow.svg" height="35" width="35" alt="right-arrow" />
                                            )}
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    </TD>
                                    <TD>
                                      <>
                                        {player?.firstName}&nbsp;{player?.lastName}
                                      </>
                                    </TD>
                                    <TD>{player?.login?.email}</TD>
                                    <TD>{player?.player?.shirtNumber}</TD>
                                    <TD>{player?.player?.rank}</TD>
                                    <TD>{current?.team?.name}</TD>
                                    <TD>{current?.league?.name}</TD>
                                    <TD>{player?.active ? 'Yes' : 'No'}</TD>
                                    <TD>
                                      <div className="flex item-center justify-center">
                                        <div className="relative">
                                          <Menu
                                            handler={() =>
                                              setIsOpenAction(isOpenAction?.length > 0 ? '' : `${player?._id}-${current?.team?.id}-${current?.league?.id}-${index}`)
                                            }
                                            open={`${player?._id}-${current?.team?.id}-${current?.league?.id}-${index}` === isOpenAction}
                                          >
                                            <MenuHandler>
                                              <Button
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                variant="gradient"
                                              >
                                                <Image src="/icons/dots-vertical.svg" height="35" width="35" alt="dots-vertical" />
                                              </Button>
                                            </MenuHandler>
                                            <MenuList>
                                              <MenuItem
                                                onClick={() => {
                                                  setUpdatePlayer({
                                                    ...player,
                                                    player: {
                                                      ...player?.player,
                                                      league: {
                                                        _id: current?.league?.id,
                                                        name: current?.league?.name,
                                                      },
                                                      team: {
                                                        _id: current?.team?.id,
                                                        name: current?.team?.name,
                                                      },
                                                    },
                                                  });
                                                  setAddUpdatePlayer(true);
                                                  setIsOpenAction('');
                                                }}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                              >
                                                Edit
                                              </MenuItem>
                                              {userRole === 'admin' && (
                                                <MenuItem
                                                  onClick={() => {
                                                    onDelete({
                                                      ...player,
                                                      player: {
                                                        ...player?.player,
                                                        league: {
                                                          _id: current?.league?.id,
                                                          name: current?.league?.name,
                                                        },
                                                        team: {
                                                          _id: current?.team?.id,
                                                          name: current?.team?.name,
                                                        },
                                                      },
                                                    });
                                                    setIsOpenAction('');
                                                  }}
                                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                                >
                                                  Delete
                                                </MenuItem>
                                              )}
                                              <MenuItem
                                                onClick={() => {
                                                  setUpdatePlayer({
                                                    ...player,
                                                    player: {
                                                      ...player?.player,
                                                      league: {
                                                        _id: current?.league?.id,
                                                        name: current?.league?.name,
                                                      },
                                                      team: {
                                                        _id: current?.team?.id,
                                                        name: current?.team?.name,
                                                      },
                                                    },
                                                  });
                                                  setAddUpdatePlayer(true);
                                                  setIsOpenAction('');
                                                  setAddInAnotherLeague(true);
                                                }}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                              >
                                                Add In Other League
                                              </MenuItem>
                                            </MenuList>
                                          </Menu>
                                        </div>
                                      </div>
                                    </TD>
                                  </tr>
                                )}
                              </Draggable>
                            )}
                            {isOpen === player._id && index > 0 && (
                              <tr>
                                <TD>
                                  <></>
                                </TD>
                                <TD>
                                  <></>
                                </TD>
                                <TD>{player?.login?.email}</TD>
                                <TD>{player?.player?.shirtNumber}</TD>
                                <TD>{player?.player?.rank}</TD>
                                <TD>{current?.team?.name}</TD>
                                <TD>{current?.league?.name}</TD>
                                <TD>{player?.active ? 'Yes' : 'No'}</TD>
                                <TD>
                                  <div className="flex item-center justify-center">
                                    <div className="relative">
                                      <Menu
                                        handler={() =>
                                          setIsOpenAction(isOpenAction?.length > 0 ? '' : `${player?._id}-${current?.team?.id}-${current?.league?.id}-${index}`)
                                        }
                                        open={`${player?._id}-${current?.team?.id}-${current?.league?.id}-${index}` === isOpenAction}
                                      >
                                        <MenuHandler>
                                          <Button
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            variant="gradient"
                                          >
                                            <Image src="/icons/dots-vertical.svg" height="35" width="35" alt="dots-vertical" />
                                          </Button>
                                        </MenuHandler>
                                        <MenuList>
                                          <MenuItem
                                            onClick={() => {
                                              setUpdatePlayer({
                                                ...player,
                                                player: {
                                                  ...player?.player,
                                                  league: {
                                                    _id: current?.league?.id,
                                                    name: current?.league?.name,
                                                  },
                                                  team: {
                                                    _id: current?.team?.id,
                                                    name: current?.team?.name,
                                                  },
                                                },
                                              });
                                              setAddUpdatePlayer(true);
                                              setIsOpenAction('');
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                          >
                                            Edit
                                          </MenuItem>
                                          {userRole === 'admin' && (
                                            <MenuItem
                                              onClick={() => {
                                                onDelete({
                                                  ...player,
                                                  player: {
                                                    ...player?.player,
                                                    league: {
                                                      _id: current?.league?.id,
                                                      name: current?.league?.name,
                                                    },
                                                    team: {
                                                      _id: current?.team?.id,
                                                      name: current?.team?.name,
                                                    },
                                                  },
                                                });
                                                setIsOpenAction('');
                                              }}
                                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                            >
                                              Delete
                                            </MenuItem>
                                          )}
                                          <MenuItem
                                            onClick={() => {
                                              setUpdatePlayer({
                                                ...player,
                                                player: {
                                                  ...player?.player,
                                                  league: {
                                                    _id: current?.league?.id,
                                                    name: current?.league?.name,
                                                  },
                                                  team: {
                                                    _id: current?.team?.id,
                                                    name: current?.team?.name,
                                                  },
                                                },
                                              });
                                              setAddUpdatePlayer(true);
                                              setIsOpenAction('');
                                              setAddInAnotherLeague(true);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                          >
                                            Add In Other League
                                          </MenuItem>
                                        </MenuList>
                                      </Menu>
                                    </div>
                                  </div>
                                </TD>
                              </tr>
                            )}
                          </>
                        )),
                    )}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </DragDropContext>
          </table>
        </div>
        {addUpdatePlayer && (
          <AddUpdatePlayer
            key={uuidv4()}
            onSuccess={onAddUpdatePlayer}
            player={updatePlayer}
            onClose={onAddUpdatePlayerClose}
            data={data?.getPlayers?.data}
            addInAnotherLeague={addInAnotherLeague}
            userRole={userRole}
            userID={userID}
          />
        )}

        {addPlayers && (
          <AddPlayers onSuccess={onAddUpdatePlayer} onClose={() => setAddPlayers(false)} data={data?.getPlayers?.data} userID={userID} userRole={userRole} />
        )}
        {showLoader && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
            <div className="loader border-4 border-gray-300 border-t-red-500 rounded-full h-10 w-10 animate-spin" />
          </div>
        )}
      </>
    </Layout>
  );
}
