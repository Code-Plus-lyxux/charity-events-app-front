import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const EventFilters = ({ activeTab, onFilterChange }) => {
  return (
    <View style={styles.container}>
      {['Hosting', 'Upcoming Events', 'Past Events'].map((filter) => (
        <Pressable
          key={filter}
          style={[
            styles.tab,
            activeTab === filter && styles.activeTab,
          ]}
          onPress={() => onFilterChange(filter)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === filter && styles.activeTabText,
            ]}
          >
            {filter}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default EventFilters;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  tab: {
    width: 'auto',
    height: 30,
    borderRadius: 50,
    borderColor: '#00B894',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
  activeTab: {
    backgroundColor: '#00B894',
  },
  tabText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
