import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, ScrollView, Dimensions, Platform } from 'react-native'
import { Pause, Play, Plus, RefreshCcw, X } from 'react-native-feather'
import { launchImageLibrary } from 'react-native-image-picker'; // Import the function
import { PermissionsAndroid, Alert } from 'react-native';
import { uploadData } from 'aws-amplify/storage';
import Video from 'react-native-video';

const deviceWidth = Dimensions.get('window').width
const ImageWidth = deviceWidth - 32

const SelectContentComponent = (props) => {
  const { setMedia, toggleViewImage } = props

  const [selectedMedia, setSelectedMedia] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoPaused, setVideoPaused] = useState(true);

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Gallery Access Permission",
            message: "App needs access to your gallery...",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return (granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      // For iOS, permissions are handled by the launchImageLibrary itself
      return true;
    }
  };
  
  const selectImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "You need to grant gallery access permission to select images.");
      return;
    }

    launchImageLibrary({ mediaType: 'mixed' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedFiles = response.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          fileName: asset.fileName
        }));
        console.log('selected media: ', selectedFiles[0])
        setSelectedMedia(selectedFiles[0]);
      }
    });
  };

  const getBlob = () => {
    return fetch(selectedMedia.uri)
      .then(response => response.blob()) // Convert the response to a blob
      .catch(error => {
          console.error("Error fetching blob:", error);
          throw error; // Propagate error to be handled later
      });
  };

  const addMediaToPost = async () => {
    setLoading(true)
    try {
      const blob = await getBlob(); // Wait for the blob to be fetched
      // Assuming listImage.fileName and listImage.type are available
      const fileName = selectedMedia.fileName;
      const fileType = selectedMedia.type;
      const folderName = "PostMedia";

      const fileKey = `${folderName}/${fileName}`;

      // Wait for the uploadData function to complete
      const result = await uploadData({
          key: fileKey,
          data: blob,
          options: {
              accessLevel: 'guest',
          }
      }).result;
  
      let uploadedImage = `https://seekify-storage-da999112230453-staging.s3.us-west-1.amazonaws.com/public/${result.key}`
      let mediaInfo = {
        publish_url: uploadedImage,
        fileName: fileName,
        fileType: fileType
      }
      setMedia(mediaInfo)
      setLoading(false)
      toggleViewImage()
    } catch (error) {
        console.log('Error:', error);
    }
  }

  const toggleVideoPlayPause = () => {
    if (selectedMedia && selectedMedia.type.includes('video')) {
      setVideoPaused(!videoPaused);
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Media</Text>
          <TouchableOpacity onPress={toggleViewImage} >
            <X height={26} width={26} color={'#e94f4e'}/>
          </TouchableOpacity>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.mediaContainer}>
            {
              selectedMedia === null 
                ? <TouchableOpacity onPress={() => {selectImage()}} style={styles.imagePlaceholder}><Plus height={36} width={36} color={'grey'}/></TouchableOpacity> 
                : selectedMedia.type.includes('video') ? (
                    <View style={styles.mediaPreview}>
                      <Video source={{uri: selectedMedia.uri}} style={styles.media} resizeMode="cover" volume={1} repeat={true} paused={videoPaused} />
                      <TouchableOpacity style={styles.playButton} onPress={toggleVideoPlayPause}>
                        {videoPaused ? <Play height={20} width={20} color="#FFF" /> : <Pause height={20} width={20} color="#FFF" />}
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Image style={styles.media} source={{uri: selectedMedia.uri}} />
                  )
            }
          </View>
          {
            selectedMedia === null 
              ? null 
              : <View style={styles.mediaMenu}>
                  <TouchableOpacity onPress={() => {selectImage()}}><Text style={styles.mediaMenuText}>Change</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => {setSelectedMedia(null)}}><Text style={styles.mediaMenuText}>Remove</Text></TouchableOpacity>
                </View>
          }
        </View>
        <View>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => {addMediaToPost()}}>
            <Text style={styles.label}>{loading ? <ActivityIndicator size={'small'} color={'black'}/> : 'Add Media'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rbga(0,0,0,0)'
  },
  content: {
    width: '100%',
    backgroundColor: '#363636',
    paddingVertical: 25,
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 16,
    borderTopEndRadius: 16
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  pictureText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16
  },
  placeHolder: {
    height: 125,
    width: 125,
    backgroundColor: 'lightgrey',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 8
  },
  image: {
    height: 125,
    width: 125,
    borderRadius: 16,
    marginTop: 8
  },
  imageIcon: {
    height: 18,
    width: 18,
    color: '#e93f3e',
    margin: 10,
    marginLeft: 14
  },
  menuOptions: {
    display: 'flex',
    flexDirection: 'row'
  },
  inputContiner: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  input: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
    flex: 1,
    color: 'white',
    fontSize: 18
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingVertical: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
  selection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16
  },
  selectionText: {
    fontSize: 18,
    color: 'white'
  },
  resultsContainer: {
    flex: 1,
    marginVertical: 16
  },
  placeContainer: {
    height: ImageWidth * .66,
    width: ImageWidth,
    backgroundColor: 'grey',
    marginVertical: 8,
    borderRadius: 8
  },
  placeImage: {
    height: ImageWidth * .66,
    width: ImageWidth,
    borderRadius: 8
  },
  overlay: {
    position: 'absolute',
    height: ImageWidth * .66,
    width: ImageWidth,
    backgroundColor: 'rgba(0,0,0,.5)',
    top: 0,
    left: 0
  },
  placeInfo: {
    position: 'absolute',
    height: ImageWidth * .66,
    width: ImageWidth,
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 16
  },
  placeName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
  },
  address: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600'
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  mediaContainer: {
    height: ImageWidth,
    width: ImageWidth,
    backgroundColor: '#2c2c2c',
    borderRadius: 8
  },
  mainContainer: {
    marginVertical: 16
  },
  imagePlaceholder: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  media:{
    height: ImageWidth,
    width: ImageWidth,
  },
  mediaMenu: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16
  },
  mediaMenuText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
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

export default SelectContentComponent
