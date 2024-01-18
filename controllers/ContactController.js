const Contact = require('../models/Contact');

// Get all contacts
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    if (contacts.length === 0) {
      return res.end();
    }
    return res.send({ success: true, contacts });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

// Add a new contact
exports.addContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newContact = await Contact.create({ name, email, phone, subject, message });
    res.send({
      success: true,
      data: newContact,
      msg: 'Contact added',
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

// Get a contact by ID
exports.getContactById = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.send({ error: 'Contact not found' });
    } else {
      res.send({ success: true, contact });
    }
  } catch (error) {
    return res.send({ error: error.message });
  }
};



// Delete a contact by ID
exports.deleteContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) {
      return res.send({ error: 'Contact not found' });
    } else {
      res.send({ success: true, msg: 'Contact deleted successfully', data: deletedContact });
    }
  } catch (error) {
    return res.send({ error: error.message });
  }
};

