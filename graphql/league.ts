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

// FT = For Teams
const ADD_UPDATE_LEAGUE_FT = gql`
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

export { GET_LEAGUES, ADD_UPDATE_LEAGUE, GET_LEAGUE_DROPDOWN, ADD_UPDATE_LEAGUE_FT, ADD_UPDATE_LEAGUE_FP, GET_LEAGUES_FM };
