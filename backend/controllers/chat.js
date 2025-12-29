import Chat from "../model/Chat.js";

export const startChat = async (req, res) => {
  try {
    const { propertyId, ownerId } = req.body;
    const tenantId = req.user.mongoId;

    let chat = await Chat.findOne({ propertyId, tenantId });

    if (!chat) {
      chat = await Chat.create({
        propertyId,
        tenantId,
        ownerId,
        messages: []
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      {
        $push: {
          messages: {
            senderId: req.user.mongoId,
            text
          }
        }
      },
      { new: true }
    );

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
