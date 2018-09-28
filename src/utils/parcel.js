const unit = 'KG';
export class Parcel {
  constructor(value, tasks) {
    let ip = '';
    let temp = '';
    const values = value.split(':');
    if (values.length === 1) {
      [temp] = values;
    } else {
      [ip, temp] = values;
    }
    [this.parcelNumber, this.weight] = temp.split('#');
    if (ip) {
      const task = tasks.find(t => t.scanDeviceIP === ip);
      this.taskID = task ? task.taskID : tasks[0].taskID;
    } else {
      this.taskID = tasks[0].taskID;
    }
    this.weightUnit = unit;
  }
}
// TODO: mock input
const pkgs = [];
export function getCode(task) {
  pkgs.push(`${task.scanDeviceIP}:PKG_${pkgs.length}#${(Math.random() * 50).toFixed(2)}`);
  return pkgs[pkgs.length - 1];
}
/**
 * @method inParcelsUpload 检验所有属于该AGV的包裹是否都放在AGV上了 : 找不到一个属于该AGV的包裹不在AGV上
 * @param {Parcel[]} parcels
 * @param {Task} task
 * @return {Boolean} isInParcelUpload
 */
export function inParcelsUpload(parcels, task) {
  return !parcels.find(parcel =>
    parcel.taskID === task.taskID &&
    !task.parcels.find(p => p.parcelNumber === parcel.parcelNumber && p.state === 'PUT_ON_BELT'));
}

export class DuplicateTimer {
  constructor(time) {
    this.last = null;
    this.time = time;
    this.date = null;
  }
  isDuplicate(value) {
    if (toString.call(this.last) !== '[object Null]' && value === this.last &&
      new Date().getTime() - this.date <= this.time) {
      return true;
    } else {
      return false;
    }
  }
  setValue(value) {
    this.last = value;
    this.date = new Date().getTime();
  }
  clear() {
    this.last = null;
  }
}
