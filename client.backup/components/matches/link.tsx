/* eslint-disable jsx-a11y/anchor-is-valid */
import { copyTextToClipboard } from '@/utils/clipboard';
import { useQuery } from '@apollo/client';
import { GET_MATCH_LINK } from '@/graphql/matches';

function MatchLink(props: { matchId: string; teamId: string; title: string; label: string; marginEnable: boolean }) {
  const { data, error, loading } = useQuery(GET_MATCH_LINK, {
    variables: {
      matchId: props.matchId,
      teamId: props.teamId,
    },
  });
  

  const onLinkClick = (ev: any) => {
    ev.preventDefault();
    if (data) {
      window.open(data?.getMatchLink?.data, '_blank');
      copyTextToClipboard(data?.getMatchLink?.data);
    }
  };

  return (
    <a
      style={{
        marginTop: props.marginEnable ? '10px' : '0px',
      }}
      href="#"
      onClick={onLinkClick}
      className="mx-1 text-blue-500 hover:text-blue-900"
    >
      <span
        style={{
          color: 'black',
        }}
      >
        {props.label}
      </span>
      {props.title}
    </a>
  );
}

export default MatchLink;
