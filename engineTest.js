import {
  analyzeNetwork,
  generateFixCandidates,
  getRecommendedFix,
} from './cyberTwinEngine'

const analysis = analyzeNetwork()
const fixes = generateFixCandidates()
const recommendedFix = getRecommendedFix()

console.log('=== CyberTwin Engine Test ===')
console.log('Attack Paths:', analysis.totalAttackPaths)
console.log('Highest Risk:', analysis.highestRisk)
console.log('Critical Assets:', analysis.criticalAssets.length)
console.log('Fix Candidates:', fixes.length)
console.log('Recommended Fix:', recommendedFix)