import React from 'react';
import Status from '../../components/Status';

export default function RestrictedPage({ loggedIn, children, message }) {
  if (loggedIn) {
    return children;
  }

  return (
    <Status statusCode={403} message={message || 'You do not have access to this page, log in first.'} />
  );
}
