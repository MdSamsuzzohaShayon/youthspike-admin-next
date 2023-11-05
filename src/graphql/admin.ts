import { gql } from '@apollo/client';

const LOGIN_ADMIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      code
      success
      message
      data {
        token
        user {
          _id
          firstName
          lastName
          role
          login {
            email
          }
          player {
            shirtNumber
            rank
            teamId
            leagueId

            league {
              _id
              name
            }

            team {
              _id
              name
            }
          }
          coach {
            team {
              name
              _id
              league {
                _id
                name
              }
            }
          }
          active
        }
      }
    }
  }
`;

const REGISTER_DIRECTOR = gql`
    mutation RegisterLeagueDirector($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
      registerLeagueDirector(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
        code
        message
        success
        data {
          _id
          active
          firstName
          lastName
        }
      }
    }
`;

export { LOGIN_ADMIN, REGISTER_DIRECTOR };
