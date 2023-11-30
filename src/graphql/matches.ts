import { gql } from "@apollo/client";

const matchResponse = `
    _id
    date
    numberOfNets
    numberOfRounds
    location
    netRange
    pairLimit
    teamA {
      _id
      name
      captain {
        _id
        firstName
        lastName
      }
    }
    teamB {
      _id
      name
      captain {
        _id
        firstName
        lastName
      }
    }
`;

/**
 * QUERIES
 * ===========================================================================================
 */
const GET_MATCHES = gql`
  query GetMatches($eventId: String!) {
    getMatches(eventId: $eventId) {
      code
      message
      success
      data {
        ${matchResponse}
      }
    }
  }
`;

/**
 * MUTATIONS
 * ===========================================================================================
 */
const CREATE_MATCH = gql`
mutation CreateMatch($input: CreateMatchInput!) {
  createMatch(input: $input) {
    code
    message
    success
    data {
      ${matchResponse}
    }
  }
}
`;

export { GET_MATCHES, CREATE_MATCH };
