import React, {Component} from 'react';
import {View, Image, ScrollView} from 'react-native';

import styles from './styles';

class CPAMapPage extends Component{

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.container}>
                    <Image style={[styles.content, {resizeMode:'contain', width:undefined}]}
                           source={require('../../../Resources/Images/map.bmp')}
                    />
                </View>
            </ScrollView>
        );
    }
}

export default CPAMapPage;