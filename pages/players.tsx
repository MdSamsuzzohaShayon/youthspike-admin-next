import { useEffect, useState } from "react";
import Layout, { LayoutPages } from "@/components/layout";
import { gql, useQuery } from "@apollo/client";
import { TD, TDR, TH, THR } from "@/components/table";
import AddUpdatePlayer from "@/components/players/add-update-player";
import AddPlayers from "@/components/players/add-players";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router";

const LEAGUES = gql`
  query GetPlayers {
    getPlayers {
      code
      success
      message
      data {
        _id
        firstName
        lastName
        role

        player {
          shirtNumber
          rank
          teamId
          leagueId

          league {
            _id
            name
          }

          team {
            _id
            name
          }
        }

        login {
          email
        }

        active
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

export default function PlayersPage() {
  const teamsQuery = useQuery(TEAM_DROPDOWN);
  const [teamId, setTeamId] = useState('');
  const [addUpdatePlayer, setAddUpdatePlayer] = useState(false);
  const [addPlayers, setAddPlayers] = useState(false);
  const [updatePlayer, setUpdatePlayer] = useState(null);
  const { data, refetch } = useQuery(LEAGUES);
  const [updatedPlayers, setUpdatedPlayers] = useState([]);

  const router = useRouter();

  useEffect(() => {
    refetch();
  }, [router.asPath])

  useEffect(() => {
    if (data?.getPlayers?.data) {
      let updatedPlayers = data?.getPlayers?.data;
      if (teamId && (teamId !== 'Select a team')) {
        updatedPlayers = data?.getPlayers?.data?.filter((current: { player: { teamId: string; }; }) => current?.player?.teamId === teamId);
      }
      setUpdatedPlayers(updatedPlayers)
    }
  }, [data, teamId, refetch])

  const onAddUpdatePlayer = () => {
    setUpdatePlayer(null);
    setAddUpdatePlayer(false);
    setAddPlayers(false);
    refetch()
  };

  const onAddUpdatePlayerClose = () => {
    setUpdatePlayer(null);
    setAddUpdatePlayer(false);
  };

  return (
    <Layout title="Players" page={LayoutPages.players}>
      <>
        <div className="flex flex-row-reverse p-4">
          <button
            className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
            onClick={() => setAddPlayers(true)}
          >
            Import Players
          </button>

          <button
            className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
            onClick={() => setAddUpdatePlayer(true)}
          >
            Add a Player
          </button>
          <div style={{
            marginRight: 'auto',
            border: '2px solid #3b82f6',
            borderRadius: '8px'
          }}>
            <select
              name="teamId"
              id="teamId"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              style={{
                height: '100%',
                borderRadius: '8px',
                padding: '8px'
              }}
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

        <table className="app-table w-full">
          <thead className="w-full">
            <THR>
              <>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Shirt Number</TH>
                <TH>Rank</TH>
                <TH>Team</TH>
                <TH>League</TH>
                <TH>Active</TH>
                <TH>Actions</TH>
              </>
            </THR>
          </thead>

          <tbody className="w-full">
            {updatedPlayers?.map((player: any) => (
              <TDR key={player?._id}>
                <>
                  <TD>
                    <>
                      {player?.firstName}&nbsp;{player?.lastName}
                    </>
                  </TD>
                  <TD>{player?.login?.email}</TD>
                  <TD>{player?.player?.shirtNumber}</TD>
                  <TD>{player?.player?.rank}</TD>
                  <TD>{player?.player?.team?.name}</TD>
                  <TD>{player?.player?.league?.name}</TD>
                  <TD>{player?.active ? "Yes" : "No"}</TD>
                  <TD>
                    <button
                      className="btn btn-sm bg-blue-200 p-2 rounded"
                      onClick={() => {
                        setUpdatePlayer(player);
                        setAddUpdatePlayer(true);
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

        {addUpdatePlayer && (
          <AddUpdatePlayer
            key={uuidv4()}
            onSuccess={onAddUpdatePlayer}
            player={updatePlayer}
            onClose={onAddUpdatePlayerClose}
            data={data?.getPlayers?.data}
          />
        )}

        {addPlayers && (
          <AddPlayers
            onSuccess={onAddUpdatePlayer}
            onClose={() => setAddPlayers(false)}
            data={data?.getPlayers?.data}
          />
        )}
      </>
    </Layout>
  );
}
