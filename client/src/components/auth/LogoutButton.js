import React from 'react';
import { GoogleLogout } from 'react-google-login';

/**
 * @param {Object} obj
 * @param {String} obj.currentUser
 */
function LogoutButton({ setLoggedIn, setUser, currentUser }) {

  const handleLogout = () => {
    setLoggedIn(false);
    setUser('');
  };

  const initials = currentUser.split(" ").map((word) => (word[0])).join("");

  return (
    <GoogleLogout
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      onLogoutSuccess={handleLogout}
      buttonText={`Logout (${initials})`}
    />
  );
}

export default LogoutButton;
