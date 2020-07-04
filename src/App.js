//Documento ajustado de acordo com o video https://www.youtube.com/watch?v=lziAk0J_Ppc&feature=youtu.be.
//Deixei de usar o FlatList para montar os itens techs, substituí pelo uso do map conforme vídeo.
//Na linha repository.techs.map foi utilizado repository.techs.split(',').map pelo fato de que a 
//prpriedade techs é uma string com valores separados por vírgula.
//Com isso, os testes passaram.

import React,{useEffect,useState} from "react";
import api from "./services/api";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories,setRepositories]=useState([]);

  useEffect(()=>{
    api.get("repositories").then(response=>{
      setRepositories(response.data);
    });
  },[]);

  async function handleLikeRepository(id) {
    // Implement "Like Repository" functionality
    const response=await api.post(`repositories/${id}/like`);
    const likes=response.data.likes;

    const repositoriesUpdated=repositories.map(repository=>{
      if(repository.id==id){
        return {...repository,likes};
      }else{
        return repository;
      }
    });
    
    setRepositories(repositoriesUpdated);
    /*if(response.status===204){
      setRepositories(repositories.filter(repository=>repository.id!=id));
    }*/
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository=>repository.id}
          renderItem={({item:repository})=>(
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>
              
              <View style={styles.techsContainer}>
                {
                repository.techs.map(tech=>(
                  <Text key={tech} style={styles.tech}>{tech}</Text>
                ))}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>

              <View style={styles.likesContainer}>
                <Text style={styles.likeText}
                testID={`repository-likes-${repository.id}`}
              >{repository.likes} curtida{repository.likes>1?'s':''}</Text>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 5,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
    justifyContent:'center',
    alignItems:'flex-start'
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
