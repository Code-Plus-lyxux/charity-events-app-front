import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.button,
        isLoading && styles.disabled,
        containerStyles,
      ]}
      disabled={isLoading}
    >
      <Text style={[styles.text, textStyles]}>{title}</Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={styles.activityIndicator}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#00B894",
    borderRadius: 12,
    minHeight: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "white",
    fontFamily: "Poppins",
    fontSize: 20,
  },
  activityIndicator: {
    marginLeft: 8,
  },
});

export default CustomButton;
