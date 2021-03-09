import React, { useState, useCallback } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { Link, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { CortexDriver } from '../../modules/CortexDriver';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';

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
    buttons: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      padding: '3px',
    },
    listItems:{
      padding:'10px 20px',
      //backgroundColor:'white',
      display:'flex',
      justifyContent:'center',
      transition: 'transform ease-in 0.1s',
      fontSize:'18px',
      //boxShadow:'0px 8px 28px -6px rgba(24, 39, 75, 0.12)',

    }
  })
);

export default function SelectProfilePage(_props: any) {
  const classes = useStyles();
  const [profiles, setProfiles] = useState(['']);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [hasSelected, setHasSelected] = useState(false);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    profile:string,
  ) => {
    setSelectedIndex(index);
    setSelectedProfile(profile);
    setHasSelected(true);
  };

  const handleNextClick = async () => {

    try{
    let driver:CortexDriver = CortexDriver.getInstance();
    let authoken:string = await driver.authorize();
    let headsetId:string = await driver.queryHeadsetId();
    let hasLoadedProfile = await driver.hasCurrentProfile(authoken, headsetId);

    if(hasLoadedProfile){
    await driver.setupProfile(authoken, headsetId,'', 'unload');
    }
    await driver.setupProfile(authoken,headsetId,selectedProfile,'load');
    }
    catch(error){
      console.log(error);
    }
  }


  useEffect(() => {
    const getProfiles = async () => {
      try{
      let driver = CortexDriver.getInstance();

      
      let authToken = await driver.authorize();
      let allProfiles = await driver.queryProfileRequest(authToken);
      
      setProfiles(allProfiles);
    }catch(error){
      console.log(error);
    }
    };

    getProfiles();
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <SimplePaper>
          <h3>Select profile {selectedProfile}</h3>

          <div className={classes.profileList}>
            <List>
            {profiles.map((profile, index) => (
              <ListItem
              className={classes.listItems}
                key={index}
                button
                selected={selectedIndex === index}
                onClick={(event) => handleListItemClick(event, index, profile)}
              >
                {profile}
              </ListItem>
            ))}
            </List>
          </div>

          <div className={classes.buttons}>
            <Link to="/">
              <button>back</button>
            </Link>

            { 
            <Link to="/ip">
              <button
              disabled={!hasSelected}
              onClick={handleNextClick}
              >Next</button>
            </Link>
}
          </div>
        </SimplePaper>
      </div>
    </div>
  );
}
