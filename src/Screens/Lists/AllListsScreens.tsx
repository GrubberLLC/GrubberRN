
import React, { useContext, useEffect, useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { UserContext } from '../../Context/UserContext'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ListContext } from '../../Context/ListContext'
import { Heart, Plus, PlusSquare } from 'react-native-feather'
import ListPlaceTileComponent from '../../Components/Lists/ListPlaceTileComponent'
import CreateListComponent from '../../Components/Lists/CreateListComponent'


const AllListsScreens = () => {
  const navigation = useNavigation()

  const { signOutUser, profile, user, getUserProfile } = useContext(UserContext)
  const { getUserLists, userLists } = useContext(ListContext)

  const [viewAddList, setViewAddList] = useState(false)

  const [search, setSearch] = useState('')

  useEffect(() => {
    if (user && user.userId) {
      getUserLists(user.userId)
    }
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      if (user && user.userId) {
        getUserLists(user.userId)
      }
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Lists</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={{marginRight: 8}} onPress={() => {navigation.navigate('FavoriteScreen')}}>
            <Heart height={20} width={20} fill={'white'} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setViewAddList(!viewAddList)}}>
            <PlusSquare height={26} width={26} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        style={styles.modal}
        animationType="slide"
        transparent={true}
        visible={viewAddList}
      >
        <CreateListComponent viewAddList={viewAddList} setViewAddList={setViewAddList}/>
      </Modal>
      {userLists.length > 0 ? (
        <ScrollView style={styles.contentContainer}>
          {
            userLists.map((item) => {
              if(item.type === 'active'){
                return(
                  <View style={styles.scrollItem} key={item.list_id}>
                    <ListPlaceTileComponent item={item}/>
                  </View>
                )
              }
            })
          }
        </ScrollView>
      ) : (
        <View style={styles.noLocationContainer}>
          <Text style={styles.noPlaceText}>No Lists Found...</Text>
        </View>
      )}
    </View>
  );
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
  subHeader: {
    width: '100%',
    paddingHorizontal: 18
  },
  title: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  manuIcon: {
    backgroundColor: 'rgba(200,200,200,.4)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 6
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#2c2c2c',
  },
  scrollItem: {
    padding: 8,
  },
  noLocationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ebebeb', // Adjust the background color as needed
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 16,
  },
  noPlaceText: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})

export default AllListsScreens
