import { SetStateAction, useEffect, useRef, useState } from "react";
import Layout, { LayoutPages } from "@/components/layout";
import { gql, useQuery } from "@apollo/client";
import { TD, TDR, TH, THR } from "@/components/table";
import AddUpdateCoach from "@/components/coaches/add-update-coach";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router";


const COACHES = gql`
  query GetCoaches {
    getCoaches {
      code
      success
      message
      data {
        _id
        firstName
        lastName
        role
        login {
          email
          password
        }
        active
        coach {
          team {
            name
            _id
            league {
              _id
              name
            }
          }
        }
      }
    }
  }
`;

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

export default function CoachesPage() {
  const [addUpdateCoach, setAddUpdateCoach] = useState(false);
  const [updateCoach, setUpdateCoach] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [isOpenAction, setIsOpenAction] = useState('');
  const [filteredCoaches, setFilteredCoachs] = useState<any[]>([]);
  const [allCoachData, setAllCoachData] = useState<{ coach: { team: { name: any; _id: any; league: any; }; }; _id: any; firstName: any; lastName: any; }[]>([]);
  const { data, error, loading, refetch } = useQuery(COACHES);
  const { data: teamsData, error: teamError, loading: teamLoading, refetch: teamRefetch } = useQuery(TEAMS);
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
    teamRefetch();
  }, [router.asPath])
  useEffect(() => {
    const coachData = data?.getCoaches?.data;
    const teamsQueryData = teamsData?.getTeams?.data;
    if (coachData && teamsQueryData) {
      const coachesData: ((prevState: never[]) => never[]) | { coach: { team: { name: any; _id: any; league: any; }; }; _id: any; firstName: any; lastName: any; }[] = [];
      coachData?.forEach((current: {
        coach: { team: { name: any; _id: any; league: any; }; }; _id: any; firstName: any; lastName: any;
      }) => {
        let count = 0;
        teamsQueryData?.forEach((cur: {
          name: any;
          _id: any;
          league: any; coach: { _id: any; };
        }) => {
          if (cur?.coach?._id === current?._id) {
            count++;
            coachesData.push({
              ...current,
              coach: {
                team: {
                  name: cur?.name,
                  _id: cur?._id,
                  league: cur?.league,
                },
              }
            })
          }
        });
        if (count === 0) {
          coachesData.push({
            ...current,
          });
        }
      })
      setAllCoachData(coachesData)
    }
  }, [data, teamsData])

  const filteredData = (key: string) => {
    const filteredCoach = allCoachData.filter((coach: any) => {
      const coachName = (`${coach.firstName} ${coach.lastName}`).toLocaleLowerCase();
      return coachName.includes(key.toLocaleLowerCase());
    });
    return filteredCoach;
  }

  const onAddUpdateCoach = () => {
    setUpdateCoach(null);
    setAddUpdateCoach(false);
    window.location.href = "/coaches";
  };

  const onAddUpdateCoachClose = () => {
    setUpdateCoach(null);
    setAddUpdateCoach(false);
  };

  const onKeyPress = (event: any) => {
    if (event.key === "Enter") {
      setSearchKey(event.target.value)
      setFilteredCoachs(filteredData(event.target.value));
    }
  }

  const toggleMenu = (coachId: SetStateAction<string>) => {
    if (isOpenAction?.length > 0) {
      setIsOpenAction('');
    } else {
      setIsOpenAction(coachId);
    }
  };

  const getCoachesForDisplay = () => {
    if (searchKey !== "") {
      return filteredCoaches;
    } else {
      return allCoachData;
    }
  }

  return (
    <Layout title="Coaches" page={LayoutPages.coaches}>
      <>
        <div className="w-[calc((w-screen)-(w-1/5)) overflow-hidden">
          <div className="flex flex-row-reverse p-4">
            <button
              className="bg-blue-500 text-white font-bold rounded p-4"
              onClick={() => setAddUpdateCoach(true)}
            >
              Add a Coach
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="relative w-1/2 m-2">
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:placeholder-gray-400 sm:text-sm"
                placeholder="Search"
                onKeyDown={onKeyPress}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.873-4.873M14.828 10.897a4.999 4.999 0 1 1-7.072 0 4.999 4.999 0 0 1 7.072 0z"></path>
                </svg>
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
                  <TH>Team</TH>
                  <TH>League</TH>
                  <TH>Active</TH>
                  <TH>Actions</TH>
                </>
              </THR>
            </thead>

            <tbody className="w-full">
              {(getCoachesForDisplay()).map((coach: any) => (
                <TDR key={coach?._id}>
                  <>
                    <TD>
                      <>
                        {coach?.firstName}&nbsp;{coach?.lastName}
                      </>
                    </TD>
                    <TD>{coach?.login?.email}</TD>
                    <TD>{coach?.coach?.team?.name}</TD>
                    <TD>{coach?.coach?.team?.league?.name}</TD>
                    <TD>{coach?.active ? "Yes" : "No"}</TD>
                    <TD>
                      <div className="flex item-center">
                        <div className="relative">
                          <button
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => toggleMenu(coach?._id)}
                          >
                            <svg className="w-6 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                          </button>
                          {(isOpenAction === coach?._id) && (
                            <div ref={ref} className="z-20 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <a onClick={() => {
                                  setUpdateCoach(coach);
                                  setAddUpdateCoach(true);
                                  setIsOpenAction('');
                                }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" role="menuitem">Edit</a>
                                <a onClick={() => {
                                }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" role="menuitem">Delete</a>
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

        {
          addUpdateCoach && (
            <AddUpdateCoach
              data={data?.getCoaches?.data}
              onSuccess={onAddUpdateCoach}
              coach={updateCoach}
              key={uuidv4()}
              onClose={onAddUpdateCoachClose}
            ></AddUpdateCoach>
          )
        }
      </>
    </Layout >
  );
}
