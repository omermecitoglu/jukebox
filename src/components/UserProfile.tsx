import { faSignOut } from "@fortawesome/free-solid-svg-icons/faSignOut";
import React, { useEffect } from "react";
import { deleteAccessToken } from "~/redux/features/user";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import CoolButton from "./CoolButton";

const UserProfile = () => {
  const accessTokenExpiration = useAppSelector(state => state.user.accessTokenExpiration);
  const picture = useAppSelector(state => state.user.picture);
  const name = useAppSelector(state => state.user.name);
  const tag = useAppSelector(state => state.user.tag);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const expired = (accessTokenExpiration || Infinity) < Date.now();
    if (expired) {
      dispatch(deleteAccessToken());
    }
  }, [accessTokenExpiration]);

  if (!picture || !name || !tag) {
    return <div />;
  }

  return (
    <div className="d-grid gap-3">
      <table>
        <tbody>
          <tr>
            <td>
              <img
                src={picture}
                alt="Youtube Profile Picture"
                className="rounded-circle"
                width="88"
              />
            </td>
            <td className="ellipsis">
              <div>
                <span className="ps-3">
                  {name}
                  <br />
                  <small>{tag}</small>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <CoolButton
        icon={faSignOut}
        label="Sign Out"
        variant="danger"
        onClick={() => dispatch(deleteAccessToken())}
      />
    </div>
  );
};

export default UserProfile;
