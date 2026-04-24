export interface ExecInterface {
  id: string;
  name: string;
  role: string;
  email: string;
  image: string;
  linkedin: string | null;
  github: string | null;
}

export interface DirectusExecutivesResponse {
  data: DirectusExec[];
}

interface DirectusExec {
  id: string;
  sort: number | null;
  name: string;
  role: string;
  email: string;
  image: string;
  linkedin: string | null;
  github: string | null;
}
