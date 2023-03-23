import { SetStateAction, useEffect, useRef, useState } from "react";
import Layout, { LayoutPages } from "@/components/layout";
import { gql, useMutation, useQuery } from "@apollo/client";
import { TD, TDR, TH, THR } from "@/components/table";
import AddUpdatePlayer from "@/components/players/add-update-player";
import AddPlayers from "@/components/players/add-players";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router";
import _, { constant } from 'lodash';
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

const LEAGUES = gql`
  query GetPlayers {
    getPlayers {
      code
      success
      message
      data {
        _id
        firstName
        lastName
        role

        player {
          shirtNumber
          rank
          teamId
          leagueId

          league {
            _id
            name
          }

          team {
            _id
            name
          }
        }

        login {
          email
        }

        active
      }
    }
  }
`;

const TEAM_DROPDOWN = gql`
  query GetTeams {
    getTeams {
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

const ADD_UPDATE_LEAGUE = gql`
  mutation CreateOrUpdatePlayer(
    $firstName: String!
    $lastName: String!
    $shirtNumber: Int!
    $rank: Int!
    $leagueId: String!
    $teamId: String!
    $active: Boolean!
    $email: String
    $id: String
  ) {
    createOrUpdatePlayer(
      firstName: $firstName
      lastName: $lastName
      shirtNumber: $shirtNumber
      rank: $rank
      leagueId: $leagueId
      teamId: $teamId
      active: $active
      email: $email
      id: $id
    ) {
      code
      data {
        _id
      }
    }
  }
