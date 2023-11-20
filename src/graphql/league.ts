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
const ADD_UPDATE_LEAGUE_RAW = `
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
      directorId
      divisions
      homeTeam
      name
      location
      nets
    }
  }
}
`;
const ADD_UPDATE_LEAGUE = gql`${ADD_UPDATE_LEAGUE_RAW}`;

export { GET_LEAGUES, ADD_UPDATE_LEAGUE, ADD_UPDATE_LEAGUE_RAW };
