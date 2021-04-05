import React from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router';
import SCOPE from '../../utils/Scope';

export default function LoginButton({ setLoggedIn, setUser }) {
  const history = useHistory();

  const onGoogleResponse = (response) => {
    // If the response had the field profileObj (i.e. someone logged into their Google account)
    if (response.profileObj) {
      const requestHeader = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedEmail: response.profileObj.email }),
      };

      fetch('/api/authorize', requestHeader).then(async (res) => {
        // Check if the resulting status was successful (200 status code) and set the scope based on the response
        if (res.status === 200) {
          const scope = (await res.json()).scope;
          setUser(response.profileObj.name);

          switch (scope) {
            case "developer": setLoggedIn(SCOPE.DEVELOPER); break;
            case "admin": setLoggedIn(SCOPE.ADMIN); break;
            case "editor": setLoggedIn(SCOPE.EDITOR); break;
            case "viewer": setLoggedIn(SCOPE.VIEWER); break;
            case "hauora-lead": setLoggedIn(SCOPE.HAUORA_LEAD); break;
            case "hauora-member": setLoggedIn(SCOPE.HAUORA_MEMBER); break;
            default:
              setLoggedIn(SCOPE.NONE);
              history.push('/403');
              break;
          }
        } else {
          history.push('/403');
        }
      });
    }
  };

  return (
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={onGoogleResponse}
        onFailure={onGoogleResponse}
        cookiePolicy="single_host_origin"
        isSignedIn={true}
      />
    </div>
  );
}
