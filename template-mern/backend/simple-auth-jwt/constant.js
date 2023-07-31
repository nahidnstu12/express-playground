export const ROLES = {
  Customer: 1,
  Delivary: 2,
  Admin: 3,
};

export const IS_VERIFIED_STATUS = {
  NOT_VERIFIED: 0,
  IS_VERIFIED: 0,
};

class Enum {
  static ROLES = {
    Customer: 1,
    Delivery: 2,
    Admin: 3,
  };

  static IS_VERIFIED_STATUS = {
    NOT_VERIFIED: 0,
    IS_VERIFIED: 1,
  };

  static getRole(roleName) {
    return Enum.ROLES[roleName] || null;
  }

  static getRoleName(roleValue) {
    return Object.keys(Enum.ROLES).find(key => Enum.ROLES[key] === roleValue) || null;
  }

  static getVerificationStatus(statusName) {
    return Enum.IS_VERIFIED_STATUS[statusName] || null;
  }

  static getVerificationStatusName(statusValue) {
    return Object.keys(Enum.IS_VERIFIED_STATUS).find(key => Enum.IS_VERIFIED_STATUS[key] === statusValue) || null;
  }
}

export default Enum;
