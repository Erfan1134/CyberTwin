import { useMemo, useState } from 'react'
import './App.css'

import {
  analyzeNetwork,
  getRecommendedFix,
  simulateFix,
} from './cyberTwinEngine'

import {
  explainRisk,
  explainSimulation,
} from './securityExplanation'

import {
  networkNodes,
  networkConnections,
} from './networkData'


function App() {
  const [page, setPage] = useState('dashboard')
  const [simulationResult, setSimulationResult] =
    useState(null)

  const analysis = useMemo(
    () => analyzeNetwork(),
    []
  )

  const recommendedFix = useMemo(
    () => getRecommendedFix(),
    []
  )

  const simulated = simulationResult !== null

  const risk = simulated
    ? simulationResult.after.highestRisk
    : analysis.highestRisk

  const riskExplanation =
    explainRisk(
      simulated
        ? simulationResult.after
        : analysis
    )

  const simulationExplanation =
    simulationResult
      ? explainSimulation(
          simulationResult.before,
          simulationResult.after,
          recommendedFix
        )
      : null


  const runSimulation = () => {
    if (!recommendedFix) return

    const index =
      networkConnections.findIndex(
        (connection) =>
          connection.source ===
            recommendedFix.source &&
          connection.target ===
            recommendedFix.target
      )

    if (index === -1) {
      console.error(
        'Recommended connection was not found.'
      )
      return
    }

    const result = simulateFix(index)

    if (result.success) {
      setSimulationResult(result)
    }
  }


  const resetSimulation = () => {
    setSimulationResult(null)
  }


  return (
    <div className="app">

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            C
          </div>

          <div>
            <strong>
              CyberTwin
            </strong>

            <span>
              AI SECURITY
            </span>
          </div>

        </div>


        <nav>

          <button
            className={
              page === 'dashboard'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setPage('dashboard')
            }
          >
            Dashboard
          </button>


          <button
            className={
              page === 'network'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setPage('network')
            }
          >
            Network Twin
          </button>


          <button
            className={
              page === 'attacks'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setPage('attacks')
            }
          >
            Attack Paths
          </button>


          <button
            className={
              page === 'simulations'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setPage('simulations')
            }
          >
            Simulations
          </button>


          <button
            className={
              page === 'reports'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() =>
              setPage('reports')
            }
          >
            Reports
          </button>

        </nav>


        <div className="sidebar-bottom">

          <div className="system-status">

            <span className="status-dot"></span>

            Simulation Engine Online

          </div>

          <small>
            CyberTwin AI v0.4
          </small>

        </div>

      </aside>


      <main className="main">

        <header className="topbar">

          <div>

            <p className="eyebrow">
              CYBERTWIN AI
            </p>

            <h1>
              {
                page === 'dashboard'
                  ? 'Cyber Risk Overview'
                  : page === 'network'
                    ? 'Network Digital Twin'
                    : page === 'attacks'
                      ? 'Attack Path Analysis'
                      : page === 'simulations'
                        ? 'Security Simulations'
                        : 'Executive Security Report'
              }
            </h1>

          </div>


          <div className="header-actions">

            <span className="environment">

              <span className="status-dot"></span>

              Lab Environment

            </span>

            <button className="profile">
              C
            </button>

          </div>

        </header>


        {page === 'dashboard' && (

          <Dashboard
            analysis={analysis}
            risk={risk}
            simulated={simulated}
            recommendedFix={recommendedFix}
            simulationResult={simulationResult}
            riskExplanation={riskExplanation}
            simulationExplanation={
              simulationExplanation
            }
            runSimulation={runSimulation}
            resetSimulation={resetSimulation}
          />

        )}


        {page === 'network' && (
          <NetworkTwin />
        )}


        {page === 'attacks' && (

          <AttackPaths
            analysis={
              simulated
                ? simulationResult.after
                : analysis
            }
            risk={risk}
            simulated={simulated}
          />

        )}


        {page === 'simulations' && (

          <Simulations
            analysis={analysis}
            risk={risk}
            simulated={simulated}
            recommendedFix={recommendedFix}
            simulationResult={simulationResult}
            runSimulation={runSimulation}
            resetSimulation={resetSimulation}
          />

        )}


        {page === 'reports' && (

          <Reports
            analysis={analysis}
            risk={risk}
            simulated={simulated}
            recommendedFix={recommendedFix}
            simulationResult={simulationResult}
          />

        )}

      </main>

    </div>
  )
}


