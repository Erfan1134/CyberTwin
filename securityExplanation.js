import { networkNodes } from './networkData'

function getNodeName(id) {
  return (
    networkNodes.find((node) => node.id === id)?.name ||
    id
  )
}

function getNodeType(id) {
  return (
    networkNodes.find((node) => node.id === id)?.type ||
    'Unknown'
  )
}

export function explainAttackPath(path) {
  if (!path || !path.nodes || path.nodes.length < 2) {
    return {
      title: 'No attack path available',
      why: 'The engine did not detect a valid path to a critical asset.',
      impact: 'No critical exposure was identified.',
      recommendation: 'Continue monitoring the network.',
    }
  }

  const names = path.nodes.map(getNodeName)

  const firstNode = path.nodes[0]
  const lastNode = path.nodes[path.nodes.length - 1]

  const firstType = getNodeType(firstNode)
  const lastType = getNodeType(lastNode)

  return {
    title: 'Critical Attack Path Detected',

    why: `The attack path starts from ${getNodeName(
      firstNode
    )} (${firstType}) and reaches ${getNodeName(
      lastNode
    )} (${lastType}).`,

    path: names.join(' → '),

    impact: `An attacker could potentially move through ${path.length - 1} network connection(s) to reach a critical asset.`,

    recommendation: `Restrict or segment the highest-risk connection in this path and validate the change through a controlled simulation.`,

    risk: path.risk,
  }
}

export function explainRisk(analysis) {
  if (!analysis || analysis.totalAttackPaths === 0) {
    return {
      level: 'LOW',
      title: 'No critical attack paths detected',
      explanation:
        'The current network model does not contain an active path reaching a critical asset.',
    }
  }

  const highestRiskPath = [...analysis.paths].sort(
    (a, b) => b.risk - a.risk
  )[0]

  const explanation =
    explainAttackPath(highestRiskPath)

  return {
    level:
      analysis.highestRisk >= 80
        ? 'CRITICAL'
        : analysis.highestRisk >= 50
          ? 'HIGH'
          : 'MEDIUM',

    title: explanation.title,

    explanation: `The CyberTwin engine identified ${analysis.totalAttackPaths} attack path(s). The highest calculated risk is ${analysis.highestRisk}/100 because a path reaches a critical asset.`,

    path: explanation.path,

    impact: explanation.impact,

    recommendation:
      explanation.recommendation,
  }
}

export function explainSimulation(
  before,
  after,
  fix
) {
  const riskReduction =
    before.highestRisk - after.highestRisk

  const pathReduction =
    before.totalAttackPaths -
    after.totalAttackPaths

  return {
    beforeRisk: before.highestRisk,

    afterRisk: after.highestRisk,

    riskReduction: Math.max(
      0,
      riskReduction
    ),

    beforePaths:
      before.totalAttackPaths,

    afterPaths:
      after.totalAttackPaths,

    pathReduction: Math.max(
      0,
      pathReduction
    ),

    status:
      after.totalAttackPaths === 0
        ? 'MITIGATED'
        : 'REDUCED',

    explanation:
      after.totalAttackPaths === 0
        ? `The simulated fix successfully removed all detected paths to critical assets. Risk decreased from ${before.highestRisk} to ${after.highestRisk}.`
        : `The simulated fix reduced the attack surface. Risk decreased from ${before.highestRisk} to ${after.highestRisk}.`,

    fix: fix
      ? fix.title
      : 'Selected security control',
  }
}