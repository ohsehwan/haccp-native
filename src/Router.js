import React, {Component} from 'react';
import {View} from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import JournalWrite from "./JournalWrite";
import FormList from "./FormList";
import JournalList from "./JournalList";
import Splash from "./Splash";
import Login from "./Login";
import {requests} from "./utils/requests";
import {LOGIN_API} from "./Urls";


export default class RouterComponent extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    logOut(){
        console.log('logout')
        requests(LOGIN_API, 'DELETE', null)
            .then(promise=>promise.json())
            .then(res=>{
                console.log(res)
                if(res.code === 'SUCCESS'){
                    Actions.splash({type: 'reset'})
                }
            })
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Router>
                    <Scene key={'root'}>
                        <Scene key={'splash'} hideNavBar={true} component={Splash}/>
                        <Scene key={'login'} hideNavBar={true} component={Login}/>
                        <Scene key={'formList'} title={'일지 메뉴'} component={FormList} rightTitle={'로그아웃'} onRight={this.logOut.bind(this)}/>
                        <Scene key={'journalList'} back component={JournalList}/>
                        <Scene key={'journalWrite'} hideNavBar={true} component={JournalWrite}/>
                    </Scene>
                </Router>
            </View>
        )
    }
}