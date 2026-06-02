import type { CyclonesData } from '@/components/dashboard/types';

const TEAMS: Record<string, CyclonesData> = {
  kansas: {
    team: 'Kansas Jayhawks',
    sport: "Men's Basketball",
    seasons: [
      {
        year: '2022-23', record: '28-8', conferenceRank: 1, avgPoints: 79.4,
        players: [
          { name: 'Marcus Thompson', position: 'G', games: 34, mpg: 34, ppg: 20.4, rpg: 3.8, apg: 4.2, spg: 1.6, bpg: 0.2, fgPct: 48.2, threePct: 38.1, ftPct: 85.3 },
          { name: 'Devon Harris',    position: 'F', games: 34, mpg: 31, ppg: 15.8, rpg: 7.2, apg: 2.1, spg: 1.0, bpg: 1.1, fgPct: 52.4, threePct: 32.0, ftPct: 74.5 },
          { name: 'Zach Collins',   position: 'C', games: 30, mpg: 28, ppg: 12.4, rpg: 8.9, apg: 1.4, spg: 0.7, bpg: 2.3, fgPct: 58.1, threePct: 0,    ftPct: 69.2 },
          { name: 'Tyler Moore',    position: 'G', games: 34, mpg: 29, ppg: 11.9, rpg: 4.2, apg: 3.8, spg: 1.8, bpg: 0.1, fgPct: 44.8, threePct: 37.5, ftPct: 88.4 },
          { name: 'Brandon Adams',  position: 'F', games: 28, mpg: 24, ppg: 9.4,  rpg: 5.8, apg: 1.2, spg: 0.6, bpg: 0.8, fgPct: 49.2, threePct: 28.4, ftPct: 71.6 },
          { name: 'Chris Lee',      position: 'G', games: 34, mpg: 22, ppg: 7.8,  rpg: 2.8, apg: 2.4, spg: 1.2, bpg: 0.0, fgPct: 41.6, threePct: 36.2, ftPct: 82.1 },
          { name: 'Sam Peters',     position: 'F', games: 26, mpg: 17, ppg: 5.6,  rpg: 4.4, apg: 0.8, spg: 0.4, bpg: 0.6, fgPct: 54.3, threePct: 25.0, ftPct: 62.4 },
          { name: 'Jake Wilson',    position: 'G', games: 22, mpg: 12, ppg: 4.2,  rpg: 1.6, apg: 1.8, spg: 0.8, bpg: 0.0, fgPct: 38.4, threePct: 31.8, ftPct: 79.3 },
        ],
      },
      {
        year: '2023-24', record: '26-9', conferenceRank: 2, avgPoints: 77.1,
        players: [
          { name: 'Marcus Thompson', position: 'G', games: 33, mpg: 34, ppg: 22.1, rpg: 4.0, apg: 4.8, spg: 1.8, bpg: 0.2, fgPct: 49.4, threePct: 39.2, ftPct: 86.1 },
          { name: 'Devon Harris',    position: 'F', games: 33, mpg: 30, ppg: 14.4, rpg: 6.8, apg: 2.4, spg: 0.9, bpg: 1.2, fgPct: 51.8, threePct: 30.5, ftPct: 76.4 },
          { name: 'Zach Collins',   position: 'C', games: 28, mpg: 27, ppg: 11.8, rpg: 9.2, apg: 1.2, spg: 0.6, bpg: 2.6, fgPct: 57.4, threePct: 0,    ftPct: 70.8 },
          { name: 'Tyler Moore',    position: 'G', games: 33, mpg: 30, ppg: 10.2, rpg: 3.6, apg: 4.2, spg: 2.0, bpg: 0.1, fgPct: 43.2, threePct: 36.8, ftPct: 89.2 },
          { name: 'Ryan Jefferson', position: 'F', games: 30, mpg: 25, ppg: 10.8, rpg: 5.4, apg: 1.4, spg: 0.8, bpg: 0.7, fgPct: 50.6, threePct: 33.1, ftPct: 73.2 },
          { name: 'Chris Lee',      position: 'G', games: 33, mpg: 21, ppg: 7.4,  rpg: 2.4, apg: 2.8, spg: 1.4, bpg: 0.0, fgPct: 42.8, threePct: 37.4, ftPct: 83.6 },
          { name: 'Sam Peters',     position: 'F', games: 24, mpg: 16, ppg: 5.2,  rpg: 4.8, apg: 0.6, spg: 0.4, bpg: 0.8, fgPct: 55.1, threePct: 22.0, ftPct: 63.8 },
          { name: 'Drew Hampton',   position: 'G', games: 20, mpg: 10, ppg: 3.8,  rpg: 1.2, apg: 1.4, spg: 0.6, bpg: 0.0, fgPct: 37.2, threePct: 32.6, ftPct: 78.4 },
        ],
      },
      {
        year: '2024-25', record: '29-7', conferenceRank: 1, avgPoints: 81.2,
        players: [
          { name: 'Marcus Thompson', position: 'G', games: 34, mpg: 33, ppg: 23.6, rpg: 3.6, apg: 5.2, spg: 2.0, bpg: 0.3, fgPct: 50.1, threePct: 40.4, ftPct: 87.4 },
          { name: 'Ryan Jefferson',  position: 'F', games: 34, mpg: 31, ppg: 16.8, rpg: 7.4, apg: 2.6, spg: 1.1, bpg: 1.4, fgPct: 53.2, threePct: 34.6, ftPct: 77.8 },
          { name: 'Alex Grant',      position: 'C', games: 31, mpg: 27, ppg: 14.2, rpg: 9.6, apg: 1.8, spg: 0.8, bpg: 2.8, fgPct: 60.4, threePct: 0,    ftPct: 68.4 },
          { name: 'Tyler Moore',     position: 'G', games: 34, mpg: 29, ppg: 11.4, rpg: 3.4, apg: 4.6, spg: 1.9, bpg: 0.1, fgPct: 45.6, threePct: 38.2, ftPct: 90.1 },
          { name: 'Drew Hampton',    position: 'G', games: 32, mpg: 26, ppg: 9.8,  rpg: 2.8, apg: 3.6, spg: 1.6, bpg: 0.1, fgPct: 43.8, threePct: 37.8, ftPct: 84.2 },
          { name: 'Chris Lee',       position: 'G', games: 34, mpg: 22, ppg: 8.4,  rpg: 2.6, apg: 2.6, spg: 1.2, bpg: 0.0, fgPct: 43.4, threePct: 38.6, ftPct: 84.8 },
          { name: 'Sam Peters',      position: 'F', games: 28, mpg: 18, ppg: 6.4,  rpg: 5.2, apg: 0.8, spg: 0.5, bpg: 0.9, fgPct: 56.2, threePct: 24.0, ftPct: 65.4 },
          { name: 'Jordan Hayes',    position: 'F', games: 25, mpg: 14, ppg: 4.8,  rpg: 3.8, apg: 0.6, spg: 0.3, bpg: 0.4, fgPct: 48.6, threePct: 29.2, ftPct: 70.6 },
        ],
      },
    ],
  },

  tcu: {
    team: 'TCU Horned Frogs',
    sport: "Men's Basketball",
    seasons: [
      {
        year: '2022-23', record: '21-13', conferenceRank: 5, avgPoints: 71.8,
        players: [
          { name: 'Miles Griffin',  position: 'G', games: 32, mpg: 33, ppg: 17.6, rpg: 4.4, apg: 3.6, spg: 1.4, bpg: 0.2, fgPct: 44.8, threePct: 36.2, ftPct: 81.4 },
          { name: 'Carson Reed',    position: 'F', games: 31, mpg: 29, ppg: 13.2, rpg: 6.8, apg: 1.8, spg: 0.8, bpg: 0.9, fgPct: 50.4, threePct: 30.1, ftPct: 72.6 },
          { name: 'David Johnson',  position: 'C', games: 28, mpg: 25, ppg: 10.8, rpg: 8.2, apg: 1.2, spg: 0.6, bpg: 1.8, fgPct: 55.6, threePct: 0,    ftPct: 66.4 },
          { name: 'Patrick Williams',position:'G', games: 32, mpg: 28, ppg: 10.4, rpg: 3.2, apg: 4.2, spg: 1.6, bpg: 0.1, fgPct: 42.6, threePct: 35.8, ftPct: 84.2 },
          { name: 'Marcus Brown',   position: 'F', games: 28, mpg: 22, ppg: 8.6,  rpg: 5.2, apg: 1.0, spg: 0.6, bpg: 0.7, fgPct: 47.2, threePct: 27.4, ftPct: 70.8 },
          { name: 'Tyler Scott',    position: 'G', games: 32, mpg: 20, ppg: 7.4,  rpg: 2.4, apg: 2.6, spg: 1.0, bpg: 0.0, fgPct: 39.8, threePct: 34.6, ftPct: 80.2 },
          { name: 'Alex Torres',    position: 'F', games: 24, mpg: 16, ppg: 5.2,  rpg: 4.0, apg: 0.6, spg: 0.4, bpg: 0.5, fgPct: 51.8, threePct: 22.0, ftPct: 61.4 },
          { name: 'Kevin Murphy',   position: 'G', games: 20, mpg: 11, ppg: 3.8,  rpg: 1.4, apg: 1.6, spg: 0.6, bpg: 0.0, fgPct: 36.4, threePct: 30.8, ftPct: 76.8 },
        ],
      },
      {
        year: '2023-24', record: '22-12', conferenceRank: 4, avgPoints: 73.4,
        players: [
          { name: 'Miles Griffin',  position: 'G', games: 32, mpg: 34, ppg: 18.8, rpg: 4.2, apg: 3.8, spg: 1.6, bpg: 0.2, fgPct: 45.6, threePct: 37.4, ftPct: 82.6 },
          { name: 'Carson Reed',    position: 'F', games: 30, mpg: 30, ppg: 14.4, rpg: 7.0, apg: 2.0, spg: 0.9, bpg: 1.1, fgPct: 51.8, threePct: 31.4, ftPct: 74.2 },
          { name: 'David Johnson',  position: 'C', games: 27, mpg: 26, ppg: 11.6, rpg: 8.6, apg: 1.4, spg: 0.5, bpg: 2.0, fgPct: 56.4, threePct: 0,    ftPct: 67.8 },
          { name: 'Patrick Williams',position:'G', games: 32, mpg: 29, ppg: 11.2, rpg: 3.4, apg: 4.6, spg: 1.8, bpg: 0.1, fgPct: 43.8, threePct: 36.6, ftPct: 85.4 },
          { name: 'Darnell Hughes', position: 'F', games: 30, mpg: 24, ppg: 9.8,  rpg: 5.6, apg: 1.2, spg: 0.7, bpg: 0.8, fgPct: 48.6, threePct: 29.2, ftPct: 72.4 },
          { name: 'Tyler Scott',    position: 'G', games: 32, mpg: 21, ppg: 7.2,  rpg: 2.6, apg: 2.8, spg: 1.1, bpg: 0.0, fgPct: 40.4, threePct: 35.2, ftPct: 81.6 },
          { name: 'Alex Torres',    position: 'F', games: 26, mpg: 17, ppg: 5.8,  rpg: 4.2, apg: 0.8, spg: 0.4, bpg: 0.6, fgPct: 52.6, threePct: 23.0, ftPct: 63.2 },
          { name: 'Kevin Murphy',   position: 'G', games: 22, mpg: 12, ppg: 4.2,  rpg: 1.6, apg: 1.8, spg: 0.7, bpg: 0.0, fgPct: 37.8, threePct: 32.4, ftPct: 78.6 },
        ],
      },
      {
        year: '2024-25', record: '24-10', conferenceRank: 3, avgPoints: 75.6,
        players: [
          { name: 'Miles Griffin',  position: 'G', games: 33, mpg: 33, ppg: 19.4, rpg: 4.6, apg: 4.2, spg: 1.8, bpg: 0.2, fgPct: 46.4, threePct: 38.6, ftPct: 83.8 },
          { name: 'Darnell Hughes', position: 'F', games: 33, mpg: 31, ppg: 15.6, rpg: 7.4, apg: 2.4, spg: 1.0, bpg: 1.2, fgPct: 52.6, threePct: 32.8, ftPct: 75.6 },
          { name: 'Jalen Carter',   position: 'C', games: 30, mpg: 27, ppg: 12.8, rpg: 9.0, apg: 1.6, spg: 0.6, bpg: 2.2, fgPct: 57.8, threePct: 0,    ftPct: 68.6 },
          { name: 'Patrick Williams',position:'G', games: 33, mpg: 30, ppg: 11.6, rpg: 3.6, apg: 5.0, spg: 2.0, bpg: 0.1, fgPct: 44.6, threePct: 37.8, ftPct: 86.2 },
          { name: 'Tyler Scott',    position: 'G', games: 33, mpg: 22, ppg: 8.4,  rpg: 2.8, apg: 3.0, spg: 1.2, bpg: 0.0, fgPct: 41.6, threePct: 36.4, ftPct: 82.8 },
          { name: 'Rob Foster',     position: 'F', games: 28, mpg: 19, ppg: 7.2,  rpg: 4.8, apg: 0.8, spg: 0.5, bpg: 0.6, fgPct: 50.4, threePct: 26.0, ftPct: 67.4 },
          { name: 'Kevin Murphy',   position: 'G', games: 24, mpg: 14, ppg: 5.4,  rpg: 1.8, apg: 2.2, spg: 0.8, bpg: 0.0, fgPct: 38.6, threePct: 33.8, ftPct: 79.4 },
          { name: 'Malik Ross',     position: 'F', games: 22, mpg: 12, ppg: 3.6,  rpg: 3.4, apg: 0.4, spg: 0.3, bpg: 0.4, fgPct: 46.2, threePct: 20.0, ftPct: 62.8 },
        ],
      },
    ],
  },

  arizona: {
    team: 'Arizona Wildcats',
    sport: "Men's Basketball",
    seasons: [
      {
        year: '2022-23', record: '25-9', conferenceRank: 2, avgPoints: 80.6,
        players: [
          { name: 'Kylan George',   position: 'G', games: 32, mpg: 34, ppg: 19.4, rpg: 3.6, apg: 4.8, spg: 1.8, bpg: 0.2, fgPct: 46.8, threePct: 39.4, ftPct: 84.6 },
          { name: 'Aaron Anderson', position: 'F', games: 31, mpg: 30, ppg: 16.2, rpg: 8.0, apg: 2.2, spg: 1.0, bpg: 1.4, fgPct: 54.6, threePct: 33.2, ftPct: 76.2 },
          { name: 'Marcus Webb',    position: 'C', games: 29, mpg: 27, ppg: 13.8, rpg: 9.4, apg: 1.4, spg: 0.6, bpg: 2.6, fgPct: 60.2, threePct: 0,    ftPct: 70.4 },
          { name: 'Justin Torres',  position: 'G', games: 32, mpg: 28, ppg: 12.6, rpg: 3.8, apg: 4.4, spg: 1.6, bpg: 0.1, fgPct: 45.4, threePct: 38.6, ftPct: 86.8 },
          { name: 'Chris Bell',     position: 'F', games: 28, mpg: 23, ppg: 9.8,  rpg: 5.6, apg: 1.4, spg: 0.8, bpg: 0.8, fgPct: 50.8, threePct: 29.6, ftPct: 73.4 },
          { name: 'Derek James',    position: 'G', games: 32, mpg: 21, ppg: 8.4,  rpg: 2.6, apg: 3.2, spg: 1.4, bpg: 0.0, fgPct: 42.4, threePct: 37.8, ftPct: 83.6 },
          { name: 'Tyler Young',    position: 'F', games: 25, mpg: 17, ppg: 6.2,  rpg: 4.6, apg: 0.8, spg: 0.5, bpg: 0.6, fgPct: 53.4, threePct: 24.0, ftPct: 64.8 },
          { name: 'Sam Washington', position: 'G', games: 21, mpg: 12, ppg: 4.4,  rpg: 1.8, apg: 2.0, spg: 0.7, bpg: 0.0, fgPct: 38.8, threePct: 33.4, ftPct: 80.2 },
        ],
      },
      {
        year: '2023-24', record: '24-10', conferenceRank: 3, avgPoints: 78.2,
        players: [
          { name: 'Kylan George',   position: 'G', games: 32, mpg: 34, ppg: 21.2, rpg: 3.8, apg: 5.2, spg: 2.0, bpg: 0.2, fgPct: 47.6, threePct: 40.2, ftPct: 85.8 },
          { name: 'Aaron Anderson', position: 'F', games: 31, mpg: 31, ppg: 17.4, rpg: 8.4, apg: 2.4, spg: 1.1, bpg: 1.6, fgPct: 55.4, threePct: 34.0, ftPct: 77.4 },
          { name: 'Marcus Webb',    position: 'C', games: 28, mpg: 26, ppg: 12.6, rpg: 9.8, apg: 1.6, spg: 0.5, bpg: 2.8, fgPct: 61.0, threePct: 0,    ftPct: 71.6 },
          { name: 'Justin Torres',  position: 'G', games: 32, mpg: 29, ppg: 11.4, rpg: 3.6, apg: 4.8, spg: 1.8, bpg: 0.1, fgPct: 44.6, threePct: 39.4, ftPct: 87.6 },
          { name: 'Devon Blake',    position: 'F', games: 30, mpg: 24, ppg: 10.6, rpg: 6.0, apg: 1.6, spg: 0.9, bpg: 0.9, fgPct: 51.6, threePct: 31.2, ftPct: 74.8 },
          { name: 'Derek James',    position: 'G', games: 32, mpg: 22, ppg: 8.2,  rpg: 2.8, apg: 3.4, spg: 1.5, bpg: 0.0, fgPct: 43.2, threePct: 38.6, ftPct: 84.4 },
          { name: 'Tyler Young',    position: 'F', games: 26, mpg: 18, ppg: 6.6,  rpg: 5.0, apg: 0.9, spg: 0.5, bpg: 0.7, fgPct: 54.2, threePct: 25.0, ftPct: 66.2 },
          { name: 'Sam Washington', position: 'G', games: 22, mpg: 13, ppg: 4.8,  rpg: 2.0, apg: 2.2, spg: 0.8, bpg: 0.0, fgPct: 39.6, threePct: 34.2, ftPct: 81.4 },
        ],
      },
      {
        year: '2024-25', record: '27-8', conferenceRank: 1, avgPoints: 83.4,
        players: [
          { name: 'Kylan George',   position: 'G', games: 33, mpg: 33, ppg: 22.8, rpg: 4.0, apg: 5.6, spg: 2.2, bpg: 0.3, fgPct: 49.2, threePct: 41.6, ftPct: 87.2 },
          { name: 'Devon Blake',    position: 'F', games: 33, mpg: 32, ppg: 18.6, rpg: 8.8, apg: 2.8, spg: 1.2, bpg: 1.8, fgPct: 56.8, threePct: 35.4, ftPct: 79.2 },
          { name: 'Ryan Cole',      position: 'C', games: 31, mpg: 28, ppg: 14.4, rpg: 10.2, apg: 1.8, spg: 0.7, bpg: 3.0, fgPct: 62.4, threePct: 0,    ftPct: 69.8 },
          { name: 'Justin Torres',  position: 'G', games: 33, mpg: 30, ppg: 12.8, rpg: 3.4, apg: 5.2, spg: 2.0, bpg: 0.1, fgPct: 46.2, threePct: 40.6, ftPct: 88.4 },
          { name: 'Derek James',    position: 'G', games: 33, mpg: 23, ppg: 9.6,  rpg: 3.0, apg: 3.6, spg: 1.6, bpg: 0.0, fgPct: 44.0, threePct: 39.4, ftPct: 85.6 },
          { name: 'Chris Bell',     position: 'F', games: 30, mpg: 20, ppg: 8.2,  rpg: 5.4, apg: 1.2, spg: 0.8, bpg: 0.8, fgPct: 52.4, threePct: 30.4, ftPct: 75.4 },
          { name: 'Tyler Young',    position: 'F', games: 28, mpg: 16, ppg: 6.8,  rpg: 4.8, apg: 0.8, spg: 0.4, bpg: 0.7, fgPct: 55.0, threePct: 26.0, ftPct: 67.4 },
          { name: 'Will Nash',      position: 'G', games: 24, mpg: 12, ppg: 4.6,  rpg: 1.8, apg: 2.4, spg: 0.9, bpg: 0.0, fgPct: 40.4, threePct: 35.0, ftPct: 82.6 },
        ],
      },
    ],
  },

  byu: {
    team: 'BYU Cougars',
    sport: "Men's Basketball",
    seasons: [
      {
        year: '2022-23', record: '20-12', conferenceRank: 7, avgPoints: 73.2,
        players: [
          { name: 'Connor Bradford', position: 'G', games: 30, mpg: 33, ppg: 16.8, rpg: 3.4, apg: 3.8, spg: 1.2, bpg: 0.2, fgPct: 44.2, threePct: 36.8, ftPct: 82.4 },
          { name: 'Alex Jensen',     position: 'F', games: 29, mpg: 29, ppg: 13.4, rpg: 7.0, apg: 1.8, spg: 0.8, bpg: 1.0, fgPct: 50.6, threePct: 30.4, ftPct: 73.6 },
          { name: 'Tyler Merrill',   position: 'C', games: 27, mpg: 25, ppg: 11.2, rpg: 8.6, apg: 1.2, spg: 0.5, bpg: 1.8, fgPct: 56.8, threePct: 0,    ftPct: 67.4 },
          { name: 'Josh Parker',     position: 'G', games: 30, mpg: 27, ppg: 10.6, rpg: 3.0, apg: 4.0, spg: 1.4, bpg: 0.1, fgPct: 42.8, threePct: 35.6, ftPct: 84.6 },
          { name: 'Ryan Mitchell',   position: 'F', games: 27, mpg: 22, ppg: 8.8,  rpg: 5.4, apg: 1.0, spg: 0.6, bpg: 0.7, fgPct: 48.4, threePct: 27.2, ftPct: 70.4 },
          { name: 'Ben Crawford',    position: 'G', games: 30, mpg: 20, ppg: 7.4,  rpg: 2.4, apg: 2.8, spg: 1.0, bpg: 0.0, fgPct: 40.6, threePct: 34.8, ftPct: 80.8 },
          { name: 'Matt Wilson',     position: 'F', games: 23, mpg: 15, ppg: 5.4,  rpg: 4.0, apg: 0.6, spg: 0.4, bpg: 0.5, fgPct: 52.4, threePct: 22.0, ftPct: 63.6 },
          { name: 'Danny Brown',     position: 'G', games: 18, mpg: 10, ppg: 3.6,  rpg: 1.4, apg: 1.6, spg: 0.5, bpg: 0.0, fgPct: 37.4, threePct: 31.6, ftPct: 77.4 },
        ],
      },
      {
        year: '2023-24', record: '22-11', conferenceRank: 5, avgPoints: 74.8,
        players: [
          { name: 'Connor Bradford', position: 'G', games: 31, mpg: 34, ppg: 18.2, rpg: 3.6, apg: 4.2, spg: 1.4, bpg: 0.2, fgPct: 45.4, threePct: 37.6, ftPct: 83.6 },
          { name: 'Alex Jensen',     position: 'F', games: 30, mpg: 30, ppg: 14.6, rpg: 7.4, apg: 2.0, spg: 0.9, bpg: 1.2, fgPct: 51.4, threePct: 31.8, ftPct: 75.2 },
          { name: 'Tyler Merrill',   position: 'C', games: 28, mpg: 26, ppg: 12.0, rpg: 9.0, apg: 1.4, spg: 0.5, bpg: 2.0, fgPct: 57.6, threePct: 0,    ftPct: 68.8 },
          { name: 'Josh Parker',     position: 'G', games: 31, mpg: 28, ppg: 10.8, rpg: 3.2, apg: 4.4, spg: 1.6, bpg: 0.1, fgPct: 43.6, threePct: 36.4, ftPct: 85.8 },
          { name: 'Lance Webb',      position: 'F', games: 29, mpg: 24, ppg: 9.6,  rpg: 5.8, apg: 1.2, spg: 0.7, bpg: 0.8, fgPct: 49.2, threePct: 29.0, ftPct: 71.6 },
          { name: 'Ben Crawford',    position: 'G', games: 31, mpg: 21, ppg: 7.8,  rpg: 2.6, apg: 3.0, spg: 1.1, bpg: 0.0, fgPct: 41.4, threePct: 35.6, ftPct: 82.0 },
          { name: 'Matt Wilson',     position: 'F', games: 25, mpg: 16, ppg: 5.8,  rpg: 4.4, apg: 0.7, spg: 0.4, bpg: 0.6, fgPct: 53.2, threePct: 23.0, ftPct: 65.0 },
          { name: 'Danny Brown',     position: 'G', games: 20, mpg: 11, ppg: 4.0,  rpg: 1.6, apg: 1.8, spg: 0.6, bpg: 0.0, fgPct: 38.2, threePct: 32.4, ftPct: 78.8 },
        ],
      },
      {
        year: '2024-25', record: '21-13', conferenceRank: 6, avgPoints: 72.6,
        players: [
          { name: 'Connor Bradford', position: 'G', games: 32, mpg: 33, ppg: 17.6, rpg: 3.8, apg: 4.6, spg: 1.6, bpg: 0.2, fgPct: 44.8, threePct: 37.2, ftPct: 84.4 },
          { name: 'Lance Webb',      position: 'F', games: 32, mpg: 31, ppg: 15.2, rpg: 7.8, apg: 2.2, spg: 1.0, bpg: 1.4, fgPct: 52.0, threePct: 32.6, ftPct: 76.4 },
          { name: 'Nathan Ellis',    position: 'C', games: 29, mpg: 26, ppg: 12.4, rpg: 9.4, apg: 1.6, spg: 0.6, bpg: 2.2, fgPct: 58.4, threePct: 0,    ftPct: 67.6 },
          { name: 'Josh Parker',     position: 'G', games: 32, mpg: 29, ppg: 11.0, rpg: 3.4, apg: 4.8, spg: 1.8, bpg: 0.1, fgPct: 44.2, threePct: 37.0, ftPct: 86.6 },
          { name: 'Ben Crawford',    position: 'G', games: 32, mpg: 22, ppg: 8.6,  rpg: 2.8, apg: 3.2, spg: 1.2, bpg: 0.0, fgPct: 42.0, threePct: 36.2, ftPct: 83.2 },
          { name: 'Matt Wilson',     position: 'F', games: 28, mpg: 18, ppg: 7.0,  rpg: 5.0, apg: 0.8, spg: 0.5, bpg: 0.7, fgPct: 53.8, threePct: 24.0, ftPct: 66.4 },
          { name: 'Danny Brown',     position: 'G', games: 24, mpg: 13, ppg: 4.8,  rpg: 1.8, apg: 2.0, spg: 0.7, bpg: 0.0, fgPct: 39.0, threePct: 33.0, ftPct: 79.6 },
          { name: 'Tom Reeves',      position: 'F', games: 20, mpg: 10, ppg: 3.2,  rpg: 3.0, apg: 0.4, spg: 0.3, bpg: 0.3, fgPct: 47.6, threePct: 20.0, ftPct: 61.8 },
        ],
      },
    ],
  },

  houston: {
    team: 'Houston Cougars',
    sport: "Men's Basketball",
    seasons: [
      {
        year: '2022-23', record: '27-8', conferenceRank: 1, avgPoints: 69.4,
        players: [
          { name: 'Jamal Edwards', position: 'G', games: 33, mpg: 32, ppg: 17.8, rpg: 4.2, apg: 3.4, spg: 2.2, bpg: 0.3, fgPct: 45.6, threePct: 34.8, ftPct: 80.6 },
          { name: 'Marcus Hill',   position: 'F', games: 32, mpg: 29, ppg: 13.6, rpg: 7.8, apg: 1.6, spg: 1.2, bpg: 1.6, fgPct: 51.2, threePct: 28.4, ftPct: 72.8 },
          { name: 'Devon Clark',   position: 'C', games: 30, mpg: 26, ppg: 10.8, rpg: 9.2, apg: 1.2, spg: 0.8, bpg: 2.8, fgPct: 57.4, threePct: 0,    ftPct: 65.4 },
          { name: 'Troy Johnson',  position: 'G', games: 33, mpg: 27, ppg: 9.6,  rpg: 3.4, apg: 4.6, spg: 2.0, bpg: 0.1, fgPct: 42.4, threePct: 33.6, ftPct: 82.4 },
          { name: 'Kevin Brown',   position: 'F', games: 29, mpg: 22, ppg: 8.4,  rpg: 5.8, apg: 1.0, spg: 0.8, bpg: 0.9, fgPct: 48.8, threePct: 26.2, ftPct: 69.6 },
          { name: 'Chris Adams',   position: 'G', games: 33, mpg: 20, ppg: 6.8,  rpg: 2.6, apg: 2.4, spg: 1.4, bpg: 0.0, fgPct: 40.2, threePct: 32.4, ftPct: 78.4 },
          { name: 'Michael Lee',   position: 'F', games: 25, mpg: 15, ppg: 5.0,  rpg: 4.4, apg: 0.6, spg: 0.5, bpg: 0.8, fgPct: 52.6, threePct: 20.0, ftPct: 62.6 },
          { name: 'Anthony Scott', position: 'G', games: 20, mpg: 11, ppg: 3.4,  rpg: 1.4, apg: 1.8, spg: 0.8, bpg: 0.0, fgPct: 36.8, threePct: 29.6, ftPct: 75.8 },
        ],
      },
      {
        year: '2023-24', record: '25-9', conferenceRank: 2, avgPoints: 71.2,
        players: [
          { name: 'Jamal Edwards', position: 'G', games: 32, mpg: 33, ppg: 19.2, rpg: 4.4, apg: 3.8, spg: 2.4, bpg: 0.3, fgPct: 46.4, threePct: 35.6, ftPct: 81.8 },
          { name: 'Marcus Hill',   position: 'F', games: 31, mpg: 30, ppg: 14.8, rpg: 8.2, apg: 1.8, spg: 1.3, bpg: 1.8, fgPct: 52.0, threePct: 29.2, ftPct: 74.2 },
          { name: 'Devon Clark',   position: 'C', games: 29, mpg: 27, ppg: 11.6, rpg: 9.6, apg: 1.4, spg: 0.7, bpg: 3.0, fgPct: 58.2, threePct: 0,    ftPct: 66.8 },
          { name: 'Troy Johnson',  position: 'G', games: 32, mpg: 28, ppg: 10.4, rpg: 3.6, apg: 5.0, spg: 2.2, bpg: 0.1, fgPct: 43.2, threePct: 34.4, ftPct: 83.6 },
          { name: 'Darius Webb',   position: 'F', games: 30, mpg: 23, ppg: 9.2,  rpg: 6.2, apg: 1.2, spg: 0.9, bpg: 1.0, fgPct: 49.6, threePct: 27.0, ftPct: 71.0 },
          { name: 'Chris Adams',   position: 'G', games: 32, mpg: 21, ppg: 7.2,  rpg: 2.8, apg: 2.6, spg: 1.5, bpg: 0.0, fgPct: 41.0, threePct: 33.2, ftPct: 79.6 },
          { name: 'Michael Lee',   position: 'F', games: 27, mpg: 16, ppg: 5.4,  rpg: 4.8, apg: 0.7, spg: 0.6, bpg: 0.9, fgPct: 53.4, threePct: 21.0, ftPct: 64.2 },
          { name: 'Anthony Scott', position: 'G', games: 22, mpg: 12, ppg: 3.8,  rpg: 1.6, apg: 2.0, spg: 0.9, bpg: 0.0, fgPct: 37.6, threePct: 30.4, ftPct: 77.2 },
        ],
      },
      {
        year: '2024-25', record: '28-7', conferenceRank: 1, avgPoints: 72.8,
        players: [
          { name: 'Jamal Edwards', position: 'G', games: 33, mpg: 32, ppg: 20.6, rpg: 4.6, apg: 4.2, spg: 2.6, bpg: 0.4, fgPct: 47.2, threePct: 36.4, ftPct: 82.6 },
          { name: 'Darius Webb',   position: 'F', games: 33, mpg: 31, ppg: 15.4, rpg: 8.6, apg: 2.0, spg: 1.4, bpg: 2.0, fgPct: 53.0, threePct: 30.0, ftPct: 75.6 },
          { name: 'Devon Clark',   position: 'C', games: 30, mpg: 27, ppg: 12.4, rpg: 10.0, apg: 1.6, spg: 0.8, bpg: 3.2, fgPct: 59.0, threePct: 0,    ftPct: 67.4 },
          { name: 'Troy Johnson',  position: 'G', games: 33, mpg: 29, ppg: 11.2, rpg: 3.8, apg: 5.4, spg: 2.4, bpg: 0.1, fgPct: 44.0, threePct: 35.2, ftPct: 84.8 },
          { name: 'Chris Adams',   position: 'G', games: 33, mpg: 22, ppg: 8.0,  rpg: 3.0, apg: 2.8, spg: 1.6, bpg: 0.0, fgPct: 41.8, threePct: 34.0, ftPct: 80.8 },
          { name: 'Ray Thomas',    position: 'F', games: 30, mpg: 19, ppg: 7.6,  rpg: 5.6, apg: 0.8, spg: 0.7, bpg: 1.0, fgPct: 51.0, threePct: 24.0, ftPct: 68.4 },
          { name: 'Michael Lee',   position: 'F', games: 28, mpg: 16, ppg: 5.8,  rpg: 4.6, apg: 0.6, spg: 0.5, bpg: 0.9, fgPct: 54.2, threePct: 22.0, ftPct: 65.6 },
          { name: 'Anthony Scott', position: 'G', games: 24, mpg: 12, ppg: 4.0,  rpg: 1.8, apg: 2.2, spg: 1.0, bpg: 0.0, fgPct: 38.4, threePct: 31.2, ftPct: 78.4 },
        ],
      },
    ],
  },
};

export default TEAMS;
