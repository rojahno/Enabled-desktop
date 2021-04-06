import React from 'react';
import SimplePaper from '../SimplePaper';
import NavigationButtons from './NavigationButtons';
import CustomList from './CustomList';
import {LoadingCircle} from '../LoadingCircle';


interface SelectPageProps {
  profiles: string[];
  handleNextClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>;
  handleListItemClick: (
    event: React.MouseEvent<HTMLDivElement>,
    index: number,
    profile: string
    
  ) => void;
  selectedProfile:string;
  selectedIndex:number;
  hasSelected:boolean;
  isLoading:boolean;

}
/**
 * @param _props
 * @returns
 */
export default function SelectProfilePage(props: SelectPageProps) {

  return (
        <SimplePaper>
          <h3>Select profile {props.selectedProfile}</h3>
          <CustomList
            profiles={props.profiles}
            handleListItemClick={props.handleListItemClick}
            selectedIndex={props.selectedIndex}
            isLoading={props.isLoading}
          />
          <NavigationButtons
            canNavigateForward={props.hasSelected}
            handleNextClick={props.handleNextClick}
            backNavigation={'/'}
          />
         
        </SimplePaper>
  );
}
