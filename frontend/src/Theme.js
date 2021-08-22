import { createTheme, makeStyles } from "@material-ui/core/styles";

// export const theme = createTheme({
//   typography: {
//     subtitle2: {
//       fontSize: 13
//     }
//   },
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 767,
//       md: 991,
//       lg: 1199,
//       xl: 1439
//     }
//   },

//   // overrides: {
//   //   MuiCssBaseline: {
//   //     '@global': {
//   //       '@font-face': [raleway],
//   //     },
//   //   },
//   // },
// });
export const useDialogClasses = makeStyles((theme) => ({
  paper: {
    minWidth: 400,
    maxWidth: 800,
    width: '100%',
  },
  content: {
    overflowY: 'visible'
  }
}))
export const lightTheme = createTheme({
  palette: {
    type: "light"
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 992,
      lg: 1100,
      xl: 1440
    }
  }
});
Object.assign(lightTheme, {
  overrides: {
    ...lightTheme.overrides,
    MUIRichTextEditor: {
      placeHolder: {
        position: 'relative'
      },
      // root: {
      //   minHeight: 200
      // },
    },
    MuiDropzoneArea: {
      root: {
        minHeight: "100%"
      },
    },
    MuiDropzonePreviewList: {
      root: {
        justifyContent: "space-around",
      },
      imageContainer: {
        flexBasis: "100%",
        maxWidth: "90%",
      },
      image: {
        height: -1
      },
      removeButton: {
        top: 0,
        right: 0,
      },
    },
    MuiDropzoneArea: {
      root: {
        minHeight: 0,
      },
      text: {
        textAlign: "center"
      }
    },
    MuiTypography: {
      root: {
        textAlign: "justify",
      }
    },
    PrivateTabIndicator: {
      root: {
        height: 6
      },
      vertical: {
        width: 6
      }
    },
    MuiFormControlLabel: {
      root: {
        margin: 'auto',
        marginRight: 0,
      }
    },
    MuiRating: {
      root: {
        color: '#b4690e',
      }
    }
    // spacing: {
    //   '&:hover': {
    //   },
    // }
  }
})
export const darkTheme = createTheme({
  palette: {
    type: "dark"
  }
});

export const useStyles = makeStyles(theme => ({
  tiny: {
    fontSize: "8px",
    fontFamily: "inherit",
  },
  small: {
    fontSize: "12px",
    fontFamily: "inherit",
  },
  medium: {
    fontSize: "16px",
    fontFamily: "inherit",
    lineHeight: "1.1rem"
  },
  big: {
    fontSize: "20px",
    fontFamily: "inherit",
  },
  huge: {
    fontSize: "24px",
    fontFamily: "inherit",
  },
  bold: {
    fontWeight: "bold",
    fontFamily: "inherit",
  }
}))