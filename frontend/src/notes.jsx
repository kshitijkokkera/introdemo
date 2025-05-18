// -----------------------------------------------------------------------------
// notes.js (Service file, ideally: src/services/persons.js)
// -----------------------------------------------------------------------------
import axios from 'axios'; // Make sure axios is installed: npm install axios or yarn add axios

// const baseUrl = 'http://localhost:3001/persons'; // Example: Adjust to your backend API URL
// // If using a relative URL for a backend on the same host/port (after build):
// const baseUrl = 'http://localhost:3001/api/persons';
// const baseUrl = 'https://introdemo-f9z5.onrender.com/api/persons';
const baseUrl = '/api/persons';


const getAllPersons = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const createPerson = newObject => {
  const request = axios.post(baseUrl, newObject);
  return request.then(response => response.data);
};

const updatePerson = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then(response => response.data);
};

const deletePersonById = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  // For delete, often we just care that it succeeded, response.data might be empty or minimal
  return request.then(response => response.data);
};

const personApiService = {
  getAll: getAllPersons,
  create: createPerson,
  update: updatePerson,
  deletePerson: deletePersonById,
};

export default personApiService; // Use this if in its own file