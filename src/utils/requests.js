import {Platform} from 'react-native';

export const requests = (url, method, data) => {
    const userAgent = (Platform.OS === 'ios' ? 'iOS/Flier' : 'Android/Flier');

    switch(method){
        case 'GET':
            return (
                fetch(url, {
                    method: method,
                    headers: {
                        'User-Agent': userAgent,
                    }
                })
            );
        case 'FILE':
            return (
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json; utf-8;',
                        'User-Agent': userAgent,
                        'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6823e56dh',
                    },
                    body: data,
                })
            );
        default:
            return (
                fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json; utf-8;',
                        'User-Agent': userAgent
                    },
                    body: JSON.stringify(data)
                })
            );
    }
};
