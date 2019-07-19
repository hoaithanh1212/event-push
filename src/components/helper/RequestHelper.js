import * as ProgramTypes from '../../contants/program-types';
import {RequestType, CheckInStatus, ReminderStatus} from '../../contants/profile-field';

var get = require('lodash.get');

let instance = null

export default class RequestHelper {

  constructor() {
    if (!instance) {
      instance = this
    }

    return instance
  }

  static getInstance() {
    if (!instance) {
      instance = new RequestHelper()
    }
    return instance
  }


  joinColumns2 = (convertedColumns, columns) => {
    let data = []
    let filterData = convertedColumns
      .filter((column) => column.selected == true)
    filterData.map(mainColumn => {
      columns.map((column) => {
        if (column.value == mainColumn.value) return data.push(column)
      })
    })
    return data
  }

  filterProgramTypeFieldsViaProgramType2 = (convertedColumns, programType) => {
    let data = []
    switch (programType) {

      case ProgramTypes.ProgramTypes.CPAP: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.CPAPWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.MITY: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.MITYWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.FITplus: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.FITplusWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.SHCCore: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.SHCCoreWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.SHCElective: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.SHCElectiveWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.MWO: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.MWOWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.SATP: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.SATPWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.ParentWorkshop: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.ParentWorkshopWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.SupermarketTour: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.SupermarketTourWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.HawkerTrail: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.HawkerTrailWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.NutritionCooking: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.NutritionCookingWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.NutritionWorkshop: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.NutritionWorkshopWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.Customized: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.CustomizedWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.PilotProject: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.PilotProjectWithAvailableFields)
        break
      }
      case ProgramTypes.ProgramTypes.DiabetesPrevention: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.DiabetesPreventionWithAvailableFields)
        break
      }
      default: {
        data = this.joinColumns2(convertedColumns, ProgramTypes.BoneHeathWithAvailableFields)
        break
      }
    }

    return data
  }

  getData = (convertedColumns, data) => {
    let filterData = data.map(item => {

      let columns = this.filterProgramTypeFieldsViaProgramType2(convertedColumns, item[ProgramTypes.PropertyName.programType])

      let requestNoStrValue = ''

      let requestDetailSerial = get(item, ProgramTypes.PropertyName.requestDetailSerial, 0)
      let requestDetailNoSub = get(item, ProgramTypes.PropertyName.requestDetailNoSub, 0)

      if (item.programType == ProgramTypes.ProgramTypes.MITY || item.programType == ProgramTypes.ProgramTypes.FITplus) {
        if (requestDetailSerial === 0 || requestDetailNoSub === 0) {
          requestNoStrValue = ''
        } else if (requestDetailSerial !== 0 && requestDetailNoSub !== 0) {
          requestNoStrValue = `${requestDetailSerial} / ${requestDetailNoSub}`
        }
      } else {
        requestNoStrValue = requestDetailSerial == 0 ? '' : requestDetailSerial
      }

      let data = [
        {value: get(item, ProgramTypes.PropertyName.id, ''), label: ProgramTypes.PropertyName.id, isShow: false},
        {value: requestNoStrValue, label: ProgramTypes.PropertyName.requestNoStr, isShow: true},
        {value: get(item, ProgramTypes.PropertyName.status, 0), label: ProgramTypes.PropertyName.status, isShow: true},
        {value: get(item, ProgramTypes.PropertyName.isOutOfTime, false), label: ProgramTypes.PropertyName.isOutOfTime, isShow: false},
        {value: get(item, ProgramTypes.PropertyName.requestDetailNo, 0), label: ProgramTypes.PropertyName.requestDetailNo, isShow: false},
        {value: get(item, ProgramTypes.PropertyName.isDuplicate, false), label: ProgramTypes.PropertyName.isDuplicate, isShow: false},
        {value: get(item, ProgramTypes.PropertyName.changeStatus, 0), label: ProgramTypes.PropertyName.changeStatus, isShow: false},
        {value: get(item, ProgramTypes.PropertyName.isShowButtonTrainerAcknowledged, false), label: ProgramTypes.PropertyName.isShowButtonTrainerAcknowledged, isShow: false},
        {value: get(item, ProgramTypes.PropertyName.isShowButtonTrainerCheckIn, false), label: ProgramTypes.PropertyName.isShowButtonTrainerCheckIn, isShow: false},
        {value: get(item, ProgramTypes.PropertyName.trainerId, ""), label: ProgramTypes.PropertyName.trainerId, isShow: false},
        {value: get(item, ProgramTypes.PropertyName.statusTitle, ""), label: ProgramTypes.PropertyName.statusTitle, isShow: false},
        {value: get(item, ProgramTypes.PropertyName.isHpmCovering, false), label: ProgramTypes.PropertyName.isHpmCovering, isShow: false},
      ]

      columns.map(col => {
        switch (col.value) {
          case ProgramTypes.PropertyName.requestDetailType: {
            let value = get(item, `${ProgramTypes.PropertyName.requestDetailType}`, 0)
            let type = ''
            if (value == 1) {
              type = RequestType.TypeA
            } else if (value == 2) {
              type = RequestType.TypeB
            } else {
              type = ''
            }
            data.push({value: type, label: get(col, 'label', ''), isShow: true})
            break
          }
          case ProgramTypes.PropertyName.checkIn: {
            let checkIn = CheckInStatus.map((i) => {
              if (i.status == item.checkIn) {
                return i.description
              }
            })
            data.push({value: checkIn, label: get(col, 'label', ''),isShow: true})
            break
          }
          case ProgramTypes.PropertyName.reminder: {
            let reminder = ReminderStatus.map((i) => {
              if (i.status == item.reminder) {
                return i.description
              }
            })
            data.push({value: reminder, label: get(col, 'label', ''),isShow: true})
            break
          }
          default: {
            data.push({value: item[col.value], label: get(col, 'label', ''),isShow: true})
            break
          }
        }
      })
      return data
    })

    return filterData
  }

}