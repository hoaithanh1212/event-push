import {HttpService} from '../utils/HttpService';
import Configure from '../contants/configure';

export function getSkillSets() {
    return HttpService.get(Configure.CompassApi + `SkillSets`)
}