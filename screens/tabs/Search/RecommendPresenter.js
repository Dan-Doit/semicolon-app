import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../../components/Loader";
import RandomSquare from "../../../components/RandomSquare";

export const FEED_QUERY = gql`
  {
    seeFeed {
      id
      files {
        id
        url
      }
      likeCount
      commentCount
    }
}
`;

const RecommendPresenter = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { data, loading, refetch } = useQuery(FEED_QUERY);
    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await refetch({ variables: { term } });
        } catch (e) {
        } finally {
            setRefreshing(false);
        }
    };
  return (
        <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap:"wrap" }} refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />} >
            {loading ? (<Loader />
            ) : (data &&
                data.seeFeed &&
                  data.seeFeed.map((post, index) => <RandomSquare key={post.id} {...post} index={index} />)
                )
            }
      </ScrollView >
    );
};

export default RecommendPresenter;