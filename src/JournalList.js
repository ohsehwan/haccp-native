import React, {Component} from 'react';
import {FlatList, Image, ScrollView, Text, TouchableWithoutFeedback, View} from 'react-native';
import {requests} from "./utils/requests";
import {JOURNAL_API} from "./Urls";
import {Actions} from 'react-native-router-flux';
import {style} from "./utils/style";


export default class JournalList extends Component{
    constructor(props){
        super(props);
        this.state = {
            journals: [],
        };
    }

    componentWillMount(){
        requests(JOURNAL_API + `?form=${this.props.form.id}`, 'GET', null)
            .then(promise=>promise.json())
            .then(res=>{
                console.log(res)
                this.setState({journals: res})
            })
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flex: 1}}>
                    <FlatList
                        contentContainerStyle={{padding: style.px1 * 15}}
                        data={this.state.journals}
                        renderItem={({item})=> <JournalItem item={item}/>}
                    />
                </ScrollView>
            </View>
        )
    }
}

class JournalItem extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let item = this.props.item;
        console.log(item);
        return (
            <TouchableWithoutFeedback onPress={()=>{
                Actions.push('journalWrite',{bgUrl: item.image, formId: item.id})
            }}>
                <View style={styles.formView}>
                    <Text style={{fontSize: style.px1 * 24, color: '#323232', marginLeft: style.px1 * 10}}>
                        마지막 작성일: {item.updated_at.split('T')[0]}
                    </Text>
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
