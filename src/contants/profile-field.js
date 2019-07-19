export const FieldUserProfile = {
  permissions: "permissions",
  divisions: "divisions",
  id: "id",
  bankName: "bankAccount.name",
  accountNumber: "bankAccount.accountNumber",
  bankInfo: "bankAccount.bankInfo",
  userName: "userName",
  divisionName: "divisionName",
  email: "email",
  pocName: "pocName",
  pocEmail: "pocEmail",
  pocMobile: "pocMobile",
  typeRole: "typeRole",
  name: "name",
  phoneNumber: "phoneNumber",
  did: "did",
  approveStatus: "approveStatus",
  aedDate: "aedDate",
  cprDate: "cprDate",
  alternativePocEmail: "alternativePocEmail",
  alternativePocMobile: "alternativePocMobile",
  programLead: "programLead",
  companyName: "companyName",
  avatar: "avatar",
  skillSetsId: "skillSetsId",
  grcsId: "grcsId",
  divisionsId: "divisionsId",
  districtsId: "districtsId",
  coverUsersId: "coverUsersId",
  programId: "programId",
  trainerSpId: "trainerSpId",
  spProgramDivisions: "spProgramDivisions",
  partnerNameId: "partnerNameId",
  userSettings: "userSettings"
}

const FieldNameUserProfile = {
  Name: "Name",
  CompanyName: "Company Name",
  Username: "User Name",
  POCName: "POC Name",
  POCEmail: "POC Email",
  POCMobile: "POC Mobile",
  Email: "Email",
  Mobile: "Mobile",
  DID: "DID",
  Skillset: "Skill Set",
  Password: "Password",
  AEDDate: "AED Date",
  CPRDate: "CPR Date",
  BankName: "Bank Name",
  AccountNumber: "Account Number",
  BankInfo: "Bank info",
  AlternativePOCEmail: "Alternative POC Email",
  AlternativePOCMobile: "Alternative POC Mobile",
  ProgrammeInvolved: "Programme Involved",
  GRCInCharge: "GRC in charge",
  DistrictInCharge: "District in charge",
  ProgrammeLead: "Programme Lead",
  CoveringHPM: "Covering HPM",
  CoveringSM: "Covering SM",
  DivisionInCharge: "Division in charge",
  GRC: "GRC",
  District: "District",
  SP: "SP",
  ProgrammeLead: "Programme Lead",
  Division: "Division",
  Trainers: "Trainers",
  NotificationType: "Notification Type"
}


//Trainer
export const TrainerMapWithFields = [
  {name: FieldNameUserProfile.Name, field: FieldUserProfile.name, editable: true},
  {name: FieldNameUserProfile.Email, field: FieldUserProfile.email, editable: true},
  {name: FieldNameUserProfile.Mobile, field: FieldUserProfile.phoneNumber, editable: true},
  {name: FieldNameUserProfile.Skillset, field: FieldUserProfile.skillSetsId, editable: false},
  {name: FieldNameUserProfile.AEDDate, field: FieldUserProfile.aedDate, editable: false},
  {name: FieldNameUserProfile.CPRDate, field: FieldUserProfile.cprDate, editable: false},
  {name: FieldNameUserProfile.BankName, field: FieldUserProfile.bankName, editable: false},
  {name: FieldNameUserProfile.AccountNumber, field: FieldUserProfile.accountNumber, editable: false},
  {name: FieldNameUserProfile.BankInfo, field: FieldUserProfile.bankInfo, editable: false},
  {name: FieldNameUserProfile.NotificationType, field: FieldUserProfile.userSettings, editable: true},
]

//SP
export const SPMapWithFields = [
  {name: FieldNameUserProfile.Name, field: FieldUserProfile.pocName, editable: true},
  {name: FieldNameUserProfile.Mobile, field: FieldUserProfile.pocMobile, editable: true},
  {name: FieldNameUserProfile.Email, field: FieldUserProfile.pocEmail, editable: true},
  {name: FieldNameUserProfile.CompanyName, field: FieldUserProfile.companyName, editable: false},
  {name: FieldNameUserProfile.POCName, field: FieldUserProfile.pocName, editable: false},
  {name: FieldNameUserProfile.POCEmail, field: FieldUserProfile.pocEmail, editable: false},
  {name: FieldNameUserProfile.POCMobile, field: FieldUserProfile.pocMobile, editable: false},
  {name: FieldNameUserProfile.AlternativePOCEmail, field: FieldUserProfile.alternativePocEmail, editable: false},
  {name: FieldNameUserProfile.AlternativePOCMobile, field: FieldUserProfile.alternativePocMobile, editable: false},
  {name: FieldNameUserProfile.ProgrammeInvolved, field: FieldUserProfile.programId, editable: false},
  {name: FieldNameUserProfile.Division, field: FieldUserProfile.divisionsId, editable: false},
  {name: FieldNameUserProfile.GRC, field: FieldUserProfile.grcsId, editable: false},
  {name: FieldNameUserProfile.District, field: FieldUserProfile.districtsId, editable: false},
  {name: FieldNameUserProfile.Trainers, field: FieldUserProfile.trainerSpId, editable: false},
  {name: FieldNameUserProfile.NotificationType, field: FieldUserProfile.userSettings, editable: true},
]

