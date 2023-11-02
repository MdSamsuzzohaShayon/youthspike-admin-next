import { useEffect, useState } from 'react';
import { Modal } from '@/components/model';
import { useMutation, useQuery } from '@apollo/client';
import { ITeam } from '@/types/team';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GET_LEAGUE_DROPDOWN } from '@/graphql/league';
import { ADD_UPDATE_TEAM } from '@/graphql/teams';
import { COACH_DROPDOWN } from '@/graphql/coach';

interface AddUpdateTeamOnSuccess {
  (id: string): void;
}

interface AddUpdateTeamOnClose {
  (): void;
}

interface AddUpdateTeamProps {
  team?: ITeam;
  onSuccess?: AddUpdateTeamOnSuccess;
  onClose?: AddUpdateTeamOnClose;
  data?: any;
  addInOtherLeague?: boolean;
}

function AddUpdateTeam(props: AddUpdateTeamProps) {
  const leaguesQuery = useQuery(GET_LEAGUE_DROPDOWN);
  const coachesQuery = useQuery(COACH_DROPDOWN);
  const [name, setName] = useState(props.team?.name || '');
  const [leagueId, setLeagueId] = useState(props.team?.league?._id || '');
  const [coachId, setCoachId] = useState(props.team?.coach?._id || '');
  const [active, setActive] = useState(props?.team ? `${props?.team?.active}` : 'true');

  const [addUpdateTeam, { data, error, loading }] = useMutation(ADD_UPDATE_TEAM, {
    variables: {
      name,
      leagueId,
      coachId,
      active: active === 'true',
      changeLeague: props.addInOtherLeague ? false : props?.team?.league?._id !== leagueId || props?.team?.coach?._id !== coachId,
      reamoveCoachId: props?.team?.coach?._id !== coachId ? props?.team?.coach?._id : '',
      reamoveLeagueId: props?.team?.league?._id !== leagueId ? props?.team?.league?._id : '',
      id: props?.team?._id,
    },
  });

  useEffect(() => {
    if (data?.createOrUpdateTeam?.code === 200) {
      props?.onSuccess && props.onSuccess(data?.createOrUpdateTeam?.data?._id);
    }
  }, [data, error]);

  let updatedLeagues: { _id: any }[] = [];
  if (props?.addInOtherLeague) {
    leaguesQuery?.data?.getLeagues?.data?.map((current: { _id: any }) => {
      const find = props?.team?.teamLeaguesData?.find((curTeam: { _id: any }) => curTeam?._id === current?._id);
      if (!find) {
        updatedLeagues.push(current);
      }
    });
  } else {
    updatedLeagues = leaguesQuery?.data?.getLeagues?.data;
  }

  return (
    <>
      <Modal showModal onClose={() => props.onClose && props.onClose()}>
        <form className="form w-100">
          <div className="flex flex-row flex-wrap">
            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="name" className="font-bold">
                Name
              </label>

              <div>
                <input type="text" name="name" id="name" placeholder="Team Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="leagueId" className="font-bold">
                League
              </label>

              <div>
                <select name="leagueId" id="leagueId" value={leagueId} onChange={(e) => setLeagueId(e.target.value)}>
                  <option>Select a league</option>
                  {updatedLeagues?.map((league: any) => (
                    <option key={league?._id} value={league?._id}>
                      {league?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="coachId" className="font-bold">
                Coach
              </label>

              <div>
                <select name="coachId" id="coachId" value={coachId} onChange={(e) => setCoachId(e.target.value)}>
                  <option>Select a coach</option>
                  {coachesQuery?.data?.getCoaches?.code === 200 &&
                    coachesQuery?.data?.getCoaches?.data?.map((coach: any) => (
                      <option key={coach?._id} value={coach?._id}>
                        {coach?.firstName}&nbsp;{coach?.lastName}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {props?.team && (
              <div className="w-full md:w-1/2 lg:w-1/3 my-2">
                <label htmlFor="active" className="font-bold">
                  Active
                </label>

                <div>
                  <select name="active" id="active" value={active} onChange={(e) => setActive(e.target.value)}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <hr />

          <div className="my-2">
            {props?.team ? (
              <button
                className="transform hover:bg-slate-800 transition duration-300 hover:scale-105 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
                type="button"
                onClick={() => {
                  let isNameError = false;
                  let isSameCoachError = false;
                  let alreadyRegister = false;
                  props?.data?.forEach((current: { league: any; name: string; coach: { _id: string } }) => {
                    if (props?.addInOtherLeague) {
                      if (!alreadyRegister && current?.league?._id === leagueId && current?.name === props?.team?.name) {
                        alreadyRegister = true;
                      }
                    }
                    if (current?.league?._id === leagueId) {
                      if (name !== props?.team?.name && current?.name === name && !isNameError) {
                        isNameError = true;
                      }
                      if (coachId !== props?.team?.coach?._id && !isSameCoachError && current?.coach?._id === coachId) {
                        isSameCoachError = true;
                      }
                    }
                  });

                  if (isNameError) {
                    toast('Team name is already registred in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else if (isSameCoachError) {
                    toast('This coach is already assign to another team in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else if (props?.addInOtherLeague) {
                    if (alreadyRegister) {
                      toast('This team already register for same league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                    } else {
                      addUpdateTeam();
                    }
                  } else if (coachId?.length === 0) {
                    toast('Please select the league & coach.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else {
                    addUpdateTeam();
                  }
                }}
              >
                {props?.addInOtherLeague ? 'Add In Another League' : 'Update Team'}
              </button>
            ) : (
              <button
                className="transform hover:bg-slate-800 transition duration-300 hover:scale-105 text-white bg-slate-700 dark:divide-gray-70 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2"
                type="button"
                onClick={() => {
                  let isNameError = false;
                  let isSameCoachError = false;
                  props?.data?.forEach((current: { _id: string; league: any; name: string; coach: { _id: string } }) => {
                    if (current?.league?._id === leagueId) {
                      if (current?.name === name && !isNameError) {
                        isNameError = true;
                      }
                      if (!isSameCoachError && current?.coach?._id === coachId) {
                        isSameCoachError = true;
                      }
                    }
                  });
                  if (isNameError) {
                    toast('Team name is already registred in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else if (isSameCoachError) {
                    toast('This coach is already assign to another team in the league.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else if (coachId?.length === 0) {
                    toast('Please select the league & coach.', { hideProgressBar: false, autoClose: 7000, type: 'error' });
                  } else {
                    addUpdateTeam();
                  }
                }}
              >
                Add Team
              </button>
            )}

            <button
              type="button"
              onClick={props.onClose}
              className="transform hover:bg-red-600 transition duration-300 hover:scale-105 text-white bg-red-500 font-medium rounded-lg text-sm px-6 py-3.5 text-center inline-flex items-center mr-2 mb-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default AddUpdateTeam;
