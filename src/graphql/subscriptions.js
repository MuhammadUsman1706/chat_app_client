import { gql } from "@apollo/client";

export const MSG_SUB = gql`
  subscription MessageAdded {
    messageAdded {
      id
      text
      receiverId
      senderId
      createdAt
    }
  }
`;
