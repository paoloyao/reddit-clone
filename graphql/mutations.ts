import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation AddPost(
    $body: String!
    $image: String!
    $subreddit_id: ID!
    $title: String!
    $username: String!
  ) {
    insertPost(
      body: $body
      image: $image
      subreddit_id: $subreddit_id
      title: $title
      username: $username
    ) {
      body
      image
      subreddit_id
      title
      username
    }
  }
`;

export const ADD_SUBREDDIT_TOPIC = gql`
  mutation MyMutation($topic: String!) {
    insertSubredditTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation MyMutation($post_id: ID!, $text: String!, $username: String!){
    insertComment(post_id: $post_id, text: $text, username: $username) {
      id
      post_id
      text
      username
    }
  }
`;

export const ADD_VOTE = gql`
  mutation MyMutation($username: String!, $post_id: ID!, $upvote: Boolean!){
    insertVote(username: $username, post_id: $post_id, upvote: $upvote){
      id
      created_at
      post_id
      upvote
      username
    }
  }
`;