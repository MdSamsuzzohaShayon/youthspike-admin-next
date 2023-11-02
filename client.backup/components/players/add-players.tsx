import { readCSVFile } from '@/utils/csv';
import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_LEAGUE_DROPDOWN } from '@/graphql/league';
import { IMPORT_PLAYERS } from '@/graphql/players';
import { Modal } from '../model';

interface AddPlayersOnSuccess {
  (): void;
}

interface AddPlayersOnClose {
  (): void;
}

interface AddPlayersProps {
  onSuccess?: AddPlayersOnSuccess;
  onClose?: AddPlayersOnClose;
  data?: any;
  userID?: any;
  userRole?: any;
}

export default function AddPlayers(props: AddPlayersProps) {
  const [leagueId, setLeagueId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { data: leagues } = useQuery(GET_LEAGUE_DROPDOWN, {
    variables: { userId: props.userRole !== 'admin' && props.userRole !== 'player' ? props.userID : null },
  });
  const [importPlayers, { data }] = useMutation(IMPORT_PLAYERS);

  useEffect(() => {
    if (data?.importPlayers?.data) {
      props?.onSuccess && props?.onSuccess();
    }
  }, [data]);

  const addImportPlayers = async () => {
    try {
      if (!file) return;
      const fileText = await readCSVFile(file);
      await importPlayers({
        variables: {
          leagueId,
          data: fileText,
        },
      });
    } catch (err) {
      console.log(JSON.parse(JSON.stringify(err)));
    }
  };

  return (
    <Modal showModal onClose={() => props.onClose && props.onClose()}>
      <form className="form w-100">
        <div className="flex flex-row flex-wrap">
          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="leagueId" className="flex flex-col items-start font-bold">
              League
              <select name="leagueId" id="leagueId" value={leagueId} onChange={(e) => setLeagueId(e.target.value)}>
                <option>Select a league</option>
                {leagues?.getLeagues?.code === 200 &&
                  leagues?.getLeagues?.data?.map((league: any) => (
                    <option key={league?._id} value={league?._id}>
                      {league?.name}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="firstName" className="flex flex-col items-start font-bold">
              Select File
              <input
                type="file"
                onChange={(e) => {
                  if (e?.target.files?.length) setFile(e?.target.files[0]);
                }}
              />
            </label>
          </div>
        </div>

        <hr />

        <div className="my-2">
          <button
            className="transform hover:bg-slate-800 transition duration-300 hover:scale-105 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
            type="button"
            onClick={() => addImportPlayers()}
            disabled={!file || !leagueId}
          >
            Add Players
          </button>

          <button
            onClick={props.onClose}
            type="button"
            className="transform hover:bg-red-600 transition duration-300 hover:scale-105 text-white bg-red-500 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center mr-2 mb-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
