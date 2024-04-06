import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'

const imageWidth = Dimensions.get('window').width - 16

const ListPlaceTileComponent = (props) => {
  const {item} = props

  const navigation = useNavigation()

  function convertDateToDaysOrHours(dateString: string) {
    const inputDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - inputDate;
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    
    if (differenceInHours < 24) {
      return `Today`;
    } else {
      const differenceInDays = differenceInHours / 24;
      return `${Math.floor(differenceInDays)} days ago`;
    }
  }

  function limitStringSize(str: string, maxLength = 25) {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  }

  function limitDescriptionStringSize(str: string, maxLength = 30) {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  }

  return (
    <TouchableOpacity onPress={() => {navigation.navigate('SingleListScreen', {list: item})}} style={styles.container}>
      <Image style={styles.listImage} source={{uri: item.picture}}/>
      <View style={styles.overlay}></View>
      <View style={styles.info}>
        <View style={styles.infoTopBar}>
          <Text style={styles.name}>{limitStringSize(item.name)}</Text>
        </View>
        <View style={styles.infoBottomBar}>
          <Text style={styles.activity}>{limitDescriptionStringSize(item.last_activity)}</Text>
          {/* <Text style={styles.item}>{convertDateToDaysOrHours(item.created_at)}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // backgroundColor: '#4d4d4d',
    overflow: 'hidden',
    marginVertical: 6,
  },
  listImage: {
    width: imageWidth,
    height: imageWidth - 140,
    backgroundColor: 'lightgrey'
  },
  info: {
    paddingHorizontal: 8,
    paddingTop: 8
    // padding: 16
  },
  infoTopBar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  infoBottomBar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white'
  },
  item: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  activity: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    overflow: 'hidden'
  }
})

export default ListPlaceTileComponent
