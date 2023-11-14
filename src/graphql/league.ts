import { gql } from "@apollo/client";

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
  mutation CreateOrUpdateLeague($sponsors: [Upload!]!, $input: CreateOrUpdateLeagueInput!) {
    createOrUpdateLeague(sponsors: $sponsors, input: $input) {
      code
      message
      success
      data {
        _id
        active
        autoAssign
        autoAssignLogic
        coachPassword
        active
        startDate
        endDate
      }
    }
  }
`;

export { GET_LEAGUES, ADD_UPDATE_LEAGUE };
