/**
 * Created by Hong HP on 2/26/19.
 */
import {HttpService} from '../utils/HttpService';
import Configure from '../contants/configure';

export function getDivisionById(id) {
  return HttpService.get(Configure.CompassApi + 'Divisions/' + id)
}