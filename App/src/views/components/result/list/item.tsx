import React from 'react';
import { px } from 'util/const';
import { OLResultAnimation } from 'views/components/result/item/animation';
import { OLResultBadge } from 'views/components/result/item/badge';
import { OLResultClub } from 'views/components/result/item/club';
import { OLResultColumn } from 'views/components/result/item/column';
import { OLResultName } from 'views/components/result/item/name';
import { OLResultTime } from 'views/components/result/item/time';
import { OLResultTimeplus } from 'views/components/result/item/timeplus';
import { OLStartTime } from 'views/components/result/item/start';
import { View } from 'react-native';
import { OLResultListItem } from '../item/listItem';
import { OLResultLiveRunning } from '../item/liveRunning';
import { isLiveRunning, startIsAfterNow } from 'util/isLive';
import { OLClassName } from '../item/className';
import { OlResult } from 'lib/graphql/generated/types';

interface OwnProps {
  result: OlResult;
  disabled?: boolean;
  club?: boolean;
}

type Props = OwnProps;

export const PORTRAIT_SIZE = {
  place: 15,
  name: 50,
  start: 0,
  time: 35,
};

export class OLResultItem extends React.PureComponent<Props> {
  renderTime = () => {
    const { result, disabled } = this.props;

    if (disabled) {
      return null;
    }

    if (!result.result.length) {
      if (isLiveRunning(result)) {
        return <OLResultLiveRunning date={result.liveRunningStart} />;
      }

      if (!startIsAfterNow(result)) {
        return <OLStartTime time={result.start} />;
      }
    }

    return (
      <>
        <OLResultTime status={result.status} time={result.result} />

        <View style={{ height: px(4) }} />

        <OLResultTimeplus status={result.status} timeplus={result.timeplus} />
      </>
    );
  };

  render() {
    const { result, club } = this.props;

    return (
      <OLResultAnimation result={result}>
        <OLResultListItem>
          <OLResultColumn size={PORTRAIT_SIZE.place} align="center">
            <OLResultBadge place={result.place} />
          </OLResultColumn>

          <OLResultColumn size={PORTRAIT_SIZE.name}>
            <OLResultName name={result.name} />

            {!club && <OLResultClub club={result.club} />}
            {club && <OLClassName className={result.class} />}
          </OLResultColumn>

          <OLResultColumn align="flex-end" size={PORTRAIT_SIZE.time}>
            {this.renderTime()}
          </OLResultColumn>
        </OLResultListItem>
      </OLResultAnimation>
    );
  }
}
