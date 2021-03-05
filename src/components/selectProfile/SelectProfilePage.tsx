import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { CortexDriver } from '../../modules/CortexDriver';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    paper: {
      margin: theme.spacing(3),
      width: theme.spacing(50),
      height: theme.spacing(50),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff95',
    },
    container: {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
    profileList: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      flexGrow: 1,
      overflow: 'auto',
      width: '100%',
    },
    buttons:{
      display:'flex',
      justifyContent:'space-between',
      width:'100%',
      padding:'3px',
    }
  })
);

export default function SelectProfilePage(_props: any) {
  const classes = useStyles();
  const [profiles, setProfiles] = useState(['']);

  useEffect(() => {
    const getProfiles = async () => {
      let driver = CortexDriver.getInstance();

      let authToken = await driver.authorize();
      let allProfiles = await driver.queryProfileRequest(authToken);

      setProfiles(allProfiles);
    };

    getProfiles();
  },[]);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <SimplePaper>
          <h3>Select profile</h3>

          <div className={classes.profileList}>
            {profiles.map((profile, index) => (
              <button key={index}>{profile}</button>
            ))}
          </div>

          <div className={classes.buttons}>
            <Link  to="/">
              <button>back</button>
            </Link>
            <Link to="/ip">
              <button>Next</button>
            </Link>
          </div>
        </SimplePaper>
      </div>
    </div>
  );
}
