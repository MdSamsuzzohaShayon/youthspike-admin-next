import { useEffect, useState } from "react";
import Layout, { LayoutPages } from "@/components/layout";
import { gql, useQuery } from "@apollo/client";
import { TD, TDR, TH, THR } from "@/components/table";
import AddUpdateCoach from "@/components/coaches/add-update-coach";
import { v4 as uuidv4 } from 'uuid';


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
  const [allCoachData, setAllCoachData] = useState<{ coach: { team: { name: any; _id: any; league: any; }; }; _id: any; firstName: any; lastName: any; }[]>([]);
  const { data, error, loading, refetch } = useQuery(COACHES);
  const { data: teamsData, error: teamError, loading: teamLoading, refetch: teamRefetch } = useQuery(TEAMS);


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
  const onAddUpdateCoach = () => {
    setUpdateCoach(null);
    setAddUpdateCoach(false);
    window.location.href = "/coaches";
  };

  const onAddUpdateCoachClose = () => {
    setUpdateCoach(null);
    setAddUpdateCoach(false);
  };

  return (
    <Layout title="Coaches" page={LayoutPages.coaches}>
      <>
        <div className="flex flex-row-reverse p-4">
          <button
            className="bg-blue-500 text-white font-bold rounded p-4"
            onClick={() => setAddUpdateCoach(true)}
          >
            Add a Coach
          </button>
        </div>

        <table className="app-table w-full">
          <thead className="w-full">
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
            {allCoachData?.map((coach: any) => (
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
                    <button
                      className="btn btn-sm bg-blue-200 p-2 rounded"
                      onClick={() => {
                        setUpdateCoach(coach);
                        setAddUpdateCoach(true);
                      }}
                    >
                      Edit
                    </button>
                  </TD>
                </>
              </TDR>
            ))}
          </tbody>
        </table>

        {addUpdateCoach && (
          <AddUpdateCoach
            data={data?.getCoaches?.data}
            onSuccess={onAddUpdateCoach}
            coach={updateCoach}
            key={uuidv4()}
            onClose={onAddUpdateCoachClose}
          ></AddUpdateCoach>
        )}
      </>
    </Layout>
  );
}
