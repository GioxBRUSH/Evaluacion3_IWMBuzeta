import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { useEffect, useState } from "react";
import { Image } from 'react-native';
import { Modal, Pressable } from 'react-native';

export default function App() {

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null); 

  const getPosts = async() => {
    try {
        const response = await axios.get('http://localhost:3000/posts')
        setPosts(response.data);
        setComments(response.data.comments);
    } catch (error) {
        console.error(error);
    }
 }



  const deletePost = async(id) => {
    
    try {
      await axios.delete(`http://localhost:3000/posts/${id}`);
      getPosts();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
      getPosts();
  }, []);



  return (

    <ScrollView>
      
      {posts.map((post) => {
        return (
          <ListItem
            key={post.id}
            bottomDivider
            
          >
            <ListItem.Content>
              <ListItem.Title>{post.title}</ListItem.Title>
              <ListItem.Subtitle>{post.author}</ListItem.Subtitle>
              <Image source={{ uri: post.image }} style={{ width: 300, height: 300 }} />


              <View style={{ flexDirection: 'row',
            gap:3, marginTop:3}}>

              <Button
                  title="Borrar"
                  onPress={() => {
                    setModalVisible(true),
                    setSelectedPostId(post.id);
                  }}
                  color="#E37399"
                />
              </View>
            </ListItem.Content>
          </ListItem>
        );
      })}

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¿Estás seguro de que quieres borrar este post?</Text>
            <View style ={{flexDirection: 'row', gap:4 }}>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                deletePost(selectedPostId);
              }}
            >
              <Text style={styles.textStyle}>Sí</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>No</Text>
            </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      

    </ScrollView>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});