import { useEffect, useState } from "react";
import Layout, { LayoutPages } from "@/components/layout";
import { Modal } from "@/components/model";
import { gql, useMutation, useQuery } from "@apollo/client";
import { TD, TDR, TH, THR } from "@/components/table";
import { format } from "date-fns";
import { MatchLink } from "@/components/matches/link";

const MATCHES = gql`
  query GetMatches {
    getMatches {
      code
      success
      message
      data {
        _id
        active
        teamAId
        teamBId
        leagueId
        teamA {
          _id
          name
          active
          coachId
          coach {
            _id
            firstName
            lastName
            role
            player {
              shirtNumber
              rank
              leagueId
              teamId
              team {
                _id
                name
                active
                coachId
                leagueId
              }
            }
            login {
              email
              password
            }
            active
          }
          leagueId
          players {
            _id
            firstName
            lastName
            role
            active
          }
        }
        teamB {
          _id
          name
          active
          coachId
          leagueId
        }
        league {
          _id
          name
          startDate
          endDate
          active
          playerLimit
        }
        date
        location
        numberOfNets
        numberOfRounds
        netRange
        pairLimit
      }
    }
  }
`;

export default function MatchesPage() {
  const [addUpdateMatch, setAddUpdateMatch] = useState(false);
  const [updateMatch, setUpdateMatch] = useState(null);
  const { data, error, loading, refetch } = useQuery(MATCHES);

  const onAddUpdateMatch = () => {
    setUpdateMatch(null);
    setAddUpdateMatch(false);
    refetch();
  };

  const onAddUpdateMatchClose = () => {
    setUpdateMatch(null);
    setAddUpdateMatch(false);
  };

  return (
    <Layout title="Matches" page={LayoutPages.matches}>
      <>
        <div className="flex flex-row-reverse p-4">
          <button
            className="bg-blue-500 text-white font-bold rounded p-4"
            onClick={() => setAddUpdateMatch(true)}
          >
            Add a Match
          </button>
        </div>

        <table className="app-table w-full">
          <thead className="w-full">
            <THR>
              <>
                <TH>League</TH>
                <TH>Team A</TH>
                <TH>Team B</TH>
                <TH>Date</TH>
                <TH>Nets</TH>
                <TH>Rounds</TH>
                <TH>Pair Limit</TH>
                <TH>Net Range</TH>
                <TH>Active</TH>
                <TH>Actions</TH>
              </>
            </THR>
          </thead>

          <tbody className="w-full">
            {data?.getMatches?.data?.map((match: any) => (
              <TDR key={match?._id}>
                <>
                  <TD>{match?.league?.name}</TD>
                  <TD>{match?.teamA?.name}</TD>
                  <TD>{match?.teamB?.name}</TD>
                  <TD>{new Date(match?.date).toDateString()}</TD>
                  <TD>{match?.numberOfNets}</TD>
                  <TD>{match?.numberOfRounds}</TD>
                  <TD>{match?.pairLimit}</TD>
                  <TD>{match?.netRange}</TD>
                  <TD>{match?.active ? "Yes" : "No"}</TD>
                  <TD>
                    <span className="flex flex-col flex-wrap justify-center">
                      <a
                        href="#"
                        className="mx-1 text-blue-500 hover:text-blue-900"
                        onClick={() => {
                          setUpdateMatch(match);
                          setAddUpdateMatch(true);
                        }}
                      >
                        Edit
                      </a>
                      <MatchLink
                        matchId={match?._id}
                        teamId={match?.teamAId}
                        title="A Link"
                      ></MatchLink>

                      <MatchLink
                        matchId={match?._id}
                        teamId={match?.teamBId}
                        title="B Link"
                      ></MatchLink>
                    </span>
                  </TD>
                </>
              </TDR>
            ))}
          </tbody>
        </table>

        {addUpdateMatch && (
          <AddUpdateMatch
            onSuccess={onAddUpdateMatch}
            match={updateMatch}
          ></AddUpdateMatch>
        )}
      </>
    </Layout>
  );
}

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
      }
    }
  }
