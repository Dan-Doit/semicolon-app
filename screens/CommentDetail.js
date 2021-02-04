import React from "react";
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import { POST_FRAGMENT } from "../Fragments";
import Loader from "../components/Loader";
import Comments from "../components/Comments";
import { ScrollView } from "react-native";

const POST_DETAIL = gql`
  query seeFullPost($id: String!) {
    seeFullPost(id: $id) {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;

export default ({ navigation }) => {
  const { loading, data } = useQuery(POST_DETAIL, {
    variables: { id: navigation.getParam("id") }
  });
  return (
    <ScrollView styled={{ flex: 1 }}>
      {loading ? (
        <Loader />
      ) : (
        data && data.seeFullPost && <Comments {...data.seeFullPost} />
      )}
    </ScrollView>
  );
};

