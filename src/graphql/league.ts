import { gql } from '@apollo/client';

/**
 * Query
 * =========================================================================================================================================
 */
const GET_LEAGUES = gql`
  query GetLeagues {
    getLeagues {
      code
      message
      success
      data {
        _id
        active
        name
        directorId
        endDate
        playerLimit
        startDate
      }
    }
  }
`;


/**
 * Mutation
 * =========================================================================================================================================
 */
const ADD_UPDATE_LEAGUE = gql`
  mutation CreateOrUpdateLeague($name: String!, $startDate: DateTime!, $endDate: DateTime!, $playerLimit: Int!, $active: Boolean!, $id: String) {
    createOrUpdateLeague(name: $name, startDate: $startDate, endDate: $endDate, playerLimit: $playerLimit, active: $active, id: $id) {
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


export { GET_LEAGUES, ADD_UPDATE_LEAGUE };
