import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { Modal } from "../model";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

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

interface AddUpdatePlayerOnSuccess {
  (id: string): void;
}

interface AddUpdatePlayerOnClose {
  (): void;
}

interface AddUpdatePlayerProps {
  player?: any;
  onSuccess?: AddUpdatePlayerOnSuccess;
  onClose?: AddUpdatePlayerOnClose;
  data?: any,
}

export default function AddUpdatePlayer(props: AddUpdatePlayerProps) {
  const leaguesQuery = useQuery(LEAGUE_DROPDOWN);
  const teamsQuery = useQuery(TEAM_DROPDOWN);

  const [email, setEmail] = useState(props?.player?.login?.email || "");
  const [firstName, setFirstName] = useState(props?.player?.firstName || "");
  const [lastName, setLastName] = useState(props?.player?.lastName || "");
  const [teamId, setTeamId] = useState(props?.player?.player?.teamId || "UnAssigned");
  const [rank, setRank] = useState(props?.player?.player?.rank || 1);

  const [shirtNumber, setShirtNumber] = useState(
    props?.player?.player.shirtNumber || 1
  );

  const [leagueId, setLeagueId] = useState(
    props?.player?.player.leagueId || ""
  );

  const [active, setActive] = useState(
    props?.player ? props?.player?.active + "" : "true"
  );

  const [role, setRole] = useState(props?.player?.role || 'player');

  const [addUpdatePlayer, { data, error, loading }] = useMutation(
    ADD_UPDATE_LEAGUE,
    {
      variables: {
        firstName,
        lastName,
        shirtNumber,
        rank,
        leagueId,
        teamId: teamId === 'Select a team' ? 'UnAssigned' : teamId,
        active: active === "true" ? true : false,
        email,
        id: props?.player?._id,
      },
    }
  );

  const handleAddPlayer = () => {
    let isPresent = false;
    let alreadyPresentInTheLeague = false;
    props?.data?.forEach((current: {
      _id: any;
      player: any; login: { email: any; };
    }) => {
      if (current?.login?.email === email) {
        isPresent = true
      }
      if (props?.player?._id !== current?._id && props?.player?.player?.league?.leagueId === current?.player?.leagueId) {
        alreadyPresentInTheLeague = current?.player?.teamId === teamId;
      }
    })

    if (isPresent && props?.player?.login?.email !== email) {
      toast('Email id is already registered.', { toastId: 'blockuser', hideProgressBar: false, autoClose: 7000, type: 'error' });
    } else if (alreadyPresentInTheLeague) {
      toast('Player is already present in the league in another team.', { toastId: 'blockuser', hideProgressBar: false, autoClose: 7000, type: 'error' });
    } else {
      addUpdatePlayer();
    }
  }

  useEffect(() => {
    if (data?.createOrUpdatePlayer?.code === 200) {
      props?.onSuccess &&
        props.onSuccess(data?.createOrUpdatePlayer?.data?._id);
    } else if (error) {
      console.log(JSON.parse(JSON.stringify(error)));
    }
  }, [data, error]);

  return (
    <>
      <Modal showModal={true} onClose={() => props.onClose && props.onClose()}>
        <form className="form w-100">
          <div className="flex flex-row flex-wrap">
            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="firstName" className="font-bold">
                First Name
              </label>

              <div>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="lastName" className="font-bold">
                Last Name
              </label>

              <div>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="email" className="font-bold">
                Email
              </label>

              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="shirtNumber" className="font-bold">
                Shirt Number
              </label>

              <div>
                <input
                  type="number"
                  name="shirtNumber"
                  id="shirtNumber"
                  placeholder="Shirt Number"
                  value={shirtNumber}
                  min="1"
                  onChange={(e) => setShirtNumber(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="rank" className="font-bold">
                Rank
              </label>

              <div>
                <input
                  type="number"
                  name="rank"
                  id="rank"
                  placeholder="Rank"
                  value={rank}
                  min="1"
                  onChange={(e) => setRank(Number(e.target.value))}
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
              <label htmlFor="teamId" className="font-bold">
                Team
              </label>

              <div>
                <select
                  name="teamId"
                  id="teamId"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                >
                  <option>Select a team</option>
                  {teamsQuery?.data?.getTeams?.code === 200 &&
                    teamsQuery?.data?.getTeams?.data?.map((team: any) => (
                      <option key={team?._id} value={team?._id}>
                        {team?.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="roll" className="font-bold">
                Roll
              </label>

              <div>
                <select
                  name="role"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="player">Player</option>
                  <option value="coach">Coach</option>
                </select>
              </div>
            </div>

            {props?.player && (
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
            {props?.player ? (
              <button
                className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
                type="button"
                onClick={() => handleAddPlayer()}
              >
                Update Player
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
                type="button"
                onClick={() => handleAddPlayer()}
              >
                Add Player
              </button>
            )}

            <button className="bg-red-100 font-bold rounded p-4 mx-2">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer />
    </>
  );
}