/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard({
  analysis,
  risk,
  simulated,
  recommendedFix,
  simulationResult,
  riskExplanation,
  simulationExplanation,
  runSimulation,
  resetSimulation,
}) {

  const factors =
    simulated
      ? simulationResult.after.riskFactors
      : analysis.riskFactors


  return (
    <>

      <section className="stats">

        <Stat
          title="Cyber Risk Score"
          value={risk}
          subtitle={
            simulated
              ? 'AFTER SIMULATION'
              : 'CURRENT RISK'
          }
          danger={risk >= 50}
        />

        <Stat
          title="Attack Paths"
          value={
            simulated
              ? simulationResult.after
                  .totalAttackPaths
              : analysis.totalAttackPaths
          }
          subtitle={
            simulated
              ? 'REMAINING'
              : 'DETECTED'
          }
        />

        <Stat
          title="Critical Assets"
          value={
            analysis.criticalAssets.length
          }
          subtitle="MONITORED"
        />

        <Stat
          title="Network Assets"
          value={
            networkNodes.length
          }
          subtitle="DISCOVERED"
        />

      </section>


      <section className="grid">

        <div className="panel">

          <div className="panel-header">

            <div>

              <p className="eyebrow">
                DIGITAL TWIN
              </p>

              <h2>
                Network Attack Surface
              </h2>

            </div>

            <span className="live-badge">
              {simulated
                ? 'SIMULATION COMPLETE'
                : 'ENGINE ANALYSIS'}
            </span>

          </div>


          <NetworkMap
            simulated={simulated}
          />

        </div>


        <div className="panel risk-panel">

          <div className="panel-header">

            <div>

              <p className="eyebrow">
                THREAT ANALYSIS
              </p>

              <h2>
                Risk Assessment
              </h2>

            </div>

          </div>


          <div
            className="risk-ring"
            style={{
              background:
                `conic-gradient(
                  ${
                    risk >= 50
                      ? '#ff5c6e'
                      : '#43d99a'
                  }
                  ${risk * 3.6}deg,
                  #1b2837
                  ${risk * 3.6}deg 360deg
                )`,
            }}
          >

            <div>

              <strong>
                {risk}
              </strong>

              <span>
                /100
              </span>

            </div>

          </div>


          <div className="risk-description">

            <strong>

              {risk >= 80
                ? 'Critical Security Risk'
                : risk >= 50
                  ? 'High Security Risk'
                  : 'Low Security Risk'}

            </strong>

            <p>

              {simulated
                ? simulationResult.message
                : `CyberTwin detected ${analysis.totalAttackPaths} potential attack path(s) reaching critical assets.`}

            </p>

          </div>


          <div className="severity">

            <span className="severity-label">
              Risk Level
            </span>

            <span
              className={
                risk >= 50
                  ? 'danger-pill'
                  : 'safe-pill'
              }
            >

              {risk >= 80
                ? 'CRITICAL'
                : risk >= 50
                  ? 'HIGH'
                  : 'LOW'}

            </span>

          </div>

        </div>

      </section>


      <section className="panel risk-breakdown">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              EXPLAINABLE SECURITY AI
            </p>

            <h2>
              Risk Breakdown
            </h2>

          </div>

          <span className="live-badge">
            EXPLAINABLE MODEL
          </span>

        </div>


        <div className="breakdown-grid">

          <RiskFactor
            title="Connection Risk"
            value={factors.connectionRisk}
            max={35}
            description="Network connection exposure."
          />

          <RiskFactor
            title="Asset Criticality"
            value={factors.assetCriticality}
            max={30}
            description="Impact of reaching critical assets."
          />

          <RiskFactor
            title="External Exposure"
            value={factors.exposure}
            max={20}
            description="Exposure originating from outside."
          />

          <RiskFactor
            title="Path Complexity"
            value={factors.pathComplexity}
            max={15}
            description="Risk caused by lateral movement."
          />

        </div>


        <div className="risk-formula">

          <span>
            Risk Score
          </span>

          <strong>

            {factors.connectionRisk}
            {' + '}
            {factors.assetCriticality}
            {' + '}
            {factors.exposure}
            {' + '}
            {factors.pathComplexity}
            {' = '}
            {risk}

          </strong>

        </div>

      </section>


      <section className="panel ai-explanation">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              SECURITY INTELLIGENCE
            </p>

            <h2>
              Why is this risk happening?
            </h2>

          </div>

          <span
            className={
              risk >= 50
                ? 'danger-pill'
                : 'safe-pill'
            }
          >
            {riskExplanation.level}
          </span>

        </div>


        <div className="ai-explanation-grid">

          <div>

            <span>
              WHY
            </span>

            <strong>
              {riskExplanation.title}
            </strong>

            <p>
              {riskExplanation.explanation}
            </p>

          </div>


          <div>

            <span>
              ATTACK PATH
            </span>

            <strong>
              {riskExplanation.path ||
                'No active path'}
            </strong>

            <p>
              {riskExplanation.impact}
            </p>

          </div>


          <div>

            <span>
              RECOMMENDED ACTION
            </span>

            <strong>
              {riskExplanation.recommendation}
            </strong>

            <p>
              CyberTwin can simulate
              the control before
              deployment.
            </p>

          </div>

        </div>


        {simulationExplanation && (

          <div className="simulation-explanation">

            <div>

              <span>
                SIMULATION
              </span>

              <strong>
                {simulationExplanation.status}
              </strong>

            </div>


            <div>

              <span>
                RISK
              </span>

              <strong>
                {simulationExplanation.beforeRisk}
                {' → '}
                {simulationExplanation.afterRisk}
              </strong>

            </div>


            <div>

              <span>
                ATTACK PATHS
              </span>

              <strong>
                {simulationExplanation.beforePaths}
                {' → '}
                {simulationExplanation.afterPaths}
              </strong>

            </div>


            <p>
              {simulationExplanation.explanation}
            </p>

          </div>

        )}

      </section>


      <section className="panel">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              ENGINE RECOMMENDATION
            </p>

            <h2>
              Recommended Security Control
            </h2>

          </div>

          <span className="recommendation">
            AUTOMATED
          </span>

        </div>


        {recommendedFix ? (

          <>

            <div className="fix-content">

              <div className="fix-icon">
                ✓
              </div>

              <div>

                <h3>
                  {recommendedFix.title}
                </h3>

                <p>
                  CyberTwin identified this
                  connection as a relevant
                  security control for the
                  detected attack surface.
                </p>


                <div className="fix-details">

                  <div>

                    <span>
                      Connection Risk
                    </span>

                    <strong>
                      {recommendedFix.riskReduction}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Attack Paths Affected
                    </span>

                    <strong>
                      {recommendedFix.affectedPaths ??
                        '—'}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Service Impact
                    </span>

                    <strong className="safe-text">
                      {recommendedFix.serviceImpact}
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            <button
              className={`simulate-button ${
                simulated
                  ? 'completed'
                  : ''
              }`}
              onClick={
                simulated
                  ? resetSimulation
                  : runSimulation
              }
            >

              {simulated
                ? '↻ Reset Simulation'
                : '▶️ Simulate Safe Fix'}

            </button>

          </>

        ) : (

          <p>
            No recommended fix is currently available.
          </p>

        )}

      </section>

    </>
  )
}


