import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {style} from "./utils/style";
import {requests} from "./utils/requests";
import {Actions} from 'react-native-router-flux';
import {FCM_REGISTER_API, LOGIN_API} from "./Urls";
import firebase from 'react-native-firebase';


export default class Splash extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillMount(){
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    // user has permissions
                    console.log('FB-push enabled')
                } else {
                    firebase.messaging().requestPermission()
                }
            });
        requests(LOGIN_API, 'GET', null)
            .then(promise=>promise.json())
            .then(res=>{
                console.log(res);
                if(res.code === 'SUCCESS'){
                    firebase.messaging().getToken()
                        .then(token=>{
                            console.log('Token', token);
                            this.registerFCMToken(token);
                        });
                    Actions.formList({type: 'reset'})
                }else{
                    Actions.login({type: 'reset'})
                }
            })
    }

    registerFCMToken(token){
        requests(FCM_REGISTER_API, 'POST', {token: token})
            .then(promise=>promise.json())
            .then(res=>{
                console.log(res)
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