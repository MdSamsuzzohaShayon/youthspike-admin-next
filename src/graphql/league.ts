import { gql } from "@apollo/client";

const commonResponse = `
  _id
  name
  startDate
  endDate
  active
  autoAssign
  autoAssignLogic
  coachPassword
  directorId
  divisions
  homeTeam
  location
  nets
  rounds
  netVariance
  rosterLock
  passcode
  timeout
  sponsors
`;

/**
 * Query
 * =========================================================================================================================================
 */
const GET_LEAGUES = gql`
  query GetLeagues($directorId: String) {
    getLeagues(directorId: $directorId) {
      code
      message
      success
      data {
        ${commonResponse}
      }
    }
  }
`;

const GET_A_LEAGUE = gql`
  query GetLeague($eventId: String!) {
    getLeague(id: $eventId) {
      code
      message
      success
      data {
        ${commonResponse}
      }
    }
  }
`;

/**
 * Mutation
 * =========================================================================================================================================
 */
const ADD_LEAGUE_RAW = `
mutation CreateLeague($sponsors: [Upload!]!, $input: CreateOrUpdateLeagueInput!) {
  createLeague(sponsors: $sponsors, input: $input) {
    code
    message
    success
    data {
      ${commonResponse}
    }
  }
}
`;

const ADD_LEAGUE = gql`${ADD_LEAGUE_RAW}`;

const UPDATE_LEAGUE_RAW = `
mutation UpdateLeague($sponsors: [Upload!]!, $input: UpdateLeagueInput!, $leagueId: String!) {
  updateLeague(sponsors: $sponsors, input: $input, leagueId: $leagueId) {
    code
    message
    success
    data {
      ${commonResponse}
    }
  }
}
`;

const UPDATE_LEAGUE = gql`${UPDATE_LEAGUE_RAW}`;

const CLONE_LEAGUE = gql`
  mutation CloneLeague($leagueId: String!) {
    cloneLeague(leagueId: $leagueId) {
      code
      message
      success
      data {
        ${commonResponse}
      }
    }
  }
`;

export { GET_LEAGUES, ADD_LEAGUE, ADD_LEAGUE_RAW , UPDATE_LEAGUE, UPDATE_LEAGUE_RAW, CLONE_LEAGUE, GET_A_LEAGUE };
