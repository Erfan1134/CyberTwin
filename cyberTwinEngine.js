import {
  networkNodes,
  networkConnections,
} from './networkData'

function getNode(nodes, id) {
  return nodes.find(
    (node) => node.id === id
  )
}


/*
  CyberTwin Risk Engine

  Calculates risk using:

  1. Connection Risk
  2. Asset Criticality
  3. External Exposure
  4. Path Complexity
  5. Attack Surface Pressure
*/


function calculateRiskFactors(
  path,
  connections,
  nodes
) {
  if (path.length < 2) {
    return {
      connectionRisk: 0,
      assetCriticality: 0,
      exposure: 0,
      pathComplexity: 0,
      total: 0,
    }
  }


  const pathConnections = []


  for (
    let i = 0;
    i < path.length - 1;
    i++
  ) {
    const connection =
      connections.find(
        (item) =>
          item.source === path[i] &&
          item.target === path[i + 1] &&
          item.allowed === true
      )

    if (connection) {
      pathConnections.push(connection)
    }
  }


  if (pathConnections.length === 0) {
    return {
      connectionRisk: 0,
      assetCriticality: 0,
      exposure: 0,
      pathComplexity: 0,
      total: 0,
    }
  }


  /*
    1. Connection Risk

    Stronger weight on dangerous
    network connections.
  */

  const averageConnectionRisk =
    pathConnections.reduce(
      (sum, connection) =>
        sum +
        Number(connection.risk || 0),
      0
    ) / pathConnections.length


  const connectionRisk =
    Math.min(
      35,
      Math.round(
        averageConnectionRisk * 0.35
      )
    )


  /*
    2. Asset Criticality
  */

  const targetNode =
    getNode(
      nodes,
      path[path.length - 1]
    )


  const assetCriticality =
    targetNode?.criticality === 'Critical'
      ? 30
      : targetNode?.criticality === 'High'
        ? 20
        : 10


  /*
    3. External Exposure
  */

  const sourceNode =
    getNode(
      nodes,
      path[0]
    )


  const exposure =
    sourceNode?.type === 'External'
      ? 20
      : 5


  /*
    4. Path Complexity
  */

  const pathComplexity =
    Math.min(
      15,
      Math.max(
        0,
        (path.length - 2) * 5
      )
    )


  const total =
    Math.min(
      100,
      Math.round(
        connectionRisk +
        assetCriticality +
        exposure +
        pathComplexity
      )
    )


  return {
    connectionRisk,
    assetCriticality,
    exposure,
    pathComplexity,
    total,
  }
}


/*
  Discover all attack paths.
*/

function findPaths(
  connections,
  nodes
) {
  const paths = []


  function walk(
    currentNode,
    path,
    visited
  ) {
    const outgoing =
      connections.filter(
        (connection) =>
          connection.source === currentNode &&
          connection.allowed === true
      )


    for (const connection of outgoing) {

      if (
        visited.has(connection.target)
      ) {
        continue
      }


      const nextPath = [
        ...path,
        connection.target,
      ]


      const targetNode =
        getNode(
          nodes,
          connection.target
        )


      if (
        targetNode?.criticality ===
        'Critical'
      ) {

        const factors =
          calculateRiskFactors(
            nextPath,
            connections,
            nodes
          )


        paths.push({
          nodes: nextPath,
          risk: factors.total,
          factors,
        })


        continue
      }


      const nextVisited =
        new Set(visited)


      nextVisited.add(
        connection.target
      )


      walk(
        connection.target,
        nextPath,
        nextVisited
      )
    }
  }


  for (const node of nodes) {

    if (
      node.type === 'External'
    ) {

      walk(
        node.id,
        [node.id],
        new Set([node.id])
      )

    }
  }


  return paths
}


/*
  Main network analysis.
*/

export function analyzeNetwork(
  connections = networkConnections
) {

  const paths =
    findPaths(
      connections,
      networkNodes
    )


  /*
    Highest individual path risk.
  */

  const highestPathRisk =
    paths.length > 0
      ? Math.max(
          ...paths.map(
            (path) => path.risk
          )
        )
      : 0


  /*
    Attack surface pressure.

    More remaining attack paths =
    higher overall cyber risk.

    Maximum contribution: 20 points.
  */

  const attackSurfacePressure =
    Math.min(
      20,
      paths.length * 4
    )


  /*
    Base risk.

    We combine the strongest attack
    path with remaining attack
    surface pressure.

    This makes the score react
    clearly when paths are removed.
  */

  const highestRisk =
    paths.length > 0
      ? Math.min(
          100,
          Math.max(
            0,
            highestPathRisk +
              attackSurfacePressure
          )
        )
      : 0


  const highestRiskPath =
    paths.length > 0
      ? [...paths].sort(
          (a, b) =>
            b.risk -
            a.risk
        )[0]
      : null


  return {

    totalAttackPaths:
      paths.length,

    highestRisk,

    highestPathRisk,

    highestRiskPath,

    paths,

    criticalAssets:
      networkNodes.filter(
        (node) =>
          node.criticality ===
          'Critical'
      ),

    riskFactors:
      highestRiskPath?.factors || {
        connectionRisk: 0,
        assetCriticality: 0,
        exposure: 0,
        pathComplexity: 0,
        total: 0,
      },

  }
}


