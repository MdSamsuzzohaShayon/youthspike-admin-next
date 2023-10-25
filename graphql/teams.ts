import { gql } from '@apollo/client';

const GET_TEAM_DROPDOWN = gql`
  query GetTeams($userId: String) {
    getTeams(userId: $userId) {
      code
      success
      message
      data {
        _id
        name
        league {
          _id
          name
        }
      }
    }
  }
`;

// FM = for matches
const GET_TEAMS_FM = gql`
  query GetTeams($userId: String) {
    getTeams(userId: $userId) {
      code
      success
      data {
        _id
        name
        coachId
        leagueId
      }
    }
  }
`;

const GET_TEAMS = gql`
  query GetTeams($userId: String) {
    getTeams(userId: $userId) {
      code
      success
      data {
        _id
        name
        active
        coach {
          _id
          firstName
          lastName
          login {
            email
          }
        }
        league {
          _id
          name
        }
      }
      teamWithLeagues {
        teamId
        leagueIds
      }
    }
  }
`;

// NTWL = No team with leagues
const GET_TEAMS_NTWL = gql`
  query GetTeams {
    getTeams {
      code
      success
      data {
        _id
        name
        active
        coach {
          _id
          firstName
          lastName
          login {
            email
          }
        }
        league {
          _id
          name
        }
      }
    }
  }
`;

export { GET_TEAMS, GET_TEAMS_NTWL, GET_TEAM_DROPDOWN, GET_TEAMS_FM };
