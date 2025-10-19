const privilegedRoles = new Set(['admin', 'moderator']);

/**
 * Checks if a user has the privilege to perform an action based on ownership or role.
 *
 * @param {string|number} ownerId - The ID of the resource owner.
 * @param {string|number} userId - The ID of the user attempting the action.
 * @param {string} userRole - The role of the user.
 * @throws {AuthorizationError} If the user is neither the owner nor has a privileged role.
 * @returns {boolean} Returns true if the user has the required privilege.
 */

export default function hasPrivilege(ownerId, userId, userRole) {
  const isOwner = ownerId === userId;
  const isPrivileged = privilegedRoles.has(userRole);
  if (!isOwner && !isPrivileged) {
    return false
  }
  return true
}