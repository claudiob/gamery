import { createConsumer, Channel } from "@rails/actioncable"

interface UsersSubscriber {
	onUsersChange: () => void
}

export default class UsersSource {
	private static instance: UsersSource

	userIDs: number[]
	subscribers: UsersSubscriber[]
	started: boolean
	channel: Channel

	static getInstance(): UsersSource {
		if (!UsersSource.instance) {
			UsersSource.instance = new UsersSource()
			UsersSource.instance.start()
		}
		return UsersSource.instance
	}

	private constructor() {
		this.userIDs = []
		this.subscribers = []
		this.started = false
	}

	start(): void {
		if (this.started) { return }
		this.started = true
		this.channel = this.createChannel(this)
	}

	createChannel(source: UsersSource): Channel {
		return createConsumer().subscriptions.create("UsersChannel", {
			connected() {
				console.log("connected!")
			},
			disconnected() {
				console.log("disconnected!")
			},
			received({ userIDs }) {
				source.userIDs = userIDs
				source.subscribers.forEach(subscriber =>
					subscriber.onUsersChange()
				)
			}
		})
	}

	addSubscriber(subscriber: UsersSubscriber) {
		this.subscribers.push(subscriber)
	}
}
