import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  TextField,
  Stack,
} from "@mui/material";
import MessageCard from "./MessageCard";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_MSG } from "../graphql/queries";
import SendIcon from "@mui/icons-material/Send";
import { SEND_MSG } from "../graphql/mutations";
import { MSG_SUB } from "../graphql/subscriptions";

const ChatScreen = () => {
  const params = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const { loading, error, data, refetch } = useQuery(GET_MSG, {
    variables: { receiverId: +params.id },
    // onCompleted(data) {
    //   setMessages(data.messagesByUser);
    // },
    // fetchPolicy: "no-cache",
  });

  const [sendMessage] = useMutation(SEND_MSG, {
    // We don't need this after subscriptions, because as we send a message, the subscription runs as well, updating both sides!
    // onCompleted(data) {
    // setMessages((prevMessages) => [...prevMessages, data.createMessage]);
    // },
  });

  // My solution for stuck messages
  useEffect(() => {
    if (!loading) {
      setMessages(data.messagesByUser);
    }
  }, [data]);

  const { data: subData } = useSubscription(MSG_SUB, {
    onSubscriptionData({ subscriptionData: { data } }) {
      // console.log(data.subscriptionData.data.messageAdded);
      setMessages((prevMessages) => [...prevMessages, data.messageAdded]);
    },
  });

  // How to use GraphQL without Apollo-Client
  // const [messages, setMessages] = useState([]);
  // const getMessages = async () => {
  //   const response = await fetch("http://localhost:4000/", {
  //     // Method will always be POST, no matter if we're getting or sending data
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization:
  //         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1NzE0MjIxMn0.QzooCCmi1TmG9t6r7E_aq7r2Ei_nYSyRGXM3kRWcBq4",
  //     },
  //     body: JSON.stringify({
  //       // It will always be query, doesn't matter if you are performing a query/mutation
  //       query: `
  //       query MessagesByUser($receiverId: Int!) {
  //         messagesByUser(receiverId: $receiverId) {
  //           text
  //           receiverId
  //           senderId
  //           id
  //         }
  //       }
  //       `,
  //       variables: {
  //         receiverId: 4,
  //       },
  //     }),
  //   });
  //   const responseData = await response.json();
  //   console.log(responseData);
  // };

  // useEffect(() => {
  //   getMessages();
  // }, []);

  return (
    <Box flexGrow={1}>
      <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: 0 }}>
        {/* Toolbar adds padding aroung items and also aligns them in a row */}
        <Toolbar>
          <Avatar
            src={`https://avatars.dicebear.com/api/initials/${params.name}.svg`}
            sx={{ width: "32px", height: "32px", marginRight: 2 }}
          />
          <Typography variant="h6" color="black">
            {params.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        backgroundColor="#f5f5f5"
        height="80vh"
        padding="10px"
        sx={{ overflowY: "scroll" }}
      >
        {loading ? (
          <Typography variant="h6">Loading messages</Typography>
        ) : (
          // Causes problems!!
          // data.messagesByUser
          messages.map((message) => (
            <MessageCard
              key={message.createdAt}
              text={message.text}
              date={message.createdAt}
              direction={message.senderId === +params.id ? "start" : "end"}
            />
          ))
        )}
      </Box>
      <Stack direction="row" alignItems="center">
        <TextField
          placeholder="Enter a message"
          variant="standard"
          fullWidth
          multiline
          rows={2}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <SendIcon
          fontSize="large"
          sx={{ cursor: "pointer" }}
          onClick={() => {
            sendMessage({
              variables: {
                receiverId: +params.id,
                text: text,
              },
            });
          }}
        />
      </Stack>
    </Box>
  );
};

export default ChatScreen;
