interface HospitalType {
  id: string;
  name: string;
  isActive: boolean;
  passwordPolicy: {
    id: string;
    requireNumber: boolean;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireSpecialChar: boolean;
    minPasswordLength: number;
    maxLoginAttempts: number;
    passwordRegex: string;
    isActive: boolean;
  };
}

interface CorporationType {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  isSuccess: boolean;
  isDefault: boolean;
}

interface CaseStatusType {
  id: string;
  name: string;
  category: number;
  categoryName: string;
  isCommon: boolean;
  isActive: boolean;
  isSuccess: boolean;
}

interface CasePriorityType {
  id: string;
  name: string;
  isActive: boolean;
  isSuccess: boolean;
  isDefault: boolean;
}

interface TypeAndPriority {
  id: string;
  caseTypeId: string;
  caseStatusId: string;
  caseStatuses?: {
    id: string;
    name: string;
    category: number;
    isActive: boolean;
  };
  casePriorities?: {
    id: string;
    name: string;
    isActive: boolean;
  };
  isActive: boolean;
}

interface CaseTypeDef {
  id: string;
  name: string;
  code: string;
  caseTypeCaseStatusMapList: TypeAndPriority[];
  caseTypeCasePriorityMapList: TypeAndPriority[];
  isActive: boolean;
  isSuccess: boolean;
  isDefault: boolean;
  errorMessage: string;
}

interface BillingCodeType {
  id: string;
  name: string;
  isActive: boolean;
  isSuccess: boolean;
}

interface AcceptanceType {
  id: string;
  user: string;
  software: string;
  eulaVersion: string;
  acceptedOn: string;
  ipAddress: string;
  macAddress: string;
}

interface SoftwareType {
  id: string;
  name: string;
  description?: string;
  latestVersion?: string | null;
  lastestEulaUpdated?: string | null;
  isActive?: boolean;
  versions?: string | null;
  eulas?: string | null;
}

interface InviteType {
  id: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  userRole: string;
  userRoleId: string;
  remarks: string | null;
  organizationName: string;
  organizationId: string | null;
  organizationType: number;
  inviteStatusValue: number;
  inviteStatus: string;
  invitedBy: string;
  invitorName: null;
  invitedAt: string;
  isSuccess: true;
}

interface AccountRequestType {
  id: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  userRole: string;
  isApproved: boolean;
  approvedBy: string | null;
  remarks: string | null;
  organizationName: string;
  organizationTypeMasterId: string;
  requestedAt: string;
  requestStatusValue: number;
  requestStatus: string;
}

interface EULAList {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  latestVersion: string;
  lastestEulaUpdated: string;
  versions: string | null;
  eulas: string | null;
}

interface LicenseType {
  id: string;
  licenseType: string;
  licenseTier: string;
  name: string;
  description: string;
  isActive: boolean;
  isSuccess: boolean;
}

interface NotificationType {
  id: string;
  notificationScenarioId: string;
  notificationScenario: string;
  physicianDefault: boolean;
  salesRepDefault: boolean;
  coordinatorDefault: boolean;
  smsRequired: boolean;
  smsBody: string;
  emailRequired: boolean;
  emailSubject: string;
  emailBody: string;
  emailButtonName: string;
  inPortalWebRequired: boolean;
  inPortalWebSubject: string;
  inPortalWebLinkName: string;
  inPortalWebBody: string;
  mobilePushRequired: boolean;
  mobilePushSubject: string;
  mobilePushBody: string;
  isActive: boolean;
}

interface RoleFeatureType {
  featureId: string;
  featureName: string;
  permission: number;
  permissionName: string;
  roleLevelPermission: number;
  roleLevelPermissionName: string;
}
interface RoleType {
  id: string;
  name: string;
  isExternalRole: boolean;
  roleFeatures: RoleFeatureType[];
  description: string;
  isActive: boolean;
  roleTypeValue: number;
  roleType: string;
  isSuccess: boolean;
  allowEdit: boolean;
}

interface DBFileType {
  id: string;
  caseId: string;
  folderId: number;
  folderName: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  fileExt: string;
  uploadedOn: string;
  uploadedBy: string;
  isActive: boolean;
  uploaderName: string;
}

type CareTeamMembers = {
  userId: string;
  userRoleId: string;
  name: string;
  displayName?: string;
  userRole?: string;
  accountStatusName?: string;
  email: string;
  role: string;
  status: string;
  tagName?: string;
  tagValue: string;
  userTag?: string;
  isDeleted?: boolean;
};
type CareTeamType = {
  id: string;
  teamName: string;
  teamDescription: string;
  hospitalId: string;
  hospitalName: string;
  totalMembers: number;
  careTeamMembers: CareTeamMembers[];
  isActive: boolean;
  isSuccess: boolean;
  errorMessage: string;
  memberListDisplayString?: string;
  userList: Record<string, CareTeamMembers[]>;
};

export type {
  HospitalType,
  CorporationType,
  CaseStatusType,
  CasePriorityType,
  CaseTypeDef,
  BillingCodeType,
  AcceptanceType,
  SoftwareType,
  InviteType,
  AccountRequestType,
  EULAList,
  LicenseType,
  NotificationType,
  RoleType,
  RoleFeatureType,
  DBFileType,
  CareTeamType,
  CareTeamMembers,
};
