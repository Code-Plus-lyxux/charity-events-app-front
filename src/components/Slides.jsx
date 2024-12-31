import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, StatusBar, Pressable, Dimensions, Animated } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import SlidesData from '../constants/SlidesData';
import SlideItem from './SlideItem';

const Slides = ({ navigation }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);

    useEffect(() => {
        console.log("Current Slide Index:", currentSlideIndex);
    }, [currentSlideIndex]);

    const Footer = () => {

        const handleNextSlide = () => {
            if (currentSlideIndex < 2) {
                const nextIndex = currentSlideIndex + 1;
                setCurrentSlideIndex(nextIndex);
                flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
            } else {
                navigation.navigate('Login'); 
            }
        };
    
        return (
            <View style={{ backgroundColor: 'white' }}>
                <View style={{ height: '5%', justifyContent: 'center', paddingHorizontal: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                        {SlidesData.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.indicator,
                                    { backgroundColor: index === currentSlideIndex ? '#00B894' : '#D9D9D9' }
                                ]}
                            />
                        ))}
                    </View>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, padding: 20 }}>
                    <Pressable onPress={handleNextSlide} style={styles.nextButton}>
                        <Text style={styles.buttonText}>Next</Text>
                    </Pressable>
                </View>
            </View>
        );
    };
    

    const Header = () => {
        return (
            <View style={{ width: '100%', height: '10%', justifyContent: "center", alignItems: "flex-end", padding: 20, backgroundColor: 'white' }}>
                {currentSlideIndex < SlidesData.length - 1 && (
                    <Pressable onPress={() => { navigation.navigate('Home') }} style={styles.skipButton}>
                        <Text style={styles.skipText}>Skip</Text>
                    </Pressable>
                )}
            </View>
        );
    };
    

    

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentSlideIndex(viewableItems[0].index);
        }
    }).current;


    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
               <Header />
                <FlatList
                    data={SlidesData}
                    ref={flatListRef}
                    renderItem={({ item }) => <SlideItem item={item} />}
                    keyExtractor={item => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                />
                <Footer />
               
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    indicator: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 3,
    },
    nextButton: {
        backgroundColor: '#CDFEEC',
        borderRadius: 50,
        paddingVertical: 12,
        paddingHorizontal: 25,
    },
    buttonText: {
        color: '#00B894',
        fontSize: 18,
    },
    skipButton: {
        borderRadius: 50,
        borderColor: '#F3F3F3',
        borderWidth: 3,
        minHeight: 50,
        paddingVertical: 10,
        paddingHorizontal: 25,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipText: {
        fontFamily: 'Poppins',
        fontSize: 18,
        color: 'rgba(0,0,0,0.8)',
    }
});

export default Slides;
