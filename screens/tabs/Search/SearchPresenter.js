import React, { useState } from "react";
import { Text,ScrollView, RefreshControl, View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../../components/Loader";
import SquarePhoto from "../../../components/SquarePhoto";
import RecommendPresenter from "./RecommendPresenter";
import { Thumbnail } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

export const SEARCH = gql`
  query search($term: String!) {
    searchPost(term: $term) {
      id
      files {
      id
      url
      }
      likeCount
      commentCount
    }
    searchUser(term: $term) {
      id
      avatar
      username
      isFollowing
      isSelf
    }
  }
`;
const gradientMargin = () => {
  const ratio = (1 - gradientRatio(62)) / 2
  return 62 * ratio
}

const gradientRatio = () => {
  return 0.94
}
const styles = () => StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 0,
  },
  linearGradient: {
    borderRadius: 62 / 2,
    width: 62,
    height: 62,
    marginHorizontal: 5
  },
  button: {
    margin: gradientMargin(62),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: (62 / 2) * gradientRatio(62),
    width: 62 * gradientRatio(62),
    height: 62 * gradientRatio(62),
    paddingHorizontal: 1
  },
});

const SearchPresenter = ({ term, shouldFetch, action, navigation }) => {

  let localStyles = styles()
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(SEARCH, {
    variables: {
      term
    },
    skip: !shouldFetch,
    fetchPolicy: "network-only"
  });

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
    <>
      {action === "recommend" ?
        <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }} refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />} >

          <RecommendPresenter />

        </ScrollView >
      
      : loading ?
        (<Loader />)
        :
          (<>
            <View style={{ height: 100 }}>

          <View style={{ flex: 3, borderBottomWidth: 0.8, backgroundColor: "white", borderBottomColor: 'lightgray' }}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
                paddingStart: 5,
                paddingEnd: 5
              }}
              horizontal={true} >
              {data && data.searchUser && data.searchUser.map(user =>
              <View>
                <LinearGradient start={[1, 0.5]}
                  end={[0, 0]}
                  colors={['#e3179e', 'tomato', 'orange', 'yellow']}
                  style={localStyles.linearGradient}>
                  <TouchableOpacity key={user.id} style={localStyles.button} onPress={() => { navigation.navigate("UserDetail", { username: user.username }) }}>
                    {<Thumbnail style={{ opacity: 0.7, marginHorizontal: 'auto', borderColor: 'white', borderWidth: 2 }} source={{ uri: user.avatar }} />}
                  </TouchableOpacity>
                </LinearGradient>               
                  <Text style={{ textAlign: 'center', marginTop: 5}}>{user.username}</Text>
              </View>                 
              )}
            </ScrollView>
          </View>
        </View>  
      <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }} refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />} >
        {data && data.searchPost && data.searchPost.map(post => <SquarePhoto key={post.id} {...post} />)}
      </ScrollView >
          </>
          )}
      

    </>
  );
};

SearchPresenter.propTypes = {
  term: PropTypes.string.isRequired,
  shouldFetch: PropTypes.bool.isRequired
};

export default SearchPresenter;