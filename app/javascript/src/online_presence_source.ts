import { createConsumer, Channel } from "@rails/actioncable"

interface OnlinePresenceSubscriber {
	onOnlineUsersChange: () => void
}

export default class OnlinePresenceSource {
	private static instance: OnlinePresenceSource

	onlineUserIds: number[]
	subscribers: OnlinePresenceSubscriber[]
	started: boolean
	channel: Channel

	static getInstance(): OnlinePresenceSource {
		if (!OnlinePresenceSource.instance) {
			OnlinePresenceSource.instance = new OnlinePresenceSource()
			OnlinePresenceSource.instance.start()
		}
		return OnlinePresenceSource.instance
	}

	private constructor() {
		this.onlineUserIds = []
		this.subscribers = []
		this.started = false
	}

	start(): void {
		if (this.started) { return }
		this.started = true
		this.channel = this.createChannel(this)
	}

	createChannel(source: OnlinePresenceSource): Channel {
		return createConsumer().subscriptions.create("OnlineUsersChannel", {
			received({ userIds }) {
				source.onlineUserIds = userIds
				source.subscribers.forEach(subscriber =>
					subscriber.onOnlineUsersChange()
				)
			}
		})
	}

	addSubscriber(subscriber: OnlinePresenceSubscriber) {
		this.subscribers.push(subscriber)
	}
}
