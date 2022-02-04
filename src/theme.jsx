const getTheme = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: {
            main: "#3f51b5",
          },
          secondary: {
            main: "#f50057",
            light: "#f33678",
          },
          warning: {
            main: "#ffd180",
          },
          info: {
            main: "#275881",
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: "#3f51b5",
          },
          secondary: {
            main: "#f50057",
            light: "#f33678",
          },
          warning: {
            main: "#ffd180",
          },
          info: {
            main: "#275881",
          },
        }),
  },
});

export default getTheme;
