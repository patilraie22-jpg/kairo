
export type EducationLevel = 'High School' | 'Undergraduate' | 'Graduate' | 'Post-Graduate' | 'Professional';

export interface UserProfile {
  name: string;
  educationLevel: EducationLevel;
  major: string;
  currentStage: string;
  interests: string[];
  futureGoal: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface CareerOpportunity {
  id: string;
  title: string;
  organization: string;
  type: 'Internship' | 'Job' | 'Fellowship' | 'Program';
  deadline: string;
  eligibility: string;
  description: string;
  matchReason: string;
  officialUrl: string;
  sources?: GroundingSource[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  type: 'Course' | 'Skill' | 'Project' | 'Certification';
  provider?: string;
  duration?: string;
  reason: string;
  sources?: GroundingSource[];
}

export interface AppState {
  user: UserProfile | null;
  opportunities: CareerOpportunity[];
  roadmap: RoadmapStep[];
  isLoading: boolean;
  isRoadmapLoading: boolean;
  applications: string[]; // List of opportunity IDs
}
