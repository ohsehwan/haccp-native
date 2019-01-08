import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, PanResponder, ViewPropTypes, Dimensions } from 'react-native';

// Fallback when RN version is < 0.44
const viewPropTypes = ViewPropTypes || View.propTypes;

export default class PinchZoomView extends Component {
    static propTypes = {
        ...viewPropTypes,
        scalable: PropTypes.bool,
        minScale: PropTypes.number,
        maxScale: PropTypes.number
    };

    static defaultProps = {
        scalable: true,
        minScale: 0.5,
        maxScale: 2
    };

    constructor(props) {
        super(props);
        this.state = {
            scale: 1,
            minScale: 0.1,
            lastScale: 1,
            offsetX: 0,
            offsetY: 0,
            lastX: 0,
            lastY: 0,
            lastPx: 0,
            lastPy: 0,
            lastMovePinch: false
        };
        this.distant = 150;
        this.screen = Dimensions.get('window')
        this.startX = 100
        this.startY = 100
    }

    componentWillMount() {
        this.gestureHandlers = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminationRequest: evt => true,
            onShouldBlockNativeResponder: evt => false
        });
    }

    componentWillReceiveProps(props){
        if(props.scale === 1){
            this.moveToCenter(this.screen.width/this.viewWidth)
            this.props.onScale();
        }
    }

    _handleStartShouldSetPanResponder = (e, gestureState) => {
        // don't respond to single touch to avoid shielding click on child components
        return false;
    };

    _handleMoveShouldSetPanResponder = (e, gestureState) => {
        return (
            this.props.scalable &&
            (Math.abs(gestureState.dx) > 2 ||
                Math.abs(gestureState.dy) > 2 ||
                gestureState.numberActiveTouches === 2)
        );
    };

    _handlePanResponderGrant = (e, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
            let dx = Math.abs(
                e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX
            );
            let dy = Math.abs(
                e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY
            );
            let distant = Math.sqrt(dx * dx + dy * dy);
            this.distant = distant;
            this.touchMode = 'TWO'
            this.startX = e.nativeEvent.touches[0].locationX
            this.startY = e.nativeEvent.touches[0].locationY
        }else if(gestureState.numberActiveTouches === 1){
            this.touchMode = 'ONE'
        }
    };

    _handlePanResponderEnd = (e, gestureState) => {
        this.setState({
            lastX: this.state.offsetX,
            lastY: this.state.offsetY,
            lastScale: this.state.scale,
        });
    };

    _handlePanResponderMove = (e, gestureState) => {
        // zoom
        if (gestureState.numberActiveTouches === 2) {
            evt = e.nativeEvent
            if(evt.touches[0].locationX < 0 || evt.touches[1].locationX < 0 || evt.touches[0].locationY < 0 || evt.touches[1].locationY < 0){return}
            let dx = Math.abs(
                e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX
            );
            let dy = Math.abs(
                e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY
            );
            let distant = Math.sqrt(dx * dx + dy * dy);
            let scale = (distant / this.distant) * this.state.lastScale;
            // console.log('Two touch', scale, this.state.offsetX, this.state.offsetY, evt.touches[0].pageX, evt.touches[1].pageY, evt.touches[0].locationX, evt.touches[1].locationY)
            // console.log(evt.touches[0].locationX, evt.touches[0].locationY)
            // console.log(evt.touches[0].pageX, evt.touches[0].pageY)
            // console.log(scale, dx, dy, this.state.lastScale)
            //check scale min to max hello
            if (scale < this.props.maxScale && scale > this.state.minScale) {
                console.log('SCALE')
                this.distant = distant
                let pgX = evt.touches[0].pageX / scale
                let pgY = evt.touches[0].pageY / scale
                // console.log(scale)
                // console.log('Two touch', pgX, pgY, evt.touches[0].locationX, evt.touches[1].locationY)
                let offsetX = -((this.viewWidth/scale)/2) + (this.viewWidth/2) //to point (0, 0)
                let offsetY = -((this.viewHeight/scale)/2) + (this.viewHeight/2) + (50/scale) //to point (0, 0)
                let xDiff = pgX - this.startX
                let yDiff = pgY - this.startY
                this.setState({ scale: scale, offsetX: offsetX + xDiff, offsetY: offsetY + yDiff, lastScale: scale, lastMovePinch: true});
            }
        }
        // translate
        else if (gestureState.numberActiveTouches === 1 && this.touchMode !== 'TWO') {
            evt = e.nativeEvent
            if (this.state.lastMovePinch) {
                gestureState.dx = 0;
                gestureState.dy = 0;
            }
            let offsetX = this.state.lastX + gestureState.dx / this.state.scale;
            let offsetY = this.state.lastY + gestureState.dy / this.state.scale;
            if(evt.locationX - (evt.pageX / this.state.scale) < 0 && offsetX > this.offsetX){offsetX = this.offsetX}
            else if(evt.locationX + ((this.screen.width - evt.pageX)/this.state.scale) > this.viewWidth && offsetX < this.offsetX){offsetX = this.offsetX}
            if(evt.locationY - (evt.pageY / this.state.scale) < 0 && offsetY > this.offsetY){offsetY = this.offsetY}
            else if(evt.locationY + ((this.screen.height - evt.pageY)/this.state.scale) > this.viewHeight && offsetY < this.offsetY){offsetY = this.offsetY}
            // if ( offsetX < 0  || offsetY <  0 )
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            console.log('One touch', this.offsetX, this.offsetY)
            this.setState({ offsetX, offsetY, lastMovePinch: false });
        }
    };

    onLayout(e){
        let layout = e.nativeEvent.layout
        this.viewWidth = layout.width;
        this.viewHeight = layout.height;
        let scale = this.screen.width / this.viewWidth;
        this.setState({minScale: scale})
        this.moveToCenter(scale)
    }

    moveToCenter(scale){
        let offsetX = -((this.viewWidth/scale)/2) + (this.viewWidth/2)
        let offsetY = -((this.viewHeight/scale)/2) + (this.viewHeight/2) + (50/scale)
        // console.log('Center', offsetX, offsetY)
        this.setState({scale: scale, lastScale: scale, offsetX: offsetX, offsetY: offsetY, lastX: offsetX, lastY: offsetY})
    }

    render() {
        return (
            <View
                ref={ref=>{this.view = ref}}
                onLayout={this.onLayout.bind(this)}
                {...this.gestureHandlers.panHandlers}
                style={[
                    styles.container,
                    this.props.style,
                    {
                        transform: [
                            {scale: this.state.scale},
                            { translateX: this.state.offsetX },
                            { translateY: this.state.offsetY }
                        ]
                    }
                ]}
            >
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
