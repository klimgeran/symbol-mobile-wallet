import React, { Component } from 'react';
import { View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import translate from '@src/locales/i18n';
import { Router } from '@src/Router';
import { logout } from '@src/App';

export default class SettingsLogout extends Component {
    onPress = () => {
        logout().then(_ => {
            Router.goToCreateOrImport({});
        });
    };

    render() {
        return (
            <View>
                <SettingsListItem
                    title={translate('Settings.logout')}
                    icon={require('../../assets/icons/ic-logout.png')}
                    onPress={this.onPress}
                />
            </View>
        );
    }
}
