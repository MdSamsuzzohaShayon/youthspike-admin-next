import { useEffect, useState } from "react";
import Layout, { LayoutPages } from "@/components/layout";
import { Modal } from "@/components/model";
import { gql, useMutation, useQuery } from "@apollo/client";
import { TD, TDR, TH, THR } from "@/components/table";
import { format } from "date-fns";

const LEAGUES = gql`
  query GetLeagues {
    getLeagues {
      code
      success
      message
      data {
        _id
        name
        startDate
        endDate
        active
        playerLimit
      }
    }
  }
`;

export default function LeaguesPage() {
  const [addUpdateLeague, setAddUpdateLeague] = useState(false);
  const [updateLeague, setUpdateLeague] = useState(null);
  const { data, error, loading, refetch } = useQuery(LEAGUES);

  const onAddUpdateLeague = () => {
    setUpdateLeague(null);
    setAddUpdateLeague(false);
    refetch();
  };

  const onAddUpdateLeagueClose = () => {
    setUpdateLeague(null);
    setAddUpdateLeague(false);
  };

  return (
    <Layout title="Leagues" page={LayoutPages.leagues}>
      <>
        <div className="flex flex-row-reverse p-4">
          <button
            className="bg-blue-500 text-white font-bold rounded p-4"
            onClick={() => setAddUpdateLeague(true)}
          >
            Add a League
          </button>
        </div>

        <table className="app-table w-full">
          <thead className="w-full">
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
            {data?.getLeagues?.data?.map((league: any) => (
              <TDR key={league?._id}>
                <>
                  <TD>{league?.name}</TD>
                  <TD>{new Date(league?.startDate).toDateString()}</TD>
                  <TD>{new Date(league?.endDate).toDateString()}</TD>
                  <TD>{league?.playerLimit}</TD>
                  <TD>{league?.active ? "Yes" : "No"}</TD>
                  <TD>
                    <button
                      className="btn btn-sm bg-blue-200 p-2 rounded"
                      onClick={() => {
                        setUpdateLeague(league);
                        setAddUpdateLeague(true);
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

        {addUpdateLeague && (
          <AddUpdateLeague
            onSuccess={onAddUpdateLeague}
            league={updateLeague}
          ></AddUpdateLeague>
        )}
      </>
    </Layout>
  );
}

const ADD_UPDATE_LEAGUE = gql`
  mutation CreateOrUpdateLeague(
    $name: String!
    $startDate: DateTime!
    $endDate: DateTime!
    $playerLimit: Int!
    $active: Boolean!
    $id: String
  ) {
    createOrUpdateLeague(
      name: $name
      startDate: $startDate
      endDate: $endDate
      playerLimit: $playerLimit
      active: $active
      id: $id
    ) {
      code
      success
      message
      data {
        _id
        name
        startDate
        endDate
        active
        playerLimit
      }
    }
  }
`;

interface AddUpdateLeagueOnSuccess {
  (id: string): void;
}

interface AddUpdateLeagueOnClose {
  (): void;
}

interface AddUpdateLeagueProps {
  league?: any;
  onSuccess?: AddUpdateLeagueOnSuccess;
  onClose?: AddUpdateLeagueOnClose;
}

function AddUpdateLeague(props: AddUpdateLeagueProps) {
  console.log(props);
  const date = format(new Date(), "yyy-MM-dd");
  const [name, setName] = useState(props?.league?.name || "");

  const [startDate, setStartDate] = useState(
    props?.league
      ? format(new Date(props?.league.startDate), "yyy-MM-dd")
      : date
  );

  const [endDate, setEndDate] = useState(
    props?.league ? format(new Date(props?.league.endDate), "yyy-MM-dd") : date
  );

  const [playerLimit, setPlayerLimit] = useState(
    props?.league ? props?.league?.playerLimit : 2
  );

  const [active, setActive] = useState(
    props?.league ? props?.league?.active + "" : "true"
  );

  const [addUpdateLeague, { data, error, loading }] = useMutation(
    ADD_UPDATE_LEAGUE,
    {
      variables: {
        name,
        startDate,
        endDate,
        playerLimit,
        active: active === "true" ? true : false,
        id: props?.league?._id,
      },
    }
  );

  useEffect(() => {
    console.log(data, error);

    if (data?.createOrUpdateLeague?.code === 200) {
      props?.onSuccess &&
        props.onSuccess(data?.createOrUpdateLeague?.data?._id);
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
                placeholder="League Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="startDate" className="font-bold">
              Start Date
            </label>

            <div>
              <input
                type="date"
                name="startDate"
                id="startDate"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setEndDate(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="endDate" className="font-bold">
              End Date
            </label>

            <div>
              <input
                type="date"
                name="endDate"
                id="endDate"
                placeholder="End Date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="playerLimit" className="font-bold">
              Player Limit
            </label>

            <div>
              <input
                type="number"
                name="playerLimit"
                id="playerLimit"
                min={2}
                placeholder="Player Limit"
                value={playerLimit}
                onChange={(e) => setPlayerLimit(Number(e.target.value))}
              />
            </div>
          </div>

          {props?.league && (
            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="playerLimit" className="font-bold">
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
          {props?.league ? (
            <button
              className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
              type="button"
              onClick={() => addUpdateLeague()}
            >
              Update League
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
              type="button"
              onClick={() => addUpdateLeague()}
            >
              Add League
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
