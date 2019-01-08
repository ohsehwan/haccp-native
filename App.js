import React, {Component} from 'react';
import {Image, Platform, StyleSheet, Text, View,} from 'react-native';
import RouterComponent from "./src/Router";

// console.log = function () {};

export default class App extends Component {
    render(){
        return(
            <RouterComponent/>
        )
    }
}

