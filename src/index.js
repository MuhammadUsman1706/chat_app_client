import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Copied from docs
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  // createHttpLink,
} from "@apollo/client";
import { AuthContextProvider } from "./store/auth-context";

// Server without the header stuff
// const client = new ApolloClient({
//   uri: "http://localhost:4000/",
//   cache: new InMemoryCache(),
// });

// Apollo won't let you access the protected resources (i.e. the list of users here) unless it detects the authorization token in the headers. To set the header with the authorization token, we need to perform following steps (as in the documentation)

import { setContext } from "@apollo/client/link/context";

// From subscription documentation code
import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("jwt");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token || "",
    },
  };
});

const httpLink = new HttpLink({
  uri: "https://graphql-chatapplication.herokuapp.com/graphql",
});

const wsLink = new GraphQLWsLink(
  // ws is fine for local host, but have to write ws's' like http's' here for a secure connection. Otherwise heroku ignore the request.
  createClient({
    url: "ws://graphql-chatapplication.herokuapp.com/graphql",
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      // It checks if the operation is a subscription, if not then passes httpLink, else passes the websocketLink
      definition.operation === "subscription"
    );
  },
  wsLink,
  // httpLink
  authLink.concat(httpLink)
);
// Till here (subscription code)

// Old link before graphql-ws
// const httpLink = createHttpLink({
//   uri: "http://localhost:4000/",
// });

const client = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: splitLink,
  cache: new InMemoryCache(),
});

///////////////
// React stuff
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);
