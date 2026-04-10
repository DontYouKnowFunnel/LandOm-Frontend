import { deleteRequest, getRequest, patchRequest, postRequest } from "./api";

export type CreateProjectPayload = {
  name: string;
  description: string;
};

export type ProjectData = {
  id: number;
  name: string;
  description: string;
  "api-key": string;
};

export type CreateProjectReturnType = {
  message: string;
  data: ProjectData;
};

export const createProject = async (
  data: CreateProjectPayload
): Promise<CreateProjectReturnType> => {
  const response = await postRequest<CreateProjectReturnType>(
    "/api/v1/projects",
    data
  );
  return response;
};

export type ProjectListItem = {
  id: number;
  name: string;
  description: string;
  apiKey: string;
};

export type GetProjectsReturnType = {
  projects: ProjectListItem[];
};

export const getProjects = async (): Promise<GetProjectsReturnType> => {
  const response = await getRequest<GetProjectsReturnType>("/api/v1/projects");
  return response;
};

export type GetProjectReturnType = {
  message: string;
  data: ProjectData;
};

export const getProject = async (id: number): Promise<GetProjectReturnType> => {
  const response = await getRequest<GetProjectReturnType>(
    `/api/v1/projects/${id}`
  );
  return response;
};

export type UpdateProjectPayload = {
  name: string;
  description: string;
};

export type UpdateProjectReturnType = {
  message: string;
  data: ProjectData;
};

export const updateProject = async (
  id: number,
  data: UpdateProjectPayload
): Promise<UpdateProjectReturnType> => {
  const response = await patchRequest<UpdateProjectReturnType>(
    `/api/v1/projects/${id}`,
    data
  );
  return response;
};

export const deleteProject = async (id: number): Promise<void> => {
  const response = await deleteRequest<void>(`/api/v1/projects/${id}`);
  return response;
};
