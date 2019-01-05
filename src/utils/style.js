import {Dimensions} from 'react-native'

export const windowSize = Dimensions.get('window');

export const style = {
    px1: windowSize.width / 360,
};