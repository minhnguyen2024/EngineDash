//src: https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/

function getMinDistance(dist: Array<number>, sptSet: Array<boolean>, numVertex: number){
    let min = Number.MAX_VALUE
    let minIndex = -1

    for(let v = 0; v < numVertex; v++){
        if(sptSet[v] == false && dist[v] < min){
            min = dist[v]
            minIndex = v
        }
    }
    return minIndex
}


function printResultTable(dist: Array<number>, numVertex: number){
    console.log("-----------------------")
    console.log("Vertex \t\t Distance from Source")
    for (let i = 0; i < numVertex; i++){
        console.log(i + "\t\t " + dist[i])
    }
    console.log("-----------------------")
}


function dijkstra(graph: Array<Array<number>>, src: number){
    let NUM_VERTEX = graph[0].length
    let dist = new Array(NUM_VERTEX)
    let sptSet = new Array(NUM_VERTEX)
    for (let  i = 0; i < NUM_VERTEX; i++){
        dist[i] = Number.MAX_VALUE
        sptSet[i] = false
    }

    dist[src] = 0

    for (let i = 0; i < NUM_VERTEX - 1; i++){
        let u = getMinDistance(dist, sptSet, NUM_VERTEX)
        sptSet[u] = true
        for(let v = 0; v < NUM_VERTEX; v++){
            if (!sptSet[v] && graph[u][v] != 0 && dist[u] != Number.MAX_VALUE && dist[u] + graph[u][v] < dist[v]){
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
    // printResultTable(dist, NUM_VERTEX)
    const resultPayload = { dist, src }
    return resultPayload
}


function printInfo(data: Array<string>, resultPayload: any){
    const result = resultPayload.dist
    const src = resultPayload.src
    console.log(resultPayload)
    for (let i = 0; i < result.length; i ++){
        console.log(`Shortest distance from ${data[src]} to ${data[i]} is ${result[i]}`)
    }
}


let graph = [ [ 0, 4, 0, 0, 0, 0, 0, 8, 0 ],
              [ 4, 0, 8, 0, 0, 0, 0, 11, 0 ],
              [ 0, 8, 0, 7, 0, 4, 0, 0, 2 ],
              [ 0, 0, 7, 0, 9, 14, 0, 0, 0],
              [ 0, 0, 0, 9, 0, 10, 0, 0, 0 ],
              [ 0, 0, 4, 14, 10, 0, 2, 0, 0],
              [ 0, 0, 0, 0, 0, 2, 0, 1, 6 ],
              [ 8, 11, 0, 0, 0, 0, 1, 0, 7 ],
              [ 0, 0, 2, 0, 0, 0, 6, 7, 0 ] ]
// dijkstra(graph, 0);


let graph1 = [
    [0, 6, 0, 1, 0],
    [6, 0, 5, 2, 2],
    [0, 5, 0, 0, 5],
    [1, 2, 0, 0, 1],
    [0, 2, 5, 1, 0]
]


let data = ["IN", "PA", "NY", "IL", "MI"]    
const resultPayload = dijkstra(graph1, 1);
printInfo(data, resultPayload)