`;

const ADD_UPDATE_MATCHE = gql`
  mutation ImportPlayers(
    $teamAId: String!
    $teamBId: String!
    $leagueId: String!
    $date: DateTime!
    $location: String!
    $numberOfNets: Int!
    $numberOfRounds: Int!
    $netRange: Int!
    $pairLimit: Int!
    $active: Boolean!
    $id: String
  ) {
    createOrUpdateMatch(
      teamAId: $teamAId
      teamBId: $teamBId
      leagueId: $leagueId
      date: $date
      location: $location
      numberOfNets: $numberOfNets
      numberOfRounds: $numberOfRounds
      netRange: $netRange
      pairLimit: $pairLimit
      active: $active
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

interface AddUpdateMatchOnSuccess {
  (id: string): void;
}

interface AddUpdateMatchOnClose {
  (): void;
}

interface AddUpdateMatchProps {
  match?: any;
  onSuccess?: AddUpdateMatchOnSuccess;
  onClose?: AddUpdateMatchOnClose;
}

function AddUpdateMatch(props: AddUpdateMatchProps) {
  const [leagueId, setLeagueId] = useState(props?.match?.leagueId || "");
  const { data: leagues } = useQuery(LEAGUES);
  const { data: teams } = useQuery(TEAMS, { variables: leagueId });

  const now = new Date();
  const [minDate, setMinDate] = useState(format(now, "yyyy-MM-dd"));
  const [maxDate, setMaxDate] = useState(format(now, "yyyy-MM-dd"));

  const [numberOfNets, setNumberOfNets] = useState(
    props?.match ? props?.match?.nets : 1
  );

  const [numberOfRounds, setNumberOfRounds] = useState(
    props?.match ? props?.match?.rounds : 1
  );

  const [teamAId, setTeamAId] = useState(props?.match?.teamAId || "");
  const [teamBId, setTeamBId] = useState(props?.match?.teamBId || "");
  const [location, setLocation] = useState(props?.match?.location || "");

  const [date, setDate] = useState(
    props?.match ? format(new Date(props?.match.date), "yyy-MM-dd") : minDate
  );

  const [netRange, setNetRange] = useState(
    props?.match ? props?.match?.netRange : 1
  );

  const [pairLimit, setPairLimit] = useState(
    props?.match ? props?.match?.pairLimit : 1
  );

  const [active, setActive] = useState(
    props?.match ? props?.match?.active + "" : "true"
  );

  const [addUpdateMatch, { data, error, loading }] = useMutation(
    ADD_UPDATE_MATCHE,
    {
      variables: {
        name,
        date,
        teamAId,
        teamBId,
        leagueId,
        numberOfNets,
        numberOfRounds,
        netRange,
        pairLimit,
        location,
        active: active === "true" ? true : false,
        id: props?.match?._id,
      },
    }
  );

  useEffect(() => {
    console.log(data, error);

    if (data?.createOrUpdateMatch?.code === 200) {
      props?.onSuccess && props.onSuccess(data?.createOrUpdateMatch?.data?._id);
    }
  }, [data, error]);

  useEffect(() => {
    console.log(leagues, teams);
  });

  return (
    <Modal showModal={true} onClose={() => props.onClose && props.onClose()}>
      <form className="form w-100">
        <div className="flex flex-row flex-wrap">
          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="leagueId" className="font-bold">
              League
            </label>

            <div>
              <select
                name="leagueId"
                id="leagueId"
                value={leagueId}
                onChange={(e) => {
                  setLeagueId(e.target.value);

                  const league = leagues?.getLeagues?.data?.find(
                    (i: any) => i._id == e?.target?.value
                  );

                  league &&
                    setMinDate(
                      format(new Date(league?.startDate), "yyyy-MM-dd")
                    );
                  league &&
                    setMaxDate(format(new Date(league?.endDate), "yyyy-MM-dd"));
                }}
              >
                <option>Select a league</option>
                {leagues?.getLeagues?.code === 200 &&
                  leagues?.getLeagues?.data?.map((league: any) => (
                    <option key={league?._id} value={league?._id}>
                      {league?.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="teamAId" className="font-bold">
              Team A
            </label>

            <div>
              <select
                name="teamAId"
                id="teamAId"
                value={teamAId}
                onChange={(e) => setTeamAId(e.target.value)}
              >
                <option>Select Team A</option>
                {teams?.getTeams?.code === 200 &&
                  teams?.getTeams?.data?.map((team: any) =>
                    team._id != teamBId ? (
                      <option key={team?._id} value={team?._id}>
                        {team?.name}
                      </option>
                    ) : (
                      <></>
                    )
                  )}
              </select>
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="teamBId" className="font-bold">
              Team B
            </label>

            <div>
              <select
                name="teamBId"
                id="teamBId"
                value={teamBId}
                onChange={(e) => setTeamBId(e.target.value)}
              >
                <option>Select Team B</option>
                {teams?.getTeams?.code === 200 &&
                  teams?.getTeams?.data?.map((team: any) =>
                    team._id != teamAId ? (
                      <option key={team?._id} value={team?._id}>
                        {team?.name}
                      </option>
                    ) : (
                      <></>
                    )
                  )}
              </select>
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
                value={date}
                min={minDate}
                max={maxDate}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="nets" className="font-bold">
              Nets
            </label>

            <div>
              <input
                type="number"
                name="nets"
                id="nets"
                min={1}
                placeholder="Number of Nets"
                value={numberOfNets}
                onChange={(e) => setNumberOfNets(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="rounds" className="font-bold">
              Rounds
            </label>

            <div>
              <input
                type="number"
                name="rounds"
                id="rounds"
                min={1}
                placeholder="Number of Rounds"
                value={numberOfRounds}
                onChange={(e) => setNumberOfRounds(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="pairLimit" className="font-bold">
              Pair Limit
            </label>

            <div>
              <input
                type="number"
                name="pairLimit"
                id="pairLimit"
                min={1}
                placeholder="Pair Limit"
                value={pairLimit}
                onChange={(e) => setPairLimit(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="netRange" className="font-bold">
              Net Range
            </label>

            <div>
              <input
                type="number"
                name="netRange"
                id="netRange"
                min={1}
                placeholder="Number of Net Range"
                value={netRange}
                onChange={(e) => setNetRange(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="location" className="font-bold">
              Location
            </label>

            <div>
              <input
                type="text"
                name="location"
                id="location"
                maxLength={255}
                placeholder="Location of the match"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {props?.match && (
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
          {props?.match ? (
            <button
              className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
              type="button"
              onClick={() => addUpdateMatch()}
            >
              Update Match
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
              type="button"
              onClick={() => addUpdateMatch()}
            >
              Add Match
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
