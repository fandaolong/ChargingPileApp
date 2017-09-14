import {Alert, ToastAndroid, Linking} from 'react-native';
import {Geolocation} from 'react-native-baidu-map';


/*
 * 展示信息（1个按钮）
 */
export function prompt(title='',
                        msg='',
                        btnTitle='ok',
                        callback=()=>{},
                        canCancel=true) {
    Alert.alert(name,
        msg,
        [
            {text: btnTitle, onPress: ()=>callback()},
        ],
        {cancelable:canCancel});
}

/*
 * 展示信息（2个按钮）
 */
export function prompt2(title='',
                        msg='',
                        btn1Title='cancel',
                        btn2Title='ok',
                        callback1=()=>{},
                        callback2=()=>{},
                        canCancel=true) {
    Alert.alert(title,
        msg,
        [
            {text: btn1Title, onPress: ()=>callback1()},
            {text: btn2Title, onPress: ()=>callback2()},
        ],
        {cancelable:canCancel});
}

/*
 * function ToastAndroid.show(...) wrapper.
 */
export function ToastAndroidBS(message) {
    ToastAndroid.show(message, ToastAndroid.BOTTOM, ToastAndroid.SHORT);
}

export function ToastAndroidBL() {
    ToastAndroid.show(message, ToastAndroid.BOTTOM, ToastAndroid.LONG);
}

export function ToastAndroidCS(message) {
    ToastAndroid.show(message, ToastAndroid.CENTER, ToastAndroid.SHORT);
}

export function ToastAndroidCL(message) {
    ToastAndroid.show(message, ToastAndroid.CENTER, ToastAndroid.LONG);
}

/*
 * 调用地图APP（百度、高德等）进行导航
 */
export const mapApp = {bdMap: 'bdMap', gdMap:'gdMap'};
/*
 * whichApp: 调用哪个APP进行导航
 * departure: 出发地
 * destination: 目的地
 * callback: 回调函数
 */
export function gotoNavigation(whichApp, from, to, callback) {
    let uri = '';
    let succeed = true;
    let msg = '';

    if (whichApp === mapApp.bdMap){
        uri += 'baidumap://map/direction?';
        if (from !== null && from !== undefined){
            uri += 'origin=name:|latlng:' + from.latitude + ',' + from.longitude + '&';
        }
        uri += 'destination=name:|latlng:' + to.latitude + ',' + to.longitude;
        uri += '&mode=driving';
    } else if (whichApp === mapApp.gdMap) {
        uri += 'amapuri://route/plan/?';
        uri += 'sourceApplication=cp';
        if (from !== null && from !== undefined) {
            uri += '&slat=' + from.latitude;
            uri += '&slon=' + from.longitude;
        }
        uri += '&dlat=' + to.latitude;
        uri += '&dlon=' + to.longitude;
        uri += '&dev=0';
        uri += '&t=0';
    } else {
        msg = 'not supported...';
        console.error(msg);
        callback && callback(!succeed, msg);
    }

    console.log(uri);

    Linking.canOpenURL(uri)
        .then(supported => {
            if (!supported) {
                msg = 'Cannot handle url: ' + uri;
                console.error(msg);
                callback && callback(!succeed, msg)
            } else {
                return Linking.openURL(uri);
            }
        })
        .catch(error => {
            msg = 'An error occurred: ' + error;
            console.error(msg);
            callback && callback(!succeed, msg);
        });
}

/*
* get current location by baidumap.
* */
export function getCurrentLocation() {
    return Geolocation.getCurrentPosition()
        .then(response=>{
            return response;
        },
        error=>{
            throw new Error(error);
        });
}