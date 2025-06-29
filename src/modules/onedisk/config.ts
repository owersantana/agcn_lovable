
export interface OneDiskConfig {
  enabled: boolean;
  maxStorage: number; // in GB
  allowedFileTypes: string[];
  features: {
    sharing: boolean;
    versioning: boolean;
    encryption: boolean;
    publicLinks: boolean;
  };
}

export const ONEDISK_CONFIG: OneDiskConfig = {
  enabled: true,
  maxStorage: 100,
  allowedFileTypes: ['*'],
  features: {
    sharing: true,
    versioning: true,
    encryption: true,
    publicLinks: true,
  }
};

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  shared: boolean;
  favorite: boolean;
  path: string;
  mimeType?: string;
}

export interface BucketInfo {
  id: string;
  name: string;
  uuid: string;
  currentPath: string;
  usedSpace: number; // in bytes
  totalSpace: number; // in bytes
  objectsCount: number;
}
