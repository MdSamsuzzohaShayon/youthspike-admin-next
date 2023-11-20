import { gql } from "@apollo/client";

const GET_LDOS = gql`
  query GetLeagueDirectors {
    getLeagueDirectors {
      code
      message
      success
      data {
        _id
        name
        logo
        director {
          _id
          active
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

const GET_LDO = gql`
  query GetLeagueDirector($dId: String) {
    getLeagueDirector(dId: $dId) {
      code
      message
      success
      data {
        _id
        name
        logo
        director {
          _id
          firstName
          lastName
          role
          login {
            email
          }
        }
      }
    }
  }
`;

const UPDATE_DIRECTOR_RAW = `
mutation UpdateDirector($args: UpdateDirectorArgs!, $dId: String, $logo: Upload) {
  updateDirector(args: $args, dId: $dId, logo: $logo) {
    code
    message
    success
    data {
      logo
      name
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

const UPDATE_DIRECTOR = gql`
  ${UPDATE_DIRECTOR_RAW}
`;

export { GET_LDO, GET_LDOS, UPDATE_DIRECTOR, UPDATE_DIRECTOR_RAW };
