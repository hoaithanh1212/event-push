export const PropertyName = {
    id: "id",
    activityName: "activityName",
    partnerName: "partnerName",
    partnerPoc: "partnerPoc",
    partnerPocHpDid: "partnerPocHpDid",
    partnerDid: "partnerDid",
    partnerPocEmail: "partnerPocEmail",
    requestDetailSerial: "requestDetailSerial",
    requestDetailNoSub: "requestDetailNoSub",
    recipe1Name: "recipe1Name",
    recipe2Name: "recipe2Name",
    requestDetailNo: "requestDetailNo",
    programTypeName: "programTypeName",
    programType: "programType",
    date: "date",
    startTime: "startTime",
    endTime: "endTime",
    frequency: "frequency",
    districtName: "districtName",
    grcName: "grcName",
    divisionName: "divisionName",
    hpmName: "hpmName",
    hpmHandPhone: "hpmHandPhone",
    hpmEmail: "hpmEmail",
    spConfirmation: "spConfirmation",
    // TODO nhẹ 
    spName: "spPocName",
    spHandPhone: "spHandPhone",
    spEmail: "spEmail",
    expectedNumberOfPax: "expectedNumberOfPax",
    language: "language",
    trainerId: "trainerId",
    trainerName: "trainerName",
    trainerHandPhone: "trainerHandPhone",
    trainerEmail: "trainerEmail",
    venue: "venue",
    venuePostalCode: "venuePostalCode",
    venueNature: "venueNature",
    alternateSite: "alternativeSite",
    requestDetailType: "requestType",
    aedLocation: "aedLocation",
    ram: "ram",
    facilitatorName: "facilitatorName",
    facilitatorHandPhone: "facilitatorHandPhone",
    facilitatorEmail: "facilitatorEmail",
    requestorName: "requesterName",
    requestorHandPhone: "requesterHandPhone",
    requestorEmail: "requesterEmail",
    preferredDomainB: "preferredDomainBName",
    preferredDomainAorC: "preferredDomainAorCName",
    status: "status",
    requestDate: 'requestDate',
    changeStatus: 'changeStatus',
    isShowButtonTrainerAcknowledged: 'isShowButtonTrainerAcknowledged',
    isShowButtonTrainerCheckIn: 'isShowButtonTrainerCheckIn',
    statusTitle: 'statusTitle',
    reasonCancel: 'reasonCancel',
    checkIn: 'checkIn',
    reminder: 'reminder',
    isOutOfTime: 'isOutOfTime',
    isDuplicate: 'isDuplicate',
    requestNoStr: 'requestNoStr',
    isHpmCovering: 'isHpmCovering',
    remarks: 'remarks',
    renewCpapText: 'renewCpapText',
    dayOfWeek: 'dayOfWeek'
}

export const Fields = [
    // {label: 'Series Number', value: PropertyName.requestDetailSerial},
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Facilitator Name', value: PropertyName.facilitatorName},
    {label: 'Facilitator HP', value: PropertyName.facilitatorHandPhone},
    {label: 'Facilitator Email', value: PropertyName.facilitatorEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'Nature of Venue', value: PropertyName.venueNature},
    {label: 'Alternate Site', value: PropertyName.alternateSite},
    {label: 'AED Location', value: PropertyName.aedLocation},
    {label: 'RAM', value: PropertyName.requestorName},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},
    
    {label: 'Preferred Domain A or C', value: PropertyName.preferredDomainAorC},
    {label: 'Preferred Domain B', value: PropertyName.preferredDomainB},
    //Mall
    //Park
    {label: 'Language', value: PropertyName.language},
    {label: 'Recipe 1', value: PropertyName.recipe1Name},
    {label: 'Recipe 2', value: PropertyName.recipe2Name},
    // 'Service Provider': 'Service Provider',   
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
    //Add new
]


