const User = require("../../models/user")

const _getProfileURL = async (username) => {
  try {
    const profileImage = await User.findOne({ username }, {profileImage:1, _id:0});
    return profileImage;
  } catch (error) {
    return null;
  }
}

module.exports = {_getProfileURL};