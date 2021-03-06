import React, {Component} from 'react';
import {
    View,
    Text,
    Keyboard,
    Vibration,
    TextInput,
    Animated,
    TouchableOpacity,
} from 'react-native';

import styles, {Size} from './styles';
import {Button} from 'react-native-elements';
import {GPlaceholderTextColor} from "../../Common/colors";
import {StackNavigator, NavigationActions} from 'react-navigation';
import CPAWaitingChargingPage from "../WaitingChargingPage/index";

import TextInputStyles from "../../CustomComponents/SimpleCustomComponent/styles";
import Camera from 'react-native-camera';
import colors from '../../Common/colors';
import {startCharging} from "../../Common/webApi";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DividerLine from "../../CustomComponents/DividerLine/index";
import {error, prompt, ToastAndroidBS, validSerialNumber} from "../../Common/functions";


const SNCount = 10;
const ScanInterval = 3000; // 扫描成功后，间隔3s允许再次处理
class CPAScanPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            scanOrInput: 'scan',
            torchMode: Camera.constants.TorchMode.off,
            sn: '',
            scanning: false,
        };
    }

    componentWillMount() {
        this._animatedValue = new Animated.Value(0);
    }

    componentDidMount() {
        this._timer = setInterval(()=>{
            this._animatedValue.setValue(0);
            this._startScanStrip();
        }, 5000+30); // 添加30ms的延迟

        this._startScanStrip();
    }

    componentWillUnmount() {
        this._timer && clearInterval(this._timer);
        this._scanTimer && clearTimeout(this._scanTimer);
    }

    _startScanStrip = () => {
        Animated.sequence([
            Animated.timing(this._animatedValue, {
                toValue: Size-4,
                duration: 2500,
            }),
            Animated.timing(this._animatedValue, {
                toValue: 0,
                duration: 2500,
            })
        ]).start();
    };


    // 扫码
    _onScanButtonPress = () => {
        if (this.state.scanOrInput === 'input') {
            this.setState({
                ...this.state,
                scanOrInput: 'scan',
                sn: '',
            });
        }
    };

    // 输入编号
    _onInputSerialNumberButtonPress = () => {
        if (this.state.scanOrInput === 'scan') {
            this.setState({
                ...this.state,
                scanOrInput: 'input',
                sn: '',
            });
        }
    };

    // 扫描成功
    _onScanSuccess = (e) => {
        if (!this.state.scanning) {
            this._onScanningStatusChanged(true);

            try {
                // 如果手电筒打开，关闭手电筒
                this._switchTorch(true);
                Vibration.vibrate();

                let sn = e.data;

                // verify the serial number.
                if (/*validSerialNumber(sn)*/true) {
                    this._startCharging(sn);
                } else {
                    prompt('编号不正确！');
                }
            } catch (e) {
                error('An error occurred', e.message);
            }

            this._scanTimer = setTimeout(()=>{
                this._onScanningStatusChanged(false);
                this._scanTimer && clearTimeout(this._scanTimer);
            }, ScanInterval);
        }
    };

    _onScanningStatusChanged = (status)=>{
        this.setState({
            ...this.state,
            scanning: status,
        });
    };

    // 打开/关闭闪光灯
    _onLightPress = () => {
        this._switchTorch();
    };

    /*
     * switch torch.
     * close: 关闭手电筒，不打开
     */
    _switchTorch = (close) => {
        if (this.state.torchMode === Camera.constants.TorchMode.on) {
            this.setState({
                ...this.state,
                torchMode: Camera.constants.TorchMode.off
            })
        }
        else {
            if (!close) {
                this.setState({
                    ...this.state,
                    torchMode: Camera.constants.TorchMode.on
                })
            }
        }

        return this.state.torchMode.toString();
    };

    // 完成输入序列号，并确认
    _onInputFinishedPress = () => {
        // 如果键盘打开，隐藏键盘
        Keyboard.dismiss();

        let sn = this.state.sn;
        this._startCharging(sn);
    };

    _startCharging = (sn)=> {
        startCharging(sn)
            .then(ret => {
                if (ret.result === true) {
                    ToastAndroidBS('开始充电');
                    AppContext.startCharging();

                    const resetAction = NavigationActions.reset({
                        index: 1,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Home'}),
                            NavigationActions.navigate({ routeName: 'WaitingCharging'})
                        ]
                    });
                    const nav = this.props.navigation;
                    nav && nav.dispatch(resetAction);
                } else {
                    ToastAndroidBS(ret.message);
                }
            })
            .catch(err => {
                console.log(err);
                ToastAndroidBS(err.message);
            });
    };

    render() {
        const scanView = (
            <View style={styles.container}>
                <Camera ref={self = () => this._scanner = self}
                        torchMode={this.state.torchMode}
                        style={[styles.camera, this.props.cameraStyle]}
                        onBarCodeRead={this._onScanSuccess.bind(this)}
                        aspect={Camera.constants.Aspect.fill} >
                    <View style={styles.rectangleContainer}>
                        <View style={styles.fillArea}>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>
                                    将二维码放入扫描框内，即可自动扫描！
                                </Text>
                            </View>
                        </View>
                        <View style={styles.middleContainer}>
                            <View style={styles.fillArea}/>
                            <View style={[styles.rectangle, {flexDirection: 'column'}]}>
                                <Animated.View pointerEvents="box-none"
                                      style={[styles.scanStrip, {transform: [{translateY: this._animatedValue}]}]} >
                                    <DividerLine style={styles.strip}/>
                                </Animated.View>

                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 1}}>
                                        <DividerLine style={styles.horizontalDivider}/>
                                        <DividerLine style={styles.verticalDivider}/>
                                    </View>

                                    <View style={{flex: 1}}>
                                        <DividerLine style={[styles.horizontalDivider, {alignSelf: 'flex-end'}]}/>
                                        <DividerLine style={[styles.verticalDivider, {alignSelf: 'flex-end'}]}/>
                                    </View>
                                </View>

                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                                    <View style={{flex: 1}}>
                                        <DividerLine style={styles.verticalDivider}/>
                                        <DividerLine style={styles.horizontalDivider}/>
                                    </View>

                                    <View style={{flex: 1}}>
                                        <DividerLine style={[styles.verticalDivider, {alignSelf: 'flex-end'}]}/>
                                        <DividerLine style={[styles.horizontalDivider, {alignSelf: 'flex-end'}]}/>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.fillArea}/>
                        </View>
                        <View style={[styles.fillArea, styles.scanContainer, styles.lowerContainer]}>
                            <View style={styles.leftContainer}>
                                <TouchableOpacity onPress={this._onInputSerialNumberButtonPress}
                                                  activeOpacity={0.9} >
                                    <Ionicons name="md-hand"
                                          size={28}
                                          color={colors.white}
                                          style={styles.icon} />
                                    <Text style={styles.buttonTitle}>
                                        输入编号
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.rightContainer}>
                                <TouchableOpacity onPress={this._onLightPress}
                                                  activeOpacity={0.9}>
                                    <Icon name="highlight"
                                          size={28}
                                          color={this.state.torchMode === Camera.constants.TorchMode.off ? colors.white : colors.yellow}
                                          style={styles.icon} />
                                    <Text style={styles.buttonTitle}>
                                        {this.state.torchMode ===  Camera.constants.TorchMode.off ? '打开手电筒' : '关闭手电筒'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Camera>
            </View>
        );

        const inputView = (
            <View style={styles.container}>
                <View style={[styles.textContainer, {marginTop: 30}]}>
                    <Text style={styles.text}>
                        请输入充电桩编号，然后点击确认按钮！
                    </Text>
                </View>
                <View style={styles.upperContainer}>
                    <View style={styles.inputContainer}>
                        <View style={styles.textInputContainer}>
                            <TextInput underlineColorAndroid='transparent'
                                       placeholder='请输入充电桩编号'
                                       placeholderTextColor={GPlaceholderTextColor}
                                       style={[styles.textInput, TextInputStyles.textInput]}
                                       keyboardType='numeric'
                                       autoFocus={true}
                                       value={this.state.sn}
                                       onChangeText={(text)=>{
                                           this.setState({
                                               ...this.state,
                                               sn: text,
                                           });
                                       }}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <View style={styles.leftButtonContainer}>
                                <Button title="扫码充电"
                                        buttonStyle={styles.button}
                                        onPress={this._onScanButtonPress} />
                            </View>
                            <View style={styles.rightButtonContainer}>
                                <Button title="确定"
                                        buttonStyle={styles.button}
                                        onPress={this._onInputFinishedPress}
                                        disabled={this.state.sn.length < SNCount}
                                        disabledStyle={{backgroundColor: colors.grey3}} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );

        return (
            <View style={styles.container}>
                {this.state.scanOrInput === 'scan' ? scanView : inputView}
            </View>
        );
    }
}

export default CPAScanPage;