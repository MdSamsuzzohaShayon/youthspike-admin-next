import { gql /* , useQuery */, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { Modal } from "../model";

const TEAM_DROPDOWN = gql`
  query GetTeams {
    getTeams {
      code
      success
      message
      data {
        _id
        name
      }
    }
  }
`;

const ADD_UPDATE_LEAGUE = gql`
  mutation SignupCoach(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    signupCoach(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      code
      data {
        _id
      }
    }
  }
`;

interface AddUpdateCoachOnSuccess {
  (id: string): void;
}

interface AddUpdateCoachOnClose {
  (): void;
}

interface AddUpdateCoachProps {
  coach?: any;
  onSuccess?: AddUpdateCoachOnSuccess;
  onClose?: AddUpdateCoachOnClose;
}

export default function AddUpdateCoach(props: AddUpdateCoachProps) {
  // const teamsQuery = useQuery(TEAM_DROPDOWN);

  const [email, setEmail] = useState(props?.coach?.login?.email || "");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(props?.coach?.firstName || "");
  const [lastName, setLastName] = useState(props?.coach?.lastName || "");

  const [active, setActive] = useState(
    props?.coach ? props?.coach?.active + "" : "true"
  );

  const [addUpdateCoach, { data, error, loading }] = useMutation(
    ADD_UPDATE_LEAGUE,
    {
      variables: {
        firstName,
        lastName,
        email,
        password,
        id: props?.coach?._id,
      },
    }
  );

  useEffect(() => {
    if (data?.createOrUpdateCoach?.code === 200) {
      props?.onSuccess && props.onSuccess(data?.createOrUpdateCoach?.data?._id);
    } else if (error) {
      console.log(JSON.parse(JSON.stringify(error)));
    }
  }, [props, data, error]);

  return (
    <Modal showModal={true} onClose={() => props.onClose && props.onClose()}>
      <form className="form w-100">
        <div className="flex flex-row flex-wrap">
          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="firstName" className="font-bold">
              First Name
            </label>

            <div>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="lastName" className="font-bold">
              Last Name
            </label>

            <div>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="email" className="font-bold">
              Email
            </label>

            <div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="password" className="font-bold">
              Password
            </label>

            <div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                minLength={6}
                maxLength={16}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* <div className="w-full md:w-1/2 lg:w-1/3 my-2">
            <label htmlFor="teamId" className="font-bold">
              Team
            </label>

            <div>
              <select
                name="teamId"
                id="teamId"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
              >
                <option>Select a team</option>
                {teamsQuery?.data?.getTeams?.code === 200 &&
                  teamsQuery?.data?.getTeams?.data?.map((team: any) => (
                    <option key={team?._id} value={team?._id}>
                      {team?.name}
                    </option>
                  ))}
              </select>
            </div>
          </div> */}

          {props?.coach && (
            <div className="w-full md:w-1/2 lg:w-1/3 my-2">
              <label htmlFor="active" className="font-bold">
                Active
              </label>

              <div>
                <select
                  name="active"
                  id="active"
                  value={active}
                  onChange={(e) => setActive(e.target.value)}
                >
                  <option value={"true"}>Yes</option>
                  <option value={"false"}>No</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <hr />

        <div className="my-2">
          {props?.coach ? (
            <button
              className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
              type="button"
              onClick={() => addUpdateCoach()}
            >
              Update Coach
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white font-bold rounded p-4 mx-2"
              type="button"
              onClick={() => addUpdateCoach()}
            >
              Add Coach
            </button>
          )}

          <button className="bg-red-100 font-bold rounded p-4 mx-2">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
