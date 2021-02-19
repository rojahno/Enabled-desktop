import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import Paper from '@material-ui/core/Paper';

import CustomInput from './customInput';
import SimplePaper from './backgroundPaper';

const useStyles = makeStyles(function (theme: Theme) {
    return createStyles({
      root: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      margin: {
        margin: theme.spacing(1),
      },
    });
  }
);

class FrontPage extends React.Component {

  render() {
    return (
        <div className="frontpage-container">
           <h2>
          Enabled
        </h2>
            <SimplePaper/>
        </div>
    );
  }
}

export default FrontPage;
