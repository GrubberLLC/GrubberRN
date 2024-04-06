import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Image, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Bold, ChevronsRight, Play } from 'react-native-feather';
import Video from 'react-native-video';

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 24 ) / 4; 

const PostGridComponent = ({ posts }) => {
  const navigation = useNavigation()


  function limitStringSize(str: string, maxLength = 85) {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  }

  const goToPostScreen = (post: any) => {
    console.log(post)
    navigation.navigate('ProfileSinglePostScreen', {item: post})
  }

  return (
    <View style={styles.container}>
      {posts.map((image, index) => {
        return(
          <View key={index} style={styles.wrapper}>
            {
              image.media_url === null
                ? null
                : image.media_type.includes('video')
                    ? <View style={styles.mediaPreview}>
                        <Video source={{uri: image.media_url}} style={styles.media} resizeMode="cover" paused={true} />
                        <View style={styles.playButton}>
                          <Play height={10} width={10} color="#FFF" /> 
                        </View>
                      </View>
                    : <Image style={[styles.image, { width: itemWidth, height: itemWidth, marginRight: 16 }]} source={{ uri: image.media_url }} />
            }
            <View style={{flex: 1}}>
              <Text style={styles.text}>{limitStringSize(image.caption)}</Text>
              <TouchableOpacity onPress={() => {goToPostScreen(image)}} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Post Details</Text>
                <ChevronsRight height={20} width={20} color={'white'}/>
              </TouchableOpacity>
            </View>
          </View>
        )
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
  wrapper: {
    width: '100%',
    padding: 12,
    borderTopColor: 'grey',
    borderTopWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    borderRadius: 8,
    resizeMode: 'cover', // Ensure images fill the square space
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  media:{
    height: itemWidth,
    width: itemWidth,
  },
  mediaPreview: {
    width: itemWidth, // Adjust as needed
    height: itemWidth, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden'
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 30,
    height: 30,
    borderRadius: 25,
  },
});

export default PostGridComponent;