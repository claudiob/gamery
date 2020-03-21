class OnlineUsersChannel < ApplicationCable::Channel
  def subscribed
    stream_from OnlinePresence.channel_name
    OnlinePresence.of(current_user).create if current_user
  end

  def unsubscribed
    OnlinePresence.of(current_user).destroy if current_user
  end
end
