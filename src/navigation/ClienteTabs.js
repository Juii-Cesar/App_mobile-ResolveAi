import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
  Dimensions,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TelaInicio from "../screens/TelaInicio";
import TelaServicos from "../screens/TelaServicos";
import { ContaStack } from "./ContaStack";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_COUNT = 3;
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;

function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  const translateX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * TAB_WIDTH,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  }, [state.index]);

  const tabs = [
    {
      name: "Início",
      icon: "home-outline",
      iconActive: "home",
    },
    {
      name: "Serviços",
      icon: "document-text-outline",
      iconActive: "document-text",
    },
    {
      name: "Conta",
      icon: "person-outline",
      iconActive: "person",
    },
  ];

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: insets.bottom,
          height: 56 + insets.bottom,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.tabIndicator,
          {
            width: TAB_WIDTH,
            transform: [{ translateX }],
          },
        ]}
      />

      <View style={styles.tabButtonsRow}>
        {state.routes.map((route, index) => {
          const tab = tabs[index];

          if (!tab) return null;

          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(route.name)}
            >
              <Ionicons
                name={isFocused ? tab.iconActive : tab.icon}
                size={22}
                color={isFocused ? "#1565C0" : "#555"}
              />

              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export function ClienteTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Início" component={TelaInicio} />

      <Tab.Screen name="Serviços" component={TelaServicos} />

      <Tab.Screen name="Conta" component={ContaStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#D9D9D9",
    borderTopWidth: 1,
    borderTopColor: "#AAA",
    height: 86,
  },

  tabButtonsRow: {
    flexDirection: "row",
    flex: 1,
    paddingBottom: 12,
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
  },

  tabLabel: {
    fontSize: 11,
    color: "#444",
    marginTop: 2,
  },

  tabLabelActive: {
    color: "#1565C0",
  },

  tabIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: "#1565C0",
    borderRadius: 10,
  },
});