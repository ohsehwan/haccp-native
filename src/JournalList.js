import React, {Component} from 'react';
import {FlatList, Alert, ScrollView, Text, TouchableWithoutFeedback, View, Modal} from 'react-native';
import {requests} from "./utils/requests";
import {JOURNAL_API} from "./Urls";
import {Actions} from 'react-native-router-flux';
import {style} from "./utils/style";


export default class JournalList extends Component{
    constructor(props){
        super(props);
        this.state = {
            journals: [],
            isCreating: false,
        };
    }

    componentWillMount(){
        this.getList()
    }

    getList(){
        requests(JOURNAL_API + `?form=${this.props.form.id}`, 'GET', null)
            .then(promise=>promise.json())
            .then(res=>{
                console.log(res);
                this.setState({journals: res})
            })
    }

    onCreate(){
        Alert.alert(
            '새 일지 생성',
            '새로운 일지를 생성하시겠어요?',
            [
                {text: '아니오', onPress: ()=>{}},
                {text: '네', onPress: this.createJournal.bind(this)},
            ],
            { cancelable: true }
        )
    }

    createJournal(){
        console.log('CREATE');
        this.setState({isCreating: true});
        requests(JOURNAL_API, 'POST', {form: this.props.form.id})
            .then(promise=>promise.json())
            .then(res=>{
                if(res.id){
                    this.getList();
                    this.setState({isCreating: false})
                }
            })
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Modal
                    visible={this.state.isCreating}
                    onRequestClose={()=>{}}
                    transparent>
                    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: style.px1 * 16, color: '#fff'}}>생성중입니다...{'\n'}잠시만 기다려 주세요</Text>
                    </View>
                </Modal>
                <ScrollView contentContainerStyle={{flex: 1, padding: style.px1 * 15}}>
                    <TouchableWithoutFeedback onPress={this.onCreate.bind(this)}>
                        <View style={{backgroundColor: '#009ACD', justifyContent: 'center', paddingVertical: style.px1 * 15}}>
                            <Text style={{fontSize: style.px1 * 20, textAlign: 'center', color: '#fff'}}>+ 새 일지 생성</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <FlatList
                        data={this.state.journals}
                        renderItem={({item})=> <JournalItem key={item.id} item={item}/>}
                        keyExtractor={(item, index)=>item.id.toString()}
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
                Actions.push('journalWrite',{journal: item})
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
