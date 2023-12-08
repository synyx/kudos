export interface KudoTitle {
  id: string;
  text: string;
  color: string;
}

export const kudoTitles = {
  CONGRATS: {
    id: 'CONGRATS',
    text: 'GLÜCKWUNSCH!',
    color: '#4fa284',
  },
  GOOD_JOB: {
    id: 'GOOD_JOB',
    text: 'GUTE ARBEIT!',
    color: '#d47ea1',
  },
  OVERJOYED: {
    id: 'OVERJOYED',
    text: 'ÜBERGLÜCKLICH!',
    color: '#4a79af',
  },
  WELL_DONE: {
    id: 'WELL_DONE',
    text: 'GUT GEMACHT!',
    color: '#964941',
  },
  THANKS: {
    id: 'THANKS',
    text: 'DANKE!',
    color: '#937dd4',
  },
};

export type KudoTitles = keyof typeof kudoTitles;
