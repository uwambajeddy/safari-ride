// import io from "../server";
// import db from "../database/models";
// import logger from "./logger";
// import { format } from 'date-fns';

// const connectedClients = {};
// const deliveryTrackings = {}
// const { delivery_requests, deliveries } = db;

// function calculateDistance(lat1, lon1, lat2, lon2) {
//  const R = 6371;
//  const dLat = (lat2 - lat1) * (Math.PI / 180);
//  const dLon = (lon2 - lon1) * (Math.PI / 180);
//  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//   Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//   Math.sin(dLon / 2) * Math.sin(dLon / 2);
//  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//  const distance = R * c;
//  return distance;
// }


// io.on('connection', function (client) {
//  connectedClients[client.id] = client.userInfo;

//  logger.success(`Client connected: ${client.id} ✅`);

//  //TODO: ====================  REAL DELIVERY============================

//  client.emmit("currentliveDelivery", async () => {
//   try { 
   

//   const currentliveDelivery = {};
//   if (deliveryTrackings[client.id]) {
//     const promises = [];

//     for (let [key, value] of Object.entries(deliveryTrackings[client.id])) {
//       const getDelivery = deliveries.findOne({ where: { id: key } });
//       promises.push(getDelivery);
//     }

//     const results = await Promise.all(promises);

//     results.forEach((result, index) => {
//       const key = Object.keys(deliveryTrackings[client.id])[index];
//       currentliveDelivery[key] = result.dataValues.trackings;
//     });
//   }

//    io.emit('currentliveDelivery', { data: currentliveDelivery, status: true });
//   } catch (error) {
//    console.log(error)
//    io.emit('currentliveDelivery', { message: "Sorry there was an Error", status: false });
//   }
// });


//  client.on("findDriverNearYou", (myLon, myLat, maxDistance) => {
//   const onlineNearDriver = []
//   for (let [key, value] of Object.entries(connectedClients)) {
//    if (value.userType.name == "driver") {
//     let driverLon = value.location.split(",")[0]
//     let driverLat = value.location.split(",")[1]
//     const distance = calculateDistance(myLat, myLon, driverLat, driverLon);
//     if (distance <= maxDistance) {
//      onlineNearDriver.push(driver);
//     }
//    }
//   }
//   if (!onlineNearDriver.length) return io.emit('findDriverNearYou', { message: `No Drivers found in ${maxDistance}Km`, status: false });
//   io.emit('findDriverNearYou', { data: onlineNearDriver, status: true });
//  })

//  client.on("findDeliveryNearYou", async (myLon, myLat, maxDistance) => {
//   try {
//    const deliveryRequests = await delivery_requests.findAll({
//     where: { isApproved: false, active: true },
//     include: [
//      {
//       model: users,
//       as: "client",
//       attributes: { exclude: ["createdAt", "updatedAt", "active"] },
//      },
//     ],
//    });
//    if (!deliveryRequests.dataValues.length) return io.emit('findDeliveryNearYou', { message: `No deliveries found in ${maxDistance}Km`, status: false });

//    const availableNearDelivery = [];
//    deliveryRequests.dataValues.map((deliveryRequest) => {
//     let deliveryLon = deliveryRequest.pickupLocation.split(",")[0]
//     let deliveryLat = deliveryRequest.pickupLocation.split(",")[1]
//     const distance = calculateDistance(myLat, myLon, deliveryLat, deliveryLon);
//     if (distance <= maxDistance) {
//      availableNearDelivery.push(deliveryRequest);
//     }
//    })

//    io.emit('findDeliveryNearYou', { data: availableNearDelivery, status: true });
//   } catch (error) {
//    console.log(error)
//    io.emit('findDeliveryNearYou', { message: "Sorry there was an Error", status: false });
//   }
//  })

//  client.on("sendRequestToDriver", (deliveryRequest, driver, isCancelled = false) => {
//   if (!connectedClients[driver.id]) return io.emit("sendRequestToDriver", { message: `${driver.fullName.split(" ")[0]} is not available at the moment`, status: false })
//   if (!isCancelled) io.emit('mySentRequestToDriver', { data: { deliveryRequest }, status: true });
//   io.to(driver.id).emit('sendRequestToDriver', { data: deliveryRequest, status: true, isCancelled });
//  })



