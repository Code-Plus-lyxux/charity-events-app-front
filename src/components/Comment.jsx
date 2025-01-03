import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Comment = ({ profileImage, name, commentText }) => {
  return (
    <View style={styles.commentContainer}>
      <Image source={profileImage} style={styles.profileImage} />
      <View style={styles.commentContent}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.commentText}>{commentText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
    marginRight:'10'
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flexDirection: 'column',
    marginRight:'10'
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

export default Comment;
