export interface Workspace {
  _id: string;

  name: string;
  about: string;

  logo: string;
  banner: string;
  
  location: string;

  founded?: string | Date | null;

  socials?: WorkspaceSocials;

  slug: string;
  createdAt: Date;
}

export interface WorkspaceSocials {
  // website?: string;
  // linkedin?: string;
  // github?: string;
  // x?: string;
  // facebook?: string;
  // instagram?: string;
  // youtube?: string;
  // discord?: string;
  linkedin?: {
    url: string;
    visible: boolean;
  };
  github?: {
    url: string;
    visible: boolean;
  };
  x?: {
    url: string;
    visible: boolean;
  };
  facebook?: {
    url: string;
    visible: boolean;
  };
  instagram?: {
    url: string;
    visible: boolean;
  };
  youtube?: {
    url: string;
    visible: boolean;
  };
  discord?: {
    url: string;
    visible: boolean;
  };
}