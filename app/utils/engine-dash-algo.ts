//src: https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/
// import { US_AVAILABLE_STATE_INDEX_MAP, US_AVAILABLE_STATE, US_DISTANCE_ARRAY } from "./helper-data"
function getMinDistance(
  dist: Array<number>,
  sptSet: Array<boolean>,
  numVertex: number
) {
  let min = Number.MAX_VALUE;
  let minIndex = -1;

  for (let v = 0; v < numVertex; v++) {
    if (sptSet[v] == false && dist[v] < min) {
      min = dist[v];
      minIndex = v;
    }
  }
  return minIndex;
}

// function printResultTable(dist: Array<number>, numVertex: number){
//     console.log("-----------------------")
//     console.log("Vertex \t\t Distance from Source")
//     for (let i = 0; i < numVertex; i++){
//         console.log(i + "\t\t " + dist[i])
//     }
//     console.log("-----------------------")
// }

export function dijkstra(graph: Array<Array<number>>, src: number) {
  let NUM_VERTEX = graph[0].length;
  let dist = new Array(NUM_VERTEX);
  let sptSet = new Array(NUM_VERTEX);
  for (let i = 0; i < NUM_VERTEX; i++) {
    dist[i] = Number.MAX_VALUE;
    sptSet[i] = false;
  }

  dist[src] = 0;

  for (let i = 0; i < NUM_VERTEX - 1; i++) {
    let u = getMinDistance(dist, sptSet, NUM_VERTEX);
    sptSet[u] = true;
    for (let v = 0; v < NUM_VERTEX; v++) {
      if (
        !sptSet[v] &&
        graph[u][v] != 0 &&
        dist[u] != Number.MAX_VALUE &&
        dist[u] + graph[u][v] < dist[v]
      ) {
        dist[v] = dist[u] + graph[u][v];
      }
    }
  }
  const resultPayload = { dist, src };
  return resultPayload;
}

export function printInfo(stateData: Array<string>, resultPayload: any) {
  const result: Array<number> = resultPayload.dist;
  const data: Array<string> = stateData;
  const map = new Map();
  for (let i = 0; i < result.length; i++) {
    map.set(data[i], result[i]);
  }
  return map;
}
