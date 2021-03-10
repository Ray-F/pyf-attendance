import React from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router';

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
        // If the check was successful, set the dashboard loggedIn status to true
        if ((await res).status === 200) {
          setLoggedIn(true);
          setUser(response.profileObj.name);
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
      />
    </div>
  );
}
