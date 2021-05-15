import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import { LoadingCircle } from '../utils/LoadingCircle';

const useStyles = makeStyles(() =>
  createStyles({
    CustomList: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      flexGrow: 1,
      overflow: 'auto',
      width: '100%',
    },
    loadingBarContent: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    listItems: {
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'center',
      transition: 'transform ease-in 0.1s',
      fontSize: '18px',
    },
  })
);

interface listProps {
  profiles: string[]; //The items shown in the list
  handleListItemClick: (
    event: React.MouseEvent<HTMLDivElement>,
    index: number,
    profile: string
  ) => void;
  selectedIndex: number; //The index of the selected element.
  isLoading: boolean; //A circular loading bar is showing while the list waits for data.
}

/**
 * A list component. Loads elements verticaly and enables a scroll bar when the list has an overflow. 
 */
function CustomList(props: listProps) {
  const classes = useStyles();
  if (props.isLoading) {
    return (
      <div className={classes.loadingBarContent}>
        <div>
          <LoadingCircle
            loading={props.isLoading}
            delay={'0ms'}
            color={'#3c3c3c'}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes.CustomList}>
        <List data-testid="list">
          {props.profiles.map((profile, index) => (
            <ListItem
              className={classes.listItems}
              key={index}
              button
              selected={props.selectedIndex === index}
              onClick={(event) =>
                props.handleListItemClick(event, index, profile)
              }
            >
              {profile}
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default CustomList;
