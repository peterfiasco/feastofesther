const db = require('../config/db');

const Registration = {
  create: async (registrationData) => {
    try {
      const [result] = await db.query(
        `INSERT INTO registrations 
        (firstname, lastname, email, phonenumber, streetaddress, apartment, 
        city, zippostalcode, country, nameofchurch, positioninminstry, 
        titleofoffice, husbandname, tshirtsize, eventId) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          registrationData.firstname,
          registrationData.lastname,
          registrationData.email,
          registrationData.phonenumber,
          registrationData.streetaddress,
          registrationData.apartment,
          registrationData.city,
          registrationData.zippostalcode,
          registrationData.country,
          registrationData.nameofchurch,
          registrationData.positioninminstry,
          registrationData.titleofoffice,
          registrationData.husbandname,
          registrationData.tshirtsize,
          registrationData.eventId
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  findOne: async (criteria) => {
    try {
      const whereClause = Object.keys(criteria).map(key => `${key} = ?`).join(' AND ');
      const values = Object.values(criteria);
      
      const [rows] = await db.query(
        `SELECT * FROM registrations WHERE ${whereClause} LIMIT 1`,
        values
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  },

  findByEmail: async (email) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM registrations WHERE email = ? LIMIT 1',
        [email]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Registration;