/* =====================================================
   NETWORK MAP
===================================================== */

function NetworkMap({
  simulated = false,
}) {

  const positions = {

    internet: {
      x: 7,
      y: 50,
    },

    firewall: {
      x: 22,
      y: 50,
    },

    'web-server': {
      x: 38,
      y: 25,
    },

    'app-server': {
      x: 55,
      y: 50,
    },

    'hr-pc-07': {
      x: 38,
      y: 75,
    },

    'domain-controller': {
      x: 70,
      y: 25,
    },

    database: {
      x: 88,
      y: 50,
    },

    'backup-server': {
      x: 88,
      y: 78,
    },

    siem: {
      x: 70,
      y: 78,
    },

  }


  return (

    <div className="network-map">

      <div className="grid-lines"></div>


      <svg className="connections">

        {networkConnections.map(
          (
            connection,
            index
          ) => {

            const start =
              positions[
                connection.source
              ]

            const end =
              positions[
                connection.target
              ]

            if (
              !start ||
              !end
            ) {
              return null
            }


            const isDatabasePath =
              connection.target ===
              'database'


            return (

              <line
                key={index}

                className={
                  isDatabasePath
                    ? simulated
                      ? 'blocked'
                      : 'danger-line'
                    : ''
                }

                x1={`${start.x}%`}
                y1={`${start.y}%`}
                x2={`${end.x}%`}
                y2={`${end.y}%`}
              />

            )

          }
        )}

      </svg>


      {networkNodes.map(
        (node) => {

          const position =
            positions[node.id]

          if (!position)
            return null


          return (

            <div
              key={node.id}

              className={`network-node ${
                node.criticality ===
                  'Critical'
                  ? 'critical'
                  : ''
              }`}

              style={{
                left:
                  `${position.x}%`,
                top:
                  `${position.y}%`,
              }}
            >

              <div className="node-icon">

                {node.type ===
                'External'
                  ? '◎'
                  : node.type ===
                      'Security'
                    ? '◇'
                    : node.type ===
                        'Critical Asset'
                      ? '▣'
                      : node.type ===
                          'Identity'
                        ? '◈'
                        : node.type ===
                            'Monitoring'
                          ? '◉'
                          : '□'}

              </div>


              <strong>
                {node.name}
              </strong>

              <span>
                {node.type}
              </span>

            </div>

          )

        }
      )}


      {!simulated && (

        <div className="attack-label">

          <span>
            ⚠
          </span>

          Critical Attack Surface

        </div>

      )}

    </div>
  )
}


