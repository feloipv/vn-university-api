import createUniversity from '@/controllers/university/createUniversity';
import updateUniversity from '@/controllers/university/updateUniversity';
import deleteUniversity from '@/controllers/university/deleteUniversity';
import getUniversities from '@/controllers/university/getUniversities';
import getUniversityById from './getOneUniversity';

export const univerCtrl = {
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getUniversities,
  getUniversityById,
};
