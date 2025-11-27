import theme from "../../config/theme";

const getStyles = () => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "50% 50%",
      gridTemplateRows: "1fr",
      "& > div:nth-of-type(1)": {
        backgroundImage: `url(${"/assets/images/forgot-password.avif"})`,
        height: "100vh",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        boxShadow: "2px 4px 39.3px 4px #00000026",
      },
    },
    firstColumn: {
      position: "relative",
      "& > h6": {
        fontFamily: "Lato",
        fontSize: "40px",
        fontWeight: 600,
        margin: "20px 0 0 20px",
        color: theme.palette.secondary.black,
      },
    },
    objectTypeCounts: {
      "@media (max-width: 1024px)": {
        marginTop: "40px",
        display: "flex",
        flexDirection: "column",
        rowGap: "20px",
      },
    },
    objectsCount: {
      padding: "16px",
      width: "min-content",
      display: "flex",
      alignItems: "center",
      background: theme.palette.secondary.white,
      border: `1px solid ${theme.palette.secondary.white}`,
      borderRadius: "20px",
      columnGap: "12px",
      "@media (max-width: 1024px)": {
        margin: "auto",
        position: "relative",
        left: 0,
        right: 0,
      },
      "& > .objectIcon": {
        padding: "8px 6px",
        border: `1px solid #554FEB33`,
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        svg: {
          color: theme.palette.main.purple,
          width: "17px",
          height: "12px",
        },
      },
      "& > .objectCount": {
        display: "flex",
        alignItems: "center",
        "& > p": {
          fontSize: "22px",
          fontFamily: "Dosis",
          fontWeight: 600,
          color: "#44546F",
          textWrap: "nowrap",
          "& > span": {
            color: "#232323",
          },
        },
      },
    },
    bicycleCount: {
      position: "absolute",
      top: "35%",
      left: "15%",
    },
    carsCount: {
      position: "absolute",
      top: "30%",
      right: "15%",
    },
    trucksCount: {
      position: "absolute",
      bottom: "20%",
      left: "45%",
    },
    secondColumn: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      margin: "auto",
      width: "100%",
      padding: "25px",
    },
    form: {
      margin: "auto",
      maxWidth: "447px",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gridGap: "3rem",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      gridGap: "2.5rem",
      "& > h5": {
        fontFamily: "Lato",
        fontSize: "40px",
        fontWeight: 600,
      },
    },
    logoTitle: {
      display: "flex",
      flexDirection: "column",
      gridGap: "5px",
      "& > img": {
        width: "80%",
        height: "120px",
      },
      "& > p": {
        fontFamily: "Lato",
        fontSize: "15px",
        fontWeight: 700,
        color: theme.palette.main.purple,
      },
    },
    content: {
      display: "flex",
      flexDirection: "column",
      gridGap: "2rem",
      "& > button": {
        height: "56px",
        borderRadius: "3px",
        "& > p": {
          fontFamily: "Roboto",
          fontWeight: 500,
          fontSize: "14px",
        },
      },
    },
    inputField: {
      width: "100%",
      "& input::placeholder": {
        fontFamily: "Lato",
        color: theme.palette.secondary.mediumGrey,
        fontSize: "16px",
      },
      "& label": {
        fontFamily: "Lato",
        color: theme.palette.primary.dark,
      },
    },
  };
};

export default getStyles;
