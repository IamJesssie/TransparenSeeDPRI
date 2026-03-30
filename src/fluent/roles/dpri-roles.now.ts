import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

// Creates patient role for portal users
export const dpri_patient = Role({ 
    name: 'x_1966129_transpar.dpri_patient',
    description: 'Role for patients using the TransparenSee portal to search drug prices and find pharmacies',
    can_delegate: false,
    grantable: true,
    elevated_privilege: false
})

// Creates admin role for managing the DPRI system
export const dpri_admin = Role({ 
    name: 'x_1966129_transpar.dpri_admin',
    description: 'Administrative role for managing drug price data, pharmacy approvals, and system analytics',
    contains_roles: [dpri_patient],
    can_delegate: true,
    grantable: true,
    elevated_privilege: false,
    scoped_admin: true
})