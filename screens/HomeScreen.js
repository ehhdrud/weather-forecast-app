import { useState, useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';
import { weatherImages } from '../constants';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { MapPinIcon, CalendarDaysIcon } from 'react-native-heroicons/solid';
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import { CircleSnail } from 'react-native-progress';
import { storeData, getData } from '../utils/asyncStorage';

export default function HomeScreen() {
    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true);

    const handleLocation = (loc) => {
        // console.log('location: ', loc);
        setLocations([]);
        setShowSearch(false);
        setLoading(true);
        fetchWeatherForecast({
            cityName: loc.name,
            days: '7',
        }).then((data) => {
            // console.log('weather info: ', data);
            setWeather(data);
            setLoading(false);
            storeData('city', loc.name);
        });
    };

    const handleSearch = (value) => {
        // console.log('value: ', value);
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then((data) => {
                // console.log('got location: ', data);
                setLocations(data);
            });
        }
    };

    const handleTextDebounce = useCallback(debounce(handleSearch, 500), []);

    const { current, location } = weather;

    useEffect(() => {
        fetchMyWeatherData();
    }, []);

    const fetchMyWeatherData = async () => {
        let myCity = await getData('city');
        let cityName = 'Seoul';
        if (myCity) {
            cityName = myCity;
        }

        fetchWeatherForecast({
            cityName,
            days: '7',
        }).then((data) => {
            setWeather(data);
            setLoading(false);
        });
    };

    return (
        <HomeScreenContainer>
            <StatusBar style="light" />
            <BackgroundImage blurRadius={70} source={require('../assets/bg.png')} />

            {loading ? (
                <LoadingView>
                    <CircleSnail thickness={15} size={90} color="#0bb3b2" />
                </LoadingView>
            ) : (
                <SafeAreaViewArea>
                    {/* search section */}
                    <SearchSection>
                        <SearchView
                            style={{
                                backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent',
                            }}
                        >
                            {showSearch ? (
                                <SearchBar
                                    onChangeText={handleTextDebounce}
                                    placeholder="Search city"
                                    placeholderTextColor={'lightgray'}
                                />
                            ) : null}
                            <SearchIconTouchableOpacity
                                onPress={() => setShowSearch(!showSearch)}
                                style={{ backgroundColor: theme.bgWhite(0.3) }}
                            >
                                {showSearch ? (
                                    <XMarkIcon size="25" color="white" />
                                ) : (
                                    <MagnifyingGlassIcon size="25" color="white" />
                                )}
                            </SearchIconTouchableOpacity>
                        </SearchView>
                        {locations.length > 0 && showSearch ? (
                            <SearchPreviews>
                                {locations.map((loc, index) => {
                                    let showBorder = index + 1 != locations.length;
                                    return (
                                        <SearchPreviewTouchableOpacity
                                            onPress={() => handleLocation(loc)}
                                            key={`Preview${index}`}
                                            style={
                                                showBorder
                                                    ? styles.previewItemBorderOn
                                                    : styles.previewItemBorderOff
                                            }
                                        >
                                            <MapPinIcon size="20" color="gray" />
                                            <SearchPreviewText>
                                                {loc?.name}, {loc?.country}
                                            </SearchPreviewText>
                                        </SearchPreviewTouchableOpacity>
                                    );
                                })}
                            </SearchPreviews>
                        ) : null}
                    </SearchSection>

                    {/* forecast section */}
                    <ForecastSection>
                        {/* location area */}
                        <City>
                            {location?.name},&nbsp;
                            <Country>{location?.country}</Country>
                        </City>
                        {/* image area */}
                        <WeatherImageView>
                            <WeatherImage source={weatherImages[current?.condition?.text]} />
                        </WeatherImageView>
                        {/* detail area */}
                        <DetailView>
                            <Degree>{current?.temp_c}&#176;</Degree>
                            <Summary>{current?.condition?.text}</Summary>
                        </DetailView>
                        {/* other stats area */}
                        <OtherStatsView>
                            <OtherStatView>
                                <OtherStatImage source={require('../assets/icons/wind.png')} />
                                <OtherStatText>{current?.wind_kph}km</OtherStatText>
                            </OtherStatView>
                            <OtherStatView>
                                <OtherStatImage source={require('../assets/icons/drop.png')} />
                                <OtherStatText>{current?.humidity}%</OtherStatText>
                            </OtherStatView>
                            <OtherStatView>
                                <OtherStatImage source={require('../assets/icons/sun.png')} />
                                <OtherStatText>
                                    {weather.forecast?.forecastday[0]?.astro?.sunrise}
                                </OtherStatText>
                            </OtherStatView>
                        </OtherStatsView>
                    </ForecastSection>

                    {/* forecast for next days */}
                    <NextDaysSection>
                        <DailyForecastView>
                            <CalendarDaysIcon size="22" color="white" />
                            <DailyForecastText>Daily forecast</DailyForecastText>
                        </DailyForecastView>
                        <NextDaysScrollView
                            horizontal
                            contentContainerStyle={{ paddingHorizontal: 15 }}
                            showsHorizontalScrollIndicator={false}
                        >
                            {weather?.forecast?.forecastday?.map((item, index) => {
                                let date = new Date(item.date);
                                let dayName = (dayName = date.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                }));
                                dayName = dayName.split(',')[0];

                                return (
                                    <NextDaysView
                                        key={`NextDay${index}`}
                                        style={{ backgroundColor: theme.bgWhite(0.15) }}
                                    >
                                        <NextWeatherImage
                                            source={
                                                weatherImages[item?.day?.condition?.text || 'other']
                                            }
                                        />
                                        <NextDay>{dayName}</NextDay>
                                        <NextDegree>{item?.day?.avgtemp_c}&#176;</NextDegree>
                                    </NextDaysView>
                                );
                            })}
                        </NextDaysScrollView>
                    </NextDaysSection>
                </SafeAreaViewArea>
            )}
        </HomeScreenContainer>
    );
}

