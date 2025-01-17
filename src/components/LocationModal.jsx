import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, FlatList, Text, StyleSheet, Animated, Image } from 'react-native';
import SearchNormalIcon from '../assets/images/search-normal.png';
import SearchPressedIcon from '../assets/images/search-pressed.png';

const LocationModal = ({ visible, onClose, onSelectLocation }) => {
    const [searchText, setSearchText] = useState('');

    const [allSuggestions, setAllSuggestions] = useState([
        'Colombo, Sri Lanka', 'Kandy, Sri Lanka', 'Homagama, Sri Lanka', 'Galle, Sri Lanka', 'Jaffna, Sri Lanka'
    ]);
    const [filteredSuggestions, setFilteredSuggestions] = useState(allSuggestions);
    const [activeSearch, setActiveSearch] = useState(false);
    const slideAnim = useState(new Animated.Value(0))[0];  // For sliding animation
    const overlayOpacity = useState(new Animated.Value(0))[0];  // For overlay opacity animation

    // Function to filter suggestions based on search query
    const filterSuggestions = (query) => {
        if (!query) {
            setFilteredSuggestions(allSuggestions);
        } else {
            const filtered = allSuggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
            setFilteredSuggestions(filtered);
        }
    };

    // Function to fetch suggestions based on query (You can integrate an API for real-time fetching if needed)
    const fetchSuggestions = async (query) => {
        filterSuggestions(query);
    };

    const handleSelectLocation = (location) => {
        onSelectLocation(location);
        onClose();
    };

    const handleOverlayPress = () => {
        // Animate both the overlay and the modal when the overlay is pressed
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 300,  // Slide the modal out
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0,  // Fade out the overlay
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();  // Close the modal after the animations complete
        });
    };

    // Animate modal slide and overlay opacity when the modal visibility changes
    useEffect(() => {
        if (visible) {
            // Modal slide and overlay opacity animation when showing
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Modal slide and overlay opacity animation when hiding
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 300,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose}>
            <Animated.View
                style={[styles.modalOverlay, { opacity: overlayOpacity }]}  // Animate overlay opacity
                onStartShouldSetResponder={handleOverlayPress}
            >
                <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.input, activeSearch ? styles.activeInput : styles.inactiveInput]}
                            placeholder="Search for location"
                            placeholderTextColor="#888"
                            value={searchText}
                            onChangeText={(text) => {
                                setSearchText(text);
                                fetchSuggestions(text);
                                setActiveSearch(true);
                            }}
                            onFocus={() => setActiveSearch(true)}
                        />
                        <Image
                            source={activeSearch ? SearchPressedIcon : SearchNormalIcon}
                            style={styles.searchIcon}
                        />
                    </View>

                    {/* Fixed height for the suggestion list */}
                    <FlatList
                        data={filteredSuggestions}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.suggestionContainer} onStartShouldSetResponder={() => handleSelectLocation(item)}>
                                <Text style={styles.suggestionText}>{item}</Text>
                            </View>
                        )}
                        style={styles.suggestionList}
                        maxToRenderPerBatch={10}
                    />
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        height: 350,  // Fixed height for modal
    },
    suggestionText: {
        fontSize: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    inputWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        paddingRight: 40, // Leave space for the icon
        fontSize: 16,
    },
    activeInput: {
        borderColor: '#00B894',
    },
    inactiveInput: {
        borderColor: '#ccc',
    },
    searchIcon: {
        position: 'absolute',
        right: 15, // Adjust for alignment
        top: '50%',
        transform: [{ translateY: -10 }], // Center vertically
        width: 16, // Smaller icon size
        height: 16,
    },
    suggestionList: {
        maxHeight: 250,  // Limit the height for the list of suggestions
    },
    suggestionContainer: {
        // No hover effect or color changes here
    }
});

export default LocationModal;


