import * as React from 'react';
import { Lang } from 'lib/lang';
import { OLRefetcher } from 'views/components/refetcher';
import { Result } from 'lib/graphql/fragments/types/Result';
import { OLResultsTable } from 'views/components/result/table';
import { OLResultsList } from 'views/components/result/list';
import * as ScreenOrientation from 'expo-screen-orientation';
import { LayoutAnimation } from 'react-native';
import _ from 'lodash';

interface Props {
    refetch: () => Promise<void>;
    results: Result[];
    landscape: boolean;

    competitionId: number;
    className: string;
}

interface State {
    landscape: boolean;

    showTable: boolean;
    showList: boolean;
}

export class OLResults extends React.PureComponent<Props, State> {
    state: State = {
        landscape: this.props.landscape,

        showList: !this.props.landscape,
        showTable: this.props.landscape,
    };

    showComponent = (c: 'table' | 'list') => {
        const a = c === 'table' ? 'showList' : 'showTable';
        const b = c === 'table' ? 'showTable' : 'showList';

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        this.setState(
            { [a]: false } as any,
            () => {
                _.defer(() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    this.setState({ [b]: true } as any);
                });
            },
        );
    }

    componentDidUpdate() {
        if (this.props.landscape !== this.state.landscape) {
            this.setState(
                { landscape: this.props.landscape },
                () => {
                    if (this.props.landscape) {
                        this.showComponent('table');
                    } else {
                        this.showComponent('list');
                    }
                },
            );
        }
    }

    render() {
        const {
            className,
            competitionId,
            results,
            refetch,
        } = this.props;

        return (
            <>
                {
                    // LANDSCAPE
                    this.state.showTable &&
                    <OLResultsTable
                        results={results}
                        competitionId={competitionId}
                        className={className}
                    />
                }

                {
                    // PORTRAIT
                    this.state.showList &&
                    <OLResultsList
                        results={results}
                        competitionId={competitionId}
                        className={className}
                    />
                }

                {/* <OLRefetcher
                    interval={15000}
                    refetch={refetch}
                    circle
                /> */}
            </>
        );
    }
}