export const CPAPWithAvailableFields = [
    
    {label: 'Series Number', value: PropertyName.requestDetailSerial},
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Facilitator Name', value: PropertyName.facilitatorName},
    {label: 'Facilitator HP', value: PropertyName.facilitatorHandPhone},
    {label: 'Facilitator Email', value: PropertyName.facilitatorEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'Nature of Venue', value: PropertyName.venueNature},
    {label: 'Alternate Site', value: PropertyName.alternateSite},
    {label: 'AED Location', value: PropertyName.aedLocation},
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    // 'Service Provider': 'Service Provider',
    {label: 'Language', value: PropertyName.language},
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const MITYWithAvailableFields = [
    {label: 'Series Number', value: PropertyName.requestDetailSerial},
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'Alternate Site', value: PropertyName.alternateSite},
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    {label: 'Preferred Domain B', value: PropertyName.preferredDomainB},
    {label: 'Preferred Domain A or C', value: PropertyName.preferredDomainAorC},
    // 'Service Provider': 'Service Provider',
    {label: 'Language', value: PropertyName.language},
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const FITplusWithAvailableFields = [
    {label: 'Series Number', value: PropertyName.requestDetailSerial},
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},
    {label: 'Alternate Site', value: PropertyName.alternateSite},
    {label: 'RAM', value: PropertyName.ram},

    
    // 'Service Provider': 'Service Provider',
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const SHCCoreWithAvailableFields = [
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    // 'Service Provider': 'Service Provider',
    {label: 'Language', value: PropertyName.language},
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const SHCElectiveWithAvailableFields = [
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    // 'Service Provider': 'Service Provider',
    {label: 'Language', value: PropertyName.language},
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const MWOWithAvailableFields = [
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Facilitator Name', value: PropertyName.facilitatorName},
    {label: 'Facilitator HP', value: PropertyName.facilitatorHandPhone},
    {label: 'Facilitator Email', value: PropertyName.facilitatorEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    //Mall : Mall
    // 'Service Provider': 'Service Provider',
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const SATPWithAvailableFields = [
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Facilitator Name', value: PropertyName.facilitatorName},
    {label: 'Facilitator HP', value: PropertyName.facilitatorHandPhone},
    {label: 'Facilitator Email', value: PropertyName.facilitatorEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    //Park : Park
    // 'Service Provider': 'Service Provider',
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const ParentWorkshopWithAvailableFields = [
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    //Park : Park
    {label: 'Recipe 1', value: PropertyName.recipe1Name},
    {label: 'Recipe 2', value: PropertyName.recipe2Name},
    // 'Service Provider': 'Service Provider',
    {label: 'Language', value: PropertyName.language},
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const SupermarketTourWithAvailableFields = [
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Language', value: PropertyName.language},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    // 'Service Provider': 'Service Provider',
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const HawkerTrailWithAvailableFields = [
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    // 'Service Provider': 'Service Provider', 
    {label: 'Language', value: PropertyName.language},
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const NutritionCookingWithAvailableFields = [
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    {label: 'Recipe 1', value: PropertyName.recipe1Name},
    {label: 'Recipe 2', value: PropertyName.recipe2Name},
    {label: 'Language', value: PropertyName.language},
    
    // 'Service Provider': 'Service Provider',
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const NutritionWorkshopWithAvailableFields = [
    {label: 'Series Number', value: PropertyName.requestDetailSerial},
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    {label: 'Recipe 1', value: PropertyName.recipe1Name},
    {label: 'Recipe 2', value: PropertyName.recipe2Name},
    // 'Service Provider': 'Service Provider',
    {label: 'Language', value: PropertyName.language},
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const CustomizedWithAvailableFields = [
    {label: 'Series Number', value: PropertyName.requestDetailSerial},
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'Alternate Site', value: PropertyName.alternateSite},
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    // 'Service Provider': 'Service Provider',
    {label: 'Language', value: PropertyName.language},
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const PilotProjectWithAvailableFields = [
    {label: 'Series Number', value: PropertyName.requestDetailSerial},
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    // 'Service Provider': 'Service Provider',
    {label: 'Language', value: PropertyName.language},
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const DiabetesPreventionWithAvailableFields = [
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    // 'Service Provider': 'Service Provider',
    {label: 'Language', value: PropertyName.language},
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const BoneHeathWithAvailableFields = [
    {label: 'Division', value: PropertyName.divisionName},
    {label: 'Partner Name', value: PropertyName.partnerName},
    {label: 'Programme Type', value: PropertyName.programTypeName},
    {label: 'Activity / Event / Topic', value: PropertyName.activityName},
    {label: 'Day Of Week', value: PropertyName.dayOfWeek},
    {label: 'Activity Date', value: PropertyName.date},
    {label: 'Start Time (24-hr)', value: PropertyName.startTime},

    {label: 'Partner POC', value: PropertyName.partnerPoc},
    {label: 'Venue', value: PropertyName.venue},
    {label: 'Type', value: PropertyName.requestDetailType},
    {label: 'Partner POC HP', value: PropertyName.partnerPocHpDid},
    {label: 'Partner POC DID', value: PropertyName.partnerDid},
    {label: 'Partner POC Email', value: PropertyName.partnerPocEmail},
    
    
    {label: 'End Time', value: PropertyName.endTime},
    {label: 'Frequency', value: PropertyName.frequency},
    
    {label: 'Venue Postal Code', value: PropertyName.venuePostalCode},
    {label: 'GRC', value: PropertyName.grcName},
    {label: 'District', value: PropertyName.districtName},
    
    {label: 'HPM Name', value: PropertyName.hpmName},
    {label: 'HPM HP', value: PropertyName.hpmHandPhone},
    {label: 'HPM Email', value: PropertyName.hpmEmail},
    {label: 'Service Provider Name', value: PropertyName.spName},
    {label: 'Service Provider HP', value: PropertyName.spHandPhone},
    {label: 'Service Provider Email', value: PropertyName.spEmail},
    {label: 'Expected Number of Pax', value: PropertyName.expectedNumberOfPax},
    {label: 'Trainer Name', value: PropertyName.trainerName},
    {label: 'Trainer HP', value: PropertyName.trainerHandPhone},
    {label: 'Trainer Email', value: PropertyName.trainerEmail},
    {label: 'Request Date', value: PropertyName.requestDate},
    
    {label: 'RAM', value: PropertyName.ram},
    {label: 'Requestor Name', value: PropertyName.requestorName},
    {label: 'Requestor HP', value: PropertyName.requestorHandPhone},
    {label: 'Requestor Email', value: PropertyName.requestorEmail},

    
    // 'Service Provider': 'Service Provider',
    {label: 'Language', value: PropertyName.language},
    {label: 'Reason', value: PropertyName.reasonCancel},
    {label: 'Reminder', value: PropertyName.reminder},
    {label: 'Checkin', value: PropertyName.checkIn},
    {label: 'Remarks', value: PropertyName.remarks},
    {label: 'Old row number', value: PropertyName.renewCpapText},
]

export const ProgramTypes = {
    CPAP: "CPAP",
    MITY: "MITY",
    FITplus: "FITplus",
    SATP: "SATP",
    MWO: "MWO",
    NutritionCooking: "NutritionCooking",
    NutritionWorkshop: "NutritionWorkshop",
    HawkerTrail: "HawkerTrail",
    SupermarketTour: "SupermarketTour",
    SHCCore: "SHCCore",
    SHCElective: "SHCElective",
    ParentWorkshop: "ParentWorkshop",
    BoneHeath: "BoneHeath",
    DiabetesPrevention: "DiabetesPrevention",
    PilotProject: "PilotProject",
    Customized: "Customized"
}