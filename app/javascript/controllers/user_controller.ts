import { Controller } from "stimulus"
import OnlinePresenceSource from "../src/online_presence_source"

export default class extends Controller {
  static classes = ["online"]
  static targets = ["indicator"]
  static values = { id: Number }

	onlineClass: string
	indicatorTarget: HTMLElement
  idValue: number

  connect() {
		OnlinePresenceSource.getInstance().addSubscriber(this)
  }

	isOnline(): boolean {
		const temp = OnlinePresenceSource.getInstance()
		const onlineUserIds = OnlinePresenceSource.getInstance().onlineUserIds
		return onlineUserIds.includes(this.idValue)
	}

	adjustIndicator(): void {
		this.indicatorTarget.classList.toggle("has-text-success", this.isOnline())
	}

	onOnlineUsersChange(): void {
		this.adjustIndicator()
	}
}
