import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CortexDriver } from '../../modules/CortexDriver';
import CortexError from '../../modules/CortexError';
import { CortexFacade } from '../../modules/CortexFacade';
import SelectProfilePage from './SelectProfilePage';

const SelectProfileContainer = () => {
  //Select profile useStates
  const [profiles, setProfiles] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [hasSelected, setHasSelected] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    //Retrieves the profiles
    const getProfiles = async () => {
      try {
        let cortexfacade = CortexFacade.getInstance();
        let allProfiles = await cortexfacade.getProfiles();
        setIsLoading(false);
        if (Array.isArray(allProfiles)) {
          setProfiles(allProfiles);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    getProfiles();
  }, []);

  /**
   * Handles the click event for the next button.
   * Tries to set the current profile to the selected and navigates to the next page.
   */
  const handleNextClick = async (): Promise<void> => {
    let cortexfacade: CortexFacade = CortexFacade.getInstance();
    try {
      let setProfileStatus = await cortexfacade.SetProfile(selectedProfile);

      if (setProfileStatus instanceof CortexError) {
        alert(setProfileStatus.errMessage);
      } else {
        history.push({ pathname: '/ip' });
      }
    } catch (error) {
      alert(error);
    }
  };
  /**
   * Handles the click event for the list items.
   * @param event The click event
   * @param index The index of the item beeing clicked
   * @param profile The selected profiel
   */
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    profile: string
  ) => {
    setSelectedIndex(index);
    setSelectedProfile(profile);
    setHasSelected(true);
  };

  return (
    <SelectProfilePage
      profiles={profiles}
      selectedIndex={selectedIndex}
      selectedProfile={selectedProfile}
      hasSelected={hasSelected}
      handleListItemClick={handleListItemClick}
      handleNextClick={handleNextClick}
      isLoading={isLoading}
    />
  );
};

export default SelectProfileContainer;
