const allRoles = {
  user: ['getCustomers', 'manageCustomers', 'getReports', 'manageReports'],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
