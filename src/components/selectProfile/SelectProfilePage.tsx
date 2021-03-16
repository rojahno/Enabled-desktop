import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { CortexDriver } from '../../modules/CortexDriver';
import { CortexFacade } from '../../modules/CortexFacade';
import CortexError from '../../modules/CortexError';
import NavigationButtons from './NavigationButtons';
import CustomList from './CustomList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },

    container: {
      margin: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  })
);
/**
 * @param _props
 * @returns
 */
export default function SelectProfilePage(_props: any) {
  const classes = useStyles();
  const [profiles, setProfiles] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [hasSelected, setHasSelected] = useState(false);
  const history = useHistory();

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    profile: string
  ) => {
    setSelectedIndex(index);
    setSelectedProfile(profile);
    setHasSelected(true);
  };

  const handleNextClick = async (): Promise<void> => {
    let cortexfacade: CortexFacade = new CortexFacade();
    try {
      let setProfileStatus = await cortexfacade.handleSetProfile(
        selectedProfile
      );

      if (setProfileStatus instanceof CortexError) {
        alert(setProfileStatus.errMessage);
      } else {
        history.push({ pathname: '/ip' });
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const getProfiles = async () => {
      try {
        let driver = CortexDriver.getInstance();
        let authToken = await driver.authorize();
        let allProfiles = await driver.queryProfileRequest(authToken);
        setProfiles(allProfiles);
      } catch (error) {
      }
    };

    getProfiles();
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <SimplePaper>
          <h3>Select profile {selectedProfile}</h3>
          <CustomList
            profiles={profiles}
            handleListItemClick={handleListItemClick}
            selectedIndex={selectedIndex}
          />
          <NavigationButtons
            canNavigateForward={hasSelected}
            handleNextClick={handleNextClick}
            backNavigation={'/'}
          />
        </SimplePaper>
      </div>
    </div>
  );
}
