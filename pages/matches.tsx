import { useEffect, useState } from "react";
import Layout, { LayoutPages } from "@/components/layout";
import { Modal } from "@/components/model";
import { gql, useMutation, useQuery } from "@apollo/client";
import { TD, TDR, TH, THR } from "@/components/table";
import { format } from "date-fns";
import { MatchLink } from "@/components/matches/link";
import { v4 as uuidv4 } from 'uuid';
import { IMatch } from "@/types/match";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useRouter } from "next/router";

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
  const [updateMatch, setUpdateMatch] = useState<any>(null);
  const { data, error, loading, refetch } = useQuery(MATCHES);
  const router = useRouter();

  useEffect(() => {
    refetch();
  }, [router.asPath])
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
                        title={match?.teamA?.name}
                        label="Team A: "
                        marginEnable={false}
                      ></MatchLink>

                      <MatchLink
                        matchId={match?._id}
                        teamId={match?.teamBId}
                        title={match?.teamB?.name}
                        label="Team B: "
                        marginEnable={true}
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
            key={uuidv4()}
            onSuccess={onAddUpdateMatch}
            match={updateMatch}
            onClose={onAddUpdateMatchClose}
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
        coachId
        leagueId
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
  match?: IMatch | undefined;
  onSuccess?: AddUpdateMatchOnSuccess;
  onClose?: AddUpdateMatchOnClose;
}

function AddUpdateMatch(props: AddUpdateMatchProps) {
  const { data: leagues } = useQuery(LEAGUES);
  const { data: teams } = useQuery(TEAMS, { variables: props?.match?.leagueId || "" });

  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // add leading zero to single-digit months
  const day = now.getDate().toString().padStart(2, '0'); // add leading zero to single-digit days
  const uperLimit = new Date();
  const lowerLimit = new Date();
  uperLimit.setDate(now.getDate() + 60);
  lowerLimit.setDate(now.getDate() - 60);
  const [minDate, setMinDate] = useState(format(lowerLimit, "yyyy-MM-dd"));
  const [maxDate, setMaxDate] = useState(format(uperLimit, "yyyy-MM-dd"));
  const [teamAId, setTeamAId] = useState(props?.match?.teamAId || "");
  const [teamBId, setTeamBId] = useState(props?.match?.teamBId || "");
  const [numberOfNets, setNumberOfNets] = useState(props?.match?.numberOfNets ?? 3);
  const [numberOfRounds, setNumberOfRounds] = useState(props?.match?.numberOfRounds ?? 4);
  const [location, setLocation] = useState(props?.match?.location || "");
  const [netRange, setNetRange] = useState(props?.match?.netRange ?? 3);
  const [pairLimit, setPairLimit] = useState(props.match?.pairLimit ?? 2);
  const [active, setActive] = useState(props.match?.active.toString() ?? "true");
  const matchDate = props.match?.date.toString().slice(0, 10);
  const [date, setDate] = useState(matchDate ?? `${year}-${month}-${day}`);
  const [leagueId, setLeagueId] = useState(props?.match?.leagueId || "");
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

    if (data?.createOrUpdateMatch?.code === 200) {
      props?.onSuccess && props.onSuccess(data?.createOrUpdateMatch?.data?._id);
    }
  }, [data, error]);

  function addOrUpdateMatch() {
    const allTeams: Array<any> = teams?.getTeams?.data ?? [];
    const isTeamACoachExist = allTeams.find((cur) => cur._id == teamAId && cur?.coachId?.trim()?.length > 0);
    const isTeamBCoachExist = allTeams.find((cur) => cur._id == teamBId && cur?.coachId?.trim()?.length > 0);
    const teamAName = allTeams.find((cur) => cur._id == teamAId).name;
    const teamBName = allTeams.find((cur) => cur._id == teamBId).name;

    if (!isTeamACoachExist) {
      toast(`Coach is not Assigned to ${teamAName}`, { toastId: 'coachNotExist', hideProgressBar: false, autoClose: 7000, type: 'error' });
    } else if (!isTeamBCoachExist) {
      toast(`Coach is not Assigned to ${teamBName}`, { toastId: 'coachNotExist', hideProgressBar: false, autoClose: 7000, type: 'error' });
    } else {
      addUpdateMatch();
    }
  }

  const updatedTeams = teams?.getTeams?.data?.filter((current: { leagueId: string; }) => current?.leagueId === leagueId)
  return (
    <>
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

                    // league &&
                    //   setMinDate(
                    //     format(new Date(league?.startDate), "yyyy-MM-dd")
                    //   );
                    // league &&
                    //   setMaxDate(format(new Date(league?.endDate), "yyyy-MM-dd"));
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
                    updatedTeams?.map((team: any) =>
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
                    updatedTeams?.map((team: any) =>
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
                onClick={() => addOrUpdateMatch()}
              >
                Update Match
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
                type="button"
                onClick={() => addOrUpdateMatch()}
              >
                Add Match
              </button>
            )}

            <button onClick={() => props?.onClose && props.onClose()} className="bg-red-100 font-bold rounded p-4 mx-2">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer />
    </>
  );
}
