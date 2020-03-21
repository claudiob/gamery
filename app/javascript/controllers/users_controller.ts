import { Controller } from "stimulus"
import UsersSource from "../src/users_source"

export default class extends Controller {
  connect() {
		UsersSource.getInstance().addSubscriber(this)
	
		console.log("showing user list!")
  }

	onUsersChange(): void {
		console.log("users have changed!")
	}
}
