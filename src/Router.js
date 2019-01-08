import React, {Component} from 'react';
import {View} from 'react-native';
import {Router, Scene} from 'react-native-router-flux';
import JournalWrite from "./JournalWrite";
import FormList from "./FormList";
import JournalList from "./JournalList";
import Splash from "./Splash";
import Login from "./Login";


export default class RouterComponent extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Router>
                    <Scene key={'root'}>
                        <Scene key={'splash'} hideNavBar={true} component={Splash}/>
                        <Scene key={'login'} hideNavBar={true} component={Login}/>
                        <Scene key={'formList'} title={'일지 메뉴'} component={FormList}/>
                        <Scene key={'journalList'} back component={JournalList}/>
                        <Scene key={'journalWrite'} hideNavBar={true} component={JournalWrite}/>
                    </Scene>
                </Router>
            </View>
        )
    }
}