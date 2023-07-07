export const US_STATES = [
    "Select a State",
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  export const APPLICATIONS = [
    "Agriculture", "Mining", "Marine", "Rail"
  ]

  export const US_AVAILABLE_STATE = ['IL', 'IN', 'KS', 'KY', 'MI', 'MO', 'OH', 'PA', 'TN', 'WI']
  export const US_AVAILABLE_STATE_INDEX_MAP = {
    "IL": 0,
    "IN": 1,
    'KS': 2,
    'KY': 3, 
    'MI': 4, 
    'MO': 5,
    'OH': 6,
    'PA': 7,
    'TN': 8,
    'WI': 9
  }

  export const US_DISTANCE_ARRAY = [
//   IL IN KS KY MI MO OH PA TN WI'
    [ 0, 2, 0, 5, 4, 3, 0, 0, 0, 1], //IL
    [ 2, 0, 0, 4, 3, 0, 2, 0, 0, 0], //IN
    [ 0, 0, 0, 0, 0, 4, 0, 0, 0, 7], //KS
    [ 5, 4, 0, 0, 0, 4, 2, 6, 3, 0], //KY
    [ 4, 3, 0, 0, 0, 0, 2, 0, 0, 0], //MI
    [ 3, 0, 4, 4, 0, 0, 0, 0, 4, 5], //MO
    [ 0, 2, 0, 2, 2, 0, 0, 3, 0, 0], //OH
    [ 0, 0, 0, 6, 0, 0, 3, 0, 11, 0], //PA
    [ 0, 0, 0, 3, 0, 4, 0, 11, 0, 0], //TN
    [ 1, 0, 7, 0, 0, 5, 0, 0, 0, 0], //WI
  ]



//   export const US_DISTANCE_ARRAY = [
//     [0,3,0,0,0,4,0,0,0,4],
//     [3,0,0,7,5,0,4,0,0,0],
//     [0,0,0,0,0,5,0,0,0,0],
//     [0,7,0,0,0,0,0,0,2,0],
//     [0,5,0,0,0,0,0,0,0,0],
//     [4,0,5,0,0,0,0,0,0,0],
//     [0,4,0,0,0,0,0,6,0,0],
//     [0,0,0,0,0,0,6,0,0,0],
//     [0,0,0,2,0,0,0,0,0,0],
//     [4,0,0,0,0,0,0,0,0,0],
// ]
