import React, {Component} from 'react';
import {Image, Platform, Alert, Text, View, TouchableWithoutFeedback, TouchableOpacity, Modal} from 'react-native';
import RNFB from 'rn-fetch-blob';
import SketchCanvas from '@terrylinla/react-native-sketch-canvas/src/SketchCanvas';
import {style} from "./utils/style";
import {Actions} from 'react-native-router-flux';
import {requests} from "./utils/requests";
import {JOURNAL_API} from "./Urls";
import ZoomView from "./ZoomView";

export default class JournalWrite extends Component {
    constructor(props){
        super(props);
        this.state = {
            imagePath: '',
            bgWidth: 500,
            bgHeight: 1000,
            sketchMode: false,
            isSaving: false,
            scale: 0,
        };
        this.isSaved = false;
    }

    componentDidMount(){
        RNFB.config({fileCache: true})
            .fetch('GET', this.props.journal.image)
            .then(res=>{
                console.log(res);
                let path = Platform.OS === 'android' ? 'file://' + res.path() : res.path();
                Image.getSize(path, (bgWidth, bgHeight)=>{console.log(path, bgWidth, bgHeight); this.setState({bgWidth, bgHeight, imagePath: path})})
            })
    }

    undo() {
        return this._sketchCanvas.undo()
    }

    save() {
        if(this.isSaved){return}
        this.isSaved = true;
        let date = new Date();
        let fileName = this.props.journal.id + '_' + date.getFullYear() + ('0' + date.getMonth() + 1).slice(-2) + ('0' + date.getDate()).slice(-2) + ('0' + date.getHours()).slice(-2) + ('0' + date.getMinutes()).slice(-2) + ('0' + date.getSeconds()).slice(-2);
        console.log(fileName)
        let p = {
            folder: 'Journals',
            filename: fileName,
            transparent: false,
            imageType: 'jpg',
            cropToImageSize: true,
            includeImage: true,
            includeText: false,
        };
        this._sketchCanvas.save(p.imageType, p.transparent, p.folder, p.filename, p.includeImage, p.includeText, p.cropToImageSize)
    }

    saveOnServer(isSuccessful, path){
        this.setState({isSaving: true});
        let data = new FormData();
        let pathArray = path.split('/');
        data.append('image', {uri: 'file://' + path, name: pathArray[pathArray.length - 1], type: 'image/jpg'});
        requests(JOURNAL_API + this.props.journal.id + '/', 'FILE', data, {method: 'PUT'})
            .then(promise=>promise.json())
            .then(res=>{
                if(res.id){
                    this.setState({isSaving: false}, ()=>{
                        Alert.alert('저장 완료', '안전하게 저장되었습니다.');
                        Actions.popTo('formList');
                    });
                }
            });
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Modal
                    visible={this.state.isSaving}
                    onRequestClose={()=>{}}
                    transparent
                >
                    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: style.px1 * 16, color: '#fff'}}>저장중입니다...{'\n'}잠시만 기다려 주세요</Text>
                    </View>
                </Modal>
                <View style={{position: 'absolute', width: this.state.bgWidth, height: this.state.bgHeight}}>
                    <ZoomView scalable={!this.state.sketchMode} minScale={0.3} maxScale={5} scale={this.state.scale} onScale={()=>{this.setState({scale: 0})}}>
                        <SketchCanvas
                            ref={ref => this._sketchCanvas = ref}
                            touchEnabled={this.state.sketchMode}
                            style={{ backgroundColor: 'transparent', flex: 1}}
                            strokeColor={'#000000'}
                            onStrokeStart={()=>{}}
                            onStrokeChanged={()=>{}}
                            onStrokeEnd={()=>{}}
                            user={null}
                            strokeWidth={1}
                            onSketchSaved={this.saveOnServer.bind(this)}
                            onPathsChange={()=>{}}
                            text={null}
                            localSourceImage={{
                                filename: this.state.imagePath.replace('file://', ''),
                            }}
                            permissionDialogTitle={''}
                            permissionDialogMessage={''}
                        />
                    </ZoomView>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: style.px1 * 10}}>
                    <TouchableWithoutFeedback onPress={this.undo.bind(this)}>
                        <View style={styles.actionButton}>
                            <Image source={require('./icons/undo-arrow.png')} style={{width: style.px1 * 20, height: style.px1 * 20}}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{this.setState({scale: 1})}}>
                        <View style={styles.actionButton}>
                            <Text style={{fontSize: style.px1 * 20, color: '#ffffff'}}>100%</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{this.setState({sketchMode: !this.state.sketchMode})}}>
                        <View style={styles.actionButton}>
                            <Text style={{fontSize: style.px1 * 20, color: '#ffffff'}}>{this.state.sketchMode ? '작성모드' : '이동모드' }</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableOpacity onPress={this.save.bind(this)}>
                        <View style={styles.actionButton}>
                            <Text style={{fontSize: style.px1 * 20, color: '#ffffff'}}>저장</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = {
    actionButton: {
        backgroundColor: '#323232',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: style.px1 * 10,
        height: style.px1 * 35,
        borderRadius: style.px1 * 5,
    },
};