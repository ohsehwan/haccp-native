import React, {Component} from 'react';
import {ScrollView, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import {LOGIN_API} from "./Urls";
import {requests} from "./utils/requests";
import {Actions} from 'react-native-router-flux';
import {style} from "./utils/style";


export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            usernameInvalid: false,
            password: '',
            passwordInValid: false,
        };
    }

    login(){
        let data = {
            username: this.state.username,
            password: this.state.password,
        };
        requests(LOGIN_API, 'POST', data)
            .then(promise=>promise.json())
            .then(result=>{
                console.log(result);
                if(result.code === 'SUCCESS'){
                    Actions.splash({type: 'reset'})
                }else{
                    this.setState({passwordInvalid: result.code === 'INVALID_FOUND', usernameInvalid: result.code === 'USER_NOT_FOUND'});
                }
            })
    }

    render(){
        return(
            <View style={styles.view}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        justifyContent: 'space-between',
                        paddingBottom: style.px1 * 20,
                        paddingHorizontal: style.px1 * 20,
                    }}>
                    <View>
                        <Text style={styles.header}>로그인</Text>
                        <LabelInput
                            label={'아이디'}
                            maxLength={10}
                            value={this.state.username}
                            onChangeText={(text)=>{this.setState({username:text})}}
                            keyboardType={'default'}
                            placeholder={'아이디를 입력해주세요'}
                        />
                        {this.state.usernameInvalid? <Text style={styles.warning}>가입된 정보가 없습니다.</Text>:null}
                        <LabelInput
                            label={'비밀번호'}
                            maxLength={100}
                            value={this.state.password}
                            onChangeText={(text)=>{this.setState({password: text, passwordInvalid: false})}}
                            placeholder={'비밀번호 입력'}
                            secureTextEntry={true}
                            autoCapitalize={'none'}
                            invalid={this.state.passwordInvalid}
                        />
                        {this.state.password && this.state.passwordInvalid?<Text style={styles.warning}>비밀번호가 틀렸습니다.</Text>:null}
                        <TouchableWithoutFeedback onPress={this.login.bind(this)}>
                            <View style={{
                                paddingVertical: style.px1 * 10,
                                backgroundColor: '#333',
                                borderRadius: style.px1 * 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: style.px1 * 50,
                            }}>
                                <Text style={{color: '#fff', fontSize: style.px1 * 30}}>로그인</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>
        )
    }
}


class LabelInput extends Component{
    constructor(props){
        super(props);
        this.state = {
            focus: false,
            text: '',
        }
    }

    render(){
        return(
            <View style={{marginTop: style.px1 * 20}}>
                <Text style={styles.label}>{this.props.label}</Text>
                <View style={styles.row}>
                    <TextInput
                        underlineColorAndroid={'rgba(0,0,0,0)'}
                        value={this.props.value}
                        style={{borderWidth: 1, flex: 1}}
                        onChangeText={(text)=>{this.props.onChangeText(text)}}
                        placeholder={this.props.placeholder}
                        placeholderTextColor={style.placeholder}
                        keyboardType={this.props.keyboardType}
                        {...this.props}
                    />
                </View>
            </View>
        )
    }
}


const styles = {
    view: {
        flex: 1,
    },
    nav: {
        paddingVertical: style.px1 * 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        paddingTop: style.px1 * 50,
        paddingBottom: style.px1 * 30,
        fontSize: style.px1 * 40,
        color: style.black,
        textAlign: 'center',
    },
    title: {
        fontSize: style.px1 * 14,
        color: style.black,
        textAlign: 'center',
    },
    warning: {
        paddingTop: style.px1 * 12,
        color: style.red,
        fontSize: style.px1 * 14,
    },
    success: {
        color: style.green,
    },
    inputWrap: {
        paddingTop: style.px1 * 10,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
    },
    nextButton: {
        position: 'absolute',
        right: 15,
        bottom: 15,
        alignItems: 'center',
        justifyContent:'center',
    },


    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: style.px1 * 16,
    },
    imgWrap: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 0.1,
    },
    eraseImg: {
        height: style.px1 * 16,
        width: style.px1 * 16,
        marginRight: style.px1 * 4,
    },
    input: {
        fontSize: style.px1 * 20,
        paddingVertical: style.px1 * 12,
        flex: 0.8,
    },
    remove: {
        color: style.green,
        fontSize: style.px1 * 16,
    }
};
