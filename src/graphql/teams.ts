import { gql } from "@apollo/client";

const teamResponse = `
      _id
      active
      name
      event {
        _id
        name
      }
      players {
        _id
        firstName
        lastName
        rank
      }
      captain {
        _id
        firstName
        lastName
        rank
      }
`;

/**
 * Query
 * =========================================================================================================================================
 */
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

export { GET_TEAMS_BY_EVENT, ADD_A_TEAM };
