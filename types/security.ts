export interface SecurityAlert {
  id: string;
  timestamp: string;
  user: string;
  event: string;
  severity: 'Low' | 'Medium' | 'High';
  action: string; // Recommended action
  confidence: number; // 0-100
  rationale: string;
}

export interface SecurityEvent {
  timestamp: string; // ISO string
  user: string; // e.g., U123
  event: 'login';
  ip: string; // IPv4
  status: 'success' | 'fail';
}

export interface AnomalyAlert {
  id: string;
  timestamp: string; // ISO string
  user: string;
  ip: string;
  attempts: number; // failed attempts in last minute
}

// AgentDecision mirrors SecurityAlert for the live alerts table
export type AgentDecision = SecurityAlert;
