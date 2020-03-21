# Wraps the logic of when a user is connected or not to the app.
class OnlinePresence
  # Initializes the class for a User (with an Id)
  def self.of(user)
    new user: user
  end

  # Store the online presence of a user and broadcast the updated list
  def create
    REDIS.sadd REDIS_SET, @user.id
    self.class.broadcast
  end

  # Remove the online presence of a user
  def destroy
    REDIS.srem REDIS_SET, @user.id
    self.class.broadcast
  end

  # Return whether the user with Id is online
  def self.include?(user_id)
    user_ids.include?(user_id)
  end

  # Broadcast the list of online user Ids to Action Cable subscribers
  def self.broadcast
    @user_ids = nil
    ActionCable.server.broadcast channel_name, userIds: user_ids
  end

  # Action Cable channel where information about online users is broadcast
  def self.channel_name
    "online_presence"
  end

private

  # Private initializer (use .of instead)
  def initialize(user:)
    @user = user
  end
  private_class_method :new

  # Private constant (use #create/#destroy instead)
  REDIS_SET = 'online_user_ids'.freeze
  private_constant :REDIS_SET

  # Private method (use .include? instead)
  # Note: the class-level memoization is cleared by the broadcast
  # method which is invoked any time user IDs are added or removed
  def self.user_ids
    @user_ids ||= REDIS.smembers(REDIS_SET).map(&:to_i)
  end
  private_class_method :user_ids
end