import React from 'react';

function leaguesPage() {
  return (
    <div>
      <h1 className="">Stop Redirecting from this component</h1>
    </div>
  )
}

export default leaguesPage;

/*
import { SetStateAction, useEffect, useRef, useState } from 'react';
import Layout, { LayoutPages } from '@/components/layout';
import { useLazyQuery } from '@apollo/client';
import Image from 'next/image';

import { TD, TDR, TH, THR } from '@/components/table';
import { LoginService } from '@/utils/login';
import { Menu, MenuHandler, MenuList, MenuItem, Button } from '@material-tailwind/react';
import { GET_LEAGUES } from '@/graphql/league';
import AddUpdateLeague from '@/components/leagues/AddUpdateLeague';

export default function LeaguesPage() {
  const [addUpdateLeague, setAddUpdateLeague] = useState<boolean>(false);
  const [updateLeague, setUpdateLeague] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filteredLeagues, setFilteredLeagues] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allLeaguesData, setAllLeaguesData] = useState<any[]>([]);
  const [isOpenAction, setIsOpenAction] = useState('');
  const [userID, setUserData] = useState('');
  const [userRole, setUserRole] = useState('');

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [getLeaguesData, { data, error, loading, refetch }] = useLazyQuery(GET_LEAGUES, {
    variables: { userId: userRole !== 'admin' && userRole !== 'player' ? userID : null },
  });

  const getDatafromLocalStorage = async () => {
    const localStorageData = await LoginService.getUser();
    setUserRole(localStorageData?.role);
    // eslint-disable-next-line no-underscore-dangle
    setUserData(localStorageData?._id);
  };

  useEffect(() => {
    getDatafromLocalStorage();
  }, []);

  useEffect(() => {
    getLeaguesData();
  }, [userID]);


  const onAddUpdateLeague = () => {
    setUpdateLeague(null);
    setAddUpdateLeague(false);
    refetch();
  };

  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    setAllLeaguesData(data?.getLeagues?.data ?? []);
  }, [data]);

  const onAddUpdateLeagueClose = () => {
    setUpdateLeague(null);
    setAddUpdateLeague(false);
  };

  const filteredData = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredLeague = allLeaguesData.filter((league: any) => {
      const leagueName = `${league.name}`.toLocaleLowerCase();
      return leagueName.includes(key.toLocaleLowerCase());
    });
    return filteredLeague;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      setSearchKey(event.target.value);
      setFilteredLeagues(filteredData(event.target.value));
    }
  };

  const toggleMenu = (teamId: SetStateAction<string>) => {
    if (isOpenAction?.length > 0) {
      setIsOpenAction('');
    } else {
      setIsOpenAction(teamId);
    }
  };

  const toggleMatch = (leagueId: SetStateAction<string>) => {
    window.location.href = `/teams?leagueId=${leagueId}`;
  };

  const getLeaguesForDisplay = () => {
    if (searchKey !== '') {
      return filteredLeagues;
    }
    return allLeaguesData;
  };

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
                <Image src="/icons/search.svg" width="35" height="35" alt="search" />
              </div>
            </div>
          </div>
          {userRole === 'admin' && (
            <div className="flex flex-row-reverse pl-4">
              <button
                type="button"
                className="transform hover:bg-slate-800 transition duration-300 hover:scale-110 text-white bg-slate-700 dark:divide-gray-700 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-md px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
                onClick={() => setAddUpdateLeague(true)}
              >
                <Image src="/icons/plus.svg" width="35" height="35" alt="plus" />
                Add a League
              </button>
            </div>
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
                    <TD>{league?.active ? 'Yes' : 'No'}</TD>
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
                                  <Image src="/icons/dots-vertical.svg" width="35" height="35" alt="dots-vertical" />
                                </Button>
                              </MenuHandler>
                              <MenuList>
                                <MenuItem
                                  onClick={() => {
                                    setUpdateLeague(league);
                                    setAddUpdateLeague(true);
                                    setIsOpenAction('');
                                  }}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                >
                                  Edit
                                </MenuItem>
                                <MenuItem
                                  onClick={() => toggleMatch(league?._id)}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                >
                                  View Teams
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </div>
                        </div>
                      ) : (
                        <div className="flex item-center justify-center">
                          <div className="relative">
                            <button
                            type="button"
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={() => toggleMatch(league?._id)}
                            >
                              <Image src="/icons/trophy.svg" width="35" height="35" alt="trophy" />
                            </button>
                          </div>
                        </div>
                      )}
                    </TD>
                  </>
                </TDR>
              ))}
            </tbody>
          </table>
        </div>

        {addUpdateLeague && <AddUpdateLeague onSuccess={onAddUpdateLeague} league={updateLeague} onClose={onAddUpdateLeagueClose} />}
      </>
    </Layout>
  );
}
*/

