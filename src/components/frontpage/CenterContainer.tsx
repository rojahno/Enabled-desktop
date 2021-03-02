import React from 'react';
import FrontPage from './FrontPage';
import VerticalLinearStepper from '../stepper'
export default function centerContainer(_props: any) {
 
    return (
        <div className="frontpage-container">
              <VerticalLinearStepper/>
            <div className = "input-container"> 
          <h2>
          Enabled
        </h2>
            <FrontPage/>
            </div>
        </div>
    );
  }
