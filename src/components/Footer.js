import React from "react";
import Box from "@material-ui/core/Box";

const Footer = () => {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      p={1}
      m={1}
      style={{ height: "10vh", width: "100vw", backgroundColor: "black" }}
      justifyContent="center"
    >
      <Box style={{color: "white" }} p={1}>Home</Box>
      <Box style={{color: "white" }} p={1}>Stay Connected</Box>
      <Box style={{color: "white" }} p={1}>Return Policy</Box>
      <Box style={{color: "white" }} p={1}>Privacy Policy</Box>
      <Box style={{color: "white" }} p={1}>Terms and Conditions</Box>
    </Box>
  );
};

export default Footer;
