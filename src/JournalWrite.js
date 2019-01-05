import React, {Component} from 'react';
import {Image, Platform, Alert, Text, View, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import PinchZoomView from 'react-native-pinch-zoom-view';
import RNFB from 'rn-fetch-blob';
import SketchCanvas from '@terrylinla/react-native-sketch-canvas/src/SketchCanvas';
import {style} from "./utils/style";

export default class JournalWrite extends Component {
    constructor(props){
        super(props);
        this.state = {
            imagePath: '',
            bgWidth: 500,
            bgHeight: 1000,
            sketchMode: false,
        };
    }

    componentDidMount(){
        RNFB.config({fileCache: true})
            .fetch('GET', this.props.bgUrl)
            .then(res=>{
                console.log(res);
                let path = Platform.OS === 'android' ? 'file://' + res.path() : res.path();
                Image.getSize(path, (bgWidth, bgHeight)=>{console.log(path, bgHeight, bgWidth); this.setState({bgWidth, bgHeight, imagePath: path})})
            })
    }

    undo() {
        return this._sketchCanvas.undo()
    }

    save() {
        let date = new Date();
        let fileName = date.getFullYear() + ('0' + date.getMonth() + 1).slice(-2) + ('0' + date.getDate()).slice(-2) + ('0' + date.getHours()).slice(-2) + ('0' + date.getMinutes()).slice(-2) + ('0' + date.getSeconds()).slice(-2);
        let p = {
            folder: 'Journals',
            filename: String(Math.ceil(Math.random() * 100000)) + '_' + fileName,
            transparent: false,
            imageType: 'jpg',
            cropToImageSize: true,
            includeImage: true,
            includeText: false,
        };
        this._sketchCanvas.save(p.imageType, p.transparent, p.folder, p.filename, p.includeImage, p.includeText, p.cropToImageSize)
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{position: 'absolute', width: this.state.bgWidth, height: this.state.bgHeight}}>
                    <PinchZoomView scalable={!this.state.sketchMode} minScale={0.5} maxScale={5}>
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
                            onSketchSaved={(success, path) => {
                                console.log(success, path);
                                Alert.alert('저장 완료', '안전하게 저장되었습니다.');
                            }}
                            onPathsChange={()=>{}}
                            text={null}
                            localSourceImage={{
                                filename: this.state.imagePath.replace('file://', ''),
                            }}
                            permissionDialogTitle={''}
                            permissionDialogMessage={''}
                        />
                    </PinchZoomView>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: style.px1 * 10}}>
                    <TouchableWithoutFeedback onPress={this.undo.bind(this)}>
                        <View style={styles.actionButton}>
                            <Image source={require('./icons/undo-arrow.png')} style={{width: style.px1 * 20, height: style.px1 * 20}}/>
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