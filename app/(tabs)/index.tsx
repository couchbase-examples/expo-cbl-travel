import {
    useContext,
    useRef,
    useState
}  from "react";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    SafeAreaView,
    StyleSheet
}  from 'react-native';
import {
    Button,
    ButtonGroup
} from "@rneui/base";
import {ThemedText} from '@/components/ThemedText';
import {ThemedSearchBar} from "@/components/searchBar/ThemedSearchBar";
import DatabaseContext from "@/providers/DatabaseContext";
import {useNavigation} from "@react-navigation/native";
import {getLandmarkBySearchTerm} from "@/hooks/getLandmarks";
import {ThemedView} from "@/components/ThemedView";
import useNavigationBarTitleResetOption from "@/hooks/useNavigationBarTitleResetOption";
import {NoLandmark} from "@/components/noLandmark/NoLandmark";

export default function LandmarkScreen() {
    const {databaseService} = useContext(DatabaseContext)!;
    const [searchName, setSearchName] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [filteredLandmarks, setFilteredLandmarks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const activities = ['buy','do','drink','eat','see'];
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    useNavigationBarTitleResetOption(
        'Landmarks',
        navigation,
        reset);

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    async function search() {
        setIsLoading(true);
        try {
            setErrorMessage('');
            const landmarks = await getLandmarkBySearchTerm(databaseService, searchName, searchLocation, activities[selectedIndex]);
            if (landmarks !== undefined && landmarks.length > 0) {
                setFilteredLandmarks(landmarks);
            } else {
                setFilteredLandmarks([]);
            }
        } catch (e){
            const errorMsg = e instanceof Error ? e.message : 'An unexpected error occurred';
            setErrorMessage(errorMsg);
        }
        finally {
            setIsLoading(false);
        }
    }

    async function reset() {
        setIsLoading(true);
        setFilteredLandmarks([]);
        setIsLoading(false);
        fadeIn();
    }

    // @ts-ignore
    const renderLandmarkCard = ({item}) => (
        <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>{item.landmark.name}</ThemedText>
            <ThemedText style={styles.cardSubtitle}>{item.landmark.title}</ThemedText>
            <ThemedText style={styles.description}>{item.landmark.content}</ThemedText>
            <ThemedText style={styles.address}>{item.landmark.address}</ThemedText>
            <ThemedText style={styles.address}>{item.landmark.city}</ThemedText>
            {item.landmark.state && <ThemedText style={styles.address}>{item.landmark.state}</ThemedText>}
            <ThemedText style={styles.address}>{item.landmark.country}</ThemedText>
        </ThemedView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ThemedSearchBar
                placeholder="Search Location Name"
                onChangeText={(text) =>
                    setSearchName(text)}
                value={searchName}>
            </ThemedSearchBar>
            <ThemedSearchBar
                placeholder="Search Address"
                onChangeText={(text) =>
                    setSearchLocation(text)}
                value={searchLocation}>
            </ThemedSearchBar>
            <ButtonGroup
                buttons={[...activities]}
                selectedIndex={selectedIndex}
                onPress={(value) => {
                    setSelectedIndex(value);
                }}
                containerStyle={{marginBottom: 20}}
            />
            <Button
                onPress={search}
                title={'Search'}
                containerStyle={{
                    marginHorizontal: 50,
                    marginBottom: 10,
                }}
            />
            {isLoading ? (
                <ThemedView style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </ThemedView>
            ) : (errorMessage.length > 0 ? (
                            <ThemedText>{errorMessage}</ThemedText>
                        ) : filteredLandmarks === undefined || filteredLandmarks.length === 0 ? (
                        <NoLandmark />
                    ) : (
                        <FlatList
                            data={filteredLandmarks}
                            renderItem={renderLandmarkCard}
                            keyExtractor={(item) => item.landmark.id.toString()}
                        />
                    )
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        marginBottom: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
    },
    address: {
        fontSize: 14,
        color: 'gray',
    },
    addressPadding: {
        paddingTop: 16,
    },
    component: {
        paddingLeft: 8,
        paddingRight: 12,
    },
    itemContainer: {
        flexDirection: 'row', // Align items in a row
        justifyContent: 'space-between', // Space between items
        alignItems: 'center', // Center items vertically
        padding: 10,
        borderBottomWidth: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    card: {
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 16,
        fontWeight: 'semibold',
        marginBottom: 16,
    },
});
