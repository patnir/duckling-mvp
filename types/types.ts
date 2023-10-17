
export interface Project {
  id?: string;
  name?: string;
  homeownerName?: string;
  homeownerPhone?: string;
  homeownerEmail?: string;
  homeownerAddress?: string;
  createdAt?: string;
  data?: ProjectData;
}

export interface ProjectData {
  squareFootage?: number,
  roomCount?: number,
  bathroomCount?: number,
  stories?: number,
  yearBuilt?: number,
  basementType?: string,
  comfortIssueTags?: string[],
  comfortIssueNotes?: string,
  healthSafetyIssueTags?: string[],
  healthSafetyIssueNotes?: string,
  homeownerGoalsTags?: string[],
  homeownerGoalsNotes?: string,
  [key: string]: number | string | string[] | undefined;
}

// TODO: Remove this?
export interface NewProject {
  id?: string,
  name: string;
  homeownerName: string;
  homeownerPhone: string;
  homeownerEmail: string;
  homeownerAddress: string;
}

export interface ProjectRoom {
  "id": string,
  "name"?: string,
  "type"?: string,
  "width"?: number,
  "length"?: number,
  "ceilingHeight"?: number,
  "floor"?: string,
  "usage"?: string,
  "comfortIssueTags"?: string[],
  "safetyIssueTags"?: string[],
  "notes"?: string,
  "projectId"?: string,
  "createdAt"?: string,
  "updatedAt"?: string,
}
export interface Organization {
  name: string;
}