export default {
  createUser: {
    fullName: ["string", "required"],
    password: ["string,min,5", "required"],
    location: ["string"],
    phoneNumber: ["number", "required"],
    userType: ["number,max,2", "required"],
    gender: ["string"],
    emergencyNumber: ["number"],
    momoPay: ["number"],
    profileImage: ["any"],
  },
  updateUser: {
    fullName: ["string"],
    oldPassword: ["string,min,5"],
    newPassword: ["string,min,5"],
    location: ["string"],
    phoneNumber: ["number"],
    profileImage: ["any"],
    gender: ["string"],
    emergencyNumber: ["number"],
    momoPay: ["number"],
  },

  userTypes: { name: ["string","required"] },
  resetPassword: {
    code: [ "required"],
    phoneNumber: ["number", "required"],
    password: ["string,min,5", "required"]
  },
  updateActivity: {
    ride: ["boolean"],
    delivery: ["boolean"]
  },
  createReport: {
    phoneNumber: ["number"],
    email: ["string", "required"],
    fullName: ["string", "required"],
    title: ["string", "required"],
    description: ["string", "required"]
  },
  createSchedule: {
    ride: ["boolean"],
    delivery: ["boolean"],
    weight: ["number"],
    sits: ["number"],
    fareAmount: ["number"],
    from: ["string", "required"],
    to: ["string", "required"],
    date: ["string", "required"],
    description: ["string", "required"]
  },
  updateSchedule: {
    ride: ["boolean"],
    delivery: ["boolean"],
    weight: ["number"],
    sits: ["number"],
    fareAmount: ["number"],
    from: ["string"],
    to: ["string"],
    date: ["string"],
    description: ["string"]
  },
  createVehicle: {
    plateNumber: [ "string","required"],
    vehicleTypeId: ["number", "required"],
    isAvailable: ["boolean"]
  },
  createRecentContact: {
    driverId: ["number", "required"],
  },
  updateVehicle: {
    plateNumber: [ "string"],
    vehicleTypeId: ["number"],
    isAvailable: ["boolean"]
  },
  createRating: {
    rates: [ "number,max,5","required"],
    review: ["string","required"],
    deliveryId: ["number","required"]
  },
  updateRating: {
    rates: [ "number,max,5"],
    review: ["string"]
  },
  createDeliveryRequest: {
    dropoffLocation: [ "string","required"],
    pickupLocation: ["string","required"],
    fareAmount: ["number"],
    weight: [ "number"],
    dimentions: ["string"],
    content: ["string","required"],
    fragile: ["boolean"],
    specialInstructions: ["string"],
    packageImage:["any"]
  },
  addPackageImage: {
    packageImage:["any","required"]
  },
  updateDeliveryRequest: {
    dropoffLocation: [ "string"],
    pickupLocation: ["string"],
    fareAmount: ["number"]
  },
  updateDeliveryPackage: {
    weight: [ "number"],
    dimentions: ["string"],
    content: ["string"],
    fragile: ["boolean"],
    specialInstructions: ["string"]
  },
  verifyDriver: {
    faceImage: [ "any","required"],
    driverLicence: ["any", "required"],
    identityCard: ["any", "required"]
  },
  permissions: { name: ["icon", "string", "required"] },
  vehicleTypes: { name: ["string","required"] },
  notificationTypes: { name: ["string","required"] },

  createLanguage: {
    name: ["string", "required"],
  },
  updateLanguage: {
    name: ["string"],
  },
  updateSettings: {
    languageId: ["number"],
    twoFA: ["boolean"],
    themeMode: ["string"]
  }
}


// export default {
//   createUser: {
//     fullName: ["string", "required"],
//     password: [
//       "string",
//       { min: 5 },"required"],
//     location: ["string"],
//     phoneNumber: ["string",{regex:/^[0-9]{10}$/},{messages:{'string.pattern.base': `Phone number must have 10 digits.`}}, "required"],
//     userType: ["number",{valid:[1,2]}, "required"],
//   },

//   userTypes: { name: ["string","required"] },
//   permissions: { name: ["string","required"] },
//   notificationTypes: { name: ["string","required"] },

//   createLanguage: {
//     name: ["string", "required"],
//     abbreviation: ["string"],
//   }, 
//   updateLanguage: {
//     name: ["string"],
//     abbreviation: ["string"],
//   } 
// }