`;

export default function PlayersPage() {

  const leaguesQuery = useQuery(LEAGUE_DROPDOWN);
  const teamsQuery = useQuery(TEAM_DROPDOWN);
  const [teamId, setTeamId] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [isOpenAction, setIsOpenAction] = useState('');
  const [addUpdatePlayer, setAddUpdatePlayer] = useState(false);
  const [addPlayers, setAddPlayers] = useState(false);
  const [updatePlayer, setUpdatePlayer] = useState(null);
  const { data, refetch } = useQuery(LEAGUES);
  const [updatedPlayers, setUpdatedPlayers] = useState<any[]>([]);
  const [addUpdatePlayerMutation, { data: updatedData }] = useMutation(ADD_UPDATE_LEAGUE);
  const [rankUpdatePlayerMutation] = useMutation(ADD_UPDATE_LEAGUE);
  const router = useRouter();
  const [refetchAfterRankUpdate, setRefetchAfterRankUpdate] = useState(false);

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
  }, [router.asPath])

  useEffect(() => {
    if (refetchAfterRankUpdate) {
      refetch();
      setRefetchAfterRankUpdate(false);
    }
  }, [refetchAfterRankUpdate])

  useEffect(() => {
    if (data?.getPlayers?.data) {
      getUpdatedPlayers();
    }
  }, [data, teamId, refetch, leagueId])

  useEffect(() => {
    if (updatedData?.createOrUpdatePlayer?.code === 200) {
      refetch();
    }
  }, [updatedData])

  const filteredData = () => {
    let updatedPlayers = data?.getPlayers?.data;
    if (teamId && (teamId !== 'Select a team' && teamId?.length > 0)) {
      updatedPlayers = data?.getPlayers?.data?.filter((current: { player: { teamId: string; leagueId: string; }; }) => current?.player?.teamId === teamId && ((leagueId === 'Select a league' || leagueId?.length === 0) ? true : current?.player?.leagueId === leagueId));
    } else {
      if (leagueId && (leagueId !== 'Select a league' && leagueId?.length > 0)) {
        updatedPlayers = data?.getPlayers?.data?.filter((current: { player: { teamId: string; leagueId: string; }; }) => current?.player?.leagueId === leagueId && ((teamId === 'Select a team' || teamId?.length === 0) ? true : current?.player?.teamId === teamId));
      }
    }

    return updatedPlayers;
  }

  const getUpdatedPlayers = () => {
    let updatedPlayers = data?.getPlayers?.data;
    console.log({ teamId, leagueId })
    if (teamId && (teamId !== 'Select a team' && teamId?.length > 0)) {
      updatedPlayers = data?.getPlayers?.data?.filter((current: { player: { teamId: string; leagueId: string; }; }) => current?.player?.teamId === teamId && ((leagueId === 'Select a league' || leagueId?.length === 0) ? true : current?.player?.leagueId === leagueId));
    } else {
      if (leagueId && (leagueId !== 'Select a league' && leagueId?.length > 0)) {
        updatedPlayers = data?.getPlayers?.data?.filter((current: { player: { teamId: string; leagueId: string; }; }) => current?.player?.leagueId === leagueId && ((teamId === 'Select a team' || teamId?.length === 0) ? true : current?.player?.teamId === teamId));
      }
    }

    updatedPlayers = _.orderBy(updatedPlayers, (item: any) => item.player.rank, ["asc"]);
    setUpdatedPlayers(updatedPlayers)

  }

  const onAddUpdatePlayer = () => {
    setUpdatePlayer(null);
    setAddUpdatePlayer(false);
    setAddPlayers(false);
    refetch()
  };

  const onAddUpdatePlayerClose = () => {
    setUpdatePlayer(null);
    setAddUpdatePlayer(false);
  };

  const onKeyPress = (event: { key: string; }) => {
    if (event.key === "Enter") {
      if (searchKey?.trim()?.length === 0) {
        getUpdatedPlayers();
        return
      }
      const filterData = filteredData();
      // Convert the query to lowercase for case-insensitive matching
      let query = searchKey.toLowerCase().replace(/\s+/g, "");
      // Filter the array to include only objects that match the query
      const filteredArray = filterData.filter((obj: { firstName: any; lastName: any; }) =>
        (obj?.firstName + obj?.lastName).toString().toLowerCase().replace(/\s+/g, "").includes(query)

      );

      setUpdatedPlayers(filteredArray);
    }
  }

  const deletePlayerFunctionality = async (player: any) => {
    await addUpdatePlayerMutation({
      variables: {
        firstName: player?.firstName,
        lastName: player?.lastName,
        shirtNumber: player?.player?.shirtNumber,
        rank: player?.player?.rank,
        leagueId: player?.player?.leagueId,
        teamId: 'UnAssigned',
        active: player?.active,
        id: player?._id,
      },
    })
  }

  const onDelete = (player: any, index: number) => {

    let newPlayers: any[] = [...updatedPlayers];
    const previesIndexPlayer = newPlayers[index];
    // Remove the object at the specified index
    newPlayers.splice(index, 1);

    // Insert the new object at the same index
    newPlayers.splice(index, 0, {
      ...previesIndexPlayer, player: {
        ...previesIndexPlayer?.player,
        teamId: 'UnAssigned',
      }
    });
    const selectedIds: String[] = ['', 'Select a team', 'UnAssigned'];

    if (selectedIds.indexOf(teamId) === -1) {
      let isTraversed = false;
      newPlayers = newPlayers?.map((current: any, indexKey: number) => {
        if (!isTraversed) {
          isTraversed = index === indexKey;
        }
        if (index === indexKey) {
          return { ...current };
        }
        return {
          ...current,
          player: {
            ...current?.player,
            rank: isTraversed ? indexKey : indexKey + 1,
          }
        }
      });
      setUpdatedPlayers(newPlayers);
      updateRank(newPlayers);
    } else {
      setUpdatedPlayers(newPlayers);
      deletePlayerFunctionality(player);
    }
  }

  const onSearch = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchKey(event.target.value)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    let newPlayers: any[] = [...updatedPlayers];
    const selectedIds: String[] = ['', 'Select a team', 'UnAssigned'];
    const [reorderedRow]: any[] = newPlayers.splice(result.source.index, 1);
    newPlayers.splice(result.destination.index, 0, reorderedRow);
    if (selectedIds.indexOf(teamId) === -1) {
      newPlayers = newPlayers?.map((current: any, index: number) => {
        return {
          ...current,
          player: {
            ...current?.player,
            rank: index + 1,
          }
        }
      });
      setUpdatedPlayers(newPlayers);
      updateRank(newPlayers);
    } else {
      setUpdatedPlayers(newPlayers);
    }
  }

  const updateRank = async (newPlayers: string | any[]) => {
    let updateNeeded = false;
    for (let i = 0; i < newPlayers?.length; i++) {
      updateNeeded = true;
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
      })
    }
    if (updateNeeded) {
      setRefetchAfterRankUpdate(true);
    }
  }

  const selectedIds: String[] = ['', 'Select a team', 'UnAssigned'];

  const toggleMenu = (playerId: SetStateAction<string>) => {
    if (isOpenAction?.length > 0) {
      setIsOpenAction('');
    } else {
      setIsOpenAction(playerId);
    }
  };

  return (
    <Layout title="Players" page={LayoutPages.players}>
      <>
        <div className="w-[calc((w-screen)-(w-1/5)) overflow-hidden">
          <div className="flex flex-row-reverse p-4">
            <button
              className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
              onClick={() => setAddPlayers(true)}
            >
              Import Players
            </button>

            <button
              className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
              onClick={() => setAddUpdatePlayer(true)}
            >
              Add a Player
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="relative w-1/2 m-2">
              <input
                type="text"
                className="block py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:placeholder-gray-400 sm:text-sm"
                placeholder="Search"
                onChange={onSearch}
                value={searchKey}
                onKeyDown={onKeyPress}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.873-4.873M14.828 10.897a4.999 4.999 0 1 1-7.072 0 4.999 4.999 0 0 1 7.072 0z"></path>
                </svg>
              </div>
            </div>
            <div className="flex align-self-right">
              <div
                className="border border-gray-30"

                style={{
                  borderRadius: '8px',
                  height: '42px',
                  color: 'grey',
                }}>
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
                  {leaguesQuery.data?.getLeagues?.code === 200 &&
                    leaguesQuery.data?.getLeagues?.data?.map((league: any) => (
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
                }}>
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
                  {teamsQuery?.data?.getTeams?.code === 200 &&
                    teamsQuery?.data?.getTeams?.data?.map((team: any) => (
                      <option key={team?._id} value={team?._id}>
                        {team?.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[calc((w-screen)-(w-1/5)) overflow-scroll max-h-screen">
          <table className="app-table w-full">
            <thead className="w-full sticky top-0 z-20">
              <THR>
                <>
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
                    {updatedPlayers?.map((player: any, index) => (
                      <Draggable
                        key={player._id}
                        draggableId={player._id}
                        index={index}
                        isDragDisabled={selectedIds.includes(teamId)}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? 'dragging w-full even:bg-purple-100 hover:bg-purple-200' : 'w-full even:bg-purple-100 hover:bg-purple-200'}
                          >
                            <>
                              <TD>
                                <>
                                  {player?.firstName}&nbsp;{player?.lastName}
                                </>
                              </TD>
                              <TD>{player?.login?.email}</TD>
                              <TD>{player?.player?.shirtNumber}</TD>
                              <TD>{player?.player?.rank}</TD>
                              <TD>{player?.player?.team?.name}</TD>
                              <TD>{player?.player?.league?.name}</TD>
                              <TD>{player?.active ? "Yes" : "No"}</TD>
                              <TD>
                                <div className="flex item-center">
                                  <div className="relative">
                                    <button
                                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                      onClick={() => toggleMenu(player?._id)}
                                    >
                                      <svg className="w-6 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                                    </button>
                                    {(isOpenAction === player?._id) && (
                                      <div ref={ref} className="z-20 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                          <a onClick={() => {
                                            setUpdatePlayer(player);
                                            setAddUpdatePlayer(true);
                                            setIsOpenAction('');
                                          }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" role="menuitem">Edit</a>
                                          <a onClick={() => {
                                            onDelete(player, index);
                                            setIsOpenAction('');
                                          }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" role="menuitem">Delete</a>
                                          <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" role="menuitem">Add in Another League</a>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                              </TD>
                            </>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )
                }
              </Droppable >
            </DragDropContext >

          </table >
        </div>
        {addUpdatePlayer && (
          <AddUpdatePlayer
            key={uuidv4()}
            onSuccess={onAddUpdatePlayer}
            player={updatePlayer}
            onClose={onAddUpdatePlayerClose}
            data={data?.getPlayers?.data}
          />
        )}

        {
          addPlayers && (
            <AddPlayers
              onSuccess={onAddUpdatePlayer}
              onClose={() => setAddPlayers(false)}
              data={data?.getPlayers?.data}
            />
          )
        }
      </>
    </Layout >
  );
}
