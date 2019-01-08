import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {style} from "./utils/style";
import {requests} from "./utils/requests";
import {Actions} from 'react-native-router-flux';
import {LOGIN_API} from "./Urls";


export default class Splash extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillMount(){
        requests(LOGIN_API, 'GET', null)
            .then(promise=>promise.json())
            .then(res=>{
                console.log(res);
                if(res.code === 'SUCCESS'){
                    Actions.formList({type: 'reset'})
                }else{
                    Actions.login({type: 'reset'})
                }
            })
    }

    render(){
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: style.px1 * 30}}>일지를 사랑해</Text>
            </View>
        )
    }
}