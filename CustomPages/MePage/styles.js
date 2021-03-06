import {StyleSheet} from 'react-native';
import colors from '../../Common/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    infoContainer:{
        height: 200,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    backgroundImage:{
        flex: 1,
        height: undefined,
        width: undefined,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list:{
        paddingTop:0,
        marginTop: 1,
    },
    item: {
        backgroundColor: colors.white,
    },
    settings:{
        justifyContent: 'flex-start',
        marginBottom: 10,
        borderTopWidth: 0.5,
        borderTopColor: '#BBBBBB',
        marginTop: 30,
    },
    text: {
        fontSize: 18,
        backgroundColor: 'transparent',
        color: '#FFFFFF',
    },
    login: {
        color: colors.white,
        //fontStyle: "italic",
        fontSize: 16,
    },
    register:{
        color: '#397af8',
    }
});

export default styles;