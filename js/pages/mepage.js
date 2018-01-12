'use strict';

import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import {Avatar, Icon, List, ListItem} from 'react-native-elements';
import colors from "../common/colors";
import {ActiveOpacity, ScreenKey} from "../common/constants";
import {IconType} from "../common/icons";

class CPAMePage extends Component{
    _navigateTo = (screenKey) => {
        const {navigate} = this.props.navigation;
        navigate && navigate(screenKey);
    };

    render() {
        const list = [
            {
                title: '钱包',
                icon: {name:'wallet', type: IconType.SimpleLineIcon, color: 'brown'},
                screenKey: ScreenKey.Wallet,
            },
            /*{
                title: '发票',
                icon: {name: 'md-checkmark', type: IconType.Ionicon, color: colors.yellow},
                screenKey: ScreenKey.InvoiceInfo,
            },*/
            {
                title: '我的账单',
                icon: {name: 'md-reorder', type: IconType.Ionicon, color: colors.lightblue},
                screenKey: ScreenKey.BillingRecords,
            },
            {
                title: '我的收藏',
                icon: {name:'md-heart', type: IconType.Ionicon, color: colors.red},
                screenKey: ScreenKey.Collect,
            },
            {
                title: '我的预约',
                icon: {name:'pin', type: IconType.SimpleLineIcon, color: colors.tintColor2},
                screenKey: ScreenKey.MySubscribe,
            },
            {
                title: '检测报告',
                icon: {name:'md-paper', type: IconType.Ionicon, color: colors.greenyellow},
                screenKey: ScreenKey.TestingReport,
            },
        ];

        const settings = [
            {
                title: '设置',
                icon: {name:'settings', type: IconType.SimpleLineIcon, color: colors.primary1},
                screenKey: ScreenKey.Setting,
            }
        ];

        return (
            <ScrollView style={styles.container}>
                <View style={styles.titleContainer}>
                    <Avatar width={60}
                            height={60}
                            rounded
                            activeOpacity={ActiveOpacity}
                            icon={{name: 'user-o', type: IconType.FAIcon, color: colors.yellow, size: 45}} />

                    <View style={styles.personalInfoContainer}>
                        <TouchableOpacity style={styles.textContainer}
                                          activeOpacity={ActiveOpacity}
                                          onPress={()=>this._navigateTo(ScreenKey.PersonalInfo)}>
                            <Text style={styles.text}>
                                登录 / 注册
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.bellContainer}
                                          activeOpacity={ActiveOpacity}
                                          onPress={()=>this._navigateTo(ScreenKey.MyMessage)}>
                            <Icon type={IconType.SimpleLineIcon} name="bell" color={colors.tintColor2} size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                <List style={styles.list}>
                    {
                        list.map((item, index) => (
                            <ListItem key={index}
                                      title={item.title}
                                      leftIcon={item.icon}
                                      containerStyle={styles.itemContainer}
                                      underlayColor='#F3F3F3'
                                      onPress={() => {this._navigateTo(item.screenKey)}}
                            />
                        ))
                    }
                </List>

                <List style={styles.settings}>
                    {
                        settings.map((item, index) => (
                            <ListItem key={index}
                                      title={item.title}
                                      leftIcon={item.icon}
                                      containerStyle={styles.itemContainer}
                                      underlayColor='#F3F3F3'
                                      onPress={() => {this._navigateTo(item.screenKey)}}
                            />
                        ))
                    }
                </List>
            </ScrollView>
        );
    }
}

export default CPAMePage;


CPAMePage.propTypes = {

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list:{
        paddingTop:0,
        marginTop:5,
    },
    itemContainer: {
        backgroundColor: colors.white,
    },
    titleContainer: {
        flexDirection: 'row',
        height: 80,
        backgroundColor: colors.theme1,
        alignItems: 'center',
        paddingLeft: 10,
    },
    personalInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 20,
    },
    textContainer: {
        flex: 1,
    },
    text: {
        fontSize: 16,
        color: colors.white,
    },
    bellContainer: {
        alignItems: 'flex-end',
        paddingRight: 20,
    },
    settings:{
        borderTopWidth: 0.5,
        borderTopColor: '#BBBBBB',
        marginTop: 15,
    },
});