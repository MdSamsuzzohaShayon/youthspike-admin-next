import { gql } from '@apollo/client';

/**
 * Query
 * =========================================================================================================================================
 */
const GET_TEAMS_BY_LEAGUE = gql`
  query GetTeams($leagueId: String) {
    getTeams (leagueId: $leagueId){
      code
      message
      success
      data {
        _id
        active
        coachId
        leagueId
        name
        coach {
          _id
          active
          firstName
          lastName
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

export { GET_TEAMS_BY_LEAGUE, ADD_UPDATE_TEAM };
