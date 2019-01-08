import React, {Component} from 'react';
import {FlatList, Image, ScrollView, Text, TouchableWithoutFeedback, View} from 'react-native';
import {requests} from "./utils/requests";
import {JOURNAL_FORM_API, LOGIN_API} from "./Urls";
import {Actions} from 'react-native-router-flux';
import {style} from "./utils/style";


export default class FormList extends Component{
    constructor(props){
        super(props);
        this.state = {
            forms: []
        };
    }

    componentWillMount(){
        requests(JOURNAL_FORM_API, 'GET', null)
            .then(promise=>promise.json())
            .then(res=>{
                console.log(res);
                this.setState({forms: res})
            });
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flex: 1}}>
                    <FlatList
                        contentContainerStyle={{padding: style.px1 * 15}}
                        data={this.state.forms}
                        renderItem={({item})=> <FormItem item={item}/>}
                        keyExtractor={(item, index)=>item.id.toString()}
                    />
                </ScrollView>
            </View>
        )
    }
}


class FormItem extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let item = this.props.item;
        return (
            <TouchableWithoutFeedback onPress={()=>{
                Actions.push('journalList',{form: item, title: item.title})
            }}>
                <View style={styles.formView}>
                    <Text style={{fontSize: style.px1 * 24, color: '#323232', marginLeft: style.px1 * 10}}>{item.title}</Text>
                    <Image source={{uri: item.thumbnail}} style={{width: style.px1 * 200, height: style.px1 * 300}}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = {
    formView: {
        padding: style.px1 * 10,
        backgroundColor: '#fff',
        marginTop: style.px1 * 20,
    }
};