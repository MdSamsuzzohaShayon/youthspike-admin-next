import { gql } from "@apollo/client";

const teamResponse = `
    _id
    active
    name
    players {
      _id
      firstName
      lastName
      rank
      captainofteam {
        _id
        name
      }
      captainuser {
        _id
        firstName
        lastName
      }
    }
    captain {
      _id
      firstName
      lastName
      rank
      captainofteam {
        _id
        name
      }
      captainuser {
        _id
        firstName
        lastName
        login {
          email
          password
        }
      }
    }
`;

/**
 * Query
 * =========================================================================================================================================
 */
const GET_A_TEAM = gql`
  query GetTeam($teamId: String!) {
    getTeam(teamId: $teamId) {
      code
      message
      success
      data {
      ${teamResponse}
      }
    }
  }
`;

const GET_TEAMS_BY_EVENT = gql`
  query GetTeams($eventId: String) {
    getTeams(eventId: $eventId) {
      code
      message
      success
      data {
        ${teamResponse}
      }
    }
  }
`;

/**
 * Mutation
 * =========================================================================================================================================
 */

const ADD_A_TEAM = gql`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      code
      message
      success
      data {
        ${teamResponse}
      }
    }
  }
`;

export { GET_TEAMS_BY_EVENT, ADD_A_TEAM, GET_A_TEAM };