//HPM
export const HPMMapWithFields = [
  {name: FieldNameUserProfile.Name, field: FieldUserProfile.name, editable: true},
  {name: FieldNameUserProfile.Mobile, field: FieldUserProfile.phoneNumber, editable: true},
  {name: FieldNameUserProfile.Email, field: FieldUserProfile.email, editable: true},
  {name: FieldNameUserProfile.DID, field: FieldUserProfile.did, editable: true},
  {name: FieldNameUserProfile.GRCInCharge, field: FieldUserProfile.grcsId, editable: false},
  {name: FieldNameUserProfile.DivisionInCharge, field: FieldUserProfile.divisionsId, editable: false},
  {name: FieldNameUserProfile.ProgrammeLead, field: FieldUserProfile.programLead, editable: false},
  {name: FieldNameUserProfile.CoveringHPM, field: FieldUserProfile.coverUsersId, editable: false},
  {name: FieldNameUserProfile.NotificationType, field: FieldUserProfile.userSettings, editable: true},
]

//SM
export const SMMapWithFields = [
  {name: FieldNameUserProfile.Name, field: FieldUserProfile.name, editable: true},
  {name: FieldNameUserProfile.Mobile, field: FieldUserProfile.phoneNumber, editable: true},
  {name: FieldNameUserProfile.Email, field: FieldUserProfile.email, editable: true},
  {name: FieldNameUserProfile.DID, field: FieldUserProfile.did, editable: true},
  {name: FieldNameUserProfile.GRCInCharge, field: FieldUserProfile.grcsId, editable: false},
  {name: FieldNameUserProfile.DivisionInCharge, field: FieldUserProfile.divisionsId, editable: false},
  {name: FieldNameUserProfile.CoveringSM, field: FieldUserProfile.coverUsersId, editable: false},
  {name: FieldNameUserProfile.NotificationType, field: FieldUserProfile.userSettings, editable: true},
]

//PL
export const PLMapWithFields = [
  {name: FieldNameUserProfile.Name, field: FieldUserProfile.name, editable: true},
  {name: FieldNameUserProfile.Mobile, field: FieldUserProfile.phoneNumber, editable: true},
  {name: FieldNameUserProfile.Email, field: FieldUserProfile.email, editable: true},
  {name: FieldNameUserProfile.DID, field: FieldUserProfile.did, editable: true},
  {name: FieldNameUserProfile.ProgrammeInvolved, field: FieldUserProfile.programId, editable: false},
  {name: FieldNameUserProfile.NotificationType, field: FieldUserProfile.userSettings, editable: true},
]

//Data Entry
export const DataEntryMapWithFields = [
  {name: FieldNameUserProfile.Name, field: FieldUserProfile.name, editable: true},
  {name: FieldNameUserProfile.Mobile, field: FieldUserProfile.phoneNumber, editable: true},
  {name: FieldNameUserProfile.Email, field: FieldUserProfile.email, editable: true},
  {name: FieldNameUserProfile.NotificationType, field: FieldUserProfile.userSettings, editable: true},
]

//PM
export const PMMapWithFields = [
  {name: FieldNameUserProfile.Name, field: FieldUserProfile.name, editable: true},
  {name: FieldNameUserProfile.Mobile, field: FieldUserProfile.phoneNumber, editable: true},
  {name: FieldNameUserProfile.Email, field: FieldUserProfile.email, editable: true},
  {name: FieldNameUserProfile.DID, field: FieldUserProfile.did, editable: true},
  {name: FieldNameUserProfile.NotificationType, field: FieldUserProfile.userSettings, editable: true},
]

//Partner
export const PartnerMapWithFields = [
  {name: FieldNameUserProfile.Name, field: FieldUserProfile.pocName, editable: true},
  {name: FieldNameUserProfile.Mobile, field: FieldUserProfile.pocMobile, editable: true},
  {name: FieldNameUserProfile.Email, field: FieldUserProfile.pocEmail, editable: true},
  {name: FieldNameUserProfile.POCName, field: FieldUserProfile.pocName, editable: false},
  {name: FieldNameUserProfile.POCEmail, field: FieldUserProfile.pocEmail, editable: false},
  {name: FieldNameUserProfile.POCMobile, field: FieldUserProfile.pocMobile, editable: false},
  {name: FieldNameUserProfile.DID, field: FieldUserProfile.did, editable: true},
  {name: FieldNameUserProfile.Division, field: FieldUserProfile.divisionsId, editable: false},
  {name: FieldNameUserProfile.GRC, field: FieldUserProfile.grcsId, editable: false},
  {name: FieldNameUserProfile.District, field: FieldUserProfile.districtsId, editable: false},
  {name: FieldNameUserProfile.NotificationType, field: FieldUserProfile.userSettings, editable: true},
]

