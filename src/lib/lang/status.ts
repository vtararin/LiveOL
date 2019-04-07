import Language from './index';

/*
    0 - OK
    1 - DNS (Did Not Start)
    2 - DNF (Did not finish)
    3 - MP (Missing Punch)
    4 - DSQ (Disqualified)
    5 - OT (Over (max) time)
    9 - Not Started Yet
    10 - Not Started Yet
    11 - Walk Over (Resigned before the race started)
    12 - Moved up (The runner have been moved to a higher class)
*/

export const statusI18n = (status: number, len = 'short') => {
    return Language.print(`status.${len}`)[status - 1];
};
