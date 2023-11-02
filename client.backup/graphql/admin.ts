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

// eslint-disable-next-line import/prefer-default-export
export { LOGIN_ADMIN };
