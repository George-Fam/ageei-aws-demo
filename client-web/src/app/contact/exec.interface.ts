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

export interface ComiteMembreInterface {
  id: number;
  name: string;
  comite: string;
  email: string;
  image: string | null;
  linkedin: string | null;
  github: string | null;
}

export interface ComiteGroup {
  comite: string;
  membres: ComiteMembreInterface[];
}

export interface DirectusComitesResponse {
  data: DirectusComiteMembre[];
}

interface DirectusComiteMembre {
  id: number;
  sort: number | null;
  name: string;
  comite: string;
  email: string;
  image: string | null;
  linkedin: string | null;
  github: string | null;
}
