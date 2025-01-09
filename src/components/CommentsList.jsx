import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import profileImage from '../assets/images/user_image.png'; // Replace with your actual profile image

const CommentsList = ({ comments }) => {
    return (
        <View>
            {comments && comments.length > 0 ? (
                comments.map((comment, index) => (
                    <View key={index} style={styles.commentContainer}>
                        <Image
                            source={
                                comment.userId?.profilePhoto
                                    ? { uri: comment.userId.profilePhoto }
                                    : profileImage
                            }
                            style={styles.profileImage}
                        />
                        <View style={styles.commentContent}>
                            <Text style={styles.name}>{comment.userId?.fullName || 'Unknown User'}</Text>
                            <Text style={styles.commentText}>{comment.comment}</Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    noComments: {
        textAlign: 'center',
        color: '#999',
    },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-start',
        marginRight: '10'
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentContent: {
        flexDirection: 'column',
        marginRight: '10'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentText: {
        marginTop: 5,
        fontSize: 12,
        color: '#333',
    },
});

export default CommentsList;
