import { gql } from '@apollo/client';

/**
 * Query
 * =========================================================================================================================================
 */
const GET_TEAM_DROPDOWN = gql`
  query GetTeams($userId: String) {
    getTeams(userId: $userId) {
      code
      success
      message
      data {
        _id
        name
        league {
          _id
          name
        }
      }
    }
  }
`;

// FAP = for adding player
const GET_TEAM_DROPDOWN_FAP = gql`
  query GetTeams($userId: String) {
    getTeams(userId: $userId) {
      code
      success
      message
      data {
        _id
        name
        leagueId
      }
    }
  }
`;

// FM = for matches
const GET_TEAMS_FM = gql`
  query GetTeams($userId: String) {
    getTeams(userId: $userId) {
      code
      success
      data {
        _id
        name
        coachId
        leagueId
      }
    }
  }
`;

const GET_TEAMS = gql`
  query GetTeams($userId: String) {
    getTeams(userId: $userId) {
      code
      success
      data {
        _id
        name
        active
        coach {
          _id
          firstName
          lastName
          login {
            email
          }
        }
        league {
          _id
          name
        }
      }
      teamWithLeagues {
        teamId
        leagueIds
      }
    }
  }
`;

// NTWL = No team with leagues
const GET_TEAMS_NTWL = gql`
  query GetTeams {
    getTeams {
      code
      success
      data {
        _id
        name
        active
        coach {
          _id
          firstName
          lastName
          login {
            email
          }
        }
        league {
          _id
          name
        }
      }
    }
  }
`;

/**
 * Mutation
 * =========================================================================================================================================
 */
const ADD_UPDATE_TEAM = gql`
  mutation CreateOrUpdateTeam(
    $name: String!
    $active: Boolean!
    $coachId: String!
    $leagueId: String!
    $reamoveLeagueId: String
    $changeLeague: Boolean
    $reamoveCoachId: String
    $id: String
  ) {
    createOrUpdateTeam(
      name: $name
      active: $active
      coachId: $coachId
      leagueId: $leagueId
      reamoveLeagueId: $reamoveLeagueId
      changeLeague: $changeLeague
      reamoveCoachId: $reamoveCoachId
      id: $id
    ) {
      code
      success
      message
      data {
        _id
      }
    }
  }
`;

export { GET_TEAMS, GET_TEAMS_NTWL, GET_TEAM_DROPDOWN, GET_TEAM_DROPDOWN_FAP, GET_TEAMS_FM, ADD_UPDATE_TEAM };
