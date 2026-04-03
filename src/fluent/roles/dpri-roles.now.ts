import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

// Creates patient role for portal users
export const dpri_patient = Role({
    name: 'x_1966129_transpar.dpri_patient',
    description: 'Role for patients using the TransparenSee portal to search drug prices and find pharmacies',
    canDelegate: false,
    grantable: true,
    elevatedPrivilege: false,
})

// Creates admin role for managing the DPRI system
export const dpri_admin = Role({
    name: 'x_1966129_transpar.dpri_admin',
    description: 'Administrative role for managing drug price data, pharmacy approvals, and system analytics',
    containsRoles: [dpri_patient],
    canDelegate: true,
    grantable: true,
    elevatedPrivilege: false,
    scopedAdmin: true,
})
