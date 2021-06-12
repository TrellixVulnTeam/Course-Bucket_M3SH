import { Drawer, Grid, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/Inbox';
import React, { useState } from 'react';
import User from './User';



const drawerWidth = 440;
const icon = <InboxIcon />
const useStyles = makeStyles((theme) => ({
  root: {
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      // width: `calc(100% - ${drawerWidth}px)`,
      width: '100%',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    position: "relative",

  },
  content: {
    flexGrow: 1,
    width: `calc(100% - ${drawerWidth}px)`,
    padding: theme.spacing(3),
  },
}));


const DrawerLayout = ({
  objects,
  children = <></>
}) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(1);
  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }
  async function handleTabIndexChange(index) {
    await timeout(100);
    setTabIndex(index);
  }


  function DrawerList({ objects }) {
    return (
      <div>
        <List>
          {
            objects.map((item, index) => (
              <ListItem
                button
                key={item.label}
                onClick={() => handleTabIndexChange(index)}
              >
                {/* <ListItemIcon>{<InboxIcon />}</ListItemIcon> */}
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))
          }
        </List>
      </div>
    )
  }
  return (
    <User>
      <Grid container direction="row">
        <Grid item sm style={{ width: drawerWidth }}>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <DrawerList objects={objects.map(item => ({ label: item.label, icon: item.icon }))} />
          </Drawer>
        </Grid>
        <Grid item className={classes.content}>
          {
            objects.map(item => ({ content: item.content })).map((item, index) => (
              <div hidden={tabIndex !== index}>
                {item.content}
              </div>
            ))
          }
        </Grid>
      </Grid>
    </User>
  )
}

export default DrawerLayout
