import { useFonts } from "expo-font";
import { StyleSheet, View, Text, ActivityIndicator, Image, Pressable } from "react-native";
import NotificationIcon from '../../Assets/images/BottomBar/notification_icon.png';
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

const GradientText = (props) => {
    return (
        <MaskedView maskElement={<Text {...props} />}>
            <LinearGradient
                colors={["#0182AC", "#0B1A33"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text {...props} style={[props.style, { opacity: 0 }]} />
            </LinearGradient>
        </MaskedView>
    );
};

const WelcomeHeader = ({ navigation }) => {

    return (
        <View style={styles.container}>

            <GradientText style={{ fontFamily: 'Rancho-Regular', fontSize: 40 }}>Welcome, <Text style={{ color: 'rgba(0,0,0,0.5)', fontSize: 18, fontFamily: 'Poppins' }}>Lucifer Saint</Text></GradientText>


            <Pressable onPress={() => { navigation.navigate('Notifications') }} style={{ width: 60, height: 70, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={NotificationIcon} resizeMode="contain" style={{ width: 30, height: 30 }} />
            </Pressable>


        </View>
    );
}

export default WelcomeHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    header: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontFamily: 'Rancho-Regular',
        fontSize: 40,
        color: 'white', // Solid color for the main text
    },
    userName: {
        color: 'rgba(0,0,0,0.5)', // Solid color for the username
        fontSize: 18,
        fontFamily: 'Poppins',
    },
})