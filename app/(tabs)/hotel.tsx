import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    Animated
} from 'react-native';
import {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {startLogging} from '@/hooks/startLogging';
import {getHotels, getHotelsBySearch} from '@/hooks/getHotels';
import useNavigationBarTitleResetOption from "@/hooks/useNavigationBarTitleResetOption";
import {useNavigation} from "@react-navigation/native";
import DatabaseContext from "@/providers/DatabaseContext";
import {NoHotel} from "@/components/noHotel/NoHotel";
import {ThemedSearchBar} from "@/components/searchBar/ThemedSearchBar";
import {debounce} from "@/util/debounce";

export default function HotelScreen() {
    const {databaseService} = useContext(DatabaseContext)!;
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useNavigationBarTitleResetOption(
        'Hotels',
        navigation,
        reload);

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        setIsLoading(true);
        const initialize = async () => {
            await startLogging();
            const hotelData = await getHotels(databaseService);
            setFilteredHotels(hotelData);
            setIsLoading(false);
            fadeIn();
        };
        initialize().then();
    }, []);

    async function reload() {
        setIsLoading(true);
        const hotelData = await getHotels(databaseService);
        setFilteredHotels(hotelData);
        setIsLoading(false);
        fadeIn();
    }

    async function searchHotels(search: string) {
        if (search.length > 2) {
            setIsLoading(true);
            const hotelData = await getHotelsBySearch(databaseService, search);
            setFilteredHotels(hotelData);
            setIsLoading(false)
            fadeIn();
        } else if (search.length === 0) {
            await reload();
        }
    }

    function onSearch(search: string) {
        setSearch(search);
        debouncedSearch(search);
    }

    const debouncedSearch = debounce(searchHotels, 500);

    // @ts-ignore
    const renderHotelCard = ({item}) => (
        <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>{item.hotel.name}</ThemedText>
            <ThemedText style={styles.description}>{item.hotel.description}</ThemedText>
            <ThemedText style={styles.address}>{item.hotel.address}</ThemedText>
            <ThemedText style={styles.address}>{item.hotel.city}</ThemedText>
            {item.hotel.state && <ThemedText style={styles.address}>{item.hotel.state}</ThemedText>}
            <ThemedText style={styles.address}>{item.hotel.country}</ThemedText>
        </ThemedView>
    );
    return (
        <SafeAreaView style={styles.container}>
            <ThemedSearchBar
                placeholder="Search Hotels"
                onChangeText={(text) =>
                    onSearch(text)}
                value={search}>
            </ThemedSearchBar>
            {isLoading ? (
                <ThemedView style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </ThemedView>
            ) : (
                <Animated.View style={{...styles.container, opacity: fadeAnim}}>
                    {filteredHotels === undefined || filteredHotels.length === 0 ? (
                        <NoHotel/>
                    ) : (
                        <FlatList
                            data={filteredHotels}
                            renderItem={renderHotelCard}
                            keyExtractor={(item) => item.hotel.id.toString()}
                        />
                    )}
                </Animated.View>
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
});