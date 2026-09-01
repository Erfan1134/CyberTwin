export const networkNodes = [
  {
    id: "internet",
    name: "Internet",
    type: "External",
    criticality: "Low",
  },

  {
    id: "firewall",
    name: "Edge Firewall",
    type: "Security",
    criticality: "High",
  },

  {
    id: "web-server",
    name: "Web Server",
    type: "Server",
    criticality: "High",
  },

  {
    id: "app-server",
    name: "Application Server",
    type: "Server",
    criticality: "High",
  },

  {
    id: "hr-pc-07",
    name: "HR-PC-07",
    type: "Endpoint",
    criticality: "Medium",
  },

  {
    id: "domain-controller",
    name: "Domain Controller",
    type: "Identity",
    criticality: "Critical",
  },

  {
    id: "database",
    name: "Production Database",
    type: "Critical Asset",
    criticality: "Critical",
  },

  {
    id: "backup-server",
    name: "Backup Server",
    type: "Storage",
    criticality: "High",
  },

  {
    id: "siem",
    name: "Security Monitoring",
    type: "Monitoring",
    criticality: "High",
  },
]


export const networkConnections = [

  /*
    External Exposure
  */

  {
    source: "internet",
    target: "firewall",
    allowed: true,
    risk: 10,
  },

  {
    source: "firewall",
    target: "web-server",
    allowed: true,
    risk: 25,
  },


  /*
    Application Layer
  */

  {
    source: "web-server",
    target: "app-server",
    allowed: true,
    risk: 35,
  },

  {
    source: "app-server",
    target: "database",
    allowed: true,
    risk: 80,
  },


  /*
    Endpoint / Lateral Movement
  */

  {
    source: "firewall",
    target: "hr-pc-07",
    allowed: true,
    risk: 30,
  },

  {
    source: "hr-pc-07",
    target: "app-server",
    allowed: true,
    risk: 55,
  },


  /*
    Identity Infrastructure
  */

  {
    source: "hr-pc-07",
    target: "domain-controller",
    allowed: true,
    risk: 75,
  },

  {
    source: "app-server",
    target: "domain-controller",
    allowed: true,
    risk: 60,
  },


  /*
    Critical Database Access
  */

  {
    source: "domain-controller",
    target: "database",
    allowed: true,
    risk: 85,
  },


  /*
    Backup Infrastructure
  */

  {
    source: "database",
    target: "backup-server",
    allowed: true,
    risk: 45,
  },


  /*
    Security Monitoring
  */

  {
    source: "firewall",
    target: "siem",
    allowed: true,
    risk: 10,
  },

  {
    source: "app-server",
    target: "siem",
    allowed: true,
    risk: 15,
  },

]