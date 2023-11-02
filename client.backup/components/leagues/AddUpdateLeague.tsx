import { useEffect, useState } from 'react';
import { Modal } from '@/components/model';
import { useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { ADD_UPDATE_LEAGUE } from '@/graphql/league';

interface AddUpdateLeagueOnSuccess {
  (id: string): void;
}

interface AddUpdateLeagueOnClose {
  (): void;
}

interface AddUpdateLeagueProps {
  league?: any;
  onSuccess?: AddUpdateLeagueOnSuccess;
  onClose?: AddUpdateLeagueOnClose;
}

function AddUpdateLeague(props: AddUpdateLeagueProps) {
  const date = format(new Date(), 'yyy-MM-dd');
  const [name, setName] = useState(props?.league?.name || '');

  const [startDate, setStartDate] = useState(props?.league ? format(new Date(props?.league.startDate), 'yyy-MM-dd') : date);

  const [endDate, setEndDate] = useState(props?.league ? format(new Date(props?.league.endDate), 'yyy-MM-dd') : date);

  const [playerLimit, setPlayerLimit] = useState(props?.league ? props?.league?.playerLimit : 2);

  const [active, setActive] = useState(props?.league ? `${props?.league?.active}` : 'true');

  /**
   * Mutation for creating a league
   */
  const [addUpdateLeague, { data, error, loading }] = useMutation(ADD_UPDATE_LEAGUE, {
    variables: {
      name,
      startDate,
      endDate,
      playerLimit,
      active: active === 'true',
      id: props?.league?._id,
    },
  });

  useEffect(() => {
    if (data?.createOrUpdateLeague?.code === 200) {
      props?.onSuccess && props.onSuccess(data?.createOrUpdateLeague?.data?._id);
    }
  }, [data, error]);

  return (
    <Modal showModal onClose={() => props.onClose && props.onClose()}>
      <form className="form w-100">
        <div className="flex flex-row flex-wrap">
          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="name" className="flex flex-col items-start font-bold">
              Name
              <input type="text" name="name" id="name" placeholder="League Name" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="startDate" className="flex flex-col items-start font-bold">
              Start Date
              <input
                type="date"
                name="startDate"
                id="startDate"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setEndDate(e.target.value);
                }}
              />
            </label>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="endDate" className="flex flex-col items-start font-bold">
              End Date
              <input type="date" name="endDate" id="endDate" placeholder="End Date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="playerLimit" className="flex flex-col items-start font-bold">
              Player Limit
              <input
                type="number"
                name="playerLimit"
                id="playerLimit"
                min={2}
                placeholder="Player Limit"
                value={playerLimit}
                onChange={(e) => setPlayerLimit(Number(e.target.value))}
              />
            </label>
          </div>

          {props?.league && (
            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="active" className="flex flex-col items-start font-bold">
                Active
                <select name="active" id="active" value={active} onChange={(e) => setActive(e.target.value)}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>
          )}
        </div>

        <hr />

        <div className="my-2">
          {props?.league ? (
            <button
              className="transform hover:bg-slate-800 transition duration-300 hover:scale-95 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
              type="button"
              onClick={() => addUpdateLeague()}
            >
              Update League
            </button>
          ) : (
            <button
              className="transform hover:bg-slate-800 transition duration-300 hover:scale-95 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
              type="button"
              onClick={() => addUpdateLeague()}
            >
              Add League
            </button>
          )}

          <button
            type="button"
            onClick={props.onClose}
            className="transform hover:bg-red-600 transition duration-300 hover:scale-95 text-white bg-red-500 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center mr-2 mb-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddUpdateLeague;
