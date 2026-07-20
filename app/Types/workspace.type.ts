export interface Workspace {
  _id: string;

  name: string;
  about: string;

  logo: string;
  banner: string;
  
  location: string;

  socials?: WorkspaceSocials;

  slug: string;
  createdAt: Date;
}

export interface WorkspaceSocials {
  website?: string;
  linkedin?: string;
  github?: string;
  x?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  discord?: string;
}