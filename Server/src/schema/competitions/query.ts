import { GQLContext } from 'lib/server';
import { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString } from 'graphql';
import { OLClass, IOLClass, marshallClass } from 'schema/classes';
import { OLCompetition, marshallCompetition, IOLCompetition } from 'schema/competitions';

export const CompetitionsQuery = new GraphQLObjectType({
    name: 'CompetitionsQuery',
    fields: () => ({
        getAllCompetitions: {
            type: GraphQLList(OLCompetition),
            resolve: async (_, args, { Liveresultat, userId }: GQLContext): Promise<IOLCompetition[]> => {
                let { competitions } = await Liveresultat.getcompetitions();
                competitions = competitions.filter((c) => c.id === 17049);
                return competitions.map(marshallCompetition(null));
            },
        },
        getCompetition: {
            args: {
                competitionId: {
                    type: GraphQLInt,
                },
            },
            type: OLCompetition,
            resolve: async (_, args, { Liveresultat, Eventor }: GQLContext): Promise<IOLCompetition> => {
                if (!args.competitionId) {
                    throw new Error('No competition id present');
                }

                const liveresultatComp = await Liveresultat.getcompetition(args.competitionId);
                const eventorComp = await Eventor.scraper.getEventorData(liveresultatComp);

                return marshallCompetition(eventorComp)(liveresultatComp);
            },
        },
        getCompetitionClasses: {
            args: {
                competitionId: {
                    type: GraphQLInt,
                },
            },
            type: GraphQLList(OLClass),
            resolve: async (_, args, { Liveresultat }: GQLContext): Promise<IOLClass[]> => {
                if (!args.competitionId) {
                    throw new Error('No competition id present');
                }

                const { classes } = await Liveresultat.getclasses(args.competitionId);

                return classes.map(marshallClass(args.competitionId));
            },
        }
    }),
});
