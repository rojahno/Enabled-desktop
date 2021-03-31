import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import SimplePaper from '../SimplePaper';
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

}
/**
 * @param _props
 * @returns
 */
export default function SelectProfilePage(props: SelectPageProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <SimplePaper>
          <h3>Select profile {props.selectedProfile}</h3>
          <CustomList
            profiles={props.profiles}
            handleListItemClick={props.handleListItemClick}
            selectedIndex={props.selectedIndex}
          />
          <NavigationButtons
            canNavigateForward={props.hasSelected}
            handleNextClick={props.handleNextClick}
            backNavigation={'/'}
          />
        </SimplePaper>
      </div>
    </div>
  );
}