/* =====================================================
   NETWORK TWIN
===================================================== */

function NetworkTwin() {

  return (

    <>

      <section className="stats">

        <Stat
          title="Network Assets"
          value={networkNodes.length}
          subtitle="DISCOVERED"
        />

        <Stat
          title="Connections"
          value={networkConnections.length}
          subtitle="MONITORED"
        />

        <Stat
          title="Critical Assets"
          value={
            networkNodes.filter(
              (node) =>
                node.criticality ===
                'Critical'
            ).length
          }
          subtitle="HIGH VALUE"
        />

        <Stat
          title="Twin Status"
          value="ACTIVE"
          subtitle="DIGITAL MODEL"
        />

      </section>


      <section className="panel">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              NETWORK DIGITAL TWIN
            </p>

            <h2>
              Virtual Network Model
            </h2>

          </div>

          <span className="live-badge">
            MODEL ACTIVE
          </span>

        </div>


        <NetworkMap />

      </section>


      <section className="panel">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              ASSET INVENTORY
            </p>

            <h2>
              Network Assets
            </h2>

          </div>

        </div>


        {networkNodes.map(
          (node) => (

            <div
              className="table-row"
              key={node.id}
            >

              <strong>
                {node.name}
              </strong>

              <span>
                {node.type}
              </span>

              <span>
                {node.criticality}
              </span>

            </div>

          )
        )}

      </section>

    </>

  )
}


/* =====================================================
   ATTACK PATHS
===================================================== */

