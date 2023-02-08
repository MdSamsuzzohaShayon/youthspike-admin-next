import { useEffect, useState } from "react";
import Layout, { LayoutPages } from "@/components/layout";
import { gql, useQuery } from "@apollo/client";
import { TD, TDR, TH, THR } from "@/components/table";
import AddUpdatePlayer from "@/components/players/add-update-player";
import AddPlayers from "@/components/players/add-players";
import { v4 as uuidv4 } from 'uuid';

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

export default function PlayersPage() {
  const [addUpdatePlayer, setAddUpdatePlayer] = useState(false);
  const [addPlayers, setAddPlayers] = useState(false);
  const [updatePlayer, setUpdatePlayer] = useState(null);
  const { data, refetch } = useQuery(LEAGUES);

  const onAddUpdatePlayer = () => {
    setUpdatePlayer(null);
    setAddUpdatePlayer(false);
    refetch();
  };

  const onAddUpdatePlayerClose = () => {
    setUpdatePlayer(null);
    setAddUpdatePlayer(false);
  };

  useEffect(() => console.log(data), [data]);

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
            {data?.getPlayers?.data?.map((player: any) => (
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
          ></AddUpdatePlayer>
        )}

        {addPlayers && (
          <AddPlayers
            onSuccess={onAddUpdatePlayer}
            onClose={() => setAddPlayers(false)}
          ></AddPlayers>
        )}
      </>
    </Layout>
  );
}
