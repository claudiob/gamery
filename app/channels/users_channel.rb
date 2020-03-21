class UsersChannel < ApplicationCable::Channel
  def subscribed
    stream_from "users"
    ActionCable.server.broadcast "users",
      user_id: 1, online: true
  end

  def unsubscribed
    ActionCable.server.broadcast "users",
      user_id: 1, online: false
  end
end
