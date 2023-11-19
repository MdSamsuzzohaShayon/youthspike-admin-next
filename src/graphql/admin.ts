import { gql } from "@apollo/client";

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

const REGISTER_DIRECTOR_RAW = `
  mutation CreateDirector($args: CreateDirectorArgs!, $logo: Upload) {
    createDirector(args: $args, logo: $logo) {
      code
      message
      success
      data {
        name
        logo
        director {
          _id
          firstName
          lastName
          login {
            email
          }
        }
      }
    }
  }
`;
const REGISTER_DIRECTOR = gql`
  ${REGISTER_DIRECTOR_RAW}
`;

export { LOGIN_ADMIN, REGISTER_DIRECTOR, REGISTER_DIRECTOR_RAW };
