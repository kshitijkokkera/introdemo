// App.js

import React, { useState, useEffect } from 'react'
import personService from './notes' // Assuming notes.js is your service file
import Notification from './notification' // Assuming notification.js is in the same directory

// Component to display a single person's details and a delete button
const PersonItem = ({ person, removeData }) => {
  return (
    <p>
      {person.name} {person.number}{' '}
      <button type="button" onClick={() => removeData(person)}>
        delete
      </button>
    </p>
  )
}

// Component to display the list of persons
const Persons = ({ persons, filter, removeData }) => {
  const personsToShow =
    filter === ''
      ? persons
      : persons.filter(p =>
          p.name.toLowerCase().includes(filter.toLowerCase())
        )

  if (!personsToShow || personsToShow.length === 0) {
    return <p>No persons to display. Add some or refine your filter!</p>
  }

  return (
    <div>
      {personsToShow.map(person => (
        // Ensure person and person.id are valid here
        person && person.id ? (
          <PersonItem key={person.id} person={person} removeData={removeData} />
        ) : null // Or some fallback UI if person/person.id is invalid
      ))}
    </div>
  )
}

// Component for the form to add a new person
const AddPersonForm = ({ addData, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addData}>
      <div>
        Name: <input value={newName} onChange={handleNameChange} placeholder="Enter name" />
      </div>
      <div>
        Number: <input value={newNumber} onChange={handleNumberChange} placeholder="Enter number" />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

// Component for the filter input
const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      Filter shown with: <input value={filter} onChange={handleFilterChange} placeholder="Search by name" />
    </div>
  )
}

// Main App component
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [currentFilter, setCurrentFilter] = useState('') // Renamed for clarity
  const [notification, setNotification] = useState({ message: null, type: null }) // { message: '...', type: 'success'/'error' }

  // Effect to fetch initial data
  useEffect(() => {
    personService.getAll()
      .then(response => {
        setPersons(response)
      })
      .catch(error => {
        console.error("Error fetching persons:", error)
        showNotification("Failed to fetch phonebook data from the server.", "error")
      })
  }, []) // Empty dependency array means this runs once on mount

  // Function to display notifications
  const showNotification = (message, type = "success", duration = 5000) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, duration)
  }

  // Handler to add a new person or update an existing one
  const addData = (event) => {
    event.preventDefault()
    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    if (trimmedName === '' || trimmedNumber === '') {
      showNotification('Please fill in both name and number.', "error")
      return
    }

    const existingPersonByName = persons.find(
      p => p.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (existingPersonByName) {
      // Person with the same name exists
      if (existingPersonByName.number === trimmedNumber) {
        showNotification(`${trimmedName} with this number is already in the phonebook.`, "info")
        setNewName('')
        setNewNumber('')
        return
      }
      // Name exists, number is different - ask to update
      if (window.confirm(
          `${trimmedName} is already in the phonebook. Replace the old number (${existingPersonByName.number}) with ${trimmedNumber}?`
        )
      ) {
        const personToUpdate = { ...existingPersonByName, number: trimmedNumber }
        personService.update(personToUpdate.id, personToUpdate)
          .then(updatedPerson => {
            setPersons(
              persons.map(p => (p.id === updatedPerson.id ? updatedPerson : p))
            )
            showNotification(`Updated ${updatedPerson.name}'s number successfully.`, "success")
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.error("Error updating person:", error)
            if (error.response && error.response.status === 404) {
                showNotification(`Information of ${personToUpdate.name} has already been removed from server.`, "error")
                setPersons(persons.filter(p => p.id !== personToUpdate.id))
            } else {
                showNotification(`Failed to update ${personToUpdate.name}'s number. ${error.response?.data?.error || ''}`, "error")
            }
          })
      } else {
        // User cancelled update
        setNewName('')
        setNewNumber('')
      }
      return // Exit after handling existing name case
    }

    // Name does not exist, create new person
    const newPersonObject = { name: trimmedName, number: trimmedNumber }
    personService.create(newPersonObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${returnedPerson.name} to the phonebook.`, "success")
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error("Error adding new person:", error)
        // Check for specific validation error from backend if available
        const errorMessage = error.response?.data?.error || "Failed to add new person."
        showNotification(errorMessage, "error")
      })
  }

  // Handler to remove a person
  const removeData = (personToRemove) => {
    if (window.confirm(`Are you sure you want to remove ${personToRemove.name} from the phonebook?`)) {
      personService.deletePerson(personToRemove.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== personToRemove.id))
          showNotification(`Removed ${personToRemove.name} from the phonebook.`, "success")
        })
        .catch(error => {
          console.error("Error deleting person:", error)
          showNotification(`Failed to delete ${personToRemove.name}. They might have already been removed.`, "error")
          // Optionally, refresh the list if the person was already removed on the server
          setPersons(persons.filter(p => p.id !== personToRemove.id))
        })
    }
  }

  // Event handlers for input fields
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setCurrentFilter(event.target.value)

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Phonebook</h1>
      <Notification message={notification.message} type={notification.type} />

      <h2>Filter</h2>
      <Filter filter={currentFilter} handleFilterChange={handleFilterChange} />

      <h2>Add a New Entry</h2>
      <AddPersonForm
        addData={addData}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filter={currentFilter}
        removeData={removeData}
      />
    </div>
  )
}

export default App
