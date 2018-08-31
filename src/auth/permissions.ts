import { notNull } from '../util/common';
import { IWError } from '../util/IWError';

// Available permissions.
const Permissions = {
    R: 1,  // read
    W: 2,  // create
    E: 4,  // edit
    D: 8,  // delete
    M: this.R | this.E | this.D,  // moderation
    X: this.M | this.W  // full access
}

// // Guest role permissions.
// const GuestPerms = {
//     'Registration': Permissions.R | Permissions.W,
//     'Posts': Permissions.R,
//     'Posts.Comments': Permissions.R,
//     'News': Permissions.R,
//     'News.Comments': Permissions.R,
//     'Pools': Permissions.R,
// }

// // User role permissions.
// const UserPerms = {
//     'Registration': Permissions.R | Permissions.E,
//     'Posts': Permissions.R | Permissions.W | Permissions.E,
//     'Posts.Comments': Permissions.R | Permissions.W | Permissions.E,
//     'News': Permissions.R,
//     'News.Comments': Permissions.R | Permissions.W | Permissions.E,
//     'Pools': Permissions.R | Permissions.W,
// }

// // Admin role permissions.
// const AdminPerms = {
//     'Registration': Permissions.X,
//     'Posts': Permissions.M,
//     'Posts.Comments': Permissions.M,
//     'News': Permissions.X,
//     'News.Comments': Permissions.M,
//     'Pools': Permissions.M,
// }

// // Permissions schema map.
// const schema = new Map<string, any>();
// schema.set(Roles.Guest, GuestPerms);
// schema.set(Roles.User, UserPerms);
// schema.set(Roles.Admin, AdminPerms);

// Roles permissions schema
const Schema = {
    'Guest': {
        'Registration': Permissions.R | Permissions.W,
        'Posts': Permissions.R,
        'Posts.Comments': Permissions.R,
        'News': Permissions.R,
        'News.Comments': Permissions.R,
        'Pools': Permissions.R,
    },
    'User': {
        'Registration': Permissions.R | Permissions.E,
        'Posts': Permissions.R | Permissions.W | Permissions.E,
        'Posts.Comments': Permissions.R | Permissions.W | Permissions.E,
        'News': Permissions.R,
        'News.Comments': Permissions.R | Permissions.W | Permissions.E,
        'Pools': Permissions.R | Permissions.W,
    },
    'Admin': {
        'Registration': Permissions.X,
        'Posts': Permissions.M,
        'Posts.Comments': Permissions.M,
        'News': Permissions.X,
        'News.Comments': Permissions.M,
        'Pools': Permissions.M,
    }
}

// Available roles.
const _array = Object.keys(Schema);
export const Roles = {
    Guest: _array[0],
    User: _array[1],
    Admin: _array[2]
}

/**
 * Get permission by given 'role'.
 * @param role 
 * @param view 
 */
export function getPermission(role: string): number {
    notNull(role, 'Role');
    if (role in Schema) {
        const perm = Schema[role];
        return perm;
    } else
        throw new IWError(500, `Invalid \'role\' argument value: ${role}`);
}

/**
 * Check if a given 'role' has a given permission 'value' for a given 'view'.
 * @param role 
 * @param view 
 * @param value 
 */
export default function hasPermission(role: string, view: string, value: number): boolean {
    notNull(view, 'View name');
    const permObj = getPermission(role);
    const perm = permObj[view]
    return (perm & value) == value ? true : false;
}