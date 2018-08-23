import React, { Component, PureComponent } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  FlatList,
  AppState,
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';

const actions=[{
  text:'Add',
  icon:require('./images/baseline_add_white_18dp.png'),
  name:'add',
  position:1
}];

let SQLite=require('react-native-sqlite-storage');

type Props={};
export default class HomeScreen extends Component{
  static navigationOptions={
    title:'List of tasks',
  };
  constructor(props){
    super(props)
    this.state={
      tasks:[],
    };
    this._query=this._query.bind(this);
    this.db=SQLite.openDatabase({name:'tasksdb', createFromLocation:'~db.sqlite'}, this.openDb, this.errorDb);
  }
  componentDidMount(){
    this._query();
  }
  _query(){
    this.db.transaction((tx)=>{
      tx.executeSql('SELECT * FROM tasks ORDER BY date',[],(tx, results)=>{
        this.setState({
          tasks: results.rows.raw(),
        })
      })
    });
  }
  openDb(){
    console.log('Database opened');
  }
  errorDb(err){
    console.log('SQL Error: '+ err);
  }
  render(){
    return(
    <View style={styles.container}>
      <FlatList
         data={this.state.tasks}
         extraData={this.state}
         showsVerticalScrollIndicator={true}
         renderItem={({item})=>
         <TouchableHighlight
         underlayColor={'#cccccc'}
         onPress={()=>{
           this.props.navigation.navigate('View',{
             id:item.id,
             headerTitle:item.title,
             refresh:this._query,
           })
         }}
         >
           <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.description}</Text>
              <Text style={styles.itemSubtitle}>{new Date(item.date).toDateString()}</Text>
           </View>
           </TouchableHighlight>
         }
         KeyExtractor={(item)=>{item.id.toString()}} //not necessary
      />
      <FloatingAction
         actions={actions}
         overrideWithAction={true}
         color={'#a80000'}
         onPressItem={
           ()=>{
             this.props.navigation.navigate('Create', {
               refresh:this._query,
             })
           }
         }
      />
    </View>
  );
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  item: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',

  },
  itemSubtitle: {
    fontSize: 18,
  }
});
