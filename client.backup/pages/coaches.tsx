/* eslint-disable no-underscore-dangle */
import { SetStateAction, useEffect, useRef, useState } from 'react';
import Layout, { LayoutPages } from '@/components/layout';
import { useQuery } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import { Menu, MenuHandler, MenuList, MenuItem, Button } from '@material-tailwind/react';
import { TD, TDR, TH, THR } from '@/components/table';
import Image from 'next/image';

import AddUpdateCoach from '@/components/coaches/add-update-coach';
import { GET_COACHES_IN_DETAIL } from '@/graphql/coach';
import { GET_LEAGUE_DROPDOWN } from '@/graphql/league';
import { GET_TEAMS_NTWL } from '@/graphql/teams';

export default function CoachesPage() {
  // Local State
  const [isOpen, setIsOpen] = useState('');
  const [addUpdateCoach, setAddUpdateCoach] = useState(false);
  const [updateCoach, setUpdateCoach] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [isOpenAction, setIsOpenAction] = useState('');
  const [filteredCoaches, setFilteredCoachs] = useState<any[]>([]);
  const [allCoachData, setAllCoachData] = useState<{ coach: { team: { name: any; _id: any; league: any } }; _id: any; firstName: any; lastName: any }[]>([]);
  const ref = useRef<HTMLInputElement | null>(null);

  // GraphQL Query
  const leaguesQuery = useQuery(GET_LEAGUE_DROPDOWN);
  const { data, error, loading, refetch } = useQuery(GET_COACHES_IN_DETAIL);
  const { data: teamsData, error: teamError, loading: teamLoading, refetch: teamRefetch } = useQuery(GET_TEAMS_NTWL);

  const router = useRouter();

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

  useEffect(() => {
    refetch();
    teamRefetch();
  }, [router.asPath]);

  useEffect(() => {
    /**
     * Looping coaches and teams
     * Making a new array to store coaches that has teams
     */
    const coachData = data?.getCoaches?.data;
    const teamsQueryData = teamsData?.getTeams?.data;
    if (coachData && teamsQueryData) {
      const coachesData: ((prevState: never[]) => never[]) | { coach: { team: { name: any; _id: any; league: any } }; _id: any; firstName: any; lastName: any }[] = [];

      coachData?.forEach((currentCoach: { coach: { team: { name: any; _id: any; league: any } }; _id: any; firstName: any; lastName: any }) => {
        let count = 0;
        teamsQueryData?.forEach((currentTeam: { name: any; _id: any; league: any; coach: { _id: any } }) => {
          if (currentTeam?.coach?._id === currentCoach?._id) {
            count += 1;
            coachesData.push({
              ...currentCoach,
              coach: {
                team: {
                  name: currentTeam?.name,
                  _id: currentTeam?._id,
                  league: currentTeam?.league,
                },
              },
            });
          }
        });
        if (count === 0) {
          coachesData.push({
            ...currentCoach,
          });
        }
      });
      setAllCoachData(coachesData);
    }
  }, [data, teamsData]);

  /**
   * If someone search with some keywords then it will filter all coaches data
   * And this data will pass through a few functions to render
   * tabaleData: find coaches of specific league
   * groupedData: group data from an array (tableData) by a common property (_id) and convert it into an array of grouped objects, each containing an array of items sharing the same property value.
   */
  const filteredData = (key: string) => {
    const filteredCoach = allCoachData.filter((coach: any) => {
      const coachName = `${coach.firstName} ${coach.lastName}`.toLocaleLowerCase();
      return coachName.includes(key.toLocaleLowerCase());
    });
    return filteredCoach;
  };

  const onAddUpdateCoach = () => {
    setUpdateCoach(null);
    setAddUpdateCoach(false);
    window.location.href = '/coaches';
  };

  const onAddUpdateCoachClose = () => {
    setUpdateCoach(null);
    setAddUpdateCoach(false);
  };

  const onKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      setSearchKey(event.target.value);
      setFilteredCoachs(filteredData(event.target.value));
    }
  };

  const toggleMenu = (coachId: SetStateAction<string>) => {
    if (isOpenAction?.length > 0) {
      setIsOpenAction('');
    } else {
      setIsOpenAction(coachId);
    }
  };

  const getCoachesForDisplay = () => {
    if (searchKey !== '') {
      return filteredCoaches;
    }
    return allCoachData;
  };

  const tabaleData = getCoachesForDisplay()?.filter((filt) =>
    leagueId?.length > 0 && leagueId !== 'Select a league' ? filt?.coach?.team?.league?._id === leagueId : true,
  );

  const groupedData = Object.values(
    tabaleData?.reduce((acc, curr) => {
      if (!acc[curr._id]) {
        acc[curr._id] = { coachId: curr._id, mappedArray: [] };
      }
      acc[curr._id].mappedArray.push(curr);
      return acc;
    }, {}),
  );

  return (
    <Layout title="Coaches" page={LayoutPages.coaches}>
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
                <Image src="/icons/search.svg" width="35" height="35" alt="search" />
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
                      {leaguesQuery?.data?.getLeagues?.code === 200 &&
                        leaguesQuery?.data?.getLeagues?.data?.map((league: any) => (
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
          <div className="flex pl-4">
            <button
              type="button"
              className="transform hover:bg-slate-800 transition duration-300 hover:scale-105 dark:hover:shadow-black/30 text-white bg-slate-700 dark:divide-gray-700 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-md px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
              onClick={() => setAddUpdateCoach(true)}
            >
              <Image src="/icons/plus.svg" width="35" height="35" alt="plus" />
              Add a Coach
            </button>
          </div>
        </div>

        {/* List of coach  */}
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
                  <TH>Email</TH>
                  <TH>Team</TH>
                  <TH>League</TH>
                  <TH>Active</TH>
                  <TH>Actions</TH>
                </>
              </THR>
            </thead>

            <tbody className="w-full shadow-lg">
              {groupedData?.map(
                (current: any) =>
                  current?.mappedArray?.map((coach: any, index: number) => (
                    <>
                      {index === 0 && (
                        <TDR key={`${current?.coachId}`}>
                          <>
                            <TD>
                              {current?.mappedArray?.length > 1 ? (
                                <button
                                  className="text-white px-4 py-2 rounded"
                                  type="button"
                                  onClick={() => setIsOpen(isOpen?.length === 0 ? `${current?.coachId}` : '')}
                                >
                                  {isOpen === `${current?.coachId}` ? (
                                    <Image src="/icons/checked.svg" width="35" height="35" alt="checked" />
                                  ) : (
                                    <Image src="/icons/right-arrow.svg" width="35" height="35" alt="right-arrow" />
                                  )}
                                </button>
                              ) : (
                                <></>
                              )}
                            </TD>
                            <TD>
                              <>
                                {coach?.firstName}&nbsp;{coach?.lastName}
                              </>
                            </TD>
                            <TD>{coach?.login?.email}</TD>
                            <TD>{coach?.coach?.team?.name}</TD>
                            <TD>{coach?.coach?.team?.league?.name}</TD>
                            <TD>{coach?.active ? 'Yes' : 'No'}</TD>
                            <TD>
                              <div className="flex item-center justify-center">
                                <div className="relative">
                                  <Menu>
                                    <MenuHandler>
                                      <Button
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        variant="gradient"
                                      >
                                        <Image src="/icons/dots-vertical.svg" width="35" height="35" alt="dots-vertical" />
                                      </Button>
                                    </MenuHandler>
                                    <MenuList>
                                      <MenuItem
                                        onClick={() => {
                                          setUpdateCoach(coach);
                                          setAddUpdateCoach(true);
                                          setIsOpenAction('');
                                        }}
                                        className="block px-4 text-sm text-gray-700 cursor-pointer"
                                      >
                                        Edit
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </div>
                              </div>
                            </TD>
                          </>
                        </TDR>
                      )}
                      {isOpen === `${current?.coachId}` && index > 0 && (
                        <TDR key={`${coach?._id}-${coach?.coach?.team?._id}-${coach?.coach?.team?.league?._id}`}>
                          <>
                            <TD />
                            <TD />
                            <TD>{coach?.login?.email}</TD>
                            <TD>{coach?.coach?.team?.name}</TD>
                            <TD>{coach?.coach?.team?.league?.name}</TD>
                            <TD>{coach?.active ? 'Yes' : 'No'}</TD>
                            <TD>
                              <div className="flex item-center justify-center">
                                <div className="relative">
                                  <Menu>
                                    <MenuHandler>
                                      <Button
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        variant="gradient"
                                      >
                                        <Image src="/icons/dots-vertical.svg" width="35" height="35" alt="dots-vertical" />
                                      </Button>
                                    </MenuHandler>
                                    <MenuList>
                                      <MenuItem
                                        onClick={() => {
                                          setUpdateCoach(coach);
                                          setAddUpdateCoach(true);
                                          setIsOpenAction('');
                                        }}
                                        className="block px-4 text-sm text-gray-700 cursor-pointer"
                                      >
                                        Edit
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </div>
                              </div>
                            </TD>
                          </>
                        </TDR>
                      )}
                    </>
                  )),
              )}
            </tbody>
          </table>
        </div>

        {addUpdateCoach && (
          <AddUpdateCoach data={data?.getCoaches?.data} onSuccess={onAddUpdateCoach} coach={updateCoach} key={uuidv4()} onClose={onAddUpdateCoachClose} />
        )}
      </>
    </Layout>
  );
}
