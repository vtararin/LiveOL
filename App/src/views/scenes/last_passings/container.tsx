import React from 'react';
import _ from 'lodash';
import { Passing } from 'lib/graphql/fragments/types/Passing';
import { OLPassings as Component } from './component';
import { OLError } from 'views/components/error';
import { useDeviceRotationStore } from 'store/deviceRotation';
import { RootStack } from 'lib/nav/router';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useGetLastPassingsQuery } from 'lib/graphql/generated/gql';

export const OLPassings: React.FC = () => {
  const { isLandscape } = useDeviceRotationStore();

  const {
    params: { competitionId },
  } = useRoute<RouteProp<RootStack, 'Passings'>>();

  const { data, loading, error, refetch } = useGetLastPassingsQuery({
    variables: { competitionId },
  });

  if (error) {
    return <OLError error={error} refetch={refetch} />;
  }

  const passings: Passing[] = _.get(data, 'lastPassings.getLastPassings', null);

  return (
    <Component
      loading={loading}
      passings={passings}
      refresh={async () => {
        await refetch({ competitionId });
      }}
      landscape={isLandscape}
    />
  );
};
