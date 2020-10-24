/**
 * @format
 * @flow
 */
import React from 'react';
import { Text, TextInput, Platform } from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import { hasUserSetPinCode } from '@haskkor/react-native-pincode';
import * as Config from "./config/environment";
import {languageNames, setI18nConfig} from "./locales/i18n";
import {Router} from "./Router";
import {AsyncCache} from "./utils/storage/AsyncCache";

const ONBOARDED_KEY = 'onboarding.finished';
// TODO: Find if user is already registered or not.
const loadAppData = async () => {
    return AsyncCache.get(ONBOARDED_KEY);
};

// Handle passcode after 30 secs of inactivity
let appState: string = '';
let appStateTime: number = Date.now();

const isSessionExpired = (lastKnownTime: number) => {
    return Date.now() > lastKnownTime + Number(Config.getSessionTimeoutInMillis());
};

export const handleAppStateChange = async (nextAppState: any) => {
    if (appState.match(/inactive|background/)) {
        appStateTime = Date.now();

        if (nextAppState !== 'active' || !isSessionExpired(appStateTime)) {
            return; // no-op
        }

        const isPin = await hasUserSetPinCode();
        if (isPin) {
            // TODO: PASSCODE
            // goToPasscode({ resetPasscode: false, onSuccessFunc: goToDashboard });
        }
    }

    appState = nextAppState;
};

export const startApp = async () => {
    setGlobalCustomFont();

    /* TODO: REGISTER CORRECT LANGUAGE
    const language = await SettingsHelper.getActiveLanguage();
    */
    setI18nConfig(languageNames.en);

    const data = await loadAppData();
    const isPin = await hasUserSetPinCode();

    SplashScreen.hide();

    if (data === 'true') {
        scheduleBackgroundJob();

        /* TODO: SELECT FIRST PAGE
        if (isPin) goToPasscode({ resetPasscode: false, onSuccessFunc: goToNetworkSelector });
        else goToNetworkSelector({});
        */
    } else {
        /* TODO: SELECT FIRST PAGE
        goToOnBoarding({
            // goToDashboard: () => goToOptinWelcomeAsRoot(),
            goToDashboard: () => goToNetworkSelector({}),
            goToPasscode: (props: Object) => goToPasscode(props),
        });
         */
    }
    Router.goToTermsAndPrivacy({});
};

const scheduleBackgroundJob = () => {
    /* TODO: SCHEDULE BACKGROUND JOB
    return WalletRepository.getWalletNotification().subscribe(
        notificationSyncInterval => {
            const syncInterval = Config.getSyncIntervalValue(notificationSyncInterval);

            BackgroundFetch.scheduleBackgroundTask(syncInterval);
        },
        error => {
            console.log('Error scheduling background task => ', error);
        }
    );
     */
};

// One Plus Fix for Oxygen OS and its painful Slate font truncating on bold text
// https://github.com/facebook/react-native/issues/15114
export const setGlobalCustomFont = () => {
    const oldRender = Text.render;
    Text.render = (...args) => {
        const origin = oldRender.call(this, ...args);
        return React.cloneElement(origin, {
            style: [{ fontFamily: 'NotoSans-Regular' }, origin.props.style],
        });
    };

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.maxFontSizeMultiplier = 1.3;

    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.maxFontSizeMultiplier = 1.3;
};