/*
  Generate security-fix candidates.
*/

export function generateFixCandidates() {

  const analysis =
    analyzeNetwork(
      networkConnections
    )


  const attackPaths =
    analysis.paths


  return networkConnections

    .filter(
      (connection) =>
        connection.allowed === true
    )

    .map(
      (
        connection,
        index
      ) => {

        const affectedPaths =
          attackPaths.filter(
            (path) => {

              for (
                let i = 0;
                i <
                path.nodes.length - 1;
                i++
              ) {

                if (
                  path.nodes[i] ===
                    connection.source &&
                  path.nodes[i + 1] ===
                    connection.target
                ) {
                  return true
                }

              }

              return false
            }
          )


        const pathImportance =
          affectedPaths.length > 0
            ? Math.max(
                ...affectedPaths.map(
                  (path) =>
                    path.risk
                )
              )
            : 0


        const isAttackPathConnection =
          affectedPaths.length > 0


        const serviceImpact =
          connection.risk >= 80
            ? 'HIGH'
            : connection.risk >= 50
              ? 'MEDIUM'
              : 'LOW'


        return {

          id: index,

          title:
            `Restrict ${getNode(
              networkNodes,
              connection.source
            )?.name} → ${getNode(
              networkNodes,
              connection.target
            )?.name}`,

          source:
            connection.source,

          target:
            connection.target,

          riskReduction:
            Number(
              connection.risk || 0
            ),

          serviceImpact,

          isAttackPathConnection,

          affectedPaths:
            affectedPaths.length,

          pathImportance,

        }

      }
    )

    .sort(
      (a, b) => {

        if (
          a.isAttackPathConnection !==
          b.isAttackPathConnection
        ) {
          return a.isAttackPathConnection
            ? -1
            : 1
        }


        if (
          a.pathImportance !==
          b.pathImportance
        ) {
          return (
            b.pathImportance -
            a.pathImportance
          )
        }


        return (
          b.riskReduction -
          a.riskReduction
        )
      }
    )
}


/*
  Select recommended security control.
*/

export function getRecommendedFix() {

  const candidates =
    generateFixCandidates()


  if (
    candidates.length === 0
  ) {
    return null
  }


  const attackPathCandidates =
    candidates.filter(
      (candidate) =>
        candidate.isAttackPathConnection
    )


  if (
    attackPathCandidates.length > 0
  ) {

    return attackPathCandidates[0]

  }


  return candidates[0]
}


/*
  Simulate a security control.
*/

export function simulateFix(
  connectionIndex
) {

  const before =
    analyzeNetwork(
      networkConnections
    )


  if (
    connectionIndex < 0 ||
    connectionIndex >=
      networkConnections.length
  ) {

    return {

      success: false,

      before,

      after: before,

      riskReduction: 0,

      pathReduction: 0,

      blocked: false,

      message:
        'Connection not found.',

    }

  }


  /*
    Create virtual network.
  */

  const simulatedConnections =
    networkConnections.map(
      (
        connection,
        index
      ) =>
        index === connectionIndex
          ? {
              ...connection,
              allowed: false,
            }
          : connection
    )


  /*
    Analyze virtual network.
  */

  const after =
    analyzeNetwork(
      simulatedConnections
    )


  /*
    Calculate actual improvement.
  */

  const riskReduction =
    Math.max(
      0,
      before.highestRisk -
        after.highestRisk
    )


  const pathReduction =
    Math.max(
      0,
      before.totalAttackPaths -
        after.totalAttackPaths
    )


  const blocked =
    before.totalAttackPaths >
    after.totalAttackPaths


  let message


  if (
    after.totalAttackPaths === 0
  ) {

    message =
      'All detected critical attack paths were removed in the simulation.'

  } else if (
    riskReduction > 0 &&
    pathReduction > 0
  ) {

    message =
      'The selected security control reduced cyber risk and removed attack paths from the attack surface.'

  } else if (
    pathReduction > 0
  ) {

    message =
      'The selected security control blocked attack paths, but another high-risk path remains.'

  } else if (
    riskReduction > 0
  ) {

    message =
      'The selected security control reduced the calculated cyber risk.'

  } else {

    message =
      'The selected control did not reduce the highest calculated risk. CyberTwin recommends evaluating another control.'

  }


  return {

    success: true,

    before,

    after,

    riskReduction,

    pathReduction,

    blocked,

    message,

  }
}