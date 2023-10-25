/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

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

export { ADD_UPDATE_LEAGUE };
