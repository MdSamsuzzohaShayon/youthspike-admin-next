import { gql } from '@apollo/client';

/**
 * Query
 * ===========================================================================================================================
 */
const GET_COACHES_IN_DETAIL = gql`
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

// eslint-disable-next-line import/prefer-default-export
export { GET_COACHES_IN_DETAIL, COACH_DROPDOWN };
