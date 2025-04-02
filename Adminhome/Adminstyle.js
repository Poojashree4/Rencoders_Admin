

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(242, 248, 249, 0.93)',
    alignItems: 'center',
    justifyContent: 'center',
  
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '90%',
    marginBottom: 15, 
  },
  card: {
    flex: 1, // Allow cards to scale flexibly within row
    padding: 20,
    
    backgroundColor: 'rgba(151, 190, 215, 0.93)',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    marginHorizontal: 10, 
    marginVertical: 10,
    transform: [{ scale: 1 }],
    marginBottom:60,
    marginTop:-40,
    width: '95%', 
  },
  cardtwo: {
    flex: 1, 
    padding: 20,
    
    backgroundColor: 'rgba(198, 171, 208, 0.93)',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    marginHorizontal: 10, 
    marginVertical: 10,
    transform: [{ scale: 1 }],
    marginBottom:60,
    marginTop:-40,
    width: '95%', 
  },
  
  cardHover: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    transform: [{ scale: 1.05 }],
  },
  cardImage: {
    width: 100, // Reduced image size for two cards in a row
    height: 100,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
 
  scrollContainer: {
  
    backgroundColor: 'white',
  },
 
  navbarContainer: {
    position: "absolute",
    bottom: 0,  
    width: "100%",
  },

  // cardone: {
  //   flex: 1, 
  //   padding: 20,
  //   backgroundColor: 'rgba(179, 185, 99, 0.93)',
  //   borderRadius: 20,
  //   shadowColor: 'black',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 5,
  //   elevation: 5,
  //   alignItems: 'center',
  //   marginHorizontal: 10, 
  //   marginVertical: 10,
  //   transform: [{ scale: 1 }],
  //   marginTop:30,
  //   marginBottom:70,
  //   width:300,
  //   height:150,
    
  // },
  countContainer: {
    marginTop: 2,
    
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'white',
  },
  header: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  cardone: {
    flex: 1,
    padding: 20,
    backgroundColor:'rgb(206 ,234,214)',
  //  borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    //  marginTop: 30,
    marginBottom: 70,
    width: '100%',
    height: 250,
     borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  
  welcomeText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 25,
  },
  headtitl:{
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: 'purple',
    textAlign: 'center',
    marginTop:-25,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
  
    backgroundColor:'rgb(206 ,234,214)',
  },
  
  
  cardone: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(212, 240, 229, 0.93)',
    borderRadius: 40,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 20,

    marginBottom: 60,
    width: '100%',
    height: 250,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },

  cardLogo: {
    width: 70,
    height: 65,
  },

  cardBellIcon: {
    marginRight: 10,
  },
});

export default styles;
