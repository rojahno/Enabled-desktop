import React from 'react';
import { Link } from 'react-router-dom';
import VerificationPage from './VerificationPage';

export default function VerificationContainer(_props: any) {
  return (
    <div className="frontpage-container">
      <h2>Enabled</h2>
      <Link to="/">
          <button>Gå til ip</button>
      </Link>
      <VerificationPage />
    </div>
  );
}
