import { gql } from '@apollo/client';

const playerResponse = `
  _id
  firstName
  lastName
  rank
  event {
    _id
    name
  }
  team {
    _id
    name
  }
`;


const GET_PLAYERS = gql`
query GetPlayers($eventId: String!) {
  getPlayers(eventId: $eventId) {
    code
    message
    success
    data {
      ${playerResponse}
    }
  }
}
`;

const IMPORT_PLAYERS = gql`
  mutation ImportPlayers($leagueId: String!, $data: String!) {
    importPlayers(leagueId: $leagueId, data: $data) {
      code
      success
      message
      data {
        ${playerResponse}
      }
    }
  }
`;

const CREATE_PLAYER_RAW = `
mutation CreatePlayer($input: CreatePlayerInput!) {
  createPlayer(input: $input) {
    code
    message
    success
    data {
      ${playerResponse}
    }
  }
}
`;

const CREATE_PLAYER = gql`${CREATE_PLAYER_RAW}`;

export { GET_PLAYERS, IMPORT_PLAYERS, CREATE_PLAYER_RAW, CREATE_PLAYER };
