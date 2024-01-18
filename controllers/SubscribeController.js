const Subscribe = require('../models/Subscribe'); 

// Get all subscribers
const getSubscribes = async (req, res) => {
  try {
    const subscribers = await Subscribe.find();
    return res.send(subscribers);
  } catch (error) {
    return res.status(500).send({ message: 'Server Error' });
  }
};

// Add a new subscriber
const addSubscribe = async (req, res) => {
  const { email } = req.body;

  try {
    const newSubscriber = new Subscribe({ email });
    await newSubscriber.save();
    return res.send( { success:true, newSubscriber});
  } catch (error) {
    return res.status(400).send({ message: 'Invalid input' });
  }
};

// Delete a subscriber by ID
const deleteSubscribe = async (req, res) => {
  const  id  = req.params.id;

  try {
    const deletedSubscriber = await Subscribe.findByIdAndRemove(id);
    if (!deletedSubscriber) {
      return res.status(404).send({ message: 'Subscriber not found' });
    }
    return res.send({ succes : true,deletedSubscriber});
  } catch (error) {
    return res.status(500).send({ message: 'Server Error' });
  }
};

module.exports = { getSubscribes, addSubscribe, deleteSubscribe };
