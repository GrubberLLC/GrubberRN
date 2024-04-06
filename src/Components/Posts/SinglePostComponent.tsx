import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Image, Text, Dimensions, TouchableWithoutFeedback, Modal } from 'react-native'
import { ChevronsRight, Heart, MessageSquare, Pause, Play, Star } from 'react-native-feather'
import { UserContext } from '../../Context/UserContext'
import axios from 'axios'
import { TextInput } from 'react-native-gesture-handler'
import SinglePostScreen from '../../Screens/Posts/SinglePostScreen'
import { useNavigation } from '@react-navigation/native'
import Video from 'react-native-video';


const deviceWidth = Dimensions.get('window').width
const ImageWidth = deviceWidth - 16

const SinglePostComponent = (props) => {

  const {item} = props

  const navigation = useNavigation()

  const { profile, user } = useContext(UserContext)

  const [showFullCaption, setShowFullCaption] = useState(false)
  const [postLikes, setPostLikes] = useState([])
  
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoPaused, setVideoPaused] = useState(true);

  const hasUserLikedPost = postLikes.some(like => like.user_id === user.userId);

  let lastTap: any = null;

  useEffect(() => {
    getPostLikes()
  }, [])

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 500;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      hasUserLikedPost
        ? removeLike()
        : createLike()
    } else {
      lastTap = now;
    }
  };

  function truncateString(str: string, maxLength = 100) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    } else {
      return str;
    }
  }

  const createLike = () => {
    let url = `https://grubberapi.com/api/v1/likes/`
    const likeData = {
      post_id: item.post_id,
      user_id: user.userId
    }
    axios.post(url, likeData)
      .then(response => {
        getPostLikes()
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        throw error;
      });
  }

  const getPostLikes = () => {
    let url = `https://grubberapi.com/api/v1/likes/${item.post_id}`
    axios.get(url)
      .then(response => {
        setPostLikes(response.data)
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        throw error;
      });
  }

  const removeLike = () => {
    const userLike = postLikes.find(like => like.user_id === user.userId);
    if (userLike) {
      let url = `https://grubberapi.com/api/v1/likes/${userLike.like_id}`;
      axios.delete(url)
        .then(response => {
          getPostLikes(); 
        })
        .catch(error => {
          console.error('Error removing like:', error);
          throw error;
        });
    }
  }

  const toggleVideoPlayPause = () => {
    if (item.media_url && item.media_type.includes('video')) {
      setVideoPaused(!videoPaused);
      setIsVideoPlaying(!isVideoPlaying);
    }
  };
  
  return (
    <View key={item.post_id} style={styles.post}>
      <TouchableOpacity onPress={() => {navigation.navigate('UserProfileScreen', {profile: profile})}} style={styles.profileHeader}>
        <Image style={styles.profileImage} source={{uri: item.profile_picture ? item.profile_picture : null}}/>
        <View style={{marginLeft: 16}}>
          <Text style={styles.profileUserName}>{item.username}</Text>
          <Text style={styles.profileName}>{item.full_name}</Text>
        </View>
      </TouchableOpacity>
      {
        item.media_url === null
          ? <>
              <TouchableOpacity onPress={handleDoubleTap} style={{width: '100%', paddingTop: 16}}>
                <Text style={{color: 'white', fontSize: 16}}>{truncateString(item.caption)} 
                  <TouchableOpacity onPress={() => {setShowFullCaption(!showFullCaption)}}>
                    <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}></Text>
                  </TouchableOpacity>
                </Text>
              </TouchableOpacity>
              <View style={styles.actionSection}>
                <TouchableOpacity onPress={() => {hasUserLikedPost ? removeLike() : createLike()}}>
                  <Heart height={24} width={24} color={hasUserLikedPost ? '#e94f4e' : 'white'} fill={hasUserLikedPost ? '#e94f4e' : 'none'}/>
                </TouchableOpacity>
                <Text style={{paddingHorizontal: 8, color: 'white', fontWeight: 'bold'}}>{postLikes.length} Likes</Text>
              </View>
              <TouchableOpacity onPress={() => {navigation.navigate('SinglePlaceInPostScreen', {place: item})}} style={styles.place}>
                <Image style={styles.placeImage} source={{uri: item.picture}}/>
                <View style={{marginLeft: 16}} >
                  <View>
                    <Text style={{marginRight: 12, color: 'white', fontWeight: '700', fontSize: 16}}>{item.name}</Text>
                  </View>
                  <View style={styles.buttonRow}>
                    <Star style={{marginRight: 5}} height={24} width={24} color={'#e94f4e'} fill={'#e94f4e'}/>
                    <Text style={{marginRight: 12, color: 'white', fontWeight: '700', fontSize: 16}}>{item.rating}/5</Text>
                    <Text style={{marginRight: 12, color: 'white', fontWeight: '700', fontSize: 16}}>({item.review_count} Reviews)</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </>
          : <>
              <TouchableWithoutFeedback onPress={handleDoubleTap}>
                {
                  item.media_type.includes('video')
                    ? <View style={styles.mediaPreview}>
                        <Video source={{uri: item.media_url}} style={styles.media} resizeMode="cover" volume={1} repeat={true} paused={videoPaused} />
                        <TouchableOpacity style={styles.playButton} onPress={toggleVideoPlayPause}>
                          {videoPaused ? <Play height={20} width={20} color="#FFF" /> : <Pause height={20} width={20} color="#FFF" />}
                        </TouchableOpacity>
                      </View>
                    : <View style={styles.image}>
                        <Image style={styles.image} source={{uri: item.media_url}}/>
                      </View>
                }
              </TouchableWithoutFeedback>
              <View style={styles.actionSection}>
                <TouchableOpacity onPress={() => {hasUserLikedPost ? removeLike() : createLike()}}>
                  <Heart height={24} width={24} color={hasUserLikedPost ? '#e94f4e' : 'white'} fill={hasUserLikedPost ? '#e94f4e' : 'none'}/>
                </TouchableOpacity>
                <Text style={{paddingHorizontal: 8, color: 'white', fontWeight: 'bold'}}>{postLikes.length} Likes</Text>
              </View>
              <TouchableOpacity onPress={() => {navigation.navigate('SinglePlaceInPostScreen', {place: item})}} style={styles.place}>
                <Image style={styles.placeImage} source={{uri: item.picture}}/>
                <View style={{marginLeft: 16}} >
                  <View>
                    <Text style={{marginRight: 12, color: 'white', fontWeight: '700', fontSize: 16}}>{item.name}</Text>
                  </View>
                  <View style={styles.buttonRow}>
                    <Star style={{marginRight: 5}} height={24} width={24} color={'#e94f4e'} fill={'#e94f4e'}/>
                    <Text style={{marginRight: 12, color: 'white', fontWeight: '700', fontSize: 16}}>{item.rating}/5</Text>
                    <Text style={{marginRight: 12, color: 'white', fontWeight: '700', fontSize: 16}}>({item.review_count} Reviews)</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={{width: '100%', paddingBottom: 16}}>
                <Text style={{color: 'white', fontSize: 16}}>{truncateString(item.caption)} 
                  <TouchableOpacity onPress={() => {setShowFullCaption(!showFullCaption)}}>
                    <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}></Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </>
      }
      <TouchableOpacity onPress={() => {navigation.navigate('SinglePostScreen', {item: item})}} style={styles.viewMoreContainer} >
        <Text style={{color: 'white', fontWeight: 'bold'}}>Post Details </Text>
        <ChevronsRight style={{marginLeft: 8}} height={16} width={16} color={'white'}/>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
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
  viewMoreContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  media:{
    height: ImageWidth,
    width: ImageWidth,
  },
  mediaPreview: {
    width: ImageWidth, // Adjust as needed
    height: ImageWidth, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
})

export default SinglePostComponent
