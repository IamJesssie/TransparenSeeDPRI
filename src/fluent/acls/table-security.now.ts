import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'

// Medicine Table ACLs
Acl({
    $id: Now.ID['medicine_read_acl'],
    table: 'x_1966129_transpar_medicine',
    operation: 'read',
    type: 'record',
    roles: ['x_1966129_transpar.dpri_patient'],
})

Acl({
    $id: Now.ID['medicine_write_acl'], 
    table: 'x_1966129_transpar_medicine',
    operation: 'write',
    type: 'record',
    roles: ['x_1966129_transpar.dpri_admin'],
})

Acl({
    $id: Now.ID['medicine_create_acl'],
    table: 'x_1966129_transpar_medicine', 
    operation: 'create',
    type: 'record',
    roles: ['x_1966129_transpar.dpri_admin'],
})

Acl({
    $id: Now.ID['medicine_delete_acl'],
    table: 'x_1966129_transpar_medicine',
    operation: 'delete',
    type: 'record',
    roles: ['x_1966129_transpar.dpri_admin'],
})

// Pharmacy Table ACLs  
Acl({
    $id: Now.ID['pharmacy_read_acl'],
    table: 'x_1966129_transpar_pharmacy',
    operation: 'read',
    type: 'record',
    roles: ['x_1966129_transpar.dpri_patient'],
    script: 'answer = current.accreditation_status == "approved" || gs.hasRole("x_1966129_transpar.dpri_admin");',
})

Acl({
    $id: Now.ID['pharmacy_write_acl'],
    table: 'x_1966129_transpar_pharmacy',
    operation: 'write',
    type: 'record',
    roles: ['x_1966129_transpar.dpri_admin'],
})

// Search Log ACLs
Acl({
    $id: Now.ID['search_log_create_acl'],
    table: 'x_1966129_transpar_search_log',
    operation: 'create', 
    type: 'record',
    script: 'answer = true; // Allow anonymous search logging',
})

Acl({
    $id: Now.ID['search_log_read_acl'],
    table: 'x_1966129_transpar_search_log',
    operation: 'read',
    type: 'record',
    roles: ['x_1966129_transpar.dpri_admin'],
})

// Category Table ACLs
Acl({
    $id: Now.ID['category_read_acl'],
    table: 'x_1966129_transpar_category',
    operation: 'read',
    type: 'record',
    roles: ['x_1966129_transpar.dpri_patient'],
})

Acl({
    $id: Now.ID['category_write_acl'],
    table: 'x_1966129_transpar_category', 
    operation: 'write',
    type: 'record',
    roles: ['x_1966129_transpar.dpri_admin'],
})