function AttackPaths({
  analysis,
  risk,
  simulated,
}) {

  const paths =
    analysis.paths


  return (

    <>

      <section className="stats">

        <Stat
          title="Detected Paths"
          value={paths.length}
          subtitle="ATTACK GRAPH"
        />

        <Stat
          title="Highest Risk"
          value={risk}
          subtitle={
            simulated
              ? 'AFTER SIMULATION'
              : 'CURRENT'
          }
          danger={risk >= 50}
        />

      </section>


      <section className="panel">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              THREAT INTELLIGENCE
            </p>

            <h2>
              Attack Paths
            </h2>

          </div>

          <span
            className={
              paths.length > 0
                ? 'danger-pill'
                : 'safe-pill'
            }
          >
            {paths.length > 0
              ? 'DETECTED'
              : 'MITIGATED'}
          </span>

        </div>


        {paths.length === 0 ? (

          <div className="analysis-box">

            <strong>
              No critical attack paths detected.
            </strong>

          </div>

        ) : (

          paths.map(
            (
              path,
              index
            ) => (

              <div
                className="attack-path-card"
                key={index}
              >

                <div>

                  {path.nodes.map(
                    (
                      nodeId,
                      nodeIndex
                    ) => (

                      <span
                        key={nodeId}
                      >

                        {
                          networkNodes.find(
                            (node) =>
                              node.id ===
                              nodeId
                          )?.name
                        }

                        {nodeIndex <
                          path.nodes.length -
                            1 &&
                          ' → '}

                      </span>

                    )
                  )}

                </div>


                <strong>
                  Risk {path.risk}
                </strong>

              </div>

            )
          )

        )}

      </section>

    </>

  )
}


/* =====================================================
   SIMULATIONS
===================================================== */

function Simulations({
  analysis,
  risk,
  simulated,
  recommendedFix,
  simulationResult,
  runSimulation,
  resetSimulation,
}) {

  return (

    <>

      <section className="panel">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              WHAT-IF ANALYSIS
            </p>

            <h2>
              Safe Fix Simulation
            </h2>

          </div>

          <span className="recommendation">
            CONTROLLED LAB
          </span>

        </div>


        <div className="simulation-flow">

          <div>

            <span>
              BEFORE
            </span>

            <strong>
              Risk {analysis.highestRisk}
            </strong>

          </div>


          <div className="flow-arrow">
            →
          </div>


          <div>

            <span>
              RECOMMENDED CONTROL
            </span>

            <strong>
              {recommendedFix?.title ||
                'No recommendation'}
            </strong>

          </div>


          <div className="flow-arrow">
            →
          </div>


          <div>

            <span>
              AFTER
            </span>

            <strong className="safe-text">

              {simulated
                ? `Risk ${risk}`
                : '—'}

            </strong>

          </div>

        </div>


        {recommendedFix && (

          <div className="analysis-box">

            <strong>
              Recommended Security Control
            </strong>

            <p>
              {recommendedFix.title}
            </p>

            <p>
              Connection Risk:{' '}
              {recommendedFix.riskReduction}
            </p>

            <p>
              Affected Attack Paths:{' '}
              {recommendedFix.affectedPaths ??
                '—'}
            </p>

          </div>

        )}


        {simulationResult && (

          <div className="analysis-box">

            <strong>
              Simulation Result
            </strong>

            <p>
              {simulationResult.message}
            </p>

            <p>
              Risk:{' '}
              {simulationResult.before.highestRisk}
              {' → '}
              {simulationResult.after.highestRisk}
            </p>

            <p>
              Risk reduction:{' '}
              {simulationResult.riskReduction}
              {' points'}
            </p>

            <p>
              Attack paths:{' '}
              {simulationResult.before.totalAttackPaths}
              {' → '}
              {simulationResult.after.totalAttackPaths}
            </p>

          </div>

        )}


        <button
          className={`simulate-button ${
            simulated
              ? 'completed'
              : ''
          }`}
          onClick={
            simulated
              ? resetSimulation
              : runSimulation
          }
        >

          {simulated
            ? '↻ Reset Simulation'
            : '▶️ Run Safe Fix Simulation'}

        </button>

      </section>


      <section className="panel">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              SECURITY IMPACT
            </p>

            <h2>
              Simulation Outcome
            </h2>

          </div>

        </div>


        <div className="impact-grid">

          <div>

            <span>
              Risk Reduction
            </span>

            <strong className="safe-text">

              {simulationResult
                ? `${simulationResult.riskReduction} pts`
                : 'Ready'}

            </strong>

          </div>


          <div>

            <span>
              Service Impact
            </span>

            <strong className="safe-text">

              {recommendedFix?.serviceImpact ||
                '—'}

            </strong>

          </div>


          <div>

            <span>
              Remaining Paths
            </span>

            <strong>

              {simulationResult
                ? simulationResult.after
                    .totalAttackPaths
                : analysis.totalAttackPaths}

            </strong>

          </div>

        </div>

      </section>

    </>

  )
}


