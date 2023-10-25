/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

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

export { GET_LEAGUES };
