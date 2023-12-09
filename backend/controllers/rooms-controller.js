const RoomDto = require("../dtos/room.dto");
const roomService = require("../services/room-service");
const userModel = require("../models/user-model");
const tfidf = require("node-tfidf");
const roomModel = require("../models/room-model");
class RoomsController {
  constructor() {
    this.userTFIDF = new tfidf(); // Create a single instance for the controller
    this.recomandation = this.recomandation.bind(this);
  }
  async create(req, res) {
    const { topic, roomType } = req.body;
    if (!topic || !roomType) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const room = await roomService.create({
      topic,
      roomType,
      ownerId: req.user._id,
    });
    return res.json(new RoomDto(room));
  }

  async index(req, res) {
    const rooms = await roomService.getAllRooms(["open"]);
    const allRooms = rooms.map((room) => new RoomDto(room));
    return res.json(allRooms);
  }

  async show(req, res) {
    const room = await roomService.getRoom(req.params.roomId);
    return res.json(room);
  }

  async recoCreate(req, res) {
    const { data } = req.body;
    const userId = req.user._id;
    try {
      const user = await userModel.findByIdAndUpdate(
        userId,
        { $push: { joinHistory: data } },
        { new: true }
      );
      // Calculate TF-IDF vector for user search history
      const corpus = user.joinHistory.join(" ");
      this.userTFIDF.addDocument(corpus); // Use the same instance for each calculation
      res.json({
        joinHistory: user.joinHistory,
        userTFIDF: this.userTFIDF.listTerms(0),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async recomandation(req, res) {
    const userId = req.user._id;
    try {
      const user = await userModel.findById(userId);
      const lastJoinTerm =
        user.joinHistory.length > 0 ? user.joinHistory.slice(-1)[0] : "";
      const recommendedProducts = await roomModel
        .find({
          $text: { $search: lastJoinTerm },
        })
        .limit(5)
        .lean()
        .populate("speakers")
        .populate("ownerId")
        .exec();
      // const similarityScores = recommendedProducts.map((product) => {
      //   const description = Array.isArray(product)
      //     ? product[0].topic || ""
      //     : product.topic || "";
      //   const similarity = this.userTFIDF
      //     .tfidf(description)
      //     .reduce((acc, term) => acc + term.tfidf, 0);

      //   return { ...product, similarity };
      // });

      // Sort products by TF-IDF similarity and return the result
      // const sortedProducts = similarityScores.sort(
      //   (a, b) => b.similarity - a.similarity
      // );

      const allRooms = recommendedProducts.map((room) => new RoomDto(room));

      res.json(allRooms);
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = new RoomsController();
