import { gql } from '@apollo/client';

const GET_PLAYERS = gql`
  query GetPlayers($userId: String) {
    getPlayers(userId: $userId) {
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
          password
        }

        active
      }
      playerMapings {
        playerId
        teamAndLeague {
          team {
            id
            name
          }
          league {
            id
            name
          }
        }
      }
    }
  }
`;

const IMPORT_PLAYERS = gql`
  mutation ImportPlayers($leagueId: String!, $data: String!) {
    importPlayers(leagueId: $leagueId, data: $data) {
      code
      success
      message
      data
    }
  }
`;

export { GET_PLAYERS, IMPORT_PLAYERS };