/* =====================================================
   REPORTS
===================================================== */

function Reports({
  analysis,
  risk,
  simulated,
  recommendedFix,
  simulationResult,
}) {

  return (

    <>

      <section className="stats">

        <Stat
          title="Risk Score"
          value={risk}
          subtitle={
            simulated
              ? 'AFTER SIMULATION'
              : 'CURRENT'
          }
          danger={risk >= 50}
        />

        <Stat
          title="Attack Paths"
          value={
            simulationResult
              ? simulationResult.after
                  .totalAttackPaths
              : analysis.totalAttackPaths
          }
          subtitle="REMAINING"
        />

      </section>


      <section className="panel report-card">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              EXECUTIVE REPORT
            </p>

            <h2>
              Cyber Risk Assessment
            </h2>

          </div>

          <span className="live-badge">
            MANAGEMENT VIEW
          </span>

        </div>


        <div className="report-section">

          <span>
            01 — FINDING
          </span>

          <h3>
            {
              analysis.totalAttackPaths > 0
                ? 'Critical attack path detected'
                : 'No critical attack path detected'
            }
          </h3>

          <p>
            CyberTwin analyzed the
            modeled network and
            identified potential
            attack paths toward
            critical assets.
          </p>

        </div>


        <div className="report-section">

          <span>
            02 — RISK
          </span>

          <h3>
            Risk Score: {risk}/100
          </h3>

          <p>
            The risk score is
            calculated using
            connection exposure,
            asset criticality,
            external exposure,
            and path complexity.
          </p>

        </div>


        <div className="report-section">

          <span>
            03 — RECOMMENDATION
          </span>

          <h3>
            {
              recommendedFix?.title ||
              'No recommendation available'
            }
          </h3>

          <p>
            CyberTwin recommends
            validating the security
            control through simulation
            before applying it to the
            production environment.
          </p>

        </div>


        <div className="report-section">

          <span>
            04 — SIMULATED OUTCOME
          </span>

          <h3
            className={
              simulated
                ? 'safe-text'
                : ''
            }
          >

            {simulated
              ? `Risk reduced from ${simulationResult.before.highestRisk} to ${simulationResult.after.highestRisk}`
              : 'Simulation not executed'}

          </h3>

          <p>

            {simulated
              ? simulationResult.message
              : 'Run the Safe Fix Simulation to generate a projected security outcome.'}

          </p>

        </div>

      </section>

    </>

  )
}


/* =====================================================
   SMALL COMPONENTS
===================================================== */

function Stat({
  title,
  value,
  subtitle,
  danger = false,
}) {

  return (

    <div className="stat-card">

      <span>
        {title}
      </span>

      <strong
        className={
          danger
            ? 'danger'
            : ''
        }
      >
        {value}
      </strong>

      <small>
        {subtitle}
      </small>

    </div>

  )
}


function RiskFactor({
  title,
  value,
  max,
  description,
}) {

  const percentage =
    max > 0
      ? Math.min(
          100,
          Math.round(
            (value / max) *
              100
          )
        )
      : 0


  return (

    <div className="risk-factor">

      <div className="risk-factor-top">

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>


      <div className="risk-bar">

        <div
          style={{
            width:
              `${percentage}%`,
          }}
        />

      </div>


      <p>
        {description}
      </p>

    </div>

  )
}


export default App