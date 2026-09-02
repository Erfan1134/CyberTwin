# CyberTwin

CyberTwin is a cybersecurity network risk analysis platform designed to visualize network attack paths, identify critical assets, calculate cyber risk, and simulate security controls.

## 🚀 Live Demo

[Open CyberTwin](https://cyber-twin-fv1x-chi.vercel.app)

## 🎯 What is CyberTwin?

CyberTwin creates a digital representation of a network and analyzes potential attack paths from external assets to critical systems.

It helps security teams understand:

- Network attack paths
- Critical assets
- Cyber risk level
- High-risk connections
- Security control recommendations
- Risk reduction after applying a security control

## 🔍 Key Features

### Network Twin
Visualizes the network architecture and connected assets.

### Attack Path Analysis
Identifies possible paths from external assets to critical assets.

### Risk Assessment
Calculates a risk score based on:

- Connection risk
- Asset criticality
- External exposure
- Path complexity

### Security Control Simulation
Allows users to simulate restricting a network connection and measure the effect on:

- Cyber risk
- Attack paths
- Attack surface

### Explainable Security Analysis
Provides an explanation of why a connection is considered a security risk and why a control is recommended.

## 🧠 Risk Engine

CyberTwin calculates risk using four main factors:

1. Connection Risk
2. Asset Criticality
3. External Exposure
4. Path Complexity

The final risk score is calculated on a scale from 0 to 100.

## 🛠️ Technologies

- React
- JavaScript
- Vite
- HTML
- CSS
- GitHub
- Vercel

## 📊 Example

A security control can be simulated by restricting a high-risk connection such as:

`Application Server → Production Database`

CyberTwin then recalculates the network and compares the result before and after the control.

Example:

`Risk: 80 → 79`

`Attack Paths: 5 → 3`

## 💡 Purpose

CyberTwin is designed as a security analysis and decision-support tool that helps organizations understand their network attack surface and evaluate potential security controls before applying them to a real environment.

## 👨‍💻 Project

CyberTwin

Cybersecurity Network Risk Analysis & Simulation Platform
