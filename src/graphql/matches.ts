import { gql } from '@apollo/client';

const GET_MATCHES = gql`
  query GetMatches($userId: String) {
    getMatches(userId: $userId) {
      code
      success
      message
      data {
        _id
        active
        teamAId
        teamBId
        leagueId
        teamA {
          _id
          name
          active
          coachId
          coach {
            _id
            firstName
            lastName
            role
            player {
              shirtNumber
              rank
              leagueId
              teamId
              team {
                _id
                name
                active
                coachId
                leagueId
              }
            }
            login {
              email
              password
            }
            active
          }
          leagueId
          players {
            _id
            firstName
            lastName
            role
            active
          }
        }
        teamB {
          _id
          name
          active
          coachId
          leagueId
        }
        league {
          _id
          name
          startDate
          endDate
          active
          playerLimit
        }
        date
        location
        numberOfNets
        numberOfRounds
        netRange
        pairLimit
      }
    }
  }
`;

const GET_MATCH_LINK = gql`
  query GetMatchLink($matchId: String!, $teamId: String!) {
    getMatchLink(id: $matchId, teamId: $teamId) {
      code
      success
      message
      data
    }
  }
`;

const ADD_UPDATE_MATCHE = gql`
  mutation ImportPlayers(
    $teamAId: String!
    $teamBId: String!
    $leagueId: String!
    $date: DateTime!
    $location: String!
    $numberOfNets: Int!
    $numberOfRounds: Int!
    $netRange: Int!
    $pairLimit: Int!
    $active: Boolean!
    $id: String
  ) {
    createOrUpdateMatch(
      teamAId: $teamAId
      teamBId: $teamBId
      leagueId: $leagueId
      date: $date
      location: $location
      numberOfNets: $numberOfNets
      numberOfRounds: $numberOfRounds
      netRange: $netRange
      pairLimit: $pairLimit
      active: $active
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

export { GET_MATCHES, ADD_UPDATE_MATCHE, GET_MATCH_LINK };
