import React from 'react'
import BackArrowIcon from '../assets/images/back_arrow_icon_3.png';
import { View,StyleSheet,Image,TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackArrowButton = ({ReturnPage}) => {
    const navigation = useNavigation();
    return (
        <View >
            <TouchableOpacity onPress={() => navigation.navigate(ReturnPage)}>
                <Image
                    source={BackArrowIcon}
                    style={styles.BackIcon}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>  
    )
}
const styles = StyleSheet.create({
    BackIcon: {
        width: 45,
        height: 45,
        marginHorizontal:20,
        marginTop:20
        
    },
})

export default BackArrowButton