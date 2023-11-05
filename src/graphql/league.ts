import { gql } from '@apollo/client';

/**
 * Query
 * =========================================================================================================================================
 */
const GET_LEAGUES = gql`
  query GetLeagues($userId: String) {
    getLeagues(userId: $userId) {
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

// FM = for matches
const GET_LEAGUES_FM = gql`
  query GetLeagues {
    getLeagues {
      code
      success
      message
      data {
        _id
        name
        startDate
        endDate
      }
    }
  }
`;

const GET_LEAGUE_DROPDOWN = gql`
  query GetLeagues {
    getLeagues {
      code
      success
      message
      data {
        _id
        name
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

// FP = for players
const ADD_UPDATE_LEAGUE_FP = gql`
   mutation CreateOrUpdatePlayer(
    $firstName: String!
    $lastName: String!
    $shirtNumber: Int!
    $rank: Int!
    $leagueId: String!
    $teamId: String!
    $active: Boolean!
    $email: String
    $ondelete: Boolean
    $id: String
  ) {
    createOrUpdatePlayer(
      firstName: $firstName
      lastName: $lastName
      shirtNumber: $shirtNumber
      rank: $rank
      leagueId: $leagueId
      teamId: $teamId
      active: $active
      email: $email
      ondelete: $ondelete
      id: $id
    ) {
      code
      data {
        _id
      }
    }
  }
`;
// FP = For players
const ADD_UPDATE_LEAGUE_FP_2 = gql`
  mutation CreateOrUpdatePlayer(
    $firstName: String!
    $lastName: String!
    $shirtNumber: Int!
    $rank: Int!
    $leagueId: String!
    $teamId: String!
    $active: Boolean!
    $email: String
    $role: String
    $password: String
    $onLeagueOrTeamChange: Boolean
    $removedTeam: String
    $removedLeague: String
    $id: String
  ) {
    createOrUpdatePlayer(
      firstName: $firstName
      lastName: $lastName
      shirtNumber: $shirtNumber
      rank: $rank
      leagueId: $leagueId
      teamId: $teamId
      active: $active
      email: $email
      role: $role
      password: $password
      onLeagueOrTeamChange: $onLeagueOrTeamChange
      removedTeam: $removedTeam
      removedLeague: $removedLeague
      id: $id
    ) {
      code
      data {
        _id
      }
    }
  }
`;


export { GET_LEAGUES, ADD_UPDATE_LEAGUE, GET_LEAGUE_DROPDOWN, ADD_UPDATE_LEAGUE_FP, GET_LEAGUES_FM, ADD_UPDATE_LEAGUE_FP_2 };
