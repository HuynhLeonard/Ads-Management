import * as officerService from '../../services/userService.js';
import { getDistrictByID } from '../../services/districtService.js';
import { getWard } from '../../services/wardService.js';
import AdsCategories from '../../models/AdsCategoriesSchema.js';

const getOfficierRoleInfor = async (info) => {
  let wardName = null;
  let districtName = null;
  let roleName = null;
  switch (info.position) {
    case 2:
      roleName = 'Cán bộ Phường';
      [wardName, districtName] = await Promise.all([ getWard(info.wardID), getDistrictByID(info.districtID) ]);
      [wardName, districtName] = [wardName.wardName, districtName.districtName];
      break;
    case 1:
      roleName = 'Cán bộ Quận';
      districtName = await getDistrictByID(info.districtID);
      districtName = districtName.districtName;
      break;
    case -1:
      roleName = 'Cán bộ Sở';
      break;
    default:
      break;
  }
  return { wardName, districtName, roleName };
}

const getInfo = async (req, res) => {
  const { username } = req.params;
  const role = String(req.originalUrl.split('/')[1]);
  try {
    const info = await officerService.getSingleUser(username, true);
    const { wardName, districtName, roleName } = await getOfficierRoleInfor(info);
    if (wardName) info.managePlace = `Phường ${wardName}, Quận ${districtName}`;
    else if (districtName) info.managePlace = `Quận ${districtName}`;
    else info.managePlace = 'Sở Văn hóa Thể thao và Du lịch';
    info.roleName = roleName;
    res.render('info', { title: 'Thông tin cán bộ', info: info, role: role});
  } catch (error) {
    res.render('error', { title: '404', error});
  }
}

const updateInfo = async (req, res) => {
  const { username } = req.params;
  const { name, email, phone, dob } = req.body;
  const role = String(req.originalUrl.split('/')[1]);
  try {
    await officerService.updateOfficer(username, { name, email, phone, dob });
    req.flash('success', 'Cập nhật thông tin thành công');
    return res.redirect(`/${role}/officer/${username}`);
  } catch {
    req.flash('error', 'Cập nhật thông tin thất bại');
    return res.redirect(`/${role}/officer/${username}`);
  }
}

export default {
  getInfo,
  updateInfo
}
