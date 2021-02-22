import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../../components/Loader";
import RandomSquare from "../../../components/RandomSquare";

export const RECOMMEND_QUERY = gql`
{
  getRecommendation{
    id
    caption
    location
    files{
      url
    }
    likeCount
    commentCount
  }
}
`;

const RecommendPresenter = () => {
    const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(RECOMMEND_QUERY, {fetchPolicy: 'cache-and-network'});

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
        data.getRecommendation &&
          data.getRecommendation.map((post, index) => {
            if (post === null) return null;
            return <RandomSquare key={post.id} {...post} index={index} />
          })
                )
            }
      </ScrollView >
    );
};

export default RecommendPresenter;