//  client.on("sendRequestToDeliver", async (deliveryRequest, isCancelled = false) => {
//   if (!connectedClients[deliveryRequest.clientId]) return io.emit("sendRequestToDeliver", { message: `${deliveryRequest.client.fullName.split(" ")[0]} is not available at the moment`, status: false })
//   if (!isCancelled) io.emit('mySentRequestToDeliver', { data: { deliveryRequest }, status: true });
//   io.to(deliveryRequest.clientId).emit('sendRequestToDeliver', { data: { deliveryRequest, driver: connectedClients[client.id], isCancelled }, status: true });
//  })


//  client.on("replyToDeliveryRequest", async (deliveryRequest, isAccepted) => {
//   if (!connectedClients[deliveryRequest.clientId]) return io.emit("replyToDeliveryRequest", { message: `${deliveryRequest.client.fullName.split(" ")[0]} is not available at the moment`, status: false })
//   io.to(deliveryRequest.clientId).emit('replyToDeliveryRequest', { data: { deliveryRequest, driver: connectedClients[client.id], isAccepted }, status: true });
//  })

//  client.on("startDelivery", async (deliveryRequest) => {
//   const startTime = new Date();
//   const formattedDate = format(startTime, "yyyy-MM-dd HH:mm:ss.SSSxxx");
//   try {

//    const newDelivery = await deliveries.create({ deliveryRequestId: deliveryRequest.id, driverId: client.id, startTime: formattedDate, status: "started" }
//    );
//    deliveryTrackings[deliveryRequest.clientId][newDelivery.dataValues.id] = [];
//    io.emit('startDelivery', { data: newDelivery.dataValues, status: true });
//    io.to(deliveryRequest.clientId).emit('startDelivery', { data:{newDelivery: newDelivery.dataValues,clientId:deliveryRequest.clientId}, status: true });

//   } catch (error) {
//    console.log(error)
//    io.emit('startDelivery', { message: "Sorry there was an Error", status: false });
//   }
//  });

//  client.on("newCoordinates", async (deliveryId, clientId, coordinates, timeStamp) => {
//   io.to(clientId).emit('newCoordinates', { data: { deliveryId, coordinates, timeStamp }, status: true });
//   deliveryTrackings[clientId][deliveryId].push({coordinates,timeStamp})

// try{
//  await deliveries.update({ trackings: deliveryTrackings[clientId][deliveryId] }, { where: { id: deliveryId, driverId: client.id } });
// } catch (error) {
//  console.log(error)
//  io.emit('newCoordinates', { message: "Sorry there was an Error", status: false });
// }
//  });


//  client.on("endDelivery", async (deliveryId,clientId) => {
//   const completionTime = new Date();
//   const formattedDate = format(completionTime, "yyyy-MM-dd HH:mm:ss.SSSxxx");
//   try {

//    const updateDelivery = await deliveries.update({ completionTime: formattedDate, status: "completed" }, { where: { id: deliveryId, driverId: client.id } });
//    delete deliveryTrackings[clientId][deliveryId];
//    io.emit('endDelivery', { data: updateDelivery.dataValues, status: true });
//    io.to(clientId).emit('endDelivery', { data: updateDelivery.dataValues, status: true });

//   } catch (error) {
//    console.log(error)
//    io.emit('endDelivery', { message: "Sorry there was an Error", status: false });
//   }
//  })


//  client.on("cancelDelivery", async (deliveryId,clientId) => {
//   const completionTime = new Date();
//   const formattedDate = format(completionTime, "yyyy-MM-dd HH:mm:ss.SSSxxx");
//   try {

//    const updateDelivery = await deliveries.update({ completionTime: formattedDate, status: "cancelled" }, { where: { id: deliveryId, driverId: client.id } });
//    delete deliveryTrackings[clientId][deliveryId];
//    io.emit('cancelDelivery', { data: updateDelivery.dataValues, status: true });
//    io.to(clientId).emit('cancelDelivery', { data: updateDelivery.dataValues, status: true });

//   } catch (error) {
//    console.log(error)
//    io.emit('cancelDelivery', { message: "Sorry there was an Error", status: false });
//   }
//  })


//  //TODO: ====================END OF REAL DELIVERY============================

 
//  client.on('disconnect', () => {
//   logger.error(`Client disconnected: ${client.id} ❌`);
//   delete connectedClients[client.id];
//  });

// });
