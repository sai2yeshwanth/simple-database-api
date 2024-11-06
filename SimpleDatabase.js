const fs = require('fs-extra'); // Import fs-extra for async file operations

class SimpleDatabase {
  constructor(filename = 'database.json') {
    this.filename = filename;
    this.data = [];

    // Load the database initially
    this.load();
  }

  // Load the JSON database file if it exists, otherwise initialize it with an empty array
  async load() {
    try {
      const fileExists = await fs.pathExists(this.filename);
      if (fileExists) {
        this.data = await fs.readJson(this.filename);
      } else {
        await this.save(); // Save an empty array if no file exists
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
  }

  // Save data to the JSON file
  async save() {
    try {
      await fs.writeJson(this.filename, this.data, { spaces: 2 });
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // CREATE: Add a new record
  async create(record) {
    record.id = this.data.length > 0 ? this.data[this.data.length - 1].id + 1 : 1;
    this.data.push(record);
    await this.save();
    return record;
  }

  // READ: Get a record by ID
  read(recordId) {
    return this.data.find(record => record.id === recordId);
  }

  // UPDATE: Update a record by ID
  async update(recordId, updates) {
    const record = this.read(recordId);
    if (record) {
      Object.assign(record, updates);
      await this.save();
      return record;
    }
    return null;
  }

  // DELETE: Remove a record by ID
  async delete(recordId) {
    const initialLength = this.data.length;
    this.data = this.data.filter(record => record.id !== recordId);
    if (this.data.length < initialLength) {
      await this.save();
      return true;
    }
    return false;
  }

  // GET ALL: Retrieve all records
  getAll() {
    return this.data;
  }
}

module.exports = SimpleDatabase;
