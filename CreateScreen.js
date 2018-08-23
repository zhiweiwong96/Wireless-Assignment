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
export default class CreateScreen extends Component <Props>{
  static navigationOptions={
    title:'Add New Task',
  };

  constructor(props){
    super(props)

    this.state={
      title:'',
      description:'',
    };

    this._insert=this._insert.bind(this);
    this.db=SQLite.openDatabase({name:'tasksdb', createFromLocation:'~db.sqlite'}, this.openDb, this.errorDb);
  }

  _insert(){
    this.db.transaction((tx)=>{
      tx.executeSql('INSERT INTO tasks(title, description, date)VALUES(?,?,?)',[
        this.state.title,
        this.state.description,
        this.state.date,
      ]);
    });

    this.props.navigation.getParam('refresh')();
    this.props.navigation.goBack();
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
          value={this.state.description}
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
          onPress={this._insert}
        />
        </ScrollView>

    )
  }









};








const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  picker: {
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});
