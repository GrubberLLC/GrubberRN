import React, { useContext, useEffect, useState } from 'react'
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { UserContext } from '../../Context/UserContext'
import { Bell, Circle, Heart, MessageSquare, Plus, PlusSquare, Star } from 'react-native-feather'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ListContext } from '../../Context/ListContext'
import axios from 'axios'
import SinglePostComponent from '../../Components/Posts/SinglePostComponent'

const deviceWidth = Dimensions.get('window').width
const ImageWidth = deviceWidth - 16

const DiscoverScreen = () => {
  const navigation = useNavigation()

  const { profile, user } = useContext(UserContext)
  const { getUserLists } = useContext(ListContext)

  const [posts, setPosts] = useState([])

  const [batch, setBatch] = useState(1)

  useEffect(() => {
    if (user && user.userId) {
      grabPosts()
    }
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      if (user && user.userId) {
        grabPosts()
      }
    }, [navigation])
  );

  const grabPosts = () => {
    const url = `https://grubberapi.com/api/v1/posts/feed/${batch}`
    axios.get(url)
      .then(response => {
        setPosts(response.data)
      })
      .catch(error => {
        console.error('Error fetching members:', error);
        throw error;
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Discover</Text>
      </View>
      <View style={styles.content}>
        <ScrollView style={styles.scroll}>
          {
            posts.length > 0 
              ? <>
                  {
                    posts.map((item) => {
                      return(
                        <SinglePostComponent item={item} profile={profile}/>
                      )
                    })
                  }
                </>
              : <View style={styles.scollContent}>
                  <Text style={styles.emptyText}>No posts</Text>
                  <Text style={styles.emptyText}>Start Following foodies</Text>
                </View>
          }
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'black',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  post: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
    padding: 8
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  headerIcons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#2c2c2c'
  },
  scroll: {
    flex: 1
  },
  profileImage: {
    height: 46,
    width: 46,
    borderRadius:25
  },
  profileHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4
  },
  profileUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  profileName: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
    marginTop: 4
  },
  image: {
    height: ImageWidth,
    width: ImageWidth,
    backgroundColor: 'grey',
    borderRadius: 8
  },
  place: {
    width: '100%', 
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'row'
  },
  placeImageContainer: {
    height: 54,
    width: 54,
    borderRadius: 8
  },
  placeImage: {
    height: 54,
    width: 54,
    borderRadius: 8
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  actionSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16
  },
  notificationIcon: {
    position: 'absolute',
    right: 0,
    top: -5
  },
  scollContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 54
  },
  emptyText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 16
  }
})

export default DiscoverScreen
