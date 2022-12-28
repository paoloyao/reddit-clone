import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_AUTH_URL,
    headers: {
      Authorization: `Apikey ${process.env.NEXT_PUBLIC_STEPZEN_PUBLIC_KEY}`
    },
    cache: new InMemoryCache(),
});

export default client;