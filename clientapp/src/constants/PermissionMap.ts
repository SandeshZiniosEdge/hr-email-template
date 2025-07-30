export const PermissionMap: Record<string, number> = {
  NoAccess: 0,
  ViewOnly: 1,
  Limitted: 2,
  RestrictDelete: 3,
  FullControl: 4,
};

// NoAccess=0 -- No Access to page
// ViewOnly=1-- No Add, No edit, No active/inactive
// Limitted=2 -- No Add, No edit, No active/inactive
// RestrictDelete=3, No active/inactive
// FullControl=4, no restriction
export const RolePermissions: Record<
  number,
  { canView: boolean; canAdd: boolean; canEdit: boolean; canDelete: boolean }
> = {
  0: {
    //NoAccess
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  },
  1: {
    //ViewOnly
    canView: true,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  },
  2: {
    //Limitted
    canView: true,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  },
  3: {
    //RestrictDelete
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: false,
  },
  4: {
    // Full Control
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
  },
};
