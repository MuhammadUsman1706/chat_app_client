import React, { useContext } from "react";
import { Box, Typography, Divider, Stack } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import UserCard from "./UserCard";
import AuthContext from "../store/auth-context";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../graphql/queries";

const SideBar = () => {
  //                                  vv can also use refetch here, to refetch the data on any event (to refresh it in real-time)
  // const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);

  // Is fetched automatically when the component is executed, no need to use functions.
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const { logoutHandler } = useContext(AuthContext);

  if (loading) {
    return <Typography variant="h6">Loading chats</Typography>;
  }

  if (error) {
    console.log(error.message);
  }

  return (
    <Box backgroundColor="#f7f7f7" height="97vh" width="250px" padding="10px">
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Chat</Typography>
        <LogoutIcon onClick={logoutHandler} />
      </Stack>
      <Divider />
      {data.users.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          firstName={user.firstName}
          lastName={user.lastName}
        />
      ))}
    </Box>
  );
};

export default SideBar;
