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

export default function CoachesPage() {
  const [addUpdateCoach, setAddUpdateCoach] = useState(false);
  const [updateCoach, setUpdateCoach] = useState(null);
  const { data, error, loading, refetch } = useQuery(COACHES);

  const onAddUpdateCoach = () => {
    setUpdateCoach(null);
    setAddUpdateCoach(false);
    window.location.href = "/coaches";
  };

  const onAddUpdateCoachClose = () => {
    setUpdateCoach(null);
    setAddUpdateCoach(false);
  };

  useEffect(() => console.log(data), [data]);

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
            {data?.getCoaches?.data?.map((coach: any) => (
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
