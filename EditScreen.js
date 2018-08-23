import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
  DatePickerAndroid,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  InputWithLabel,
  PickerWithLabel,
  AppButton,
} from './UI'

Date.prototype.formatted = function() {
  let day = this.getDay();
  let date = this.getDate();
  let month = this.getMonth();
  let year = this.getFullYear();
  let daysText = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let monthsText = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  return `${daysText[day]}, ${monthsText[month]} ${date}, ${year}`;
}

let SQLite=require('react-native-sqlite-storage');

type Props={};
export default class EditScreen extends Component<Props>{
  static navigationOptions=({navigation})=>{
    return{
    title:'Edit'+navigation.getParam('headerTitle')
    };
  };

  constructor(props){
    super(props)

    this.state={
      taskId: this.props.navigation.getParam('id'),
      title:'',
      description:'',
      date: new Date(),
      dateText: ''
    };


    this._query=this._query.bind(this);
    this._update=this._update.bind(this);

    this.db=SQLite.openDatabase({name:'taskdb', createFromLocation:'~db.sqlite'}, this.openDb, this.errorDb);
  }

    componentDidMount(){
      this._query();
    }

    _query(){
      this.db.transaction((tx)=>{
        tx.executeSql('SELECT * FROM tasks WHERE id=?',[this.state.taskId], (tx, results)=>{
          if(results.rows.length){
            this.setState({
              name:results.rows.item(0).title,
              city:results.rows.item(0).description,
              date:new Date(results.rows.item(0).date),
              dateText: new Date(results.rows.item(0).date).formatted(),
            })
          }
        })
      });
    }

    _update(){
      this.db.transaction((tx)=>{
        tx.executeSql('UPDATE tasks SET title=?,description=?,date=? WHERE id=?',[
          this.state.title,
          this.state.description,
          this.state.date,
          this.state.taskId,
        ]);
      });

      this.props.navigation.getParam('refresh')();
      this.props.navigation.getParam('homeRefresh')();
      this.props.navigation.goBack();
    }

    openDb(){
      console.log('Database opened');
    }

    errorDb(err){
      console.log('SQL Error: '+err);
    }

    openDatePicker = async () => {
   try {
     const {action, year, month, day} = await DatePickerAndroid.open({
       date: this.state.date,
       minDate: new Date(2000, 0, 1),
       maxDate: new Date(2099, 11, 31),
       mode: 'calendar', // try also with `spinner`
     });
     if (action !== DatePickerAndroid.dismissedAction) {
       // Selected year, month (0-11), day
       let selectedDate = new Date(year, month, day);

       this.setState({
         date: selectedDate.getTime(),
         dateText: selectedDate.formatted(),
       });
     }
   } catch ({code, message}) {
     console.warn('Cannot open date picker', message);
   }
 }

    render(){
      let task=this.state.task;
      return(
        <ScrollView style={styles.container}>
          <InputWithLabel style={styles.input}
            label={'Title'}
            value={this.state.title}
            onChangeText={(title)=>{this.setState({title})}}
            orientation={'vertical'}
          />


            <InputWithLabel style={styles.input}
              label={'Description'}
              value={this.state.city}
              onChangeText={(description)=>{this.setState({description})}}
              orientation={'vertical'}
            />


       <TouchableWithoutFeedback
         onPress={ this.openDatePicker }
       >
         <View>
           <InputWithLabel style={styles.input}
             label='Event Date'
             value={this.state.dateText}
             onChangeText={(date)=>{this.setState({date})}}
             editable={false}
             orientation={'vertical'}
           />
         </View>
       </TouchableWithoutFeedback>


            <AppButton style={styles.button}
              title={'Save'}
              theme={'primary'}
              onPress={this._update}
            />
          </ScrollView>
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
  input: {
      fontSize: 20,
      height: 48,
      color: 'black',
      borderBottomWidth: 2,
      borderBottomColor: 'red',
    },
});
