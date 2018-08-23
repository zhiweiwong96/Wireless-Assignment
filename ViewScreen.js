import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {
  InputWithLabel
} from './UI';
import { FloatingAction } from 'react-native-floating-action';

const actions=[{
  text:'Edit',
  color:'#c80000',
  icon: require('./images/baseline_edit_white_18dp.png'),
  name:'edit',
  position:2
},
{
  text:'Delete',
  color:'#c80000',
  icon:require('./images/baseline_delete_white_18dp.png'),
  name:'delete',
  position:1
}];

let SQLite=require('react-native-sqlite-storage');

type Props={};
export default class ViewScreen extends Component<Props>{
  static navigationOptions=({navigation})=>{
    return {
      title:navigation.getParam('headerTitle')
    };
  };
  constructor(props){
    super(props)
    this.state={
      taskId:this.props.navigation.getParam('id'),
      task:null,
    };
    this._query=this._query.bind(this);
    this.db=SQLite.openDatabase({name:'tasksdb', createFromLocation:'~db.sqlite'},this.openDb, this.errorDb);
  }
  componentDidMount(){
    this._query();
  }

  _query(){
    this.db.transaction((tx)=>{
      tx.executeSql('SELECT * FROM tasks WHERE id=?', [this.state.taskId], (tx, results)=>{
        if(results.rows.length){
          this.setState({
            task:results.rows.item(0),
          })
        }
      })
    });
  }

  _delete(){
    Alert.alert('Are you sure you want to delete task', ''+ this.state.task.title +'?', [
      {
        text:'No',
        onPress:()=>{},
      },
      {
        text:'Yes',
        onPress:()=>{
          this.db.transaction((tx)=>{
            tx.executeSql('DELETE FROM tasks WHERE id=?',[this.state.taskId])
          });
          this.props.navigation.getParam('refresh')();
          this.props.navigation.goBack();
        },
      },
    ], { cancelable: false });
  }

  openDb(){console.log('Database opened');}
  errorDb(){console.log('SQL error: '+err);}

  render(){
    let task=this.state.task;

    return(
      <View style={styles.container}>
        <ScrollView>
          <InputWithLabel style={styles.output}
             label={'Title'}
             value={task?task.title:''}
             orientation={'vertical'}
             editable={false}
          />

          <InputWithLabel style={styles.output}
             label={'Description'}
             value={task?task.description:''}
             orientation={'vertical'}
             editable={false}
          />

          <InputWithLabel style={styles.output}
             label={'Date'}
             value={task?new Date(task.date).toDateString():''}
             orientation={'vertical'}
             editable={false}
          />
        </ScrollView>

        <FloatingAction
           actions={actions}
           color={'#a80000'}
           floatingIcon={(
             <Image
                source={require('./images/baseline_edit_white_18dp.png')}
             />
           )}

           onPressItem={(name)=>{
             switch(name){
               case 'edit':
                 this.props.navigation.navigate('Edit',{
                   id:task?task.id:0,
                   headerTitle:task?task.title:'',
                   refresh:this._query,
                   homeRefresh:this.props.navigation.getParam('refresh'),
                 });
                 break;

                 case 'delete':
                   this._delete();
                   break;
             }
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
    padding: 20,
    backgroundColor: '#fff',
  },
  output: {
    fontSize: 24,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
});
