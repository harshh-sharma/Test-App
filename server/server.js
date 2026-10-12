
// require("dotenv").config();

// const express = require("express");
// const mongoose = require("mongoose");



// const jwt = require("jsonwebtoken");
// const User = require("./models/User.js");

// const chatRoutes = require("./routes/chatRoutes");
// const Chat = require("./models/Chat");
// const Message = require("./models/Message");
// const messageRoutes = require("./routes/MessageRoutes.js");



// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const connectDB = require("./config/db");

// const userRouter = require("./routes/auth.routes.js");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });


// io.use(async (socket, next) => {
//   try {
//     const token = socket.handshake.auth?.token;

//     if (!token) {
//       return next(new Error("Authentication required"));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.userId)
//       .select("_id name email");

//     if (!user) {
//       return next(new Error("User not found"));
//     }

//     // Attach verified user details to this socket
//     socket.user = user;

//     next();
//   } catch (error) {
//     next(new Error("Invalid or expired token"));
//   }
// });


// io.on("connection", (socket) => {
//   console.log("Connected:", socket.id);
// //   console.log("socket", socket)


// socket.on("join_chat", async (chatId) => {
//   try {
//     if (!mongoose.isValidObjectId(chatId)) {
//       socket.emit("chat_error", "Invalid chat ID");
//       return;
//     }

//     const chat = await Chat.findOne({
//       _id: chatId,
//       members: socket.user._id,
//     });

//     if (!chat) {
//       socket.emit("chat_error", "You are not authorized to join this chat");
//       return;
//     }
//     const roomId = chat._id.toString();
//     socket.join(roomId);

//     socket.emit("joined_chat", {
//       chatId,
//       message: "Successfully joined chat",
//     });
//   } catch (error) {
//     console.error("Join chat error:", error);
//     socket.emit("chat_error", "Could not join chat");
//   }
// });


  
// socket.on("send_message", async (data, acknowledge) => {
//   // Support clients that don't provide an acknowledgement callback.
//   const reply =
//     typeof acknowledge === "function"
//       ? acknowledge
//       : (result) => {
//           if (!result.success) {
//             socket.emit("chat_error", result.message);
//           }
//         };

//   try {
//     const { chatId, text } = data || {};

//     if (
//       !mongoose.isValidObjectId(chatId) ||
//       typeof text !== "string" ||
//       !text.trim() ||
//       text.trim().length > 2000
//     ) {
//       reply({
//         success: false,
//         message: "Invalid chat ID or message",
//       });
//       return;
//     }

//     const chat = await Chat.findOne({
//       _id: chatId,
//       members: socket.user._id,
//     });

//     if (!chat) {
//       reply({
//         success: false,
//         message: "You are not authorized to message this chat",
//       });
//       return;
//     }

//     const message = await Message.create({
//       chat: chat._id,
//       sender: socket.user._id,
//       text: text.trim(),
//     });

//     const messageData = {
//       _id: message._id,
//       chatId: message.chat.toString(),
//       sender: {
//         id: socket.user._id.toString(),
//         name: socket.user.name,
//       },
//       text: message.text,
//       createdAt: message.createdAt,
//     };

//     // Confirm successful saving to the sender.
//     reply({
//       success: true,
//       data: messageData,
//     });

//     // Broadcast the saved message to everyone in this room.
//     io.to(chat._id.toString()).emit(
//       "receive_message",
//       messageData
//     );
//   } catch (error) {
//     console.error("Send message error:", error);

//     reply({
//       success: false,
//       message: "Could not save message. Please try again.",
//     });
//   }
// });

//   socket.on("typing", async(chatId) => {
//     const userId = socket.user._id.toString();
//     socket.to(chatId).emit("user_typing", {
//       userId,
//       chatId
//     })
//   });



//   socket.on("typingOff", async(chatId) => {
//     const userId = socket.user._id.toString();
//     socket.to(chatId).emit("user_typing_off",{
//       userId,
//       chatId
//     })
//   })

//   socket.on("disconnect", () => {
//     console.log("Disconnected:", socket.id);
//   });
// });


// app.use('/api/auth', userRouter);
// app.use("/api/chats", chatRoutes);
// app.use("/api/messages", messageRoutes);

// const startServer = async () => {
//   await connectDB();

//   server.listen(process.env.PORT || 5000, () => {
//     console.log("Server running on port 5000");
//   });
// };

// startServer();

require("dotenv").config();
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors:{
    origin : "http://localhost:5173"
  }
});


io.on("connection", (socket) => {
  console.log("socket successfully connected");

  socket.on("join_chat", async(chatId) => {
    
  })
})
