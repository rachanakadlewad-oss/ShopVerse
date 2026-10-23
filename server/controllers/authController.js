const User = require("../models/User")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils/generateToken")

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists)
      return res.status(400).json({ message: "User already exists" })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Get saved addresses
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses")
    res.json(user.addresses || [])
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Add address
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const { label, name, phone, line1, city, state, pincode, isDefault } = req.body

    if (isDefault) {
      user.addresses.forEach(a => (a.isDefault = false))
    }

    user.addresses.push({ label, name, phone, line1, city, state, pincode, isDefault: isDefault || user.addresses.length === 0 })
    await user.save()

    res.status(201).json(user.addresses)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const addr = user.addresses.id(req.params.addressId)

    if (!addr) return res.status(404).json({ message: "Address not found" })

    const { label, name, phone, line1, city, state, pincode, isDefault } = req.body

    if (isDefault) {
      user.addresses.forEach(a => (a.isDefault = false))
    }

    addr.set({ label, name, phone, line1, city, state, pincode, isDefault })
    await user.save()

    res.json(user.addresses)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.addresses = user.addresses.filter(
      a => a._id.toString() !== req.params.addressId
    )
    await user.save()
    res.json(user.addresses)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}