const HomeScreenContainer = styled.View`
    flex: 1;
    position: relative;
`;

const BackgroundImage = styled.Image`
    position: absolute;
    width: 100%;
    height: 100%;
`;

const LoadingView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const SafeAreaViewArea = styled.SafeAreaView`
    display: flex;
    flex: 1;
`;

const SearchSection = styled.View`
    position: relative;
    height: 7%;
    margin: 0 16px;
    z-index: 100;
`;

const SearchView = styled.View`
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    border-radius: 50%;
`;

const SearchBar = styled.TextInput`
    padding-left: 24px;
    height: 40px;
    flex: 1;
    font-size: 16px;
    color: white;
`;

const SearchIconTouchableOpacity = styled.TouchableOpacity`
    border-radius: 50%;
    padding: 12px;
    margin: 4px;
`;

const SearchPreviews = styled.View`
    position: absolute;
    top: 64px;
    border-radius: 20px;
    width: 100%;
    background-color: #d1d5db;
`;

const SearchPreviewTouchableOpacity = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    border: none;
    padding: 16px 12px;
    margin-bottom: 4px;
`;

const SearchPreviewText = styled.Text`
    color: black;
    font-size: 18px;
    margin-left: 8px;
`;

const ForecastSection = styled.View`
    display: flex;
    justify-content: space-around;
    flex: 1;
    margin: 0 16px 8px 16px;
`;

const City = styled.Text`
    color: white;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
`;

const Country = styled.Text`
    font-size: 18px;
    font-weight: 700;
    color: #d1d5db;
`;

const WeatherImageView = styled.View`
    flex-direction: row;
    justify-content: center;
`;

const WeatherImage = styled.Image`
    width: 208px;
    height: 208px;
`;

const DetailView = styled.View`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Degree = styled.Text`
    margin-top: 8px;
    text-align: center;
    font-weight: bold;
    color: white;
    font-size: 64px;
    margin-left: 20px;
`;

const Summary = styled.Text`
    margin-bottom: 8px;
    text-align: center;
    font-weight: 500;
    color: white;
    font-size: 20px;
    letter-spacing: 1px;
`;

const OtherStatsView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin: 0 16px;
`;

const OtherStatView = styled.View`
    flex-direction: row;
    gap: 8px;
    align-items: center;
`;

const OtherStatImage = styled.Image`
    margin-left: 8px;
    width: 24px;
    height: 24px;
`;

const OtherStatText = styled.Text`
    margin-right: 8px;
    color: white;
    font-size: 16px;
    font-weight: 600;
`;

const NextDaysSection = styled.View`
    margin: 12px 0 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const DailyForecastView = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 8px;
    margin: 0 28px;
`;

const DailyForecastText = styled.Text`
    color: white;
    font-size: 16px;
`;

const NextDaysScrollView = styled.ScrollView``;

const NextDaysView = styled.View`
    justify-content: center;
    align-items: center;
    width: 96px;
    border-radius: 24px;
    padding: 12px 0;
    margin: 4px 16px 4px 0px;
`;

const NextWeatherImage = styled.Image`
    width: 44px;
    height: 44px;
`;

const NextDay = styled.Text`
    color: white;
`;

const NextDegree = styled.Text`
    color: white;
    font-size: 20px;
`;

const styles = StyleSheet.create({
    previewItemBorderOn: {
        borderBottomWidth: 2,
        borderColor: '#9CA3AF',
    },

    previewItemBorderOff: {
        borderBottomWidth: '',
        borderColor: '',
    },
});
