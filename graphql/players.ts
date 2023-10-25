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

// eslint-disable-next-line import/prefer-default-export
export { GET_PLAYERS };
