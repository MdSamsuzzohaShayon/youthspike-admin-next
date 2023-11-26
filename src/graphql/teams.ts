import { gql } from '@apollo/client';

/**
 * Query
 * =========================================================================================================================================
 */
const GET_TEAMS_BY_EVENT = gql`
  query GetTeams($eventId: String) {
    getTeams (eventId: $eventId){
      code
      message
      success
      data {
        _id
        active
        coachId
        eventId
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
    $eventId: String!
    $reamoveEventId: String
    $changeEvent: Boolean
    $reamoveCoachId: String
    $id: String
  ) {
    createOrUpdateTeam(
      name: $name
      active: $active
      coachId: $coachId
      eventId: $eventId
      reamoveEventId: $reamoveEventId
      changeEvent: $changeEvent
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

export { GET_TEAMS_BY_EVENT, ADD_UPDATE_TEAM };
