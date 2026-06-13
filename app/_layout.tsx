import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {ThemeProvider as RNEUIThemeProvider} from '@rneui/themed';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, {useEffect} from 'react';
import 'react-native-reanimated';
import DatabaseProvider from '@/providers/DatabaseProvider';
import {useColorScheme} from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync().then();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync().then();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <DatabaseProvider>
            <RNEUIThemeProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    </Stack>
                </ThemeProvider>
            </RNEUIThemeProvider>
        </DatabaseProvider>
    );
}
