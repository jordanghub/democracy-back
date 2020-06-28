import { Injectable } from '@nestjs/common';
import { User } from 'src/users/models/user.entity';
import { UserRole } from 'src/users/models/user-roles.entity';
import { Role } from 'src/users/models/role.entity';

@Injectable()
export class PermissionService {
  async checkIfUserHasRoles(userId, roleCodes: string[]) {
    let isAllowed = false;
    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: UserRole,
          attributes: ['id'],
          include: [
            {
              model: Role,
              attributes: ['name', 'code'],
            },
          ],
        },
      ],
    });

    if (user) {
      roleCodes.forEach(roleCode => {
        const hasRole = user.roles.find(
          userRoleData => userRoleData.role.code === roleCode,
        );

        if (hasRole) {
          isAllowed = true;
        }
      });
    }

    return isAllowed;
  }
}