//AIC
export const AICMapWithFields = [
  {name: FieldNameUserProfile.Name, field: FieldUserProfile.name, editable: true},
  {name: FieldNameUserProfile.Email, field: FieldUserProfile.email, editable: true},
  {name: FieldNameUserProfile.Mobile, field: FieldUserProfile.phoneNumber, editable: true},
  {name: FieldNameUserProfile.DID, field: FieldUserProfile.did, editable: true},
  {name: FieldNameUserProfile.GRCInCharge, field: FieldUserProfile.grcsId, editable: false},
  {name: FieldNameUserProfile.DivisionInCharge, field: FieldUserProfile.divisionsId, editable: false},
  {name: FieldNameUserProfile.NotificationType, field: FieldUserProfile.userSettings, editable: true},
]

//SuperAdmin
export const SuperAdminMapWithFields = [
  {name: FieldNameUserProfile.Name, field: FieldUserProfile.name, editable: true},
  {name: FieldNameUserProfile.Mobile, field: FieldUserProfile.phoneNumber, editable: true},
  {name: FieldNameUserProfile.Email, field: FieldUserProfile.email, editable: true},
  {name: FieldNameUserProfile.NotificationType, field: FieldUserProfile.userSettings, editable: true},
]

export const Roles = [
  {Trainer: TrainerMapWithFields},
  {SP: SPMapWithFields},
  {HPM: HPMMapWithFields},
  {SM: SMMapWithFields},
  {PL: PLMapWithFields},
  {DataEntry: DataEntryMapWithFields},
  {PM: PMMapWithFields},
  {Partner: PartnerMapWithFields},
  {AIC: AICMapWithFields},
  {SuperAdmin: SuperAdminMapWithFields}
]

export const RoleType = {
  Trainer: 'Trainer',
  SP: 'SP',
  SM: 'SM',
  HPM: 'HPM',
  Another: 'Another',
  Admin: 'Admin',
  DataEntry: 'DataEntry',
  AIC: 'AIC',
  Partner: 'Partner',
  PL: 'PL',
  PM: 'PM',
  SuperAdmin: 'SuperAdmin',
  Facilitator: 'Facilitator'
}

export const RequestStatus = [
  {
    name: 'Approved',
    status: 1,
    selected: true
  },
  {
    name: 'Reject',
    status: 2,
    selected: true
  },
  {
    name: 'Pending',
    status: 3,
    selected: true
  },
  {
    name: 'Confirmation',
    status: 4,
    selected: true
  },
  {
    name: 'Canceled',
    status: 5,
    selected: true
  },
  {
    name: 'StartRequest',
    status: 6,
    selected: true
  },
];

export const RequestType = {
  TypeA: 'A',
  TypeB: 'B'
}

//The newest request after client change requiremnet
//Using all project

export const AvailableRequestStatusKey = {
  Pending: 1,
  Approve: 2,
  Reject: 3,
  Confirm: 4,
  ChangeRequest: 5,
  CancelRequest: 6,
  Cancel: 7,
  Ready: 8,
  EndSession: 10
}

//For test
export const AvailableRequestStatusValue = {
  Pending: "Pending",
  Approve: "Approve",
  Reject: "Reject",
  Confirm: "Confirm",
  ChangeRequest: "Change Request",
  CancelRequest: "Cancel Request --- Pending Request Old",
  Cancel: "Cancel",
}

export const FilterDashBoardStatus = {
  CONFIRMED: 1,
  NEW_REQUESTS: 2,
  CHANGE_REQUESTS: 3,
  PENDING_TRAINER: 4,
  UPCOMING_ACTIVITIES: 5,
  NON_CHECK_IN: 6,
  UNACKNOWLEDGED_REMINDER: 7,
  RENEW_CPAP: 8,
  YET_TO_ACKNOWLEDGE: 9,
  YET_TO_CHECK_IN: 10
}

export const ReminderStatus = [
  {
    status: 1,
    description: "NA"
  },
  {
    status: 2,
    description: "Notification Sent / Waiting for Response"
  },
  {
    status: 3,
    description: "Acknowledged"
  }
]

export const CheckInStatus = [
  {
    status: 1,
    description: "NA"
  },
  {
    status: 2,
    description: "Notification Sent / Waiting for Response"
  },
  {
    status: 3,
    description: "Acknowledged"
  }
]

export const FIELD_TYPE = [
  {
    name: 'GRC',
    value: 1,
  }, {
    name: 'Division',
    value: 2,
  }, {
    name: 'Partner',
    value: 3,
  }
]

export const FREQUENCY_TYPE = [
  {
    name: 'Quarterly',
    value: 1,
  }, {
    name: 'Yearly',
    value: 2,
  }, {
    name: 'Monthly',
    value: 3,
    description: '“Monthly” is applied for Part A only'
  }
]

export const QUARTERLY_PERIOD = {
  Q1: [3, 4, 5],
  Q2: [6, 7, 8],
  Q3: [9, 10, 11],
  Q4: [12, 1, 2]
};
