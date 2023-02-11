import { copyTextToClipboard } from "@/utils/clipboard";
import { gql, useQuery } from "@apollo/client";

const MATCH_LINK = gql`
  query GetMatchLink($matchId: String!, $teamId: String!) {
    getMatchLink(id: $matchId, teamId: $teamId) {
      code
      success
      message
      data
    }
  }
`;

export const MatchLink = (props: {
  matchId: string;
  teamId: string;
  title: string;
}) => {
  const { data, error, loading } = useQuery(MATCH_LINK, {
    variables: {
      matchId: props.matchId,
      teamId: props.teamId,
    },
  });

  const onLinkClick = (ev: any) => {
    ev.preventDefault();
    if (data) {
      window.open(data?.getMatchLink?.data, "_blank");
      copyTextToClipboard(data?.getMatchLink?.data);
    }
  };

  return (
    <a
      href="#"
      onClick={onLinkClick}
      className="mx-1 text-blue-500 hover:text-blue-900"
    >
      {props.title}
    </a>
  );
};
