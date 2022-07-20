import UserService from "./user.services";
class UserController {
  userService: UserService = new UserService();

  getAllUsers = this.userService.getAllUsers();

  getUser = this.userService.getUser();

  createUser = this.userService.createUser();
}
export default UserController;
