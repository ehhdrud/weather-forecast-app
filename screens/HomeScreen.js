import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';

export default function HomeScreen() {
    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([1, 2, 3]);

    const handleLocation = (loc) => {
        console.log('location: ', loc);
    };

    return (
        <HomeScreenContainer>
            <StatusBar style="light" />
            <BackgroundImage blurRadius={70} source={require('../assets/bg.png')} />
            <SafeAreaViewArea>
                {/* search section */}
                <SearchSection>
                    <SearchView
                        style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}
                    >
                        {showSearch ? (
                            <SearchBar
                                placeholder="Search city"
                                placeholderTextColor={'lightgray'}
                            />
                        ) : null}
                        <SearchIconTouchableOpacity
                            onPress={() => setShowSearch(!showSearch)}
                            style={{ backgroundColor: theme.bgWhite(0.3) }}
                        >
                            <MagnifyingGlassIcon size="25" color="white" />
                        </SearchIconTouchableOpacity>
                    </SearchView>
                    {locations.length > 0 && showSearch ? (
                        <SearchPreviews>
                            {locations.map((loc, index) => {
                                let showBorder = index + 1 != locations.length;
                                return (
                                    <SearchPreviewTouchableOpacity
                                        onPress={() => handleLocation(loc)}
                                        key={index}
                                        style={
                                            showBorder
                                                ? styles.previewItemBorderOn
                                                : styles.previewItemBorderOff
                                        }
                                    >
                                        <MapPinIcon size="20" color="gray" />
                                        <SearchPreviewText>
                                            London, United Kingdom
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
                        London,&nbsp;
                        <Country>United Kingdom</Country>
                    </City>
                    {/* image area */}
                    <WeatherImageView>
                        <WeatherImage source={require('../assets/images/partlycloudy.png')} />
                    </WeatherImageView>
                    {/* detail area */}
                    <DetailView>
                        <Degree>23&#176;</Degree>
                        <Summary>Partly Cloudy</Summary>
                    </DetailView>
                    {/* other stats area */}
                    <OtherStatsView>
                        <OtherStatView>
                            <OtherStatImage source={require('../assets/icons/wind.png')} />
                            <OtherStatText>22km</OtherStatText>
                        </OtherStatView>
                        <OtherStatView>
                            <OtherStatImage source={require('../assets/icons/drop.png')} />
                            <OtherStatText>23%</OtherStatText>
                        </OtherStatView>
                        <OtherStatView>
                            <OtherStatImage source={require('../assets/icons/sun.png')} />
                            <OtherStatText>6:05 AM</OtherStatText>
                        </OtherStatView>
                    </OtherStatsView>
                </ForecastSection>
            </SafeAreaViewArea>
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
    font-size: 16px;
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
    font-size: 16px;
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
