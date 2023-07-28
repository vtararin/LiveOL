import React from 'react';
import { VERSION } from 'util/const';
import { OLInfo as Component } from './component';
import { Alert, Linking } from 'react-native';
import { useDeviceRotationStore } from 'store/deviceRotation';
import { useTextStore } from 'store/text';
import { useGetServerVersionQuery } from 'lib/graphql/generated/gql';
import { useOLNavigation } from 'hooks/useNavigation';
import { useIap } from 'hooks/useIap';
import moment from 'moment';
import { usePlusCodes } from 'hooks/usePlusCodes';

const translationCredits: { code: string; name: string }[] = [
  {
    code: 'no',
    name: 'Pål Kittilsen',
  },
  {
    code: 'sr',
    name: 'Nikola Spaskovic',
  },
  {
    code: 'it',
    name: 'Paolo Gallerani',
  },
  {
    code: 'cs',
    name: 'Petr Havliček',
  },
  {
    code: 'de',
    name: 'Petr Havliček',
  },
  {
    code: 'es',
    name: 'Adrian Perez',
  },
];

export const OLInfo: React.FC = () => {
  const { plusActive, plusExpirationDate, plusWillRenew } = useIap();

  const { redeem } = usePlusCodes();

  const { navigate } = useOLNavigation();

  const { isLandscape } = useDeviceRotationStore();

  const { data } = useGetServerVersionQuery();

  const { setTextSizeMultiplier, textSizeMultiplier } = useTextStore();

  const [secretTaps, setSecretTaps] = React.useState(0);
  const contact = () =>
    Linking.openURL('https://liveol.larsendahl.se/#contact');
  const openPhraseApp = () => Linking.openURL('https://phrase.com/');
  const openZapSplat = () => Linking.openURL('https://www.zapsplat.com/');

  const increaseTextSize = () => {
    if (textSizeMultiplier > 1.25) {
      return;
    }
    setTextSizeMultiplier(textSizeMultiplier + 0.1);
  };
  const decreaseTextSize = () => {
    if (textSizeMultiplier < 0.75) {
      return;
    }
    setTextSizeMultiplier(textSizeMultiplier - 0.1);
  };

  const secretTap = async () => {
    setSecretTaps(secretTaps + 1);

    if (secretTaps > 5) {
      setSecretTaps(0);

      Alert.alert(
        'VERSION',
        `Package Version: ${VERSION}\n` +
          `Server Version: ${data?.server?.version}\n`,
      );
    }
  };

  const onGetLiveOlPlus = () => {
    navigate('Plus');
  };

  const onNewsletterPress = () =>
    Linking.openURL('https://liveol.larsendahl.se/newsletter');

  return (
    <Component
      contact={contact}
      landscape={isLandscape}
      translationCredits={translationCredits}
      openPhraseApp={openPhraseApp}
      openZapSplat={openZapSplat}
      secretTap={secretTap}
      decreaseFontSize={decreaseTextSize}
      increaseFontSize={increaseTextSize}
      textSizeMultiplier={textSizeMultiplier}
      onGetLiveOlPlus={onGetLiveOlPlus}
      showGetLiveOlPlus={!plusActive}
      plusExpirationDate={
        plusExpirationDate &&
        moment(plusExpirationDate).format(__DEV__ ? undefined : 'LL')
      }
      plusWillRenew={plusWillRenew}
      redeemPlusCode={redeem}
      onNewsletterPress={onNewsletterPress}
    />
  );
};
