import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      flexGrow: 1,
      overflow: 'auto',
      width: '100%',
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
  profiles: string[];
  handleListItemClick: (
    event: React.MouseEvent<HTMLDivElement>,
    index: number,
    profile: string
  ) => void;
  selectedIndex: number;
}

function CustomList(props: listProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List>
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

export default CustomList;
