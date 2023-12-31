import { useEffect, useState } from "react";
import Layout, { LayoutPages } from "@/components/layout";
import { Modal } from "@/components/model";
import { gql, useMutation, useQuery } from "@apollo/client";
import { TD, TDR, TH, THR } from "@/components/table";

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
  const [updateTeam, setUpdateTeam] = useState(null);
  const { data, error, loading, refetch } = useQuery(TEAMS);

  const onAddUpdateTeam = () => {
    setUpdateTeam(null);
    setAddUpdateTeam(false);
    refetch();
  };

  const onAddUpdateTeamClose = () => {
    setUpdateTeam(null);
    setAddUpdateTeam(false);
  };

  useEffect(() => console.log(data), [data]);

  return (
    <Layout title="Teams" page={LayoutPages.teams}>
      <>
        <div className="flex flex-row-reverse p-4">
          <button
            className="bg-blue-500 text-white font-bold rounded p-4"
            onClick={() => setAddUpdateTeam(true)}
          >
            Add a Team
          </button>
        </div>

        <table className="app-table w-full">
          <thead className="w-full">
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
            {data?.getTeams?.data?.map((team: any) => (
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
                    <button
                      className="btn btn-sm bg-blue-200 p-2 rounded"
                      onClick={() => {
                        setUpdateTeam(team);
                        setAddUpdateTeam(true);
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

        {addUpdateTeam && (
          <AddUpdateTeam
            onSuccess={onAddUpdateTeam}
            team={updateTeam}
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
  team?: any;
  onSuccess?: AddUpdateTeamOnSuccess;
  onClose?: AddUpdateTeamOnClose;
}

function AddUpdateTeam(props: AddUpdateTeamProps) {
  const leaguesQuery = useQuery(LEAGUE_DROPDOWN);
  const coachesQuery = useQuery(COACH_DROPDOWN);

  const [name, setName] = useState(props?.team?.name || "");
  const [leagueId, setLeagueId] = useState(props?.team?.leagueId || "");
  const [coachId, setCoachId] = useState(props?.team?.coachId || "");

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
        id: props?.team?._id,
      },
    }
  );

  useEffect(() => {
    console.log(leaguesQuery.data, coachesQuery.data);

    if (data?.createOrUpdateTeam?.code === 200) {
      props?.onSuccess && props.onSuccess(data?.createOrUpdateTeam?.data?._id);
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
              className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
              type="button"
              onClick={() => addUpdateTeam()}
            >
              Update Team
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
              type="button"
              onClick={() => addUpdateTeam()}
            >
              Add Team
            </button>
          )}

          <button className="bg-red-100 font-bold rounded p-4 mx-